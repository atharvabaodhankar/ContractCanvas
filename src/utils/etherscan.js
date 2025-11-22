/**
 * Etherscan API utility for fetching contract ABIs
 * Using Etherscan API V2 which supports 50+ EVM chains with a single API key
 */

const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY || 'YourApiKeyToken';
const BASE_URL = 'https://api.etherscan.io/v2/api';

// Chain ID mapping for Etherscan API V2
const CHAIN_NAMES = {
  '1': 'Ethereum Mainnet',
  '11155111': 'Sepolia Testnet',
  '137': 'Polygon Mainnet',
  '80002': 'Polygon Amoy Testnet',
  '56': 'BSC Mainnet',
  '8453': 'Base Mainnet',
  '42161': 'Arbitrum One',
  '10': 'Optimism'
};

/**
 * Fetch ABI from block explorer using Etherscan API V2
 * @param {string} address - Contract address
 * @param {string} chainId - Chain ID
 * @returns {Promise<{abi: Array, verified: boolean, name: string}>}
 */
export async function fetchABI(address, chainId) {
  const chainName = CHAIN_NAMES[chainId];
  
  if (!chainName) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  // Etherscan API V2 format: https://api.etherscan.io/v2/api?chainid={chainId}&module=contract&action=getabi
  const url = `${BASE_URL}?chainid=${chainId}&module=contract&action=getabi&address=${address}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '1' && data.result) {
      // Parse the ABI
      const abi = JSON.parse(data.result);
      
      return {
        abi,
        verified: true,
        source: chainName,
        contractName: await fetchContractName(address, chainId)
      };
    } else if (data.result && data.result.includes('not verified')) {
      throw new Error('Contract source code not verified. Please verify your contract on Etherscan or use manual ABI import.');
    } else if (data.message === 'NOTOK') {
      // Check if it's even a contract
      throw new Error('Unable to fetch ABI. This may not be a smart contract address, or the contract is not verified.');
    } else {
      throw new Error(data.result || data.message || 'Failed to fetch ABI');
    }
  } catch (error) {
    if (error.message.includes('not verified') || error.message.includes('not be a smart contract')) {
      throw error;
    }
    throw new Error(`Failed to fetch ABI: ${error.message}`);
  }
}

/**
 * Fetch contract name from block explorer using Etherscan API V2
 * @param {string} address - Contract address
 * @param {string} chainId - Chain ID
 * @returns {Promise<string>}
 */
async function fetchContractName(address, chainId) {
  if (!CHAIN_NAMES[chainId]) return 'Unknown Contract';

  // Etherscan API V2 format
  const url = `${BASE_URL}?chainid=${chainId}&module=contract&action=getsourcecode&address=${address}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '1' && data.result && data.result[0]) {
      return data.result[0].ContractName || 'Unknown Contract';
    }
  } catch (error) {
    console.error('Failed to fetch contract name:', error);
  }

  return 'Unknown Contract';
}

/**
 * Validate if address is a valid Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean}
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
