import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const SolidityLogo = () => {
  const meshRef = useRef();
  const groupRef = useRef();

  useEffect(() => {
    if (!groupRef.current) return;

    // Rotation animation on scroll
    gsap.to(groupRef.current.rotation, {
      scrollTrigger: {
        trigger: '#section-1',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: Math.PI * 2, // 360 degree rotation
      ease: 'power4.out'
    });

    // Scale animation
    gsap.to(groupRef.current.scale, {
      scrollTrigger: {
        trigger: '#section-1',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      x: 1.2,
      y: 1.2,
      z: 1.2,
      ease: 'power4.out'
    });

    // Position shift to left
    gsap.to(groupRef.current.position, {
      scrollTrigger: {
        trigger: '#section-1',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      x: -1.5,
      ease: 'power4.out'
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Diamond shape (Solidity logo inspired) */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#a855f7"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh position={[0, 0, 0]} scale={1.3}>
        <torusGeometry args={[1, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

export default SolidityLogo;
