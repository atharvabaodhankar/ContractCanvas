import React, { useState } from 'react';
import { FileJson, Upload, Check, AlertTriangle, Download, Loader2, Code, FlaskConical } from 'lucide-react';
import { fetchABI, isValidAddress } from '../utils/etherscan';
import { generateAbiFromSource } from '../utils/abiGenerator';

const ABIManager = ({ onAbiChange, address, chainId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [abiText, setAbiText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('json'); // 'json' or 'source'
  const [sourceCode, setSourceCode] = useState('');

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
      if (err.message.includes('not verified') || err.message.includes('not be a smart contract')) {
        // Auto-switch to manual import for unverified contracts
        setIsOpen(true);
        setActiveTab('source'); // Default to source code as it might be easier for some
        setError(''); // access it as a "hint" rather than red error
        setFetchStatus({
          success: false,
          message: 'Contract not verified. Please paste the ABI or Source Code manually.'
        });
      } else {
        setError(err.message);
        setFetchStatus({
          success: false,
          message: err.message
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAbi = () => {
    try {
      const generatedAbi = generateAbiFromSource(sourceCode);
      if (generatedAbi.length === 0) {
        throw new Error('No public functions found in source code. Make sure to define functions as "public" or "external".');
      }
      
      setAbiText(JSON.stringify(generatedAbi, null, 2));
      setActiveTab('json');
      setFetchStatus({
        success: true,
        message: `Generated ABI with ${generatedAbi.length} functions`
      });
    } catch (e) {
      setError(e.message);
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
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('json')}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'json' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <FileJson size={14} /> JSON ABI
              </button>
              <button
                onClick={() => setActiveTab('source')}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'source' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <Code size={14} /> Solidity Source
              </button>
            </div>
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

          {activeTab === 'json' ? (
            <>
              <div className="mb-2 text-xs text-slate-500">
                Paste the contract ABI JSON array below.
              </div>
              <textarea
                value={abiText}
                onChange={(e) => setAbiText(e.target.value)}
                className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
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
            </>
          ) : (
            <>
              <div className="mb-2 text-xs text-slate-500">
                Paste the Solidity source code. We'll try to extract public functions.
              </div>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
                placeholder={'contract MyContract {\n  function transfer(address to, uint256 amount) public returns (bool) {\n    // ...\n  }\n}'}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-rose-400 flex items-center gap-1">
                  {error && <><AlertTriangle size={12} /> {error}</>}
                </span>
                <button
                  onClick={handleGenerateAbi}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <FlaskConical size={14} /> Generate ABI
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ABIManager;
