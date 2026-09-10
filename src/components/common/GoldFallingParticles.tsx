import React, { useEffect, useRef } from 'react';

interface GoldParticle {
  x: number;
  y: number;
  size: number;
  fallSpeed: number;
  swaySpeed: number;
  swayAmount: number;
  swayOffset: number;
  rotation: number;
  rotationSpeed: number;
  flipRotation: number;
  flipSpeed: number;
  opacity: number;
  baseOpacity: number;
  pulseSpeed: number;
  color: string;
  type: 'leaf' | 'sparkle' | 'petal';
}

interface GoldFallingParticlesProps {
  enabled?: boolean;
  opacity?: number;
  particleCount?: number;
  className?: string;
}

const GOLD_PALETTES = [
  { primary: '#FFDF73', secondary: '#D4AF37', glow: 'rgba(255, 223, 115, 0.4)' },
  { primary: '#F5DF88', secondary: '#B8860B', glow: 'rgba(245, 223, 136, 0.35)' },
  { primary: '#D4AF37', secondary: '#997316', glow: 'rgba(212, 175, 55, 0.3)' },
  { primary: '#FFF2B2', secondary: '#E6CA65', glow: 'rgba(255, 242, 178, 0.45)' },
  { primary: '#E5A93C', secondary: '#8A5D12', glow: 'rgba(229, 169, 60, 0.35)' },
];

export const GoldFallingParticles: React.FC<GoldFallingParticlesProps> = ({
  enabled = true,
  opacity = 0.65,
  particleCount = 45,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<GoldParticle[]>([]);
  const isTabVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle canvas dimensions with DPR clamping for high performance
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize particles across full height so they don't all start from the top
    const count = Math.min(particleCount, width < 640 ? 25 : 50);
    const particles: GoldParticle[] = [];

    for (let i = 0; i < count; i++) {
      const typeRand = Math.random();
      const type: 'leaf' | 'sparkle' | 'petal' =
        typeRand < 0.55 ? 'leaf' : typeRand < 0.8 ? 'petal' : 'sparkle';

      const palette = GOLD_PALETTES[Math.floor(Math.random() * GOLD_PALETTES.length)];
      const baseOpacity = Math.random() * 0.45 + 0.25;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size:
          type === 'leaf'
            ? Math.random() * 7 + 6
            : type === 'petal'
            ? Math.random() * 5 + 4
            : Math.random() * 2.5 + 1.5,
        fallSpeed: Math.random() * 0.65 + 0.4,
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayAmount: Math.random() * 1.8 + 0.8,
        swayOffset: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        flipRotation: Math.random() * Math.PI * 2,
        flipSpeed: (Math.random() * 0.025 + 0.015) * (Math.random() > 0.5 ? 1 : -1),
        opacity: baseOpacity,
        baseOpacity,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        color: palette.primary,
        type,
      });
    }

    particlesRef.current = particles;

    let time = 0;

    const render = () => {
      if (!isTabVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      time += 1;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update movement
        p.y += p.fallSpeed;
        p.x += Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmount;
        p.rotation += p.rotationSpeed;
        p.flipRotation += p.flipSpeed;

        // Subtle shimmering opacity
        p.opacity = p.baseOpacity + Math.sin(time * p.pulseSpeed + p.swayOffset) * 0.15;

        // Wrap around when exiting bottom or sides
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -15;
        } else if (p.x < -20) {
          p.x = width + 15;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity * opacity));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // 3D leaf fluttering compression: simulate horizontal tumbling
        const flipScale = Math.cos(p.flipRotation);
        ctx.scale(flipScale, 1);

        if (p.type === 'leaf') {
          // Draw elegant curved golden leaf / foil flake
          const s = p.size;
          const grad = ctx.createLinearGradient(-s, -s * 1.5, s, s * 1.5);
          grad.addColorStop(0, '#FFF2B2');
          grad.addColorStop(0.35, '#FFDF73');
          grad.addColorStop(0.7, '#D4AF37');
          grad.addColorStop(1, '#997316');

          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
          ctx.shadowBlur = 6;

          ctx.beginPath();
          ctx.moveTo(0, -s * 1.4);
          ctx.bezierCurveTo(s * 0.9, -s * 0.7, s * 0.9, s * 0.7, 0, s * 1.4);
          ctx.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.7, -s * 0.7, 0, -s * 1.4);
          ctx.fill();

          // Delicate leaf central vein
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(0, -s * 1.2);
          ctx.lineTo(0, s * 1.1);
          ctx.stroke();
        } else if (p.type === 'petal') {
          // Softer rounded gold petal/foil flake
          const s = p.size;
          ctx.fillStyle = p.color;
          ctx.shadowColor = 'rgba(255, 223, 115, 0.35)';
          ctx.shadowBlur = 5;

          ctx.beginPath();
          ctx.ellipse(0, 0, s * 0.6, s * 1.2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Stardust / sparkle star
          const s = p.size;
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 10;

          // 4-point golden star
          ctx.beginPath();
          ctx.moveTo(0, -s * 1.8);
          ctx.quadraticCurveTo(0, 0, s * 1.8, 0);
          ctx.quadraticCurveTo(0, 0, 0, s * 1.8);
          ctx.quadraticCurveTo(0, 0, -s * 1.8, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s * 1.8);
          ctx.fill();

          // Center glowing dot
          ctx.fillStyle = '#FFDF73';
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, opacity, particleCount]);

  if (!enabled) return null;

  const positionClass = className.includes('absolute') ? 'absolute' : 'fixed';

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${positionClass} inset-0 pointer-events-none z-10 w-full h-full ${className}`}
      style={{
        pointerEvents: 'none',
      }}
    />
  );
};
