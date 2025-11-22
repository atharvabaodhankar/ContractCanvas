import React, { useState } from 'react';
import { FileJson, Upload, Check, AlertTriangle } from 'lucide-react';

const ABIManager = ({ onAbiChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [abiText, setAbiText] = useState('');
  const [error, setError] = useState('');

  const handleAbiSubmit = () => {
    try {
      const parsed = JSON.parse(abiText);
      if (!Array.isArray(parsed)) throw new Error('ABI must be an array');
      onAbiChange(parsed);
      setIsOpen(false);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
        >
          <FileJson size={16} />
          Manually import ABI
        </button>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Upload size={16} /> Paste ABI JSON
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Cancel
            </button>
          </div>
          <textarea
            value={abiText}
            onChange={(e) => setAbiText(e.target.value)}
            className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
            placeholder='[{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-rose-400 flex items-center gap-1">
              {error && <><AlertTriangle size={12} /> {error}</>}
            </span>
            <button
              onClick={handleAbiSubmit}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Check size={14} /> Import ABI
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ABIManager;
