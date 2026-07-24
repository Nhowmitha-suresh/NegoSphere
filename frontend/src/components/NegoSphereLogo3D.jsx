import React, { useEffect, useRef } from 'react';

export default function NegoSphereLogo3D({ 
  scale = 1, 
  animateAssembly = true, 
  size = 260,
  mode = 'idle', // 'idle' | 'searching' | 'thinking' | 'running' | 'complete'
  theme = 'light' // 'light' | 'dark'
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let startTime = performance.now();

    const ORBITAL_SPHERES = [
      { ring: 0, angleOffset: 0.2, r: 4 },
      { ring: 0, angleOffset: 2.1, r: 6 },
      { ring: 1, angleOffset: 0.8, r: 5 },
      { ring: 1, angleOffset: 3.5, r: 7 },
      { ring: 2, angleOffset: 1.4, r: 4.5 },
      { ring: 2, angleOffset: 4.8, r: 6 },
      { ring: 2, angleOffset: 5.6, r: 5 }
    ];

    const render = (time) => {
      const elapsed = (time - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const assemblyProgress = animateAssembly ? Math.min(1, elapsed / 2.0) : 1;
      const easeAssembly = 1 - Math.pow(1 - assemblyProgress, 3);

      // Mode-based speed & pulse multipliers
      let speedMult = 1.0;
      let pulseGlow = 0;

      if (mode === 'searching') {
        speedMult = 2.2;
        pulseGlow = (Math.sin(time * 0.005) + 1) * 6;
      } else if (mode === 'thinking') {
        speedMult = 1.6;
        pulseGlow = (Math.sin(time * 0.003) + 1) * 4;
      } else if (mode === 'running') {
        speedMult = 1.8;
        pulseGlow = (Math.sin(time * 0.008) + 1) * 8;
      } else if (mode === 'complete') {
        speedMult = 1.0;
        pulseGlow = 12;
      }

      ctx.save();
      ctx.translate(centerX, centerY);

      // Soft breathing glow
      const breath = 1 + Math.sin(time * 0.001 * speedMult) * 0.015;
      ctx.scale(breath * scale, breath * scale);

      // Draw Fine Delicate Orbital Rings
      const ringRadii = [size * 0.42, size * 0.33, size * 0.24];
      const ringTilts = [0.25, -0.2, 0.15];

      ringRadii.forEach((rad, idx) => {
        ctx.save();
        ctx.rotate(ringTilts[idx] + time * 0.00015 * speedMult * (idx % 2 === 0 ? 1 : -1));
        
        ctx.beginPath();
        ctx.ellipse(0, 0, rad, rad * 0.55, 0, 0, Math.PI * 2);
        ctx.strokeStyle = theme === 'dark'
          ? `rgba(201, 167, 106, ${0.2 * easeAssembly})`
          : `rgba(122, 92, 69, ${0.12 * easeAssembly})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // Draw Floating Polished Gold Spheres on Orbits
      ORBITAL_SPHERES.forEach((s) => {
        const rad = ringRadii[s.ring];
        const currentAngle = s.angleOffset + time * 0.0002 * speedMult * (s.ring % 2 === 0 ? 1 : -1);
        const sx = Math.cos(currentAngle) * rad;
        const sy = Math.sin(currentAngle) * rad * 0.55;

        ctx.save();
        ctx.rotate(ringTilts[s.ring]);
        
        const sphereGrad = ctx.createRadialGradient(sx - s.r * 0.3, sy - s.r * 0.3, 1, sx, sy, s.r);
        sphereGrad.addColorStop(0, '#FFF6E5');
        sphereGrad.addColorStop(0.4, '#C9A76A');
        sphereGrad.addColorStop(0.8, '#7A5C45');
        sphereGrad.addColorStop(1, '#3F3024');

        ctx.beginPath();
        ctx.arc(sx, sy, s.r * easeAssembly, 0, Math.PI * 2);
        ctx.fillStyle = sphereGrad;
        ctx.shadowColor = 'rgba(201, 167, 106, 0.5)';
        ctx.shadowBlur = 8 + pulseGlow;
        ctx.fill();
        ctx.restore();
      });

      // Central 3D Interlocking Curved Metallic Crescents
      if (assemblyProgress > 0.15) {
        const emblemAlpha = animateAssembly ? Math.min(1, (assemblyProgress - 0.15) / 0.85) : 1;
        ctx.globalAlpha = emblemAlpha;

        const R = size * 0.18;
        
        // Brushed Gold Metallic Gradient with Dynamic Specular Light Sweep
        const goldGrad = ctx.createLinearGradient(-R, -R, R, R);
        const sweep = (Math.sin(time * 0.0008 * speedMult) + 1) / 2;
        goldGrad.addColorStop(0, '#7A5C45');
        goldGrad.addColorStop(Math.max(0, sweep - 0.2), '#C9A76A');
        goldGrad.addColorStop(sweep, '#FFFBF0');
        goldGrad.addColorStop(Math.min(1, sweep + 0.2), '#C9A76A');
        goldGrad.addColorStop(1, '#3F3024');

        for (let i = 0; i < 2; i++) {
          ctx.save();
          ctx.rotate(i * Math.PI + time * 0.0001 * speedMult);

          ctx.beginPath();
          ctx.arc(0, R * 0.15, R * 0.8, 0.2, Math.PI - 0.2, false);
          ctx.arc(0, -R * 0.05, R * 0.65, Math.PI - 0.3, 0.3, true);
          ctx.closePath();

          ctx.fillStyle = goldGrad;
          ctx.shadowColor = theme === 'dark' ? 'rgba(201, 167, 106, 0.5)' : 'rgba(63, 48, 36, 0.3)';
          ctx.shadowBlur = 12 + pulseGlow;
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 246, 229, 0.7)';
          ctx.lineWidth = 0.9;
          ctx.stroke();

          ctx.restore();
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [size, scale, animateAssembly, mode, theme]);

  return (
    <canvas
      ref={canvasRef}
      width={size * 1.4}
      height={size * 1.4}
      className="pointer-events-none select-none inline-block transition-transform duration-500"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
