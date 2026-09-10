import React, { useState } from 'react';
import { motion } from 'motion/react';
import { VIPTier } from '../../types';

export interface Floating3DCrownAnimationProps {
  tier?: VIPTier;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showAmbientLight?: boolean;
  showRays?: boolean;
  showSparkles?: boolean;
  isHovered?: boolean;
}

export const Floating3DCrownAnimation: React.FC<Floating3DCrownAnimationProps> = ({
  tier = 'mythic',
  size = 'lg',
  className = '',
  showAmbientLight = true,
  showRays = true,
  showSparkles = true,
  isHovered: propIsHovered = false,
}) => {
  const [internalHover, setInternalHover] = useState(false);
  const isHovered = propIsHovered || internalHover;

  // Size dimensions mapping (width x height)
  const sizeConfig = {
    sm: { width: 46, height: 38, scale: 0.75, glowSpread: 42, raySize: 74 },
    md: { width: 64, height: 52, scale: 0.95, glowSpread: 58, raySize: 98 },
    lg: { width: 92, height: 74, scale: 1.25, glowSpread: 82, raySize: 136 },
    xl: { width: 114, height: 92, scale: 1.55, glowSpread: 100, raySize: 168 },
    hero: { width: 140, height: 112, scale: 1.9, glowSpread: 126, raySize: 210 },
  }[size];

  // Palette customization based on tier
  const tierPalette = {
    mythic: {
      goldHighlight: '#FFFFFF',
      goldLight: '#FEF9C3',
      goldMid: '#F59E0B',
      goldDeep: '#B45309',
      goldShadow: '#451A03',
      velvetPrimary: '#4C1D95',
      velvetShadow: '#1E0836',
      gemCenter: '#A855F7',
      gemCenterGlow: 'rgba(168, 85, 247, 0.95)',
      gemAccent: '#F43F5E',
      glowAura: 'rgba(168, 85, 247, 0.6)',
      goldenAura: 'rgba(250, 204, 21, 0.75)',
      rayColor: '#FDE047',
      pulseRingColor: '#D8B4FE',
    },
    royal: {
      goldHighlight: '#FFFFFF',
      goldLight: '#FEF08A',
      goldMid: '#EAB308',
      goldDeep: '#A16207',
      goldShadow: '#3F1F04',
      velvetPrimary: '#3B0764',
      velvetShadow: '#170329',
      gemCenter: '#9333EA',
      gemCenterGlow: 'rgba(147, 51, 234, 0.9)',
      gemAccent: '#0284C7',
      glowAura: 'rgba(147, 51, 234, 0.55)',
      goldenAura: 'rgba(234, 179, 8, 0.7)',
      rayColor: '#FACC15',
      pulseRingColor: '#C084FC',
    },
    gold: {
      goldHighlight: '#FFFFFF',
      goldLight: '#FEF08A',
      goldMid: '#EAB308',
      goldDeep: '#92400E',
      goldShadow: '#451A03',
      velvetPrimary: '#78350F',
      velvetShadow: '#291003',
      gemCenter: '#DC2626',
      gemCenterGlow: 'rgba(220, 38, 38, 0.9)',
      gemAccent: '#16A34A',
      glowAura: 'rgba(234, 179, 8, 0.6)',
      goldenAura: 'rgba(250, 204, 21, 0.8)',
      rayColor: '#FDE047',
      pulseRingColor: '#FDE047',
    },
    silver: {
      goldHighlight: '#FFFFFF',
      goldLight: '#F1F5F9',
      goldMid: '#94A3B8',
      goldDeep: '#475569',
      goldShadow: '#0F172A',
      velvetPrimary: '#1E1B4B',
      velvetShadow: '#090723',
      gemCenter: '#38BDF8',
      gemCenterGlow: 'rgba(56, 189, 248, 0.9)',
      gemAccent: '#C084FC',
      glowAura: 'rgba(192, 132, 252, 0.5)',
      goldenAura: 'rgba(226, 232, 240, 0.7)',
      rayColor: '#BAE6FD',
      pulseRingColor: '#7DD3FC',
    },
    bronze: {
      goldHighlight: '#FFFFFF',
      goldLight: '#FED7AA',
      goldMid: '#D97706',
      goldDeep: '#78350F',
      goldShadow: '#2E1005',
      velvetPrimary: '#451A03',
      velvetShadow: '#1A0702',
      gemCenter: '#EA580C',
      gemCenterGlow: 'rgba(234, 88, 12, 0.9)',
      gemAccent: '#A855F7',
      glowAura: 'rgba(217, 119, 6, 0.55)',
      goldenAura: 'rgba(245, 158, 11, 0.65)',
      rayColor: '#FDBA74',
      pulseRingColor: '#FB923C',
    },
    none: {
      goldHighlight: '#FFFFFF',
      goldLight: '#FEF08A',
      goldMid: '#EAB308',
      goldDeep: '#92400E',
      goldShadow: '#451A03',
      velvetPrimary: '#4C1D95',
      velvetShadow: '#1E0836',
      gemCenter: '#9333EA',
      gemCenterGlow: 'rgba(147, 51, 234, 0.7)',
      gemAccent: '#DC2626',
      glowAura: 'rgba(234, 179, 8, 0.4)',
      goldenAura: 'rgba(250, 204, 21, 0.5)',
      rayColor: '#FDE047',
      pulseRingColor: '#FDE047',
    },
  }[tier || 'mythic'];

  const uniqueId = React.useId().replace(/:/g, '_');

  // Sparkle stars coordinates around crown
  const sparklePositions = [
    { top: '-16%', left: '18%', delay: 0, scale: 1.1 },
    { top: '-20%', right: '20%', delay: 0.6, scale: 1.0 },
    { top: '24%', left: '-10%', delay: 1.2, scale: 0.8 },
    { top: '28%', right: '-8%', delay: 0.3, scale: 0.9 },
    { top: '-26%', left: '48%', delay: 1.8, scale: 1.25 },
  ];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        width: sizeConfig.width,
        height: sizeConfig.height,
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
    >
      {/* 1. LAYER 1: MULTI-STAGE AMBIENT LIGHTING GLOW PULSE (Responsive to Hover) */}
      {showAmbientLight && (
        <>
          {/* Volumetric Radial Aura Pulse - Expands dramatically on Hover */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: sizeConfig.glowSpread * 1.5,
              height: sizeConfig.glowSpread * 1.25,
              background: `radial-gradient(ellipse at center, ${tierPalette.goldenAura} 0%, ${tierPalette.glowAura} 45%, transparent 72%)`,
              filter: isHovered ? 'blur(18px)' : 'blur(13px)',
            }}
            animate={
              isHovered
                ? {
                    scale: [1.15, 1.48, 1.25],
                    opacity: [0.85, 1, 0.85],
                  }
                : {
                    scale: [0.92, 1.14, 0.92],
                    opacity: [0.55, 0.9, 0.55],
                  }
            }
            transition={{
              duration: isHovered ? 1.6 : 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Intense Core Gem Light Bloom */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: sizeConfig.glowSpread * 0.95,
              height: sizeConfig.glowSpread * 0.75,
              background: `radial-gradient(circle, ${tierPalette.gemCenterGlow} 0%, ${tierPalette.goldenAura} 50%, transparent 80%)`,
              filter: isHovered ? 'blur(11px)' : 'blur(7px)',
            }}
            animate={
              isHovered
                ? {
                    scale: [1.2, 1.5, 1.2],
                    opacity: [0.9, 1, 0.9],
                  }
                : {
                    scale: [1, 1.22, 1],
                    opacity: [0.7, 1, 0.7],
                  }
            }
            transition={{
              duration: isHovered ? 1.4 : 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Glowing Shockwave Pulse Rings Triggered on Hover */}
          {isHovered && (
            <>
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: sizeConfig.glowSpread * 1.3,
                  height: sizeConfig.glowSpread * 1.05,
                  border: `2px solid ${tierPalette.pulseRingColor}`,
                  boxShadow: `0 0 16px ${tierPalette.pulseRingColor}`,
                  filter: 'blur(1px)',
                }}
                initial={{ scale: 0.85, opacity: 0.9 }}
                animate={{
                  scale: [0.85, 1.55],
                  opacity: [0.9, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: sizeConfig.glowSpread * 1.3,
                  height: sizeConfig.glowSpread * 1.05,
                  border: `1.5px solid ${tierPalette.goldLight}`,
                  boxShadow: `0 0 12px ${tierPalette.goldenAura}`,
                  filter: 'blur(1px)',
                }}
                initial={{ scale: 0.85, opacity: 0.9 }}
                animate={{
                  scale: [0.85, 1.6],
                  opacity: [0.9, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.6,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            </>
          )}
        </>
      )}

      {/* 2. LAYER 2: ROTATING DIVINE SUNBURST RAYS */}
      {showRays && (
        <motion.div
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            width: sizeConfig.raySize,
            height: sizeConfig.raySize,
            opacity: isHovered ? 0.7 : 0.42,
          }}
          animate={{
            rotate: 360,
            scale: isHovered ? [1.05, 1.18, 1.05] : 1,
          }}
          transition={{
            rotate: {
              duration: isHovered ? 16 : 26,
              repeat: Infinity,
              ease: 'linear',
            },
            scale: {
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <radialGradient id={`sunburst_${uniqueId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={tierPalette.rayColor} stopOpacity="0.95" />
                <stop offset="50%" stopColor={tierPalette.goldMid} stopOpacity="0.4" />
                <stop offset="100%" stopColor={tierPalette.goldDeep} stopOpacity="0" />
              </radialGradient>
            </defs>
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 46 * Math.cos((i * 2 * Math.PI) / 16)}
                y2={50 + 46 * Math.sin((i * 2 * Math.PI) / 16)}
                stroke={`url(#sunburst_${uniqueId})`}
                strokeWidth={i % 2 === 0 ? '2.4' : '1.2'}
                strokeLinecap="round"
              />
            ))}
          </svg>
        </motion.div>
      )}

      {/* 3. LAYER 3: DYNAMIC FLOATING SPARKLE STARS */}
      {showSparkles && (
        <>
          {sparklePositions.map((spark, idx) => (
            <motion.div
              key={idx}
              className="absolute z-30 pointer-events-none"
              style={{
                top: spark.top,
                left: spark.left,
                right: spark.right,
              }}
              animate={{
                scale: isHovered ? [0, spark.scale * 1.35, 0] : [0, spark.scale, 0],
                opacity: isHovered ? [0, 1, 0] : [0, 0.9, 0],
                rotate: [0, 90, 180],
                y: isHovered ? [0, -9, 0] : [0, -6, 0],
              }}
              transition={{
                duration: isHovered ? 1.6 : 2.2,
                repeat: Infinity,
                delay: spark.delay,
                ease: 'easeInOut',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                  fill="#FFFFFF"
                />
                <circle cx="12" cy="12" r="2.5" fill={tierPalette.goldLight} />
              </svg>
            </motion.div>
          ))}
        </>
      )}

      {/* 4. LAYER 4: 3D FLOATING & SLOW ROTATIONAL MOTION IN SPACE (Framer Motion) */}
      <motion.div
        className="relative z-20 w-full h-full flex items-center justify-center drop-shadow-[0_8px_22px_rgba(0,0,0,0.9)]"
        animate={{
          // Natural zero-gravity levitation
          y: isHovered ? [-14, -6, -14] : [-7, 5, -7],
          // Slow, realistic 3D yaw rotation as if orbiting/floating in space
          rotateY: [-16, 0, 16, 0, -16],
          // Gentle pitch tilt
          rotateX: [6, -4, 6],
          // Gentle roll
          rotateZ: [-2.5, 2.5, -2.5],
          // Scale pulse
          scale: isHovered ? [1.12, 1.16, 1.12] : [1, 1.035, 1],
        }}
        transition={{
          y: { duration: isHovered ? 2.8 : 4.2, repeat: Infinity, ease: 'easeInOut' },
          rotateY: { duration: 9.0, repeat: Infinity, ease: 'easeInOut' },
          rotateX: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
          rotateZ: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <svg
          viewBox="0 0 160 120"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Master 24K Polished Metallic Gradient */}
            <linearGradient id={`goldMetallic_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={tierPalette.goldHighlight} />
              <stop offset="18%" stopColor={tierPalette.goldLight} />
              <stop offset="45%" stopColor={tierPalette.goldMid} />
              <stop offset="78%" stopColor={tierPalette.goldDeep} />
              <stop offset="100%" stopColor={tierPalette.goldShadow} />
            </linearGradient>

            {/* Specular Ridge Bright Gold */}
            <linearGradient id={`goldSpecular_${uniqueId}`} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor={tierPalette.goldLight} />
              <stop offset="70%" stopColor={tierPalette.goldMid} />
              <stop offset="100%" stopColor={tierPalette.goldDeep} />
            </linearGradient>

            {/* Royal Velvet Cap Shading */}
            <radialGradient id={`velvetCap_${uniqueId}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={tierPalette.velvetPrimary} />
              <stop offset="65%" stopColor={tierPalette.velvetShadow} />
              <stop offset="100%" stopColor="#0B0214" />
            </radialGradient>

            {/* Faceted Brilliant Center Gem */}
            <radialGradient id={`centerGemRadial_${uniqueId}`} cx="38%" cy="28%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
              <stop offset="25%" stopColor={tierPalette.gemCenter} stopOpacity="0.92" />
              <stop offset="75%" stopColor={tierPalette.velvetPrimary} stopOpacity="0.98" />
              <stop offset="100%" stopColor="#0B0214" stopOpacity="1" />
            </radialGradient>

            {/* Accent Gemstones */}
            <radialGradient id={`accentGem_${uniqueId}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="40%" stopColor={tierPalette.gemAccent} stopOpacity="0.85" />
              <stop offset="100%" stopColor="#051B2E" stopOpacity="1" />
            </radialGradient>

            {/* Gold Pearl Bead Gradient */}
            <radialGradient id={`pearlBead_${uniqueId}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor={tierPalette.goldLight} />
              <stop offset="90%" stopColor={tierPalette.goldDeep} />
              <stop offset="100%" stopColor={tierPalette.goldShadow} />
            </radialGradient>

            {/* Atmospheric Filter */}
            <filter id={`crownGlow_${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Traveling Shimmer Sweep */}
            <linearGradient id={`shimmerGrad_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity={isHovered ? 0.95 : 0.65} />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ═══════════════════════════════════════════════════════════════
              EACH VIP TIER HAS ITS OWN DISTINCT & UNIQUE CROWN SHAPE!
              Zero text, zero emoji strings - pure high-definition 3D vectors
              ═══════════════════════════════════════════════════════════════ */}

          {/* ─────────────────────────────────────────────────────────────
              TIER 1: BRONZE (VIP 1 Falcon Wing Sharp Coronet)
              ───────────────────────────────────────────────────────────── */}
          {tier === 'bronze' && (
            <g id="crown_bronze_falcon">
              {/* Back Bronze Wing Arches */}
              <path
                d="M 32 80 C 36 50, 48 38, 80 44 C 112 38, 124 50, 128 80 Z"
                fill={`url(#velvetCap_${uniqueId})`}
                opacity="0.85"
              />

              {/* Soaring Wing Spires (Left and Right Sweeping Feathers) */}
              {/* Left Wing Spire 1 (Tallest) */}
              <polygon points="26,82 14,40 34,58 36,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              <polygon points="14,40 24,24 32,46" fill={`url(#goldSpecular_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
              {/* Left Wing Spire 2 */}
              <polygon points="34,82 28,34 44,52 46,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              {/* Left Wing Spire 3 */}
              <polygon points="44,82 48,36 60,60 62,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />

              {/* Right Wing Spire 3 */}
              <polygon points="98,82 100,60 112,36 116,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              {/* Right Wing Spire 2 */}
              <polygon points="114,82 116,52 132,34 126,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              {/* Right Wing Spire 1 (Tallest) */}
              <polygon points="124,82 126,58 146,40 134,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              <polygon points="146,40 136,24 128,46" fill={`url(#goldSpecular_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

              {/* Center Falcon Beak / Chevron Peak */}
              <path
                d="M 60 84 L 80 18 L 100 84 Z"
                fill={`url(#goldMetallic_${uniqueId})`}
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="1.6"
              />
              <path
                d="M 72 82 L 80 26 L 88 82 Z"
                fill={`url(#goldSpecular_${uniqueId})`}
                opacity="0.8"
              />

              {/* Center Falcon Peak Diamond Finial */}
              <polygon points="80,14 84,18 80,22 76,18" fill="#FFFFFF" />
              <circle cx="80" cy="18" r="3.2" fill={`url(#centerGemRadial_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

              {/* Lower Warrior Bronze Diadem Band */}
              <path
                d="M 22 84 C 54 90, 106 90, 138 84 L 136 96 C 106 102, 54 102, 24 96 Z"
                fill={`url(#goldMetallic_${uniqueId})`}
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="1.5"
              />
              {/* Studded Bronze Rivets */}
              {[28, 44, 60, 80, 100, 116, 132].map((cx, i) => (
                <circle
                  key={`rivet_${i}`}
                  cx={cx}
                  cy={90.5}
                  r="2.2"
                  fill={`url(#pearlBead_${uniqueId})`}
                  stroke={tierPalette.goldShadow}
                  strokeWidth="0.6"
                />
              ))}

              {/* Center Fiery Amber/Topaz Cabochon */}
              <g transform="translate(80, 68)">
                <ellipse cx="0" cy="0" rx="9" ry="11" fill={`url(#goldSpecular_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
                <ellipse cx="0" cy="0" rx="7.5" ry="9.5" fill={`url(#centerGemRadial_${uniqueId})`} />
                <circle cx="-2" cy="-3" r="1.5" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TIER 2: SILVER (VIP 2 Lunar Wolf Crescent Tiara)
              ───────────────────────────────────────────────────────────── */}
          {tier === 'silver' && (
            <g id="crown_silver_lunar">
              {/* Celestial Dark Night Cap */}
              <path
                d="M 38 82 C 40 46, 52 32, 80 28 C 108 32, 120 46, 122 82 Z"
                fill={`url(#velvetCap_${uniqueId})`}
                opacity="0.9"
              />

              {/* Slender Gothic Platinum Arches */}
              <path
                d="M 30 84
                   C 26 62, 24 40, 30 26
                   C 36 38, 44 48, 50 62
                   C 54 44, 62 28, 68 18
                   C 72 32, 76 46, 80 58
                   C 84 46, 88 32, 92 18
                   C 98 28, 106 44, 110 62
                   C 116 48, 124 38, 130 26
                   C 136 40, 134 62, 130 84
                   C 106 88, 54 88, 30 84 Z"
                fill={`url(#goldMetallic_${uniqueId})`}
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="1.4"
                filter={`url(#crownGlow_${uniqueId})`}
              />

              {/* Center Elevated Crescent Moon Embracing Celestial Ice Gem */}
              <g transform="translate(80, 24)">
                {/* Crescent Moon Horns */}
                <path
                  d="M -12 -8 C -12 8, 12 8, 12 -8 C 8 2, -8 2, -12 -8 Z"
                  fill={`url(#goldSpecular_${uniqueId})`}
                  stroke="#FFFFFF"
                  strokeWidth="0.9"
                />
                {/* Floating Apex Ice Star */}
                <polygon points="0,-16 2.5,-10 8,-8 2.5,-6 0,0 -2.5,-6 -8,-8 -2.5,-10" fill="#FFFFFF" />
                <circle cx="0" cy="-8" r="3.6" fill={`url(#centerGemRadial_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
              </g>

              {/* Spire Tip Star Jewels */}
              <circle cx="30" cy="26" r="2.8" fill={`url(#accentGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.7" />
              <circle cx="68" cy="18" r="3.2" fill={`url(#accentGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
              <circle cx="92" cy="18" r="3.2" fill={`url(#accentGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
              <circle cx="130" cy="26" r="2.8" fill={`url(#accentGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.7" />

              {/* Center Teardrop Faceted Ice Diamond */}
              <g transform="translate(80, 64)">
                <path
                  d="M 0 -12 C 8 -2, 10 6, 0 14 C -10 6, -8 -2, 0 -12 Z"
                  fill={`url(#centerGemRadial_${uniqueId})`}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                />
                <circle cx="-2" cy="0" r="1.8" fill="#FFFFFF" />
              </g>

              {/* Platinum Braided Diadem Band */}
              <path
                d="M 28 84 C 54 90, 106 90, 132 84 L 134 96 C 106 102, 54 102, 26 96 Z"
                fill={`url(#goldMetallic_${uniqueId})`}
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="1.4"
              />
              {/* Alternating Ice Pearls and Stars */}
              {[36, 50, 65, 80, 95, 110, 124].map((cx, i) => (
                <circle
                  key={`ice_pearl_${i}`}
                  cx={cx}
                  cy={90.5}
                  r="2.2"
                  fill={`url(#pearlBead_${uniqueId})`}
                  stroke="#FFFFFF"
                  strokeWidth="0.5"
                />
              ))}
            </g>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TIER 3: GOLD (VIP 3 Solar Eagle Radiant Sunburst Coronet)
              ───────────────────────────────────────────────────────────── */}
          {tier === 'gold' && (
            <g id="crown_gold_sunburst">
              {/* Back Golden Velvet Cap */}
              <path
                d="M 32 82 C 34 52, 48 40, 80 36 C 112 40, 126 52, 128 82 Z"
                fill={`url(#velvetCap_${uniqueId})`}
                opacity="0.92"
              />

              {/* 7 RADIANT SUNBURST GOLDEN FLARES / BLADES */}
              {/* Flare 1 (Far Left) */}
              <polygon points="26,82 12,46 32,58 36,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              <circle cx="12" cy="46" r="2.8" fill={`url(#pearlBead_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
              {/* Flare 2 (Mid Left) */}
              <polygon points="34,82 28,32 46,50 48,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              <circle cx="28" cy="32" r="3.2" fill={`url(#accentGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
              {/* Flare 3 (Inner Left) */}
              <polygon points="46,82 52,18 64,54 66,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              <circle cx="52" cy="18" r="3.6" fill={`url(#pearlBead_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

              {/* Flare 4 (CENTER HIGHEST SUNBURST SPIRE) */}
              <polygon points="66,82 80,6 94,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.6" filter={`url(#crownGlow_${uniqueId})`} />
              <polygon points="76,82 80,12 84,82" fill="#FFFFFF" opacity="0.75" />
              {/* Apex Golden Sun Finial */}
              <g transform="translate(80, 6)">
                <polygon points="0,-9 2.5,-2 9,0 2.5,2 0,9 -2.5,2 -9,0 -2.5,-2" fill="#FFFFFF" />
                <circle cx="0" cy="0" r="4.2" fill={`url(#centerGemRadial_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.9" />
              </g>

              {/* Flare 5 (Inner Right) */}
              <polygon points="94,82 96,54 108,18 114,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              <circle cx="108" cy="18" r="3.6" fill={`url(#pearlBead_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
              {/* Flare 6 (Mid Right) */}
              <polygon points="112,82 114,50 132,32 126,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              <circle cx="132" cy="32" r="3.2" fill={`url(#accentGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
              {/* Flare 7 (Far Right) */}
              <polygon points="124,82 128,58 148,46 134,82" fill={`url(#goldMetallic_${uniqueId})`} stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.2" />
              <circle cx="148" cy="46" r="2.8" fill={`url(#pearlBead_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />

              {/* Roman Golden Laurel Wreath Diadem Band */}
              <path
                d="M 24 84 C 54 90, 106 90, 136 84 L 138 96 C 108 103, 52 103, 22 96 Z"
                fill={`url(#goldMetallic_${uniqueId})`}
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="1.5"
              />
              {/* Laurel Leaves along the band */}
              {[32, 48, 64, 80, 96, 112, 128].map((cx, i) => (
                <ellipse
                  key={`laurel_${i}`}
                  cx={cx}
                  cy={90.5}
                  rx="4.5"
                  ry="2.4"
                  transform={`rotate(${i % 2 === 0 ? 15 : -15}, ${cx}, 90.5)`}
                  fill={`url(#goldSpecular_${uniqueId})`}
                  stroke={tierPalette.goldShadow}
                  strokeWidth="0.5"
                />
              ))}

              {/* Center Solar Disc Medallion with Fiery Ruby Diamond */}
              <g transform="translate(80, 64)">
                <circle cx="0" cy="0" r="12" fill={`url(#goldSpecular_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1.2" filter={`url(#crownGlow_${uniqueId})`} />
                <circle cx="0" cy="0" r="9.5" fill={`url(#centerGemRadial_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
                <circle cx="-2.5" cy="-2.5" r="2.2" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TIER 4: ROYAL (VIP 4 Imperial British Sovereign Arch-Crown)
              ───────────────────────────────────────────────────────────── */}
          {tier === 'royal' && (
            <g id="crown_royal_lion">
              {/* Deep Imperial Purple Velvet Domed Bonnet */}
              <path
                d="M 30 84 C 28 44, 46 26, 80 24 C 114 26, 132 44, 130 84 Z"
                fill={`url(#velvetCap_${uniqueId})`}
                stroke={tierPalette.goldShadow}
                strokeWidth="1.4"
              />

              {/* Heavy Golden Ribbed Crossing Arches */}
              <path
                d="M 34 82 C 42 40, 64 24, 80 18 C 96 24, 118 40, 126 82"
                fill="none"
                stroke={`url(#goldMetallic_${uniqueId})`}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 34 82 C 42 40, 64 24, 80 18 C 96 24, 118 40, 126 82"
                fill="none"
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Summit Royal Globus Cruciger (Golden Orb & Cross) */}
              <g transform="translate(80, 14)">
                <circle cx="0" cy="0" r="5" fill={`url(#goldSpecular_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.9" />
                <circle cx="-1.5" cy="-1.5" r="1.4" fill="#FFFFFF" />
                {/* Royal Cross */}
                <path d="M 0 -11 L 0 -4 M -3.5 -8 L 3.5 -8" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="square" />
                <polygon points="0,-12 1.5,-8 5,-8 1.5,-6 0,-2 -1.5,-6 -5,-8 -1.5,-8" fill="#FFFFFF" opacity="0.9" />
              </g>

              {/* 4 FLEUR-DE-LIS ROYAL GOLDEN SPIRES */}
              {/* Leftmost Fleur-de-lis */}
              <g transform="translate(32, 60)">
                <path d="M 0 -16 C -6 -10, -6 -2, 0 4 C 6 -2, 6 -10, 0 -16 Z" fill={`url(#goldSpecular_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
                <path d="M -8 -8 C -12 0, -4 4, 0 4 M 8 -8 C 12 0, 4 4, 0 4" fill="none" stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.4" />
                <circle cx="0" cy="-16" r="2.2" fill={`url(#pearlBead_${uniqueId})`} />
              </g>
              {/* Mid-Left Fleur-de-lis */}
              <g transform="translate(56, 52)">
                <path d="M 0 -18 C -7 -12, -7 -2, 0 4 C 7 -2, 7 -12, 0 -18 Z" fill={`url(#goldSpecular_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
                <path d="M -9 -9 C -13 0, -5 4, 0 4 M 9 -9 C 13 0, 5 4, 0 4" fill="none" stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.5" />
                <circle cx="0" cy="-18" r="2.4" fill={`url(#pearlBead_${uniqueId})`} />
              </g>
              {/* Mid-Right Fleur-de-lis */}
              <g transform="translate(104, 52)">
                <path d="M 0 -18 C -7 -12, -7 -2, 0 4 C 7 -2, 7 -12, 0 -18 Z" fill={`url(#goldSpecular_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
                <path d="M -9 -9 C -13 0, -5 4, 0 4 M 9 -9 C 13 0, 5 4, 0 4" fill="none" stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.5" />
                <circle cx="0" cy="-18" r="2.4" fill={`url(#pearlBead_${uniqueId})`} />
              </g>
              {/* Rightmost Fleur-de-lis */}
              <g transform="translate(128, 60)">
                <path d="M 0 -16 C -6 -10, -6 -2, 0 4 C 6 -2, 6 -10, 0 -16 Z" fill={`url(#goldSpecular_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
                <path d="M -8 -8 C -12 0, -4 4, 0 4 M 8 -8 C 12 0, 4 4, 0 4" fill="none" stroke={`url(#goldSpecular_${uniqueId})`} strokeWidth="1.4" />
                <circle cx="0" cy="-16" r="2.2" fill={`url(#pearlBead_${uniqueId})`} />
              </g>

              {/* Large Faceted Cushion-Cut Amethyst Center Jewel */}
              <g transform="translate(80, 58)">
                <rect x="-10" y="-12" width="20" height="24" rx="4" fill={`url(#goldSpecular_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1.1" filter={`url(#crownGlow_${uniqueId})`} />
                <rect x="-8" y="-10" width="16" height="20" rx="3" fill={`url(#centerGemRadial_${uniqueId})`} stroke={tierPalette.goldHighlight} strokeWidth="0.8" />
                <circle cx="-3" cy="-4" r="1.8" fill="#FFFFFF" />
              </g>

              {/* Sovereign Ermine-Embossed Gold Diadem Band */}
              <path
                d="M 22 84 C 54 90, 106 90, 138 84 L 140 98 C 108 105, 52 105, 20 98 Z"
                fill={`url(#goldMetallic_${uniqueId})`}
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="1.6"
              />
              {/* Alternating Emerald & Ruby Cabochons */}
              {[28, 48, 68, 80, 92, 112, 132].map((cx, i) => (
                <ellipse
                  key={`gem_band_${i}`}
                  cx={cx}
                  cy={91}
                  rx="3.6"
                  ry="4.2"
                  fill={i % 2 === 0 ? `url(#centerGemRadial_${uniqueId})` : `url(#accentGem_${uniqueId})`}
                  stroke="#FFFFFF"
                  strokeWidth="0.7"
                />
              ))}
            </g>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TIER 5: MYTHIC (VIP 5 Grand Celestial Sovereign Arch-Emperor Crown)
              Dual sweeping cosmic wings, floating sacred geometry star halo
              ───────────────────────────────────────────────────────────── */}
          {(tier === 'mythic' || tier === 'none') && (
            <g id="crown_mythic_sovereign">
              {/* Dual Cosmic Wings Expanding Flanks */}
              {/* Left Phoenix Wing */}
              <path
                d="M 32 78
                   C 18 56, 4 36, -2 18
                   C 10 28, 22 42, 34 60
                   C 26 38, 16 18, 10 2
                   C 24 16, 36 34, 44 54
                   C 42 34, 38 14, 34 -4
                   C 48 14, 56 36, 60 62 Z"
                fill={`url(#goldMetallic_${uniqueId})`}
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="1.4"
                filter={`url(#crownGlow_${uniqueId})`}
              />
              {/* Right Phoenix Wing */}
              <path
                d="M 128 78
                   C 142 56, 156 36, 162 18
                   C 150 28, 138 42, 126 60
                   C 134 38, 144 18, 150 2
                   C 136 16, 124 34, 116 54
                   C 118 34, 122 14, 126 -4
                   C 112 14, 104 36, 100 62 Z"
                fill={`url(#goldMetallic_${uniqueId})`}
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="1.4"
                filter={`url(#crownGlow_${uniqueId})`}
              />

              {/* Deep Imperial Violet Cap Interior */}
              <path
                d="M 40 82 C 40 50, 52 32, 80 28 C 108 32, 120 50, 120 82 Z"
                fill={`url(#velvetCap_${uniqueId})`}
                stroke={tierPalette.goldShadow}
                strokeWidth="1.2"
              />

              {/* Front 5-Pinnacle Transcendent Crown Body */}
              <path
                d="M 36 84
                   C 36 64, 40 48, 44 38
                   C 48 48, 54 58, 60 64
                   C 64 50, 68 32, 72 24
                   C 76 34, 78 48, 80 56
                   C 82 48, 84 34, 88 24
                   C 92 32, 96 50, 100 64
                   C 106 58, 112 48, 116 38
                   C 120 48, 124 64, 124 84
                   C 104 89, 56 89, 36 84 Z"
                fill={`url(#goldMetallic_${uniqueId})`}
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="1.6"
              />

              {/* Levitating Sacred 8-Point Cosmic Star Finial at Apex */}
              <g transform="translate(80, 10)">
                <polygon
                  points="0,-14 3,-3 14,0 3,3 0,14 -3,3 -14,0 -3,-3"
                  fill="#FFFFFF"
                  filter={`url(#crownGlow_${uniqueId})`}
                />
                <circle cx="0" cy="0" r="5" fill={`url(#centerGemRadial_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="-1.5" cy="-1.5" r="1.6" fill="#FFFFFF" />
              </g>

              {/* Tip Pearls on Inner Spires */}
              <circle cx="44" cy="38" r="3.2" fill={`url(#pearlBead_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.7" />
              <circle cx="72" cy="24" r="3.6" fill={`url(#accentGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
              <circle cx="88" cy="24" r="3.6" fill={`url(#accentGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
              <circle cx="116" cy="38" r="3.2" fill={`url(#pearlBead_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.7" />

              {/* Colossal Faceted Amethyst Heart / Prism Diamond Center Gem */}
              <g transform="translate(80, 68)">
                <polygon
                  points="0,-14 11,-2 8,12 0,16 -8,12 -11,-2"
                  fill={`url(#goldSpecular_${uniqueId})`}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  filter={`url(#crownGlow_${uniqueId})`}
                />
                <polygon
                  points="0,-12 9,-1 6,10 0,13 -6,10 -9,-1"
                  fill={`url(#centerGemRadial_${uniqueId})`}
                  stroke={tierPalette.goldHighlight}
                  strokeWidth="0.9"
                />
                <circle cx="-2.5" cy="-3.5" r="2" fill="#FFFFFF" />
              </g>

              {/* Imperial Multi-Tiered Pedestal Band */}
              <path
                d="M 32 84 C 54 90, 106 90, 128 84 L 130 96 C 106 103, 54 103, 30 96 Z"
                fill={`url(#goldMetallic_${uniqueId})`}
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="1.6"
              />
              {/* Micro-pearls along the rim */}
              {[36, 48, 60, 72, 80, 88, 100, 112, 124].map((cx, i) => (
                <circle
                  key={`m_pearl_${i}`}
                  cx={cx}
                  cy={90.5}
                  r="2"
                  fill={`url(#pearlBead_${uniqueId})`}
                  stroke={tierPalette.goldShadow}
                  strokeWidth="0.4"
                />
              ))}

              {/* Concentric Floating Orbital Rings */}
              <ellipse
                cx="80"
                cy="72"
                rx="62"
                ry="18"
                fill="none"
                stroke={`url(#goldSpecular_${uniqueId})`}
                strokeWidth="0.9"
                opacity={isHovered ? 0.9 : 0.55}
                strokeDasharray="4 6"
              />
            </g>
          )}

          {/* TRAVELING SPECULAR SHIMMER SWEEP OVER CROWN SURFACE */}
          <motion.rect
            x="0"
            y="0"
            width="32"
            height="115"
            fill={`url(#shimmerGrad_${uniqueId})`}
            transform="skewX(-28)"
            animate={{
              x: [-60, 220],
            }}
            transition={{
              duration: isHovered ? 2.2 : 3.8,
              repeat: Infinity,
              repeatDelay: isHovered ? 0.6 : 1.8,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </motion.div>

      {/* 5. LAYER 5: DYNAMIC GROUNDING SOFT SHADOW UNDER CROWN */}
      <motion.div
        className="absolute -bottom-2 rounded-full pointer-events-none"
        style={{
          width: sizeConfig.width * 0.78,
          height: 8,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(20,5,30,0.4) 50%, transparent 80%)',
          filter: 'blur(3px)',
        }}
        animate={{
          scale: isHovered ? [0.95, 1.25, 0.95] : [0.82, 1.12, 0.82],
          opacity: isHovered ? [0.55, 0.85, 0.55] : [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: isHovered ? 2.8 : 4.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
