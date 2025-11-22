import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Section4_Features = () => {
  const cardsRef = useRef();

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.feature-card');
    
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '#section-4',
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

  const features = [
    {
      title: 'Paste Contract Address',
      description: 'Instantly load any deployed smart contract by simply pasting its address',
      icon: '📋',
      color: 'indigo',
    },
    {
      title: 'Automatic ABI Detection',
      description: 'Smart ABI fetching from verified contracts across multiple explorers',
      icon: '🔍',
      color: 'purple',
    },
    {
      title: 'Live Method Invocation',
      description: 'Call contract functions directly from the UI with real-time feedback',
      icon: '⚡',
      color: 'violet',
    },
    {
      title: 'Event Logs Visualizer',
      description: 'Monitor and export contract events in real-time with filtering',
      icon: '📊',
      color: 'cyan',
    },
  ];

  return (
    <section 
      id="section-4" 
      className="relative min-h-screen flex items-center justify-center px-8 md:px-16 py-20"
    >
      {/* Text content */}
      <div className="max-w-6xl z-10 w-full">
        <h2 className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200 leading-tight text-center mb-16">
          Powerful Features
        </h2>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm hover:border-${feature.color}-500/50 transition-all duration-300 hover:scale-105`}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className={`text-2xl font-bold text-${feature.color}-400 mb-3`}>
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/50"
          >
            Start Testing Contracts
          </a>
        </div>
      </div>
    </section>
  );
};

export default Section4_Features;
