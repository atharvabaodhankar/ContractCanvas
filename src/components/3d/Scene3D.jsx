import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Scene3D = () => {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. Setup Scene ---
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Enable shadow map for better depth if needed, but keeping it performant
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Create "Sexy" Cube ---
    // Using a group to handle rotation and position separately
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Inner Core (Glowing)
    const coreGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const coreMat = new THREE.MeshBasicMaterial({ 
      color: 0x6366f1, // Indigo
      wireframe: true,
      transparent: true, 
      opacity: 0.3 
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    cubeGroup.add(core);

    // Outer Shell (Glassy/Metallic)
    const shellGeo = new THREE.BoxGeometry(2, 2, 2);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b, // Dark Indigo
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.2, // Glass-like
      thickness: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: 0x4c1d95, // Purple glow
      emissiveIntensity: 0.2
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    cubeGroup.add(shell);

    // Edges for definition
    const edges = new THREE.EdgesGeometry(shellGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 2 }); // Cyan edges
    const lines = new THREE.LineSegments(edges, lineMat);
    shell.add(lines);

    // --- 3. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x06b6d4, 2, 10);
    blueLight.position.set(-3, 2, 3);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 2, 10);
    purpleLight.position.set(3, -2, 3);
    scene.add(purpleLight);

    // --- 4. Responsive Positioning ---
    const updatePosition = () => {
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // Mobile: Center top, smaller
        cubeGroup.position.set(0, 1, 0);
        cubeGroup.scale.set(0.6, 0.6, 0.6);
      } else {
        // Desktop: Left side, normal size
        cubeGroup.position.set(-2.5, 0, 0);
        cubeGroup.scale.set(1, 1, 1);
      }
    };
    updatePosition();

    // --- 5. Animation Loop ---
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Complex rotation
      shell.rotation.x += 0.003;
      shell.rotation.y += 0.005;
      
      core.rotation.x -= 0.005; // Rotate opposite
      core.rotation.y -= 0.005;

      // Floating effect
      cubeGroup.position.y += Math.sin(Date.now() * 0.001) * 0.002;

      renderer.render(scene, camera);
    };
    animate();

    // --- 6. Scroll Interaction ---
    // Rotate faster on scroll
    gsap.to(cubeGroup.rotation, {
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
      x: Math.PI,
      y: Math.PI,
    });

    // Move to center on second section (example interaction)
    gsap.to(cubeGroup.position, {
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
      x: 0, // Move to center eventually
      ease: "power1.inOut"
    });

    // --- 7. Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updatePosition(); // Update position on resize
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default Scene3D;
