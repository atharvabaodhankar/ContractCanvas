import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Section1_SolidityReveal = () => {
  const textRef = useRef();

  useEffect(() => {
    if (!textRef.current) return;

    // Text fade-in animation
    gsap.fromTo(
      textRef.current.children,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '#section-1',
          start: 'top center',
          end: 'center center',
          scrub: 1,
        },
        ease: 'power4.out',
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      id="section-1" 
      className="relative h-screen flex items-center justify-end px-8 md:px-16"
    >
      {/* Text content */}
      <div 
        ref={textRef}
        className="max-w-xl z-10 space-y-6"
      >
        <h2 className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300 leading-tight">
          What is Solidity?
        </h2>
        
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
          Solidity is the programming language powering smart contracts on Ethereum and EVM-compatible blockchains. 
          It enables developers to write self-executing contracts with the terms of the agreement directly written into code.
        </p>
        
        <p className="text-base md:text-lg text-slate-400">
          With ContractCanvas, you can interact with any Solidity smart contract without writing a single line of code.
        </p>

        <div className="flex gap-4 pt-4">
          <div className="px-4 py-2 bg-indigo-950/50 border border-indigo-800/50 rounded-lg">
            <span className="text-indigo-400 text-sm font-mono">Ethereum</span>
          </div>
          <div className="px-4 py-2 bg-purple-950/50 border border-purple-800/50 rounded-lg">
            <span className="text-purple-400 text-sm font-mono">Polygon</span>
          </div>
          <div className="px-4 py-2 bg-cyan-950/50 border border-cyan-800/50 rounded-lg">
            <span className="text-cyan-400 text-sm font-mono">BSC</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1_SolidityReveal;
