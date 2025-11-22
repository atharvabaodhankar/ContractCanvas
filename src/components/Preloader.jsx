import React, { useState, useEffect } from 'react';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStage('zooming');
            setTimeout(() => {
              setStage('complete');
              onComplete();
            }, 1000);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center overflow-hidden transition-all ${
        stage === 'zooming' ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
      }`}
      style={{
        transition: 'transform 1s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.8s ease-out'
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950"></div>
      
      {/* Large scrolling text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="text-scrolling-container">
          <h1 className="text-scrolling font-black tracking-tighter leading-none select-none">
            ContractCanvas ContractCanvas ContractCanvas
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
