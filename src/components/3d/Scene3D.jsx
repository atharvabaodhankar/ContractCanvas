import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Scene3D = () => {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    // Transparent background so CSS background shows through if needed
    // But we'll rely on the canvas being visible
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent clear color
    containerRef.current.appendChild(renderer.domElement);

    // 2. Create Cube (Simple & Robust)
    const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 3. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // 4. Scroll Interaction
    gsap.to(cube.rotation, {
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
      x: Math.PI * 2,
      y: Math.PI * 2,
    });

    gsap.to(cube.scale, {
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
      x: 0.5,
      y: 0.5,
      z: 0.5,
    });

    // 5. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  // Z-Index 0 ensures it's above the body background but below the content (z-10)
  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default Scene3D;
