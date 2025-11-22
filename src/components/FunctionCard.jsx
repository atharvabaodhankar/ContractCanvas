import React, { useState } from 'react';
import { Play, Loader2, Copy, Check } from 'lucide-react';

const FunctionCard = ({ func, onCall }) => {
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCall = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const args = func.inputs.map(input => inputs[input.name]);
      const res = await onCall(func.name, args, func.stateMutability);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isWrite = func.stateMutability !== 'view' && func.stateMutability !== 'pure';

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
      <div className="p-4 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            isWrite ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {func.stateMutability || 'nonpayable'}
          </span>
          <h3 className="font-mono text-sm font-semibold text-slate-200">{func.name}</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {func.inputs.length > 0 ? (
          <div className="space-y-3">
            {func.inputs.map((input, idx) => (
              <div key={idx} className="space-y-1">
                <label className="text-xs text-slate-500 font-mono ml-1">
                  {input.name || `param_${idx}`} <span className="text-slate-600">({input.type})</span>
                </label>
                <input
                  type="text"
                  placeholder={`${input.type} value`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) => handleInputChange(input.name, e.target.value)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600 italic">No parameters required</p>
        )}

        <div className="pt-2">
          <button
            onClick={handleCall}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              isWrite 
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {isWrite ? 'Write' : 'Read'}
          </button>
        </div>

        {error && (
          <div className="bg-rose-950/30 border border-rose-900/50 rounded-lg p-3 text-xs font-mono text-rose-300 break-all">
            Error: {error}
          </div>
        )}

        {result !== null && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 relative group">
            <div className="text-xs text-slate-500 mb-1">Result:</div>
            <div className="font-mono text-sm text-emerald-400 break-all pr-8">
              {result.toString()}
            </div>
            <button 
              onClick={copyResult}
              className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-slate-300 rounded-md hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionCard;
