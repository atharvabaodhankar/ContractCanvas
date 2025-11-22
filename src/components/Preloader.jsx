import React, { useState, useEffect } from 'react';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('loading'); // loading, zooming, complete

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Start zoom animation after loading completes
          setTimeout(() => {
            setStage('zooming');
            // Complete after zoom animation
            setTimeout(() => {
              setStage('complete');
              onComplete();
            }, 1200);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center transition-all duration-1000 ${
        stage === 'zooming' ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
      } ${stage === 'complete' ? 'pointer-events-none' : ''}`}
      style={{
        transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out'
      }}
    >
      <div className={`flex flex-col items-center gap-8 transition-all duration-700 ${
        stage === 'zooming' ? 'scale-110' : 'scale-100'
      }`}>
        {/* Logo with enhanced animations */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl blur-3xl opacity-40 animate-pulse"></div>
          
          {/* Rotating ring */}
          <div className="absolute inset-[-20px] rounded-full border-2 border-indigo-500/20 animate-spin-slow"></div>
          
          {/* Logo container */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
            <img src="/logo.png" alt="ContractCanvas" className="w-20 h-20 object-contain filter drop-shadow-lg" />
          </div>
        </div>

        {/* Brand name with stagger animation */}
        <div className={`text-center space-y-2 transition-all duration-500 ${
          stage === 'loading' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300">
            ContractCanvas
          </h2>
          <p className="text-slate-500 text-sm tracking-wider uppercase">
            Smart Contract Visualizer
          </p>
        </div>

        {/* Progress bar with gradient */}
        <div className={`w-72 transition-all duration-500 ${
          stage === 'loading' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 transition-all duration-300 ease-out rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          {/* Loading percentage */}
          <div className="text-slate-600 text-xs font-mono text-center mt-3">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
