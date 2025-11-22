import React from 'react';
import { ChevronDown } from 'lucide-react';

const CHAINS = [
  { id: '1', name: 'Ethereum Mainnet', icon: '🔷' },
  { id: '11155111', name: 'Sepolia Testnet', icon: '⚫' },
  { id: '137', name: 'Polygon', icon: '💜' },
  { id: '80002', name: 'Polygon Amoy', icon: '🟣' },
  { id: '42161', name: 'Arbitrum One', icon: '🔵' },
  { id: '10', name: 'Optimism', icon: '🔴' },
];

const ChainSelector = ({ selectedChain, onSelectChain }) => {
  return (
    <div className="relative">
      <div className="relative group">
         <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
         <select
            value={selectedChain}
            onChange={(e) => onSelectChain(e.target.value)}
            className="relative appearance-none bg-slate-900 border border-slate-800 text-slate-200 py-4 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-slate-800/50 transition-colors w-full md:w-auto min-w-[200px]"
          >
            {CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.icon} {chain.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <ChevronDown size={16} />
          </div>
      </div>
    </div>
  );
};

export default ChainSelector;
