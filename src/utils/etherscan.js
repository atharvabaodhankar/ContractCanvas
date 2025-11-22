/**
 * Etherscan API utility for fetching contract ABIs
 * Using Etherscan API V2 which supports 50+ EVM chains with a single API key
 */

const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY || 'YourApiKeyToken';

const EXPLORER_APIS = {
  '1': {
    name: 'Ethereum Mainnet',
    url: 'https://api.etherscan.io/api'
  },
  '11155111': {
    name: 'Sepolia Testnet',
    url: 'https://api-sepolia.etherscan.io/api'
  },
  '137': {
    name: 'Polygon Mainnet',
    url: 'https://api.polygonscan.com/api'
  },
  '80002': {
    name: 'Polygon Amoy Testnet',
    url: 'https://api-amoy.polygonscan.com/api'
  },
  '56': {
    name: 'BSC Mainnet',
    url: 'https://api.bscscan.com/api'
  }
};

/**
 * Fetch ABI from block explorer
 * @param {string} address - Contract address
 * @param {string} chainId - Chain ID
 * @returns {Promise<{abi: Array, verified: boolean, name: string}>}
 */
export async function fetchABI(address, chainId) {
  const explorer = EXPLORER_APIS[chainId];
  
  if (!explorer) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const url = `${explorer.url}?module=contract&action=getabi&address=${address}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '1' && data.result) {
      // Parse the ABI
      const abi = JSON.parse(data.result);
      
      return {
        abi,
        verified: true,
        source: explorer.name,
        contractName: await fetchContractName(address, chainId)
      };
    } else if (data.result === 'Contract source code not verified') {
      throw new Error('Contract not verified on block explorer');
    } else {
      throw new Error(data.result || 'Failed to fetch ABI');
    }
  } catch (error) {
    if (error.message.includes('not verified')) {
      throw error;
    }
    throw new Error(`Failed to fetch ABI: ${error.message}`);
  }
}

/**
 * Fetch contract name from block explorer
 * @param {string} address - Contract address
 * @param {string} chainId - Chain ID
 * @returns {Promise<string>}
 */
async function fetchContractName(address, chainId) {
  const explorer = EXPLORER_APIS[chainId];
  
  if (!explorer) return 'Unknown Contract';

  const url = `${explorer.url}?module=contract&action=getsourcecode&address=${address}&apikey=${API_KEY}`;

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
