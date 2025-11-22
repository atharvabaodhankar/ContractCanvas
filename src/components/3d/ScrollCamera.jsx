import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollCamera = () => {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useEffect(() => {
    const cam = cameraRef.current;

    // Section 1: Initial position
    gsap.to(cam.position, {
      scrollTrigger: {
        trigger: '#section-1',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      x: 0,
      y: 0,
      z: 5,
      ease: 'power4.out'
    });

    // Section 2: Move camera
    gsap.to(cam.position, {
      scrollTrigger: {
        trigger: '#section-2',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      x: 1,
      y: -0.5,
      z: 4.5,
      ease: 'power4.out'
    });

    // Section 3: Carousel view
    gsap.to(cam.position, {
      scrollTrigger: {
        trigger: '#section-3',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      x: 0,
      y: 0,
      z: 6,
      ease: 'power4.out'
    });

    // Section 4: Cards view
    gsap.to(cam.position, {
      scrollTrigger: {
        trigger: '#section-4',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      x: 0,
      y: -1,
      z: 5,
      ease: 'power4.out'
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useFrame(() => {
    // Camera always looks at origin
    cameraRef.current.lookAt(0, 0, 0);
  });

  return null;
};

export default ScrollCamera;
