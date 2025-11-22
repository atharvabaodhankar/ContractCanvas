import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const SmartContractIcon = () => {
  const groupRef = useRef();
  const linesRef = useRef([]);

  useEffect(() => {
    if (!groupRef.current) return;

    // Fade in animation
    gsap.fromTo(
      groupRef.current.scale,
      { x: 0, y: 0, z: 0 },
      {
        x: 1,
        y: 1,
        z: 1,
        scrollTrigger: {
          trigger: '#section-2',
          start: 'top center',
          end: 'center center',
          scrub: 1,
        },
        ease: 'expo.out',
      }
    );

    // Rotation
    gsap.to(groupRef.current.rotation, {
      scrollTrigger: {
        trigger: '#section-2',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: Math.PI * 0.5,
      ease: 'power4.out',
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[-1, 0, 0]}>
      {/* Document/paper shape */}
      <mesh>
        <boxGeometry args={[1.2, 1.6, 0.1]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#6366f1"
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Code lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-0.3, 0.5 - i * 0.25, 0.06]}>
          <boxGeometry args={[0.8, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* Glowing border */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1.2, 1.6, 0.1)]} />
        <lineBasicMaterial attach="material" color="#06b6d4" linewidth={2} />
      </lineSegments>
    </group>
  );
};

export default SmartContractIcon;
