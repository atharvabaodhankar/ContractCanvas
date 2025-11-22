import React, { useState } from 'react';
import { FileJson, Upload, Check, AlertTriangle, Download, Loader2 } from 'lucide-react';
import { fetchABI, isValidAddress } from '../utils/etherscan';

const ABIManager = ({ onAbiChange, address, chainId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [abiText, setAbiText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null);

  const handleAutoFetch = async () => {
    if (!address || !isValidAddress(address)) {
      setError('Please enter a valid contract address first');
      return;
    }

    setLoading(true);
    setError('');
    setFetchStatus(null);

    try {
      const result = await fetchABI(address, chainId);
      onAbiChange(result.abi);
      setFetchStatus({
        success: true,
        message: `Successfully fetched ABI from ${result.source}`,
        contractName: result.contractName
      });
      setIsOpen(false);
    } catch (err) {
      setError(err.message);
      setFetchStatus({
        success: false,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAbiSubmit = () => {
    try {
      const parsed = JSON.parse(abiText);
      if (!Array.isArray(parsed)) throw new Error('ABI must be an array');
      onAbiChange(parsed);
      setIsOpen(false);
      setError('');
      setFetchStatus({
        success: true,
        message: 'ABI imported successfully'
      });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      {/* Status message */}
      {fetchStatus && (
        <div className={`mb-3 p-3 rounded-lg border ${
          fetchStatus.success 
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400' 
            : 'bg-rose-950/30 border-rose-800/50 text-rose-400'
        } text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2`}>
          {fetchStatus.success ? <Check size={16} /> : <AlertTriangle size={16} />}
          <span>{fetchStatus.message}</span>
          {fetchStatus.contractName && (
            <span className="text-xs opacity-70">({fetchStatus.contractName})</span>
          )}
        </div>
      )}

      {!isOpen ? (
        <div className="flex gap-3">
          <button
            onClick={handleAutoFetch}
            disabled={loading || !address}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Fetching ABI...
              </>
            ) : (
              <>
                <Download size={16} />
                Auto-fetch ABI
              </>
            )}
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="text-sm text-indigo-400 hover:text-indigo-300 px-4 py-2.5 flex items-center gap-2 transition-colors border border-slate-800 rounded-lg hover:border-indigo-800"
          >
            <FileJson size={16} />
            Manual Import
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Upload size={16} /> Paste ABI JSON
            </h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setError('');
              }}
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
