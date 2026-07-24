import React, { useEffect, useRef } from 'react';

export default function CinematicSphereCanvas({ phase = 'orbit' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let startTime = performance.now();

    // Generate thousands of microscopic particles for 3D sphere & dust
    const numSphereParticles = 350;
    const numDustParticles = 80;
    
    const sphereParticles = [];
    const dustParticles = [];

    // Fibonacci sphere distribution for mathematical perfection
    const phi = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numSphereParticles; i++) {
      const theta = (2 * Math.PI * i) / phi;
      const y = 1 - (i / (numSphereParticles - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);

      sphereParticles.push({
        x: Math.cos(theta) * radiusAtY,
        y: y,
        z: Math.sin(theta) * radiusAtY,
        baseRadius: 100,
        trail: [],
        sparkle: Math.random()
      });
    }

    // Ambient floating dust particles
    for (let i = 0; i < numDustParticles; i++) {
      dustParticles.push({
        x: (Math.random() - 0.5) * window.innerWidth,
        y: (Math.random() - 0.5) * window.innerHeight,
        z: Math.random() * 500,
        speedY: -0.15 - Math.random() * 0.2,
        size: 0.5 + Math.random() * 1.5,
        alpha: 0.1 + Math.random() * 0.4
      });
    }

    const render = (time) => {
      const elapsed = (time - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Volumetric Gold Spotlight Beam Background Effect
      const spotGrad = ctx.createRadialGradient(centerX, centerY - 80, 10, centerX, centerY, canvas.width * 0.6);
      spotGrad.addColorStop(0, 'rgba(201, 167, 106, 0.08)');
      spotGrad.addColorStop(0.5, 'rgba(122, 92, 69, 0.03)');
      spotGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');

      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Floating Dust Particles
      dustParticles.forEach((d) => {
        d.y += d.speedY;
        if (d.y < -canvas.height / 2) d.y = canvas.height / 2;

        ctx.save();
        ctx.fillStyle = '#C9A76A';
        ctx.globalAlpha = d.alpha * (0.5 + Math.sin(elapsed + d.z) * 0.5);
        ctx.beginPath();
        ctx.arc(centerX + d.x, centerY + d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3D Camera Rotation Parameters
      const rotY = elapsed * 0.35;
      const rotX = Math.sin(elapsed * 0.2) * 0.15;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      // Render 3D Sphere & Particle Trails
      const projected = [];
      sphereParticles.forEach((p) => {
        // Rotate Y
        let rx = p.x * cosY - p.z * sinY;
        let rz = p.x * sinY + p.z * cosY;
        // Rotate X
        let ry = p.y * cosX - rz * sinX;
        rz = p.y * sinX + rz * cosX;

        // Radial Breathing effect
        const breath = p.baseRadius * (1 + Math.sin(elapsed * 1.5 + p.y * 3) * 0.03);
        const px = rx * breath;
        const py = ry * breath;
        const pz = rz * breath;

        // Perspective Projection
        const fov = 400;
        const scale = fov / (fov + pz + 200);
        const screenX = centerX + px * scale;
        const screenY = centerY + py * scale;

        projected.push({
          x: screenX,
          y: screenY,
          scale,
          z: pz,
          sparkle: p.sparkle
        });
      });

      // Sort by Z for Depth of Field Sorting
      projected.sort((a, b) => b.z - a.z);

      // Draw Orbit Particle Rings & Connecting Lines
      ctx.save();
      for (let i = 0; i < projected.length; i += 4) {
        const p = projected[i];
        const alpha = Math.max(0.1, (p.z + 100) / 200) * 0.4;
        
        ctx.fillStyle = p.sparkle > 0.8 ? '#FFFBF5' : '#C9A76A';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Outer Metallic Orbit Ring Sweeps
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 130, 75, elapsed * 0.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201, 167, 106, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 160, 90, -elapsed * 0.15, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 232, 211, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [phase]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
