import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

/**
 * Hook to poll and decode contract events
 * @param {string} address - Contract address
 * @param {Array} abi - Contract ABI
 * @param {string} chainId - Chain ID
 * @param {number} fromBlock - Starting block number
 * @returns {Object} - Events, loading state, and error
 */
export default function useEvents(address, abi, chainId, fromBlock = 'latest') {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);

  const RPC_URLS = {
    '1': 'https://eth.public-rpc.com',
    '11155111': 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    '137': 'https://polygon-rpc.com',
    '80002': 'https://rpc-amoy.polygon.technology',
    '56': 'https://bsc-dataseed.binance.org'
  };

  const fetchEvents = useCallback(async () => {
    if (!address || !abi || !chainId) return;

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const contract = new ethers.Contract(address, abi, provider);

      // Get current block
      const currentBlock = await provider.getBlockNumber();
      
      // Calculate from block (last 1000 blocks or specified)
      const startBlock = fromBlock === 'latest' 
        ? Math.max(0, currentBlock - 1000)
        : fromBlock;

      // Get all events
      const eventFilters = abi
        .filter(item => item.type === 'event')
        .map(event => contract.filters[event.name]());

      const allEvents = [];

      for (const filter of eventFilters) {
        try {
          const logs = await contract.queryFilter(filter, startBlock, currentBlock);
          
          for (const log of logs) {
            const block = await provider.getBlock(log.blockNumber);
            
            allEvents.push({
              id: `${log.transactionHash}-${log.index}`,
              eventName: log.eventName || log.fragment?.name,
              args: log.args ? Object.fromEntries(
                Object.entries(log.args).filter(([key]) => isNaN(key))
              ) : {},
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash,
              timestamp: block ? block.timestamp * 1000 : Date.now(),
              logIndex: log.index
            });
          }
        } catch (err) {
          console.error(`Error fetching events for filter:`, err);
        }
      }

      // Sort by block number (newest first)
      allEvents.sort((a, b) => b.blockNumber - a.blockNumber);

      setEvents(allEvents);
      setLatestBlock(currentBlock);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [address, abi, chainId, fromBlock]);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Poll for new events every 10 seconds
  useEffect(() => {
    if (!address || !abi) return;

    const interval = setInterval(() => {
      fetchEvents();
    }, 10000);

    return () => clearInterval(interval);
  }, [address, abi, fetchEvents]);

  return {
    events,
    loading,
    error,
    latestBlock,
    refetch: fetchEvents
  };
}
