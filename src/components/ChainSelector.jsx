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
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentChain = CHAINS.find(c => c.id === selectedChain) || CHAINS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 pl-4 pr-3 py-3 rounded-xl 
          bg-slate-900/40 backdrop-blur-md border border-slate-700/50 
          text-slate-200 hover:bg-slate-800/50 hover:border-slate-600/50 
          transition-all duration-300 min-w-[200px] justify-between group
          ${isOpen ? 'ring-2 ring-indigo-500/20 border-indigo-500/30' : ''}
        `}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{currentChain.icon}</span>
          <span className="font-medium text-sm">{currentChain.name}</span>
        </span>
        <ChevronDown 
          size={16} 
          className={`text-slate-500 transition-transform duration-300 group-hover:text-slate-400 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <div 
        className={`
          absolute right-0 top-full mt-2 w-full min-w-[220px] 
          bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 
          rounded-xl shadow-xl shadow-black/20 overflow-hidden z-50
          transition-all duration-200 origin-top
          ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}
        `}
      >
        <div className="p-1 space-y-0.5">
          {CHAINS.map((chain) => (
            <button
              key={chain.id}
              onClick={() => {
                onSelectChain(chain.id);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                ${selectedChain === chain.id 
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'}
              `}
            >
              <span className="text-lg">{chain.icon}</span>
              <span className="text-sm font-medium">{chain.name}</span>
              {selectedChain === chain.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChainSelector;
