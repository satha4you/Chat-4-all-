import React, { useEffect, useState } from 'react';
import { ActiveGiftEvent } from './GiftCelebrationOverlay';
import { AvatarWithFrame } from '../../common/AvatarWithFrame';
import { VIPName } from '../../common/VIPName';
import { Gift3DIcon } from '../../common/Gift3DIcon';
import { playSoundEffect } from '../../../utils/soundEffects';

interface RoyalFalconEffectProps {
  event: ActiveGiftEvent;
}

export const RoyalFalconEffect: React.FC<RoyalFalconEffectProps> = ({ event }) => {
  const { gift, sender, receiver, comboCount } = event;
  const [showSonicFlash, setShowSonicFlash] = useState(false);

  useEffect(() => {
    // Play majestic falcon cry sound effect immediately
    playSoundEffect('falcon_cry');

    const flashTimer = setTimeout(() => {
      setShowSonicFlash(true);
    }, 500);

    const sparkleTimer = setTimeout(() => {
      playSoundEffect('gift_sparkle');
    }, 900);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(sparkleTimer);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex flex-col justify-between">
      {/* Top Royal Sky Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-sky-500/25 via-amber-500/15 to-transparent pointer-events-none" />

      {/* 1. Top Imperial Floating Announcement Banner */}
      <div className="relative z-30 pt-3 px-3 flex justify-center animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="max-w-md w-full rounded-2xl bg-gradient-to-r from-[#071224]/95 via-[#10223D]/95 to-[#071224]/95 border-2 border-cyan-400/90 p-2.5 shadow-[0_0_35px_rgba(56,189,248,0.6),inset_0_1px_2px_rgba(254,240,138,0.4)] backdrop-blur-xl flex items-center justify-between gap-2.5">
          {/* Right: Sender */}
          <div className="flex items-center gap-2 min-w-0">
            <AvatarWithFrame user={sender} size="xs" showCrown={true} />
            <div className="min-w-0 text-right">
              <span className="text-[9px] text-cyan-300 font-bold block leading-tight">المرسل</span>
              <VIPName user={sender} size="xs" />
            </div>
          </div>

          {/* Center: Falcon 3D Badge & Gift Info */}
          <div className="flex flex-col items-center shrink-0 px-1">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-sky-500/30 via-cyan-400/20 to-amber-500/30 border border-cyan-400/70 text-cyan-200 text-[11px] font-black shadow-sm">
              <Gift3DIcon giftId="gift_falcon" size="xs" />
              <span className="tracking-wide">صقر العز الملكي ثلاثي الأبعاد</span>
              <span className="text-xs">✨</span>
            </div>
            <div className="text-[10px] text-yellow-300 font-bold mt-0.5 flex items-center gap-1">
              <span>{gift.nameAr}</span>
              {comboCount > 1 && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/80 text-black text-[9px] font-black animate-pulse">
                  x{comboCount}
                </span>
              )}
            </div>
          </div>

          {/* Left: Receiver */}
          <div className="flex items-center gap-2 min-w-0 flex-row-reverse">
            <AvatarWithFrame user={receiver} size="xs" showCrown={true} />
            <div className="min-w-0 text-left">
              <span className="text-[9px] text-cyan-300 font-bold block leading-tight">المستلم</span>
              <VIPName user={receiver} size="xs" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Fast 2.0s Realistic 3D Falcon Supersonic Flight Dive */}
      <div className="relative flex-1 w-full flex items-center overflow-hidden">
        {/* Sonic Shockwave Flare */}
        <div
          className="absolute right-1/3 top-1/3 w-56 h-56 rounded-full border-2 border-cyan-300/80 pointer-events-none opacity-0"
          style={{ animation: 'sonicShockwave 1.1s cubic-bezier(0.1, 0.8, 0.2, 1) 0.4s forwards' }}
        />

        <div
          className="absolute right-0 top-1/4"
          style={{
            animation: 'royalFalconGlide 2.0s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="relative w-[340px] sm:w-[460px] h-[250px] sm:h-[320px] drop-shadow-[0_0_45px_rgba(245,158,11,1)]">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 440 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="falcon3DGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="20%" stopColor="#FFFBEB" />
                  <stop offset="40%" stopColor="#FEF08A" />
                  <stop offset="70%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>

                <linearGradient id="falconFeather3D" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="25%" stopColor="#FDE68A" />
                  <stop offset="60%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>

                <linearGradient id="skySonicTrail" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(56, 189, 248, 0.95)" />
                  <stop offset="40%" stopColor="rgba(253, 224, 71, 0.8)" />
                  <stop offset="75%" stopColor="rgba(245, 158, 11, 0.6)" />
                  <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
                </linearGradient>

                <filter id="falconGlowRealistic" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Supersonic Streamline Shockwaves Behind Wings */}
              <path
                d="M 320 40 Q 380 20, 480 -10"
                stroke="url(#skySonicTrail)"
                strokeWidth="24"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M 300 80 Q 360 60, 460 30"
                stroke="url(#skySonicTrail)"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.6"
              />

              {/* Falcon Tail Feathers (Layered 3D Spread Fan) */}
              <g transform="translate(260, 180)">
                <path d="M 0 0 L 55 75 L 30 85 L 0 0 Z" fill="url(#falconFeather3D)" stroke="#FEF08A" strokeWidth="1.5" />
                <path d="M 0 0 L 72 65 L 55 75 L 0 0 Z" fill="url(#falconFeather3D)" stroke="#FEF08A" strokeWidth="1.5" />
                <path d="M 0 0 L 82 48 L 72 65 L 0 0 Z" fill="url(#falconFeather3D)" stroke="#FEF08A" strokeWidth="1.5" />
                <path d="M 0 0 L 30 85 L 8 92 L 0 0 Z" fill="url(#falconFeather3D)" stroke="#FEF08A" strokeWidth="1.5" />
              </g>

              {/* Left Wing (Aerodynamic 3D Wing Strata with rapid flap) */}
              <g
                style={{
                  transformOrigin: '210px 125px',
                  animation: 'falconFlap 0.35s ease-in-out infinite alternate',
                }}
              >
                {/* Primary Flight Feathers in 3D */}
                <path
                  d="M 210 125 L 350 -10 L 320 -5 L 180 120 Z"
                  fill="url(#falconFeather3D)"
                  stroke="#FFFBEB"
                  strokeWidth="1.2"
                />
                <path
                  d="M 210 125 L 375 15 L 345 20 L 185 125 Z"
                  fill="url(#falconFeather3D)"
                  stroke="#FFFBEB"
                  strokeWidth="1.2"
                />
                <path
                  d="M 210 125 L 390 45 L 360 50 L 190 130 Z"
                  fill="url(#falconFeather3D)"
                  stroke="#FFFBEB"
                  strokeWidth="1.2"
                />
                {/* Wing Upper Scapulars (24k Gold Sheen) */}
                <path
                  d="M 170 140 Q 240 60, 340 5 Q 260 80, 190 150 Z"
                  fill="url(#falcon3DGold)"
                  stroke="#FFFBEB"
                  strokeWidth="2"
                  filter="url(#falconGlowRealistic)"
                />
              </g>

              {/* Muscular Falcon Body / Breast in 3D Volume */}
              <ellipse cx="170" cy="150" rx="42" ry="58" fill="url(#falcon3DGold)" stroke="#FFFBEB" strokeWidth="2" />
              {/* Chest Plumage Bevel */}
              <path
                d="M 155 120 Q 170 145, 185 120 Q 170 180, 155 120 Z"
                fill="#FFFBEB"
                opacity="0.9"
              />

              {/* Right Wing (Perspective Fore-Wing) */}
              <g
                style={{
                  transformOrigin: '150px 140px',
                  animation: 'falconFlap 0.35s ease-in-out infinite alternate 0.05s',
                }}
              >
                <path
                  d="M 150 140 Q 110 50, 40 -15 Q 90 60, 130 160 Z"
                  fill="url(#falcon3DGold)"
                  stroke="#FFFBEB"
                  strokeWidth="2"
                  filter="url(#falconGlowRealistic)"
                />
                {/* Secondary Wing Feathers */}
                <path d="M 40 -15 L 65 -5 L 125 130 Z" fill="url(#falconFeather3D)" stroke="#FEF08A" strokeWidth="1" />
                <path d="M 65 -5 L 90 15 L 130 140 Z" fill="url(#falconFeather3D)" stroke="#FEF08A" strokeWidth="1" />
              </g>

              {/* 3D Realistic Golden Talons Clutching Royal Sky Diamond */}
              <g transform="translate(150, 205)">
                {/* Huge Floating Celestial Blue Diamond */}
                <polygon points="12,18 24,6 36,18 24,34" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" className="animate-pulse" />
                <polygon points="16,18 24,10 32,18 24,30" fill="#E0F2FE" />
                {/* Left Talon Grip */}
                <path d="M 0 0 L 8 18 L 16 16 M 8 18 L 12 24" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />
                {/* Right Talon Grip */}
                <path d="M 22 0 L 26 18 L 34 16 M 26 18 L 30 24" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />
                {/* Talon Curved Razor Black Claws */}
                <path d="M 16 16 Q 18 24, 20 20" stroke="#1C1917" strokeWidth="2" fill="none" />
                <path d="M 34 16 Q 36 24, 38 20" stroke="#1C1917" strokeWidth="2" fill="none" />
              </g>

              {/* Realistic 3D Falcon Head with Piercing Gaze */}
              <g transform="translate(105, 95)">
                {/* Head Base */}
                <circle cx="28" cy="28" r="24" fill="url(#falcon3DGold)" stroke="#FFFBEB" strokeWidth="2" />
                
                {/* Crown Feather Crest */}
                <path d="M 28 4 L 34 14 L 38 6 L 36 18 L 22 18 Z" fill="#FFFBEB" stroke="#78350F" strokeWidth="1.2" />
                <circle cx="38" cy="6" r="2.5" fill="#EF4444" />

                {/* Piercing 3D Predator Eye */}
                <circle cx="18" cy="22" r="7" fill="#1C1917" stroke="#FEF08A" strokeWidth="1.8" />
                <circle cx="18" cy="22" r="4.5" fill="#F59E0B" />
                <circle cx="18" cy="22" r="2.5" fill="#000000" />
                <circle cx="16.5" cy="20.5" r="1.5" fill="#FFFFFF" />

                {/* Curved Hooked Golden Beak */}
                <path
                  d="M 12 26 Q -12 30, -14 42 Q -2 38, 12 36 Z"
                  fill="#F59E0B"
                  stroke="#78350F"
                  strokeWidth="2"
                />
                {/* Beak Highlight */}
                <path d="M 10 28 Q -4 32, -8 38" stroke="#FFFBEB" strokeWidth="1.2" fill="none" />
              </g>
            </svg>

            {/* Glowing Feathers Floating in Sky */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-around">
              <span className="text-3xl animate-ping absolute top-0 left-10 text-cyan-300">💎</span>
              <span className="text-3xl animate-pulse absolute -bottom-4 right-1/4">✨</span>
              <span className="text-2xl animate-bounce absolute top-1/2 left-0 text-amber-300">🌟</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Subtle Status Banner */}
      <div className="relative z-30 pb-3 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-cyan-400/60 text-cyan-300 text-xs font-bold shadow-xl backdrop-blur-md">
          <span>✨</span>
          <span>صقر العز والشموخ الملكي السريع يحلق في الغرفة</span>
          <span>✨</span>
        </div>
      </div>
    </div>
  );
};
