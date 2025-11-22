import React, { useEffect } from 'react';
import Scene3D from '../components/3d/Scene3D';
import Section1_SolidityReveal from '../sections/Section1_SolidityReveal';
import Section2_SmartContract from '../sections/Section2_SmartContract';
import Section3_Networks from '../sections/Section3_Networks';
import Section4_Features from '../sections/Section4_Features';

const Dashboard = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative text-white overflow-x-hidden">
      {/* Pure Three.js WebGL Scene */}
      <Scene3D />

      {/* Scroll Sections */}
      <div className="relative z-10">
        <Section1_SolidityReveal />
        <Section2_SmartContract />
        <Section3_Networks />
        <Section4_Features />
      </div>

      {/* Navigation hint */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
        <div className="text-slate-500 text-sm flex flex-col items-center gap-2">
          <span>Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
