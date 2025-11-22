import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
  const pointsRef = useRef();
  const particleCount = 1500;

  // Generate particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    return positions;
  }, []);

  // Generate particle colors
  const colors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3);
    const color1 = new THREE.Color('#6366f1'); // Indigo
    const color2 = new THREE.Color('#a855f7'); // Purple
    const color3 = new THREE.Color('#06b6d4'); // Aqua
    
    for (let i = 0; i < particleCount; i++) {
      const mixFactor = Math.random();
      let color;
      
      if (mixFactor < 0.33) {
        color = color1;
      } else if (mixFactor < 0.66) {
        color = color2;
      } else {
        color = color3;
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return colors;
  }, []);

  // Animate particles
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime;
      
      // Gentle rotation
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      
      // Floating effect
      const positions = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + i) * 0.001;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleField;
