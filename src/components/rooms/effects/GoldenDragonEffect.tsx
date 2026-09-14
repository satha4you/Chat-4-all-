import React, { useEffect, useState } from 'react';
import { ActiveGiftEvent } from './GiftCelebrationOverlay';
import { AvatarWithFrame } from '../../common/AvatarWithFrame';
import { VIPName } from '../../common/VIPName';
import { Gift3DIcon } from '../../common/Gift3DIcon';
import { playSoundEffect } from '../../../utils/soundEffects';

interface GoldenDragonEffectProps {
  event: ActiveGiftEvent;
}

export const GoldenDragonEffect: React.FC<GoldenDragonEffectProps> = ({ event }) => {
  const { gift, sender, receiver, comboCount } = event;
  const [showRumble, setShowRumble] = useState(false);

  useEffect(() => {
    // Play majestic dragon roar sound effect immediately
    playSoundEffect('dragon_roar');
    
    // Quick screen vibration / rumble at peak swoop
    const rumbleTimer = setTimeout(() => {
      setShowRumble(true);
    }, 600);

    const fanfareTimer = setTimeout(() => {
      playSoundEffect('vip_fanfare');
    }, 1100);

    return () => {
      clearTimeout(rumbleTimer);
      clearTimeout(fanfareTimer);
    };
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none z-50 overflow-hidden flex flex-col justify-between ${showRumble ? 'animate-pulse' : ''}`}>
      {/* Top Royal Ambient Glow Bar */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/25 via-yellow-500/15 to-transparent pointer-events-none" />

      {/* 1. Top Imperial Floating Announcement Banner */}
      <div className="relative z-30 pt-3 px-3 flex justify-center animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="max-w-md w-full rounded-2xl bg-gradient-to-r from-[#1A0F02]/95 via-[#2E1805]/95 to-[#1A0F02]/95 border-2 border-amber-400/90 p-2.5 shadow-[0_0_35px_rgba(245,158,11,0.6),inset_0_1px_2px_rgba(254,240,138,0.4)] backdrop-blur-xl flex items-center justify-between gap-2.5">
          {/* Right: Sender */}
          <div className="flex items-center gap-2 min-w-0">
            <AvatarWithFrame user={sender} size="xs" showCrown={true} />
            <div className="min-w-0 text-right">
              <span className="text-[9px] text-amber-300 font-bold block leading-tight">المرسل</span>
              <VIPName user={sender} size="xs" />
            </div>
          </div>

          {/* Center: Dragon 3D Badge & Gift Info */}
          <div className="flex flex-col items-center shrink-0 px-1">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-amber-500/30 border border-amber-400/70 text-amber-200 text-[11px] font-black shadow-sm">
              <Gift3DIcon giftId="gift_dragon" size="xs" />
              <span className="tracking-wide">تنين الذهب الأسطوري ثلاثي الأبعاد</span>
              <span className="text-xs">✨</span>
            </div>
            <div className="text-[10px] text-yellow-300 font-bold mt-0.5 flex items-center gap-1">
              <span>{gift.nameAr}</span>
              {comboCount > 1 && (
                <span className="px-1.5 py-0.2 rounded bg-red-600/80 text-white text-[9px] font-black animate-pulse">
                  x{comboCount}
                </span>
              )}
            </div>
          </div>

          {/* Left: Receiver */}
          <div className="flex items-center gap-2 min-w-0 flex-row-reverse">
            <AvatarWithFrame user={receiver} size="xs" showCrown={true} />
            <div className="min-w-0 text-left">
              <span className="text-[9px] text-amber-300 font-bold block leading-tight">المستلم</span>
              <VIPName user={receiver} size="xs" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Fast 3D Realistic Dragon Traversal Screen Flight */}
      <div className="relative flex-1 w-full flex items-center overflow-hidden">
        {/* Sonic Shockwave Burst at mid-flight */}
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-1/2 w-64 h-64 rounded-full border-2 border-amber-400/80 pointer-events-none opacity-0"
          style={{ animation: 'sonicShockwave 1.2s cubic-bezier(0.1, 0.8, 0.2, 1) 0.5s forwards' }}
        />

        {/* The Golden Dragon Entity crossing screen in 2.2s */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2"
          style={{
            animation: 'goldenDragonTraverse 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="relative w-[360px] sm:w-[500px] h-[240px] sm:h-[280px] drop-shadow-[0_0_50px_rgba(245,158,11,1)]">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Metallic 24K Polished Gold Gradient */}
                <linearGradient id="dragon3DGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="15%" stopColor="#FFFBEB" />
                  <stop offset="35%" stopColor="#FDE047" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="85%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>

                {/* Dark Volumetric Shadow Gradient for 3D Underside */}
                <linearGradient id="dragon3DShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>

                {/* Plasma Solar Fire Breath */}
                <linearGradient id="dragonPlasmaFire" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="20%" stopColor="#FEF08A" />
                  <stop offset="45%" stopColor="#F97316" />
                  <stop offset="75%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
                </linearGradient>

                {/* Wing Membrane Layer with 3D Light Refraction */}
                <linearGradient id="wing3DGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#FEF08A" />
                  <stop offset="55%" stopColor="#F59E0B" />
                  <stop offset="90%" stopColor="#92400E" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>

                <filter id="goldGlowRealistic" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feColorMatrix type="matrix" values="
                    1 0 0 0 0.2
                    0 0.8 0 0 0.1
                    0 0 0.2 0 0
                    0 0 0 1 0" />
                  <feComposite in="SourceGraphic" operator="over" />
                </filter>
              </defs>

              {/* 3D Dynamic Flight Aerodynamic Glow Trail */}
              <path
                d="M 20 210 Q 120 110, 200 180 T 360 140 T 450 100"
                fill="none"
                stroke="url(#dragonPlasmaFire)"
                strokeWidth="48"
                strokeLinecap="round"
                opacity="0.6"
              />

              {/* Serpentine Glowing Body Segments (S-Curve 3D Core) */}
              <path
                d="M 40 200 Q 120 100, 200 170 T 360 130 T 440 95"
                fill="none"
                stroke="url(#dragon3DShadow)"
                strokeWidth="42"
                strokeLinecap="round"
              />
              <path
                d="M 40 196 Q 120 96, 200 166 T 360 126 T 440 91"
                fill="none"
                stroke="url(#dragon3DGold)"
                strokeWidth="32"
                strokeLinecap="round"
                filter="url(#goldGlowRealistic)"
              />

              {/* Beveled 3D Scale Ridges (Reflective Gold Highlights) */}
              <path
                d="M 50 185 L 62 160 L 78 175 L 94 140 L 114 162 L 136 120 L 158 152 L 184 130 L 210 162 L 238 130 L 266 156 L 294 116 L 322 142 L 350 102 L 378 122 L 410 85 L 426 100"
                fill="#FFFBEB"
                stroke="#78350F"
                strokeWidth="2.5"
              />

              {/* Back Muscular 3D Talon with Golden Nails */}
              <g transform="translate(150, 170)">
                <path d="M 0 0 L 14 30 L 4 42 M 14 30 L 18 46 M 14 30 L 28 38" stroke="#FEF08A" strokeWidth="5.5" strokeLinecap="round" />
                <circle cx="14" cy="30" r="5" fill="#D97706" />
                {/* Razor Sharp White-Gold Claws */}
                <polygon points="4,42 0,50 6,44" fill="#FFFBEB" />
                <polygon points="18,46 16,55 22,48" fill="#FFFBEB" />
                <polygon points="28,38 36,44 30,36" fill="#FFFBEB" />
              </g>

              {/* Front Muscular 3D Talon */}
              <g transform="translate(320, 130)">
                <path d="M 0 0 L 16 35 L 8 48 M 16 35 L 22 52 M 16 35 L 32 44" stroke="#FEF08A" strokeWidth="6" strokeLinecap="round" />
                <circle cx="16" cy="35" r="6" fill="#D97706" />
                <polygon points="8,48 4,58 10,50" fill="#FFFBEB" />
                <polygon points="22,52 20,62 26,54" fill="#FFFBEB" />
                <polygon points="32,44 42,50 34,42" fill="#FFFBEB" />
              </g>

              {/* Majestic 3D Spread Wings with Golden Membrane & Ribs */}
              <g transform="translate(250, 75)">
                {/* Main Wing Span */}
                <path
                  d="M 0 60 Q 25 -40, 110 -60 Q 75 -5, 105 18 Q 65 10, 78 40 Q 40 20, 0 60 Z"
                  fill="url(#wing3DGoldGrad)"
                  stroke="#FFFBEB"
                  strokeWidth="2.5"
                  filter="url(#goldGlowRealistic)"
                />
                {/* 3D Wing Bone Struts */}
                <path d="M 0 60 L 110 -60 M 0 60 L 105 18 M 0 60 L 78 40" stroke="#FFFBEB" strokeWidth="2" opacity="0.8" />
                {/* Secondary Wing Layer */}
                <path
                  d="M 0 60 Q -15 -25, 60 -45 Q 30 0, 55 25 Z"
                  fill="url(#dragon3DGold)"
                  opacity="0.85"
                />
              </g>

              {/* Sculpted Realistic 3D Dragon Head */}
              <g transform="translate(410, 50)">
                {/* Twin Swept 3D Antler Horns */}
                <path
                  d="M 18 28 Q 12 -20, -20 -45 Q -8 -12, 6 18 Z"
                  fill="#FFFBEB"
                  stroke="#78350F"
                  strokeWidth="2"
                />
                <path
                  d="M 30 24 Q 30 -25, 12 -50 Q 24 -12, 24 20 Z"
                  fill="#FEF08A"
                  stroke="#78350F"
                  strokeWidth="2"
                />

                {/* Head Cranium */}
                <ellipse cx="40" cy="45" rx="34" ry="26" fill="url(#dragon3DGold)" stroke="#FFFBEB" strokeWidth="2" />
                <ellipse cx="38" cy="42" rx="28" ry="20" fill="url(#dragon3DShadow)" opacity="0.4" />

                {/* Upper Beveled Snout */}
                <path
                  d="M 45 28 L 96 38 Q 105 46, 96 54 L 45 56 Z"
                  fill="url(#dragon3DGold)"
                  stroke="#78350F"
                  strokeWidth="2"
                />

                {/* Lower Jaw */}
                <path
                  d="M 50 54 L 88 58 Q 92 66, 82 68 L 50 62 Z"
                  fill="#F59E0B"
                  stroke="#78350F"
                  strokeWidth="1.8"
                />

                {/* 3D Razor Dragon Fangs */}
                <polygon points="58,54 62,48 66,54" fill="#FFFFFF" />
                <polygon points="70,54 74,48 78,54" fill="#FFFFFF" />
                <polygon points="82,54 86,48 90,54" fill="#FFFFFF" />
                <polygon points="92,54 96,48 100,54" fill="#FFFFFF" />

                {/* Golden Whiskers with Physics Flutter */}
                <path
                  d="M 85 46 Q 120 32, 150 56"
                  stroke="#FFFBEB"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                  style={{ animation: 'dragonWhiskers 0.8s ease-in-out infinite' }}
                />
                <path
                  d="M 82 50 Q 110 68, 140 86"
                  stroke="#FEF08A"
                  strokeWidth="2.8"
                  fill="none"
                  strokeLinecap="round"
                  style={{ animation: 'dragonWhiskers 1.0s ease-in-out infinite 0.15s' }}
                />

                {/* Hyper-Realistic Glowing Ruby Eye with Pupil and Specular Reflection */}
                <ellipse cx="48" cy="36" rx="7" ry="5.5" fill="#1C1917" />
                <circle cx="49" cy="36" r="4.2" fill="#EF4444" />
                <ellipse cx="50" cy="36" rx="1.5" ry="3.5" fill="#7F1D1D" />
                <circle cx="51" cy="34" r="1.5" fill="#FFFFFF" />

                {/* Imperial Sovereign Crown Mounted on Forehead */}
                <path
                  d="M 26 20 L 22 4 L 30 11 L 38 -4 L 46 11 L 54 4 L 50 20 Z"
                  fill="#FEF08A"
                  stroke="#78350F"
                  strokeWidth="1.5"
                />
                <circle cx="38" cy="-4" r="3.5" fill="#EF4444" stroke="#FFF" strokeWidth="0.8" />
                <circle cx="22" cy="4" r="2" fill="#38BDF8" />
                <circle cx="54" cy="4" r="2" fill="#38BDF8" />

                {/* Torrential Dragon Fire Breath Blast */}
                <path
                  d="M 96 46 Q 160 32, 220 20 Q 180 62, 225 80 Q 150 70, 96 54 Z"
                  fill="url(#dragonPlasmaFire)"
                  filter="url(#goldGlowRealistic)"
                  className="animate-pulse"
                />
              </g>

              {/* Tail Flame Tip in 3D */}
              <g transform="translate(18, 185)">
                <path
                  d="M 0 12 Q -30 0, -50 30 Q -18 30, -6 48 Q 6 30, 24 18 Z"
                  fill="url(#dragonPlasmaFire)"
                  stroke="#FEF08A"
                  strokeWidth="1.5"
                />
              </g>
            </svg>

            {/* Radiant Stardust and Embers Stream */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-around">
              <span className="text-3xl animate-ping absolute -top-6 left-1/4">✨</span>
              <span className="text-4xl animate-pulse absolute -bottom-8 left-1/2">🌟</span>
              <span className="text-2xl animate-bounce absolute top-12 right-1/4">💫</span>
              <span className="text-3xl animate-ping absolute -top-8 right-12">🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Shimmer Status Banner */}
      <div className="relative z-30 pb-3 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-amber-400/60 text-amber-300 text-xs font-bold shadow-xl backdrop-blur-md">
          <span>✨</span>
          <span>تأثير التنين الملكي الذهبي السريع يضيء سماء الجلسة</span>
          <span>✨</span>
        </div>
      </div>
    </div>
  );
};
