import React, { useMemo } from 'react';
import FunctionCard from './FunctionCard';
import { Layers } from 'lucide-react';

const FunctionList = ({ abi, onCall }) => {
  const functions = useMemo(() => {
    if (!abi) return { read: [], write: [] };
    
    const funcs = abi.filter(item => item.type === 'function');
    return {
      read: funcs.filter(f => f.stateMutability === 'view' || f.stateMutability === 'pure'),
      write: funcs.filter(f => f.stateMutability !== 'view' && f.stateMutability !== 'pure')
    };
  }, [abi]);

  if (!abi) return null;

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg">
            <Layers size={18} className="text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-200">Read Functions</h2>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            {functions.read.length}
          </span>
        </div>
        <div className="grid gap-4">
          {functions.read.map((func, i) => (
            <FunctionCard key={`${func.name}-${i}`} func={func} onCall={onCall} />
          ))}
          {functions.read.length === 0 && (
            <p className="text-slate-500 text-sm italic">No read functions found.</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-amber-500/10 rounded-lg">
            <Layers size={18} className="text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-200">Write Functions</h2>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            {functions.write.length}
          </span>
        </div>
        <div className="grid gap-4">
          {functions.write.map((func, i) => (
            <FunctionCard key={`${func.name}-${i}`} func={func} onCall={onCall} />
          ))}
          {functions.write.length === 0 && (
            <p className="text-slate-500 text-sm italic">No write functions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FunctionList;
