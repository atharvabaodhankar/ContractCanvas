import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const NetworkLogo = ({ position, color, label, index }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Individual floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
      // Individual rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 + index;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const NetworkCarousel = () => {
  const groupRef = useRef();
  const [rotation, setRotation] = useState(0);

  const networks = [
    { label: 'Sepolia', color: '#6366f1' },
    { label: 'Ethereum', color: '#a855f7' },
    { label: 'Polygon', color: '#8b5cf6' },
    { label: 'BSC', color: '#06b6d4' },
  ];

  useEffect(() => {
    if (!groupRef.current) return;

    // Carousel rotation on scroll
    gsap.to(groupRef.current.rotation, {
      scrollTrigger: {
        trigger: '#section-3',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: Math.PI * 2,
      ease: 'none',
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <group ref={groupRef} position={[-1.5, 0, 0]}>
      {networks.map((network, index) => {
        const angle = (index / networks.length) * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <NetworkLogo
            key={network.label}
            position={[x, 0, z]}
            color={network.color}
            label={network.label}
            index={index}
          />
        );
      })}

      {/* Center ring */}
      <mesh>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#818cf8"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

export default NetworkCarousel;
