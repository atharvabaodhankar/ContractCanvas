import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { isAddress } from 'ethers';

const AddressInput = ({ onAddressChange, value }) => {
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const val = e.target.value;
    onAddressChange(val);
    
    if (val && !isAddress(val)) {
      setError('Invalid Ethereum address');
    } else {
      setError('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        <div className="relative flex items-center bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
          <div className="pl-4 text-slate-500">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Paste contract address (0x...)"
            className="w-full bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-500 py-4 pl-3 pr-12 font-mono"
          />
          <div className="pr-4">
            {value && !error && <CheckCircle2 className="text-emerald-500" size={20} />}
            {error && <AlertCircle className="text-rose-500" size={20} />}
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-rose-400 flex items-center gap-1 ml-1">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
};

export default AddressInput;
