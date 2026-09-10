import React, { useEffect, useRef } from 'react';
import { GiftEffectConfig } from '../../../utils/giftEffects';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  emoji?: string;
  color: string;
  isSparkle: boolean;
  scale: number;
}

interface GiftParticleCanvasProps {
  isActive: boolean;
  config: GiftEffectConfig;
  durationMs?: number;
}

export const GiftParticleCanvas: React.FC<GiftParticleCanvasProps> = ({
  isActive,
  config,
  durationMs = 4000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isSpawningRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isActive) {
      particlesRef.current = [];
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resize = () => {
      if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    isSpawningRef.current = true;
    const startTime = Date.now();

    // Spawn initial particle burst
    const spawnParticles = (count: number, isInitial: boolean = false) => {
      const width = canvas.width;
      const height = canvas.height;

      for (let i = 0; i < count; i++) {
        const isEmoji = Math.random() < 0.45;
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const emoji = isEmoji
          ? config.emojis[Math.floor(Math.random() * config.emojis.length)]
          : undefined;

        // Position: bottom area or center fountain
        const startX = isInitial
          ? width * 0.5 + (Math.random() - 0.5) * width * 0.6
          : Math.random() * width;
        const startY = height * 0.95 + Math.random() * (height * 0.05);

        particlesRef.current.push({
          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * 4,
          vy: -(Math.random() * 5 + 3.5),
          size: isEmoji ? Math.random() * 16 + 20 : Math.random() * 6 + 3,
          alpha: 1,
          decay: Math.random() * 0.008 + 0.005,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.08,
          emoji,
          color,
          isSparkle: !isEmoji,
          scale: 0.2,
        });
      }
    };

    // Initial blast
    spawnParticles(35, true);

    // Continuous emission for 2.2 seconds
    const interval = setInterval(() => {
      if (Date.now() - startTime < durationMs - 1200) {
        spawnParticles(10);
      } else {
        clearInterval(interval);
      }
    }, 120);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;
        p.scale = Math.min(p.scale + 0.05, 1);

        // Gentle floating drift
        p.vx += (Math.random() - 0.5) * 0.2;

        if (p.alpha <= 0 || p.y < -50) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scale, p.scale);

        if (p.emoji) {
          ctx.font = `${p.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.fillText(p.emoji, 0, 0);
        } else {
          // Sparkling star / glowing dot
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 14;

          // Draw 4-point sparkle star
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        }

        ctx.restore();
      }

      if (particlesRef.current.length > 0 || Date.now() - startTime < durationMs) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(interval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, config, durationMs]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-35 w-full h-full"
    />
  );
};
