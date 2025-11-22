import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const useContract = (address, abi, chainId) => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(browserProvider);
        
        try {
          const s = await browserProvider.getSigner();
          setSigner(s);
        } catch (e) {
          console.log("Wallet not connected");
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (address && abi && provider) {
      try {
        // If we have a signer, use it for write operations
        const contractInstance = new ethers.Contract(address, abi, signer || provider);
        setContract(contractInstance);
      } catch (e) {
        console.error("Error creating contract instance:", e);
        setContract(null);
      }
    }
  }, [address, abi, provider, signer]);

  const callFunction = async (functionName, args, stateMutability) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      const func = contract[functionName];
      if (!func) throw new Error(`Function ${functionName} not found`);

      // If it's a write function and we don't have a signer, try to connect
      if (stateMutability !== 'view' && stateMutability !== 'pure' && !signer) {
        if (window.ethereum) {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const s = await browserProvider.getSigner();
          setSigner(s);
          // Re-create contract with signer
          const signedContract = new ethers.Contract(address, abi, s);
          const tx = await signedContract[functionName](...args);
          return tx.hash; // Return tx hash for write calls
        } else {
          throw new Error("No wallet found");
        }
      }

      const result = await func(...args);
      return result;
    } catch (error) {
      console.error("Contract call failed:", error);
      throw error;
    }
  };

  return { contract, callFunction };
};

export default useContract;
