import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const BackgroundFX: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { neonTheme } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle simulation matching Swift BackgroundFX
    const particles = Array.from({ length: 42 }, (_, i) => ({
      fi: i,
      speed: 18 + (i % 7) * 7,
      yOffset: Math.random() * height,
      xSeed: i * 53,
      radius: 1.2 + (i % 3) * 0.8,
      pulseSpeed: 1.5 + Math.random() * 2,
    }));

    let startTime = performance.now();

    const render = (currentTime: number) => {
      const t = (currentTime - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Dark crimson vignette gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (neonTheme) {
        bgGrad.addColorStop(0, '#130202');
        bgGrad.addColorStop(0.5, '#0a0101');
        bgGrad.addColorStop(1, '#020000');
      } else {
        bgGrad.addColorStop(0, '#0c0c0c');
        bgGrad.addColorStop(1, '#040404');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render glowing embers
      if (neonTheme) {
        particles.forEach(p => {
          const y = height - ((t * p.speed + p.yOffset) % (height + 40));
          const x = (p.xSeed % width) + Math.sin(t + p.fi) * 14;
          const opacity = Math.max(0.15, Math.min(0.85, 0.3 + 0.5 * Math.abs(Math.sin(t * p.pulseSpeed + p.fi))));

          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 65, 30, ${opacity})`;
          ctx.shadowColor = '#ff1a1a';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [neonTheme]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-red-600 selection:text-white">
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
      />
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
};
