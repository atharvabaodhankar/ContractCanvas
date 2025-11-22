import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Section3_Networks = () => {
  const textRef = useRef();

  useEffect(() => {
    if (!textRef.current) return;

    gsap.fromTo(
      textRef.current.children,
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '#section-3',
          start: 'top center',
          end: 'center center',
          scrub: 1,
        },
        ease: 'expo.out',
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      id="section-3" 
      className="relative h-screen flex items-center justify-end px-8 md:px-16"
    >
      {/* Text content */}
      <div 
        ref={textRef}
        className="max-w-xl z-10 space-y-6"
      >
        <h2 className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 leading-tight">
          Multi-Chain Support
        </h2>
        
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
          ContractCanvas works seamlessly across multiple blockchain networks. 
          Test on testnets, deploy to mainnet—all with the same intuitive interface.
        </p>

        <div className="space-y-4 pt-4">
          <div className="p-4 bg-indigo-950/30 border border-indigo-800/50 rounded-lg backdrop-blur-sm">
            <h3 className="text-indigo-400 font-semibold mb-2">Ethereum & Sepolia</h3>
            <p className="text-sm text-slate-400">The world's programmable blockchain and its testnet</p>
          </div>

          <div className="p-4 bg-purple-950/30 border border-purple-800/50 rounded-lg backdrop-blur-sm">
            <h3 className="text-purple-400 font-semibold mb-2">Polygon</h3>
            <p className="text-sm text-slate-400">Scaling Ethereum with Layer 2 technology</p>
          </div>

          <div className="p-4 bg-cyan-950/30 border border-cyan-800/50 rounded-lg backdrop-blur-sm">
            <h3 className="text-cyan-400 font-semibold mb-2">Binance Smart Chain</h3>
            <p className="text-sm text-slate-400">Fast and low-cost smart contracts</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section3_Networks;
