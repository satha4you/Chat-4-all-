import React from 'react';
import { Gift } from '../../../types';

interface GiftSceneAnimationProps {
  gift: Gift;
  comboCount: number;
}

export const GiftSceneAnimation: React.FC<GiftSceneAnimationProps> = ({ gift, comboCount }) => {
  const { animationType, id } = gift;

  switch (animationType) {
    // 1. Golden Supercar Drift Scene
    case 'supercar':
      return (
        <div className="absolute inset-x-0 bottom-16 sm:bottom-24 pointer-events-none z-30 overflow-hidden h-44">
          <div className="relative w-full h-full">
            {/* Speed trails & light streaks */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-70">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400 to-red-500 animate-pulse" />
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />
              <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-orange-500 to-amber-300 animate-pulse" />
            </div>

            {/* Racing Supercar Element */}
            <div className="absolute top-4 -right-64 animate-[driveBy_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards] flex items-center gap-3">
              {/* Exhaust Flames & Tire Smoke */}
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-orange-500/60 blur-md animate-ping" />
                <div className="text-2xl animate-bounce">🔥</div>
                <div className="text-xl">💨</div>
              </div>

              {/* Supercar Graphic */}
              <div className="relative transform scale-110 drop-shadow-[0_10px_25px_rgba(245,158,11,0.8)]">
                <svg className="w-56 h-28" viewBox="0 0 240 100" fill="none">
                  <defs>
                    <linearGradient id="carGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF275" />
                      <stop offset="40%" stopColor="#E5A910" />
                      <stop offset="80%" stopColor="#996500" />
                      <stop offset="100%" stopColor="#553700" />
                    </linearGradient>
                    <linearGradient id="windowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>
                  </defs>

                  {/* Car Body Shell */}
                  <path
                    d="M10 70 L35 70 Q45 52 70 52 L140 52 Q165 52 185 62 L225 65 Q235 68 235 75 L225 80 L15 80 Q8 80 10 70 Z"
                    fill="url(#carGoldGrad)"
                    stroke="#FFDF00"
                    strokeWidth="1.5"
                  />
                  {/* Roof / Cockpit */}
                  <path
                    d="M75 52 L100 28 Q105 24 125 24 L160 24 Q175 24 190 40 L205 52 Z"
                    fill="url(#carGoldGrad)"
                  />
                  {/* Cockpit Tinted Glass */}
                  <path
                    d="M104 32 L125 30 L155 30 L182 50 L85 50 Z"
                    fill="url(#windowGrad)"
                    stroke="#38BDF8"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  {/* Rear Spoiler */}
                  <path d="M12 55 L32 55 L28 45 L8 45 Z" fill="#D97706" />
                  <path d="M18 55 L18 68" stroke="#D97706" strokeWidth="3" />

                  {/* Wheels */}
                  <circle cx="58" cy="78" r="16" fill="#18181B" stroke="#F59E0B" strokeWidth="3" />
                  <circle cx="58" cy="78" r="7" fill="#D4AF37" />
                  <circle cx="185" cy="78" r="16" fill="#18181B" stroke="#F59E0B" strokeWidth="3" />
                  <circle cx="185" cy="78" r="7" fill="#D4AF37" />

                  {/* Xenon Headlight Beam */}
                  <polygon points="225,65 240,68 238,73 223,70" fill="#38BDF8" />
                  <path d="M238 68 L320 60 L320 85 L238 73 Z" fill="rgba(56, 189, 248, 0.25)" />
                  {/* Neon Underglow */}
                  <ellipse cx="120" cy="85" rx="90" ry="6" fill="#F59E0B" opacity="0.8" />
                </svg>
              </div>

              {/* VIP Plate */}
              <div className="px-2 py-0.5 rounded bg-black/90 border border-yellow-400 text-yellow-300 text-[10px] font-mono font-black shadow-lg">
                VIP-777
              </div>
            </div>
          </div>
        </div>
      );

    // 2. Mythic Dragon Flight Scene
    case 'dragon':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Dragon S-Curve swooping across screen */}
            <div className="absolute top-1/4 -left-72 animate-[dragonFly_1.5s_ease-in-out_forwards] flex items-center">
              <div className="relative w-80 h-64 filter drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]">
                <svg className="w-full h-full" viewBox="0 0 320 200" fill="none">
                  <defs>
                    <linearGradient id="dragonSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#DC2626" />
                      <stop offset="50%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#FBBF24" />
                    </linearGradient>
                  </defs>

                  {/* Serpentine Body Segments */}
                  <path
                    d="M280 90 Q220 30 170 80 T80 70 T10 120"
                    fill="none"
                    stroke="url(#dragonSkin)"
                    strokeWidth="28"
                    strokeLinecap="round"
                  />
                  {/* Dorsal Spines */}
                  <path
                    d="M275 80 L280 65 L265 75 L255 55 L245 70 L230 45 L220 65 L200 40 L190 65 L170 45 L155 70 L135 48 L120 75 L100 55 L85 85 L65 65 L50 95 L30 80 L15 110"
                    stroke="#FFD700"
                    strokeWidth="4"
                    fill="#EF4444"
                  />
                  {/* Dragon Head */}
                  <circle cx="285" cy="85" r="22" fill="#DC2626" />
                  <path d="M285 70 L315 80 L310 95 L275 95 Z" fill="url(#dragonSkin)" />
                  {/* Horns */}
                  <path d="M275 70 Q280 40 260 30" stroke="#FFD700" strokeWidth="5" fill="none" />
                  <path d="M285 70 Q295 45 310 40" stroke="#FFD700" strokeWidth="4" fill="none" />
                  {/* Glowing Eye */}
                  <circle cx="295" cy="78" r="4" fill="#FFFFFF" />
                  <circle cx="295" cy="78" r="2" fill="#FEF08A" />
                  {/* Flame Breath */}
                  <path
                    d="M312 85 Q350 75 390 65 Q360 95 385 110 Q340 100 312 92 Z"
                    fill="url(#dragonSkin)"
                    className="animate-pulse"
                  />
                </svg>

                {/* Floating flame particles */}
                <div className="absolute top-12 -right-16 flex flex-col gap-1">
                  <span className="text-3xl animate-ping">🔥</span>
                  <span className="text-2xl animate-bounce">⚡</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    // 3. Royal Falcon Dive Scene
    case 'falcon':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden">
          <div className="relative w-full h-full">
            <div className="absolute -top-32 -right-32 animate-[falconSwoop_1.2s_ease-out_forwards]">
              <div className="relative flex flex-col items-center drop-shadow-[0_0_25px_rgba(56,189,248,0.85)]">
                <svg className="w-56 h-44" viewBox="0 0 200 160" fill="none">
                  <defs>
                    <linearGradient id="falconWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#92400E" />
                    </linearGradient>
                  </defs>

                  {/* Falcon Body */}
                  <path d="M90 60 Q100 30 110 60 L105 110 L95 110 Z" fill="#78350F" />
                  {/* Wings Spread */}
                  <path
                    d="M100 50 Q140 10 190 20 Q160 60 115 75 Z"
                    fill="url(#falconWingGrad)"
                    stroke="#FFD700"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M100 50 Q60 10 10 20 Q40 60 85 75 Z"
                    fill="url(#falconWingGrad)"
                    stroke="#FFD700"
                    strokeWidth="1.5"
                  />
                  {/* Tail Feathers */}
                  <polygon points="90,110 110,110 120,145 80,145" fill="#B45309" stroke="#FFD700" />
                  {/* Falcon Head & Sharp Beak */}
                  <circle cx="100" cy="40" r="14" fill="#FEF3C7" stroke="#D4AF37" strokeWidth="2" />
                  <path d="M100 32 L116 42 L102 46 Z" fill="#F59E0B" />
                  <circle cx="98" cy="38" r="3" fill="#000000" />
                  <circle cx="97" cy="37" r="1" fill="#FFFFFF" />
                  {/* Royal Crown on Falcon */}
                  <path d="M92 26 L96 32 L100 24 L104 32 L108 26 L106 34 L94 34 Z" fill="#FFD700" />
                </svg>

                <div className="px-3 py-1 rounded-full bg-blue-950/80 border border-cyan-400 text-cyan-200 text-xs font-black shadow-xl animate-pulse">
                  🦅 صقر العز والشموخ
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    // 4. Clashing Damascus Swords Scene
    case 'swords':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 flex items-center justify-center overflow-hidden">
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Central Energy Shockwave Ring */}
            <div className="absolute w-44 h-44 rounded-full border-4 border-cyan-400/80 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_50px_rgba(56,189,248,0.9)]" />
            <div className="absolute w-60 h-60 rounded-full border border-amber-400/60 animate-pulse" />

            {/* Left Sword */}
            <div className="absolute animate-[swordClashLeft_0.5s_ease-out_forwards] origin-bottom-right">
              <svg className="w-40 h-40" viewBox="0 0 120 120" fill="none">
                <path
                  d="M20 100 L30 110 L45 95 L35 85 Z"
                  fill="#D4AF37"
                  stroke="#FFD700"
                  strokeWidth="2"
                />
                <circle cx="25" cy="105" r="5" fill="#EF4444" />
                <path d="M40 90 L50 80" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round" />
                <path
                  d="M48 82 Q75 55 105 15 L95 10 Q65 48 42 76 Z"
                  fill="url(#swordBladeGrad)"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                />
                <defs>
                  <linearGradient id="swordBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#93C5FD" />
                    <stop offset="100%" stopColor="#1E40AF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Right Sword */}
            <div className="absolute animate-[swordClashRight_0.5s_ease-out_forwards] origin-bottom-left">
              <svg className="w-40 h-40 transform scale-x-[-1]" viewBox="0 0 120 120" fill="none">
                <path
                  d="M20 100 L30 110 L45 95 L35 85 Z"
                  fill="#D4AF37"
                  stroke="#FFD700"
                  strokeWidth="2"
                />
                <circle cx="25" cy="105" r="5" fill="#38BDF8" />
                <path d="M40 90 L50 80" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round" />
                <path
                  d="M48 82 Q75 55 105 15 L95 10 Q65 48 42 76 Z"
                  fill="url(#swordBladeGrad)"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Clashing Sparks in center */}
            <div className="absolute text-5xl animate-spin [animation-duration:3s]">
              💥
            </div>
          </div>
        </div>
      );

    // 5. Arabian Horse Gallop Scene
    case 'horse':
      return (
        <div className="absolute inset-x-0 bottom-20 pointer-events-none z-35 overflow-hidden h-40">
          <div className="relative w-full h-full">
            <div className="absolute top-2 -right-52 animate-[driveBy_1.2s_ease-in-out_forwards] flex items-center gap-3">
              <div className="relative flex items-center">
                <span className="text-7xl filter drop-shadow-[0_0_20px_rgba(245,158,11,0.9)] animate-bounce">
                  🐎
                </span>
                <div className="flex flex-col gap-1 -ml-4">
                  <span className="text-3xl animate-ping">✨</span>
                  <span className="text-2xl animate-pulse">🌟</span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400 text-amber-200 text-xs font-black shadow-lg">
                خيل الأصالة العربية
              </div>
            </div>
          </div>
        </div>
      );

    // 6. Supersonic Jet Stream Scene
    case 'jet':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden">
          <div className="relative w-full h-full">
            <div className="absolute -bottom-24 -left-32 animate-[jetFly_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] flex items-center gap-2">
              {/* Jet SVG with dual sonic vapor trails */}
              <div className="relative flex items-center drop-shadow-[0_0_30px_rgba(56,189,248,0.9)]">
                <span className="text-8xl transform rotate-45">✈️</span>
                {/* Sonic boom rings */}
                <div className="absolute -left-12 w-24 h-24 rounded-full border-2 border-cyan-300/80 animate-ping" />
                <div className="absolute -left-20 w-36 h-36 rounded-full border border-sky-400/60 animate-ping" />
              </div>
            </div>
          </div>
        </div>
      );

    // 7. Billionaire Yacht Scene
    case 'yacht':
      return (
        <div className="absolute inset-x-0 bottom-12 pointer-events-none z-35 overflow-hidden h-48 flex flex-col justify-end">
          {/* Shimmering Ocean Waves */}
          <div className="relative w-full h-24 bg-gradient-to-t from-cyan-950/90 via-blue-900/60 to-transparent flex items-end justify-center pb-2">
            <div className="absolute inset-0 flex items-center justify-around opacity-60">
              <div className="w-24 h-1 bg-cyan-400 rounded-full blur-sm animate-pulse" />
              <div className="w-36 h-1 bg-blue-400 rounded-full blur-sm" />
              <div className="w-28 h-1 bg-cyan-300 rounded-full blur-sm animate-pulse" />
            </div>

            {/* Sailing Yacht */}
            <div className="relative flex flex-col items-center animate-bounce [animation-duration:2.5s]">
              <div className="text-7xl filter drop-shadow-[0_0_25px_rgba(6,182,212,0.9)]">
                🛥️
              </div>
              <div className="px-3 py-0.5 rounded-full bg-black/80 border border-cyan-400 text-cyan-200 text-xs font-black shadow-lg -mt-2">
                يخت المليارديرات الذهبي
              </div>
            </div>
          </div>
        </div>
      );

    // 8. Cosmic Galaxy / Meteor Scene
    case 'galaxy':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 flex items-center justify-center overflow-hidden">
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Spinning Galaxy Nebula Core */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 via-fuchsia-500/20 to-cyan-500/30 blur-2xl animate-spin [animation-duration:14s]" />
            <div className="absolute w-64 h-64 rounded-full border-2 border-dashed border-purple-400/50 animate-spin [animation-duration:20s]" />
            <div className="absolute w-48 h-48 rounded-full border border-pink-400/40 animate-spin [animation-duration:10s]" />

            {/* Orbiting Planets & Stars */}
            <div className="absolute text-7xl filter drop-shadow-[0_0_35px_rgba(168,85,247,0.95)] animate-pulse">
              🌌
            </div>
            <div className="absolute -top-6 left-12 text-3xl animate-bounce">🪐</div>
            <div className="absolute bottom-4 right-10 text-3xl animate-ping">☄️</div>
            <div className="absolute top-10 right-4 text-2xl animate-pulse">⭐</div>
          </div>
        </div>
      );

    // 9. Imperial Crown Ascension Scene
    case 'crown_burst':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 flex items-center justify-center overflow-hidden">
          <div className="relative flex flex-col items-center animate-in zoom-in-50 duration-500">
            {/* Radiating Light Beams */}
            <div className="absolute w-72 h-72 rounded-full bg-yellow-400/20 blur-3xl animate-pulse" />
            
            {/* Crown with angel wings */}
            <div className="relative flex items-center gap-2">
              <span className="text-4xl text-amber-300 animate-pulse">🪽</span>
              <span className="text-8xl filter drop-shadow-[0_0_35px_rgba(255,215,0,0.95)] animate-bounce">
                👑
              </span>
              <span className="text-4xl text-amber-300 animate-pulse transform scale-x-[-1]">🪽</span>
            </div>

            <div className="mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 text-black font-black text-xs shadow-[0_0_20px_rgba(255,215,0,0.8)] border border-white/60 flex items-center gap-1.5">
              <span>⚜️</span>
              <span>تاج الملوك الألماسي الإمبراطوري</span>
              <span>⚜️</span>
            </div>
          </div>
        </div>
      );

    // 10. Arabian Dallah Hospitality Scene
    case 'dallah_pour':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 flex items-center justify-center overflow-hidden">
          <div className="relative flex flex-col items-center">
            {/* Glowing Aura */}
            <div className="absolute w-64 h-64 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />

            {/* Dallah Pot pouring */}
            <div className="relative flex items-center gap-4 animate-in zoom-in-75 duration-300">
              <div className="text-8xl filter drop-shadow-[0_0_30px_rgba(245,158,11,0.9)] transform -rotate-12 animate-pulse">
                🫖
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl animate-bounce">☕</span>
                <div className="h-10 w-1 bg-gradient-to-b from-amber-400 to-amber-700 animate-pulse rounded-full" />
              </div>
            </div>

            <div className="mt-3 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400 text-amber-200 text-xs font-black shadow-lg">
              كرم الضيافة العربية الأصيلة
            </div>
          </div>
        </div>
      );

    // 11. Rose & Heart Shower Scene
    case 'rose_shower':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 flex items-center justify-center overflow-hidden">
          <div className="relative flex flex-col items-center animate-in zoom-in-75 duration-300">
            <div className="absolute w-64 h-64 rounded-full bg-rose-500/25 blur-3xl animate-pulse" />
            <div className="relative text-8xl filter drop-shadow-[0_0_35px_rgba(244,63,94,0.95)] animate-pulse">
              🌹
            </div>
            {/* Flying petals */}
            <div className="absolute -top-8 left-0 text-3xl animate-ping">💖</div>
            <div className="absolute -bottom-6 right-0 text-3xl animate-bounce">🌸</div>
            <div className="absolute top-10 -right-8 text-2xl animate-pulse">✨</div>
          </div>
        </div>
      );

    // 12. Mythic Phoenix Rebirth Scene
    case 'phoenix':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden flex items-center justify-center">
          {/* Pulsing Solar / Fiery Aura */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-red-600/30 via-orange-500/30 to-amber-400/25 blur-3xl animate-pulse" />

          <div className="relative flex flex-col items-center animate-in zoom-in-50 duration-500">
            {/* Animated Phoenix Creature Graphic */}
            <div className="relative w-80 h-72 drop-shadow-[0_0_40px_rgba(239,68,68,0.9)]">
              <svg className="w-full h-full" viewBox="0 0 320 280" fill="none">
                <defs>
                  <linearGradient id="phoenixBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="35%" stopColor="#F59E0B" />
                    <stop offset="70%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#7F1D1D" />
                  </linearGradient>
                  <linearGradient id="wingFlameGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="40%" stopColor="#F97316" />
                    <stop offset="80%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>

                {/* Left Majestic Wing */}
                <path
                  d="M160 140 Q100 80 40 40 Q70 110 90 150 Q110 120 140 160 Z"
                  fill="url(#wingFlameGrad)"
                  stroke="#FFD700"
                  strokeWidth="2"
                  className="origin-bottom-right animate-pulse"
                />
                <path
                  d="M145 135 Q75 60 15 20 Q50 95 75 140 Z"
                  fill="url(#wingFlameGrad)"
                  opacity="0.85"
                />

                {/* Right Majestic Wing */}
                <path
                  d="M160 140 Q220 80 280 40 Q250 110 230 150 Q210 120 180 160 Z"
                  fill="url(#wingFlameGrad)"
                  stroke="#FFD700"
                  strokeWidth="2"
                  className="origin-bottom-left animate-pulse"
                />
                <path
                  d="M175 135 Q245 60 305 20 Q270 95 245 140 Z"
                  fill="url(#wingFlameGrad)"
                  opacity="0.85"
                />

                {/* Phoenix Fiery Tail Feathers */}
                <path
                  d="M160 180 Q140 230 110 270 Q150 250 160 210 Q170 250 210 270 Q180 230 160 180 Z"
                  fill="url(#wingFlameGrad)"
                  stroke="#FFD700"
                  strokeWidth="1.5"
                />

                {/* Phoenix Body Core */}
                <ellipse cx="160" cy="140" rx="22" ry="36" fill="url(#phoenixBodyGrad)" stroke="#FFD700" strokeWidth="2" />

                {/* Phoenix Head & Solar Crest */}
                <circle cx="160" cy="92" r="16" fill="#FBBF24" stroke="#DC2626" strokeWidth="2" />
                <polygon points="160,82 154,62 160,70 166,62" fill="#FFD700" stroke="#DC2626" />
                <polygon points="160,92 168,98 160,102" fill="#DC2626" />
                <circle cx="158" cy="90" r="3" fill="#FFFFFF" />
                <circle cx="158" cy="90" r="1.5" fill="#000000" />
              </svg>

              {/* Floating Fire & Sparkles */}
              <div className="absolute top-2 left-6 text-3xl animate-ping">🔥</div>
              <div className="absolute top-4 right-6 text-3xl animate-ping">🔥</div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl animate-bounce">⚡</div>
            </div>

            {/* Imperial Title Banner */}
            <div className="mt-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-red-950/90 via-orange-600/90 to-amber-600/90 border border-yellow-300 text-yellow-200 font-black text-xs shadow-[0_0_25px_rgba(239,68,68,0.8)] flex items-center gap-2">
              <span className="text-base animate-spin">🔥</span>
              <span>طائر الفينيق الأسطوري الخالد</span>
              <span className="text-base animate-spin">🔥</span>
            </div>
          </div>
        </div>
      );

    // 13. Cosmic Rocket Space Launch Scene
    case 'rocket':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden flex items-center justify-center">
          {/* Nebula Backdrop */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-blue-600/20 via-purple-600/25 to-pink-500/20 blur-3xl animate-pulse" />

          {/* Ascending Rocket */}
          <div className="relative flex flex-col items-center animate-[driveBy_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            {/* Rocket Ship SVG */}
            <div className="relative w-48 h-64 drop-shadow-[0_0_35px_rgba(59,130,246,0.9)]">
              <svg className="w-full h-full" viewBox="0 0 160 220" fill="none">
                <defs>
                  <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>
                  <linearGradient id="thrustFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="50%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>

                {/* Side Thrusters / Fins */}
                <path d="M48 130 L20 170 L48 165 Z" fill="#EF4444" stroke="#DC2626" />
                <path d="M112 130 L140 170 L112 165 Z" fill="#EF4444" stroke="#DC2626" />

                {/* Main Rocket Fuselage */}
                <path
                  d="M80 20 Q120 70 112 160 L48 160 Q40 70 80 20 Z"
                  fill="url(#rocketBodyGrad)"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />

                {/* Nose Cone */}
                <path d="M80 20 Q95 45 100 65 L60 65 Q65 45 80 20 Z" fill="#EF4444" />

                {/* Cockpit Porthole */}
                <circle cx="80" cy="90" r="18" fill="#0284C7" stroke="#FFD700" strokeWidth="3" />
                <circle cx="80" cy="90" r="14" fill="#38BDF8" />
                <circle cx="75" cy="85" r="4" fill="#FFFFFF" />

                {/* Exhaust Nozzle */}
                <polygon points="56,160 104,160 96,175 64,175" fill="#334155" />

                {/* Thruster Flames */}
                <polygon
                  points="60,175 100,175 80,225"
                  fill="url(#thrustFlameGrad)"
                  className="animate-pulse"
                />
              </svg>

              {/* Floating Smoke & Sparkles */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1">
                <span className="text-3xl animate-bounce">💨</span>
                <span className="text-2xl animate-ping">🔥</span>
                <span className="text-3xl animate-bounce">💨</span>
              </div>
            </div>

            {/* Rocket Banner */}
            <div className="mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-950/90 via-indigo-600/90 to-purple-600/90 border border-cyan-400 text-cyan-200 font-black text-xs shadow-xl flex items-center gap-1.5">
              <span>🚀</span>
              <span>صاروخ المجرات الفضائي الأسطوري</span>
              <span>🌌</span>
            </div>
          </div>
        </div>
      );

    // 14. Sultan's Golden Treasure Chest Scene
    case 'treasure_chest':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden flex items-center justify-center">
          {/* Radiating Light Core */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-400/30 to-amber-600/25 blur-3xl animate-pulse" />

          <div className="relative flex flex-col items-center animate-in zoom-in-75 duration-400">
            {/* Treasure Chest Graphic */}
            <div className="relative w-64 h-56 drop-shadow-[0_0_35px_rgba(245,158,11,0.9)]">
              <svg className="w-full h-full" viewBox="0 0 240 200" fill="none">
                <defs>
                  <linearGradient id="chestWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#92400E" />
                    <stop offset="50%" stopColor="#78350F" />
                    <stop offset="100%" stopColor="#451A03" />
                  </linearGradient>
                  <linearGradient id="chestGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF275" />
                    <stop offset="50%" stopColor="#E5A910" />
                    <stop offset="100%" stopColor="#996500" />
                  </linearGradient>
                </defs>

                {/* Chest Base Box */}
                <rect x="30" y="90" width="180" height="90" rx="8" fill="url(#chestWoodGrad)" stroke="#D4AF37" strokeWidth="3" />
                {/* Gold Bands */}
                <rect x="50" y="90" width="16" height="90" fill="url(#chestGoldGrad)" />
                <rect x="174" y="90" width="16" height="90" fill="url(#chestGoldGrad)" />
                <rect x="30" y="130" width="180" height="10" fill="url(#chestGoldGrad)" />

                {/* Open Lid (Tilted Upward) */}
                <path
                  d="M20 70 Q120 15 220 70 L210 90 Q120 35 30 90 Z"
                  fill="url(#chestWoodGrad)"
                  stroke="#FFD700"
                  strokeWidth="3"
                />
                <path d="M48 45 L58 87" stroke="#FFD700" strokeWidth="8" />
                <path d="M172 45 L182 87" stroke="#FFD700" strokeWidth="8" />

                {/* Bursting Golden Coins Inside */}
                <ellipse cx="120" cy="90" rx="65" ry="16" fill="#FBBF24" />
                <circle cx="95" cy="88" r="8" fill="#FDE047" stroke="#B45309" />
                <circle cx="115" cy="86" r="9" fill="#FFD700" stroke="#B45309" />
                <circle cx="138" cy="89" r="8" fill="#FDE047" stroke="#B45309" />

                {/* Golden Keyhole Lock */}
                <rect x="110" y="125" width="20" height="24" rx="4" fill="url(#chestGoldGrad)" stroke="#FFD700" strokeWidth="1.5" />
                <circle cx="120" cy="133" r="3" fill="#18181B" />
                <polygon points="118,133 122,133 121,142 119,142" fill="#18181B" />
              </svg>

              {/* Floating Erupting Treasures */}
              <div className="absolute -top-10 left-6 text-3xl animate-bounce">🪙</div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl animate-pulse">💎</div>
              <div className="absolute -top-8 right-8 text-3xl animate-bounce">👑</div>
              <div className="absolute top-2 right-2 text-2xl animate-ping">✨</div>
            </div>

            {/* Treasure Banner */}
            <div className="mt-3 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-950/90 via-yellow-600/90 to-amber-600/90 border border-yellow-300 text-black font-black text-xs shadow-[0_0_25px_rgba(255,215,0,0.8)] flex items-center gap-1.5">
              <span>🧰</span>
              <span>صندوق كنز السلطان الذهبي العظيم</span>
              <span>🪙</span>
            </div>
          </div>
        </div>
      );

    // 15. Diamond Waterfall / Rain Scene
    case 'diamond_rain':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden flex items-center justify-center">
          {/* Diamond Glow Aura */}
          <div className="absolute w-[460px] h-[460px] rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />

          <div className="relative flex flex-col items-center animate-in zoom-in-75 duration-300">
            {/* Spinning Master Diamond */}
            <div className="relative text-8xl filter drop-shadow-[0_0_40px_rgba(56,189,248,0.95)] animate-bounce [animation-duration:2.5s]">
              💎
            </div>

            {/* Falling Gems Orbiting */}
            <div className="absolute -top-12 -left-12 text-3xl animate-ping">🔷</div>
            <div className="absolute -top-10 -right-12 text-3xl animate-bounce">💍</div>
            <div className="absolute -bottom-8 -left-8 text-3xl animate-pulse">✨</div>
            <div className="absolute -bottom-10 -right-8 text-3xl animate-ping">💎</div>
            <div className="absolute top-1/2 -right-16 text-2xl animate-pulse">🌟</div>

            {/* Diamond Title Banner */}
            <div className="mt-4 px-5 py-1.5 rounded-full bg-gradient-to-r from-blue-950/90 via-cyan-600/90 to-sky-500/90 border border-cyan-300 text-cyan-100 font-black text-xs shadow-[0_0_25px_rgba(56,189,248,0.85)] flex items-center gap-1.5">
              <span>💎</span>
              <span>شلال الألماس الكريستالي البراق</span>
              <span>✨</span>
            </div>
          </div>
        </div>
      );

    // 16. Imperial Golden Throne Scene
    case 'golden_throne':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden flex items-center justify-center">
          {/* Imperial Gold & Crimson Aura */}
          <div className="absolute w-[480px] h-[480px] rounded-full bg-gradient-to-b from-amber-500/25 via-red-600/20 to-amber-700/25 blur-3xl animate-pulse" />

          <div className="relative flex flex-col items-center animate-in zoom-in-50 duration-500">
            {/* Throne SVG */}
            <div className="relative w-64 h-60 drop-shadow-[0_0_40px_rgba(245,158,11,0.95)]">
              <svg className="w-full h-full" viewBox="0 0 240 220" fill="none">
                <defs>
                  <linearGradient id="throneGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF275" />
                    <stop offset="50%" stopColor="#E5A910" />
                    <stop offset="100%" stopColor="#996500" />
                  </linearGradient>
                  <linearGradient id="velvetRed" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#7F1D1D" />
                  </linearGradient>
                </defs>

                {/* Backrest Pillars & Crown Top */}
                <rect x="40" y="20" width="20" height="150" fill="url(#throneGold)" />
                <rect x="180" y="20" width="20" height="150" fill="url(#throneGold)" />
                {/* Crown Crest on Backrest */}
                <path d="M50 40 L120 10 L190 40 L190 70 L50 70 Z" fill="url(#throneGold)" stroke="#FFD700" strokeWidth="2" />
                <circle cx="120" cy="28" r="8" fill="#DC2626" stroke="#FFD700" strokeWidth="2" />

                {/* Velvet Back Cushion */}
                <rect x="60" y="60" width="120" height="90" rx="8" fill="url(#velvetRed)" stroke="#FFD700" strokeWidth="2" />
                {/* Tufted Button Diamonds */}
                <circle cx="90" cy="85" r="3" fill="#FFD700" />
                <circle cx="120" cy="85" r="3" fill="#FFD700" />
                <circle cx="150" cy="85" r="3" fill="#FFD700" />
                <circle cx="105" cy="115" r="3" fill="#FFD700" />
                <circle cx="135" cy="115" r="3" fill="#FFD700" />

                {/* Armrests with Lions */}
                <rect x="30" y="120" width="30" height="15" rx="4" fill="url(#throneGold)" />
                <circle cx="35" cy="120" r="10" fill="url(#throneGold)" />
                <rect x="180" y="120" width="30" height="15" rx="4" fill="url(#throneGold)" />
                <circle cx="205" cy="120" r="10" fill="url(#throneGold)" />

                {/* Seat Cushion */}
                <rect x="50" y="140" width="140" height="30" rx="6" fill="url(#velvetRed)" stroke="#FFD700" strokeWidth="2" />
                {/* Front Legs */}
                <rect x="55" y="170" width="18" height="40" rx="4" fill="url(#throneGold)" />
                <rect x="167" y="170" width="18" height="40" rx="4" fill="url(#throneGold)" />
              </svg>

              {/* Floating Regal Symbols */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl animate-bounce">👑</div>
              <div className="absolute top-8 left-2 text-2xl animate-pulse">⚜️</div>
              <div className="absolute top-8 right-2 text-2xl animate-pulse">⚜️</div>
            </div>

            {/* Throne Banner */}
            <div className="mt-3 px-5 py-1.5 rounded-full bg-gradient-to-r from-red-950/95 via-amber-600/90 to-yellow-500/90 border border-yellow-300 text-black font-black text-xs shadow-[0_0_25px_rgba(255,215,0,0.85)] flex items-center gap-2">
              <span>👑</span>
              <span>عرش الملوك والإمبراطورية الأسمى</span>
              <span>👑</span>
            </div>
          </div>
        </div>
      );

    // 17. Royal Emerald & Ruby Bouquet Scene
    case 'emerald_burst':
      return (
        <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden flex items-center justify-center">
          {/* Emerald Glow Aura */}
          <div className="absolute w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-emerald-600/25 via-rose-600/20 to-amber-500/20 blur-3xl animate-pulse" />

          <div className="relative flex flex-col items-center animate-in zoom-in-75 duration-300">
            {/* Blooming Bouquet Graphic */}
            <div className="relative text-8xl filter drop-shadow-[0_0_35px_rgba(16,185,129,0.9)] animate-pulse">
              💐
            </div>

            {/* Floating Emeralds & Roses */}
            <div className="absolute -top-10 -left-10 text-3xl animate-ping">💚</div>
            <div className="absolute -top-8 -right-10 text-3xl animate-bounce">🌹</div>
            <div className="absolute -bottom-6 left-2 text-3xl animate-pulse">💎</div>
            <div className="absolute -bottom-8 right-2 text-3xl animate-ping">✨</div>

            {/* Bouquet Title Banner */}
            <div className="mt-4 px-5 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/90 via-rose-700/90 to-amber-600/90 border border-emerald-400 text-emerald-100 font-black text-xs shadow-[0_0_20px_rgba(16,185,129,0.8)] flex items-center gap-1.5">
              <span>💐</span>
              <span>باقة الياقوت والزمرد الملكية</span>
              <span>💚</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
