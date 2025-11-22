import React from 'react';

const Lights = () => {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directional Light 
        position={[5, 5, 5]} 
        intensity={0.8}
        castShadow
      />
      
      {/* Purple accent light */}
      <pointLight 
        position={[-3, 2, 3]} 
        intensity={1.5}
        color="#a855f7"
        distance={10}
      />
      
      {/* Blue accent light */}
      <pointLight 
        position={[3, -2, 2]} 
        intensity={1.2}
        color="#6366f1"
        distance={8}
      />
      
      {/* Aqua accent light */}
      <pointLight 
        position={[0, 3, -3]} 
        intensity={1}
        color="#06b6d4"
        distance={12}
      />
      
      {/* Fill light from below */}
      <pointLight 
        position={[0, -5, 0]} 
        intensity={0.5}
        color="#818cf8"
        distance={15}
      />
    </>
  );
};

export default Lights;
