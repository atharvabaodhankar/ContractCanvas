import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeatureCard3D = ({ position, color, index }) => {
  const cardRef = useRef();

  useEffect(() => {
    if (!cardRef.current) return;

    // Slide in and rotate animation
    gsap.fromTo(
      cardRef.current.position,
      {
        x: position[0] + 5,
        y: position[1],
        z: position[2],
      },
      {
        x: position[0],
        scrollTrigger: {
          trigger: '#section-4',
          start: 'top center',
          end: 'center center',
          scrub: 1,
        },
        delay: index * 0.1,
        ease: 'expo.out',
      }
    );

    gsap.fromTo(
      cardRef.current.rotation,
      {
        y: Math.PI * 0.5,
      },
      {
        y: 0,
        scrollTrigger: {
          trigger: '#section-4',
          start: 'top center',
          end: 'center center',
          scrub: 1,
        },
        delay: index * 0.1,
        ease: 'expo.out',
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [position, index]);

  // Floating animation
  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.05;
    }
  });

  return (
    <RoundedBox
      ref={cardRef}
      args={[0.8, 1, 0.05]}
      radius={0.05}
      smoothness={4}
      position={position}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        metalness={0.5}
        roughness={0.3}
        transparent
        opacity={0.8}
      />
    </RoundedBox>
  );
};

const FeatureCards3D = () => {
  const features = [
    { color: '#6366f1', position: [-1.5, 1, 0] },
    { color: '#a855f7', position: [-0.5, 0.5, 0] },
    { color: '#8b5cf6', position: [0.5, 0, 0] },
    { color: '#06b6d4', position: [1.5, -0.5, 0] },
  ];

  return (
    <group position={[0, 0, 0]}>
      {features.map((feature, index) => (
        <FeatureCard3D
          key={index}
          position={feature.position}
          color={feature.color}
          index={index}
        />
      ))}
    </group>
  );
};

export default FeatureCards3D;
