import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Section2_SmartContract = () => {
  const textRef = useRef();

  useEffect(() => {
    if (!textRef.current) return;

    gsap.fromTo(
      textRef.current.children,
      {
        opacity: 0,
        x: 100,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '#section-2',
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
      id="section-2" 
      className="relative h-screen flex items-center justify-end px-8 md:px-16"
    >
      {/* Text content */}
      <div 
        ref={textRef}
        className="max-w-xl z-10 space-y-6"
      >
        <h2 className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 leading-tight">
          Smart Contracts
        </h2>
        
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
          Self-executing contracts with the terms of the agreement directly written into lines of code. 
          They automatically enforce and execute the terms of a contract when predetermined conditions are met.
        </p>
        
        <p className="text-base md:text-lg text-slate-400">
          ContractCanvas lets you visualize and interact with any deployed smart contract through an intuitive interface. 
          No coding required—just paste the contract address and start exploring.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
            <div className="text-3xl font-bold text-indigo-400">100%</div>
            <div className="text-sm text-slate-500">Automated</div>
          </div>
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
            <div className="text-3xl font-bold text-purple-400">0</div>
            <div className="text-sm text-slate-500">Intermediaries</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section2_SmartContract;
