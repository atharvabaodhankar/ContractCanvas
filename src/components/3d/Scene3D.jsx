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
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Create Blockchain Structure ---
    const blocks = [];
    const connections = []; // Array of { mesh, startBlock, endBlock }
    const blockGroup = new THREE.Group();
    scene.add(blockGroup);

    // Helper: Create a High-Quality Block
    const createBlock = (index) => {
      const group = new THREE.Group();
      
      // 1. Glass Shell
      const shellGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
      const shellMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e1b4b, // Deep Indigo
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.6, // Glassy
        thickness: 1.5,
        clearcoat: 1,
        transparent: true,
        opacity: 0.8
      });
      const shell = new THREE.Mesh(shellGeo, shellMat);
      group.add(shell);

      // 2. Glowing Edges (Thick)
      const edgesGeo = new THREE.EdgesGeometry(shellGeo);
      // Note: LineBasicMaterial doesn't support linewidth on Windows/WebGL usually, 
      // but we'll use a bright color to make it pop.
      const edgesMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.8 });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      group.add(edges);

      // 3. Inner Core (The "Data")
      const coreGeo = new THREE.IcosahedronGeometry(0.6, 0);
      const coreMat = new THREE.MeshStandardMaterial({ 
        color: 0xa855f7, 
        emissive: 0xa855f7,
        emissiveIntensity: 2,
        roughness: 0.4,
        metalness: 0.8
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      // Position
      group.position.y = (index - 1.5) * 2.8; // Spaced out vertically
      
      group.userData = { core, shell }; // Store refs
      blocks.push(group);
      blockGroup.add(group);
    };

    // Create 4 Blocks
    for (let i = 0; i < 4; i++) createBlock(i);

    // Helper: Create Connection (Cylinder)
    const createConnection = (idx1, idx2) => {
      const geometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
      const material = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        emissive: 0x6366f1,
        emissiveIntensity: 1,
        metalness: 0.8,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(geometry, material);
      // Pivot is center (default), which is perfect for our midpoint logic
      
      blockGroup.add(mesh);
      connections.push({ mesh, start: blocks[idx1], end: blocks[idx2] });
    };

    // Connect them: 0->1, 1->2, 2->3
    for (let i = 0; i < 3; i++) createConnection(i, i+1);


    // --- 3. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const bluePoint = new THREE.PointLight(0x06b6d4, 3, 20);
    bluePoint.position.set(-5, 0, 5);
    scene.add(bluePoint);

    const purplePoint = new THREE.PointLight(0xa855f7, 3, 20);
    purplePoint.position.set(5, 0, 5);
    scene.add(purplePoint);


    // --- 4. Animation Loop (Dynamic Connections) ---
    const animate = () => {
      requestAnimationFrame(animate);

      // 1. Rotate Blocks (Subtle)
      blocks.forEach((block, i) => {
        block.userData.core.rotation.x += 0.01;
        block.userData.core.rotation.y += 0.015;
        block.userData.shell.rotation.y += 0.002;
      });

      // 2. Update Connections (Robust Vector Math)
      connections.forEach(({ mesh, start, end }) => {
        const startPos = start.position;
        const endPos = end.position;
        
        // 1. Position at midpoint
        const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
        mesh.position.copy(midPoint);
        
        // 2. Scale to match distance
        const distance = startPos.distanceTo(endPos);
        mesh.scale.set(1, distance, 1);
        
        // 3. Rotate to align
        // Cylinder default is Y-up. We need to rotate it to point from start to end.
        const direction = new THREE.Vector3().subVectors(endPos, startPos).normalize();
        const quaternion = new THREE.Quaternion();
        // Create a rotation that rotates the Y-axis (0,1,0) to the direction vector
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        mesh.setRotationFromQuaternion(quaternion);
      });

      // 3. Float Group
      blockGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;

      renderer.render(scene, camera);
    };
    animate();


    // --- 6. Responsive & Scroll Logic ---
    
    const updateScrollAnimations = () => {
      const isMobile = window.innerWidth < 768;
      
      // Clear existing triggers to rebuild them
      ScrollTrigger.getAll().forEach(t => t.kill());
      
      // Initial Position
      if (isMobile) {
        blockGroup.position.set(0, 1.5, 0);
        blockGroup.scale.set(0.4, 0.4, 0.4);
      } else {
        blockGroup.position.set(-4.5, 0, 0); // Further left
        blockGroup.scale.set(0.8, 0.8, 0.8);
      }

      // Common settings
      const scrollDefaults = {
        scrub: 2,
        ease: "power2.inOut"
      };

      // Section 2: Explosion
      const tl2 = gsap.timeline({
        scrollTrigger: { trigger: '#section-2', start: 'top bottom', end: 'center center', ...scrollDefaults }
      });
      tl2.to(blocks[0].position, { x: -2.5, y: 2.5, z: 0 }, 0)
         .to(blocks[1].position, { x: 2.5, y: 1, z: 1 }, 0)
         .to(blocks[2].position, { x: -2.5, y: -1, z: 1 }, 0)
         .to(blocks[3].position, { x: 2.5, y: -2.5, z: 0 }, 0);

      // Section 3: Network Circle
      const tl3 = gsap.timeline({
        scrollTrigger: { trigger: '#section-3', start: 'top bottom', end: 'center center', ...scrollDefaults }
      });
      const radius = 3.5;
      blocks.forEach((block, i) => {
        const angle = (i / 4) * Math.PI * 2;
        tl3.to(block.position, {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: 0
        }, 0);
      });

      // Section 4: Features (Center Stage)
      const tl4 = gsap.timeline({
        scrollTrigger: { trigger: '#section-4', start: 'top bottom', end: 'center center', ...scrollDefaults }
      });
      
      // 1. Merge blocks to center line
      blocks.forEach((block, i) => {
        tl4.to(block.position, {
          x: (i - 1.5) * 1.5, // Tighter spacing
          y: 0,
          z: 0,
          scale: 0.8
        }, 0);
      });

      // 2. Move Group to Center (Desktop only, Mobile is already centered)
      if (!isMobile) {
        tl4.to(blockGroup.position, {
          x: 0, // Move to center
          y: 0,
          z: 2, // Bring closer
          duration: 1
        }, 0);
      } else {
        // Mobile: Just scale up a bit
        tl4.to(blockGroup.scale, {
          x: 0.5, y: 0.5, z: 0.5
        }, 0);
      }
      
      // Rotate group
      gsap.to(blockGroup.rotation, {
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 3 },
        y: Math.PI * 1 // Full rotation
      });
    };

    // Initial call
    updateScrollAnimations();

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateScrollAnimations(); // Rebuild animations on resize
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
