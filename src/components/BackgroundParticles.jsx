import React, { useEffect, useRef } from 'react';

const BackgroundParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: 0, y: 0, radius: 150 };
    let hue = 0;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle class with enhanced features
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.history = [];
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.baseSize = this.size;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.hue = Math.random() * 60 + 200; // Blue to purple range
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        // Save history for trail effect
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 5) {
          this.history.shift();
        }

        // Pulsing effect
        this.pulsePhase += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulsePhase) * 0.5;

        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction - attraction and repulsion
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = mouse.radius;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          
          // Repulsion when very close
          if (distance < maxDistance / 2) {
            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;
            this.size = this.baseSize * (1 + force);
          } else {
            // Gentle attraction when farther
            this.x += Math.cos(angle) * force * 0.5;
            this.y += Math.sin(angle) * force * 0.5;
          }
        }

        // Wrap around edges with fade effect
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }

      draw() {
        // Draw trail
        if (this.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(this.history[0].x, this.history[0].y);
          for (let i = 1; i < this.history.length; i++) {
            ctx.lineTo(this.history[i].x, this.history[i].y);
          }
          ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity * 0.2})`;
          ctx.lineWidth = this.size * 0.3;
          ctx.stroke();
        }

        // Draw particle with gradient
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 70%, ${this.opacity})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 60%, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 60%, 50%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner glow
        ctx.fillStyle = `hsla(${this.hue + 20}, 90%, 80%, ${this.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      // Fade effect instead of clear
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Slowly shift hue over time
      hue += 0.1;

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections with gradient
      particles.forEach((particleA, indexA) => {
        particles.slice(indexA + 1).forEach((particleB) => {
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = 0.3 * (1 - distance / 120);
            const gradient = ctx.createLinearGradient(
              particleA.x, particleA.y,
              particleB.x, particleB.y
            );
            gradient.addColorStop(0, `hsla(${particleA.hue}, 70%, 60%, ${opacity})`);
            gradient.addColorStop(1, `hsla(${particleB.hue}, 70%, 60%, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.stroke();
          }
        });
      });

      // Draw mouse cursor glow with darker, more beautiful gradient
      if (mouse.x && mouse.y) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouse.radius
        );
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.08)'); // Darker indigo center
        gradient.addColorStop(0.4, 'rgba(79, 70, 229, 0.04)'); // Purple mid
        gradient.addColorStop(1, 'rgba(67, 56, 202, 0)'); // Fade to transparent
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] bg-slate-950"
      style={{ display: 'block' }}
    />
  );
};

export default BackgroundParticles;
