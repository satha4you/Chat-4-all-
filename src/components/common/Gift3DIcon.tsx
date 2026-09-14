import React from 'react';

interface Gift3DIconProps {
  giftId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Gift3DIcon: React.FC<Gift3DIconProps> = ({
  giftId,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Render hyper-realistic, 3D-styled fantasy artifact with multi-layered specular lighting, shadows, and metallic finishes
  const renderArtifact = () => {
    switch (giftId) {
      // 1. Imperial Golden Throne (عرش الملوك الأسطوري) - Replaces 🪑
      case 'gift_golden_throne':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
            <defs>
              <linearGradient id="throneGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="20%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="throneVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="40%" stopColor="#991B1B" />
                <stop offset="100%" stopColor="#450A0A" />
              </linearGradient>
              <radialGradient id="gemGlowRuby" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="60%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#7F1D1D" />
              </radialGradient>
            </defs>
            {/* Throne Backrest Frame (Majestic 3D Arch) */}
            <path d="M22 88 L25 35 Q28 10, 50 8 Q72 10, 75 35 L78 88 Z" fill="url(#throneGoldLight)" stroke="#78350F" strokeWidth="1.5" />
            {/* Crowned Spire Top */}
            <path d="M50 2 L56 12 L50 9 L44 12 Z" fill="#FFFBEB" stroke="#92400E" strokeWidth="1" />
            <circle cx="50" cy="5" r="2.5" fill="url(#gemGlowRuby)" />
            {/* Finial Orbs */}
            <circle cx="26" cy="18" r="4" fill="url(#throneGoldLight)" stroke="#78350F" strokeWidth="1" />
            <circle cx="74" cy="18" r="4" fill="url(#throneGoldLight)" stroke="#78350F" strokeWidth="1" />
            {/* Deep Tufted Red Velvet Cushion Back */}
            <path d="M30 38 Q32 20, 50 18 Q68 20, 70 38 L68 68 L32 68 Z" fill="url(#throneVelvet)" stroke="#500724" strokeWidth="1" />
            {/* Diamond Tufting lines */}
            <path d="M38 30 L62 55 M62 30 L38 55 M42 22 L58 40 M58 22 L42 40" stroke="#FF8181" strokeWidth="0.8" opacity="0.4" />
            {/* Tufting Gem Buttons */}
            <circle cx="50" cy="36" r="1.5" fill="#FDE047" />
            <circle cx="43" cy="46" r="1.2" fill="#FDE047" />
            <circle cx="57" cy="46" r="1.2" fill="#FDE047" />
            {/* Velvet Seat Cushion */}
            <ellipse cx="50" cy="70" rx="26" ry="9" fill="url(#throneVelvet)" stroke="#B91C1C" strokeWidth="1" />
            <ellipse cx="50" cy="68" rx="23" ry="7" fill="#B91C1C" opacity="0.5" />
            {/* Golden Armrests with Lion Heads */}
            <path d="M20 54 Q20 50, 26 50 L32 54 L32 72 L22 72 Z" fill="url(#throneGoldLight)" stroke="#78350F" strokeWidth="1" />
            <path d="M80 54 Q80 50, 74 50 L68 54 L68 72 L78 72 Z" fill="url(#throneGoldLight)" stroke="#78350F" strokeWidth="1" />
            <circle cx="22" cy="53" r="3" fill="#FEF08A" />
            <circle cx="78" cy="53" r="3" fill="#FEF08A" />
            {/* 3D Base & Golden Claw Legs */}
            <path d="M22 74 L78 74 L74 94 L26 94 Z" fill="url(#throneGoldLight)" stroke="#78350F" strokeWidth="1.5" />
            {/* Front Claw Feet */}
            <path d="M24 90 L20 98 L30 98 Z" fill="#D97706" />
            <path d="M76 90 L70 98 L80 98 Z" fill="#D97706" />
            {/* Royal Crest Emblem on Back */}
            <polygon points="50,22 53,28 59,28 54,32 56,38 50,34 44,38 46,32 41,28 47,28" fill="#FFFBEB" />
          </svg>
        );

      // 2. Sultan's Royal Treasure Chest (صندوق كنز السلطان الذهبي) - Replaces 🧰
      case 'gift_treasure_chest':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_14px_rgba(234,179,8,0.7)]">
            <defs>
              <linearGradient id="chestWood" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5B21B6" />
                <stop offset="50%" stopColor="#311042" />
                <stop offset="100%" stopColor="#1E0A2A" />
              </linearGradient>
              <linearGradient id="chestGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#FDE047" />
                <stop offset="60%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <radialGradient id="chestTreasureGlow" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FDE047" />
                <stop offset="80%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            {/* Interior Holy Golden Treasure Glow Erupting */}
            <ellipse cx="50" cy="44" rx="34" ry="18" fill="url(#chestTreasureGlow)" className="animate-pulse" />
            {/* Overflowing Diamond & Ruby Jewels */}
            <circle cx="42" cy="42" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="58" cy="40" r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
            <polygon points="50,34 55,42 45,42" fill="#10B981" stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="34,44 40,40 38,48" fill="#FDE047" />
            <polygon points="66,44 60,40 62,48" fill="#FDE047" />
            {/* Golden Coins Spilling Out */}
            <ellipse cx="48" cy="45" rx="5" ry="3" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
            <ellipse cx="54" cy="46" rx="5" ry="3" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
            {/* Open Curved Chest Lid (Perspective Angled Up) */}
            <path d="M12 36 Q50 6, 88 36 L82 22 Q50 -2, 18 22 Z" fill="url(#chestGold)" stroke="#78350F" strokeWidth="1.5" />
            <path d="M16 33 Q50 12, 84 33 L80 24 Q50 4, 20 24 Z" fill="url(#chestWood)" />
            {/* Main Chest Body */}
            <path d="M14 44 L18 88 Q50 94, 82 88 L86 44 Q50 50, 14 44 Z" fill="url(#chestWood)" stroke="#78350F" strokeWidth="1.5" />
            {/* Heavy Gold Corner Brackets & Trim */}
            <path d="M14 44 L18 88 L28 88 L24 45 Z" fill="url(#chestGold)" />
            <path d="M86 44 L82 88 L72 88 L76 45 Z" fill="url(#chestGold)" />
            <path d="M44 47 L44 92 L56 92 L56 47 Z" fill="url(#chestGold)" />
            {/* Giant Jeweled Padlock Hasp */}
            <rect x="43" y="55" width="14" height="18" rx="3" fill="url(#chestGold)" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="50" cy="62" r="3.5" fill="#EF4444" stroke="#FFFBEB" strokeWidth="1" />
            <path d="M50 66 L50 70" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            {/* Side Lifting Ring Handles */}
            <circle cx="15" cy="62" r="4" fill="none" stroke="#FDE047" strokeWidth="2" />
            <circle cx="85" cy="62" r="4" fill="none" stroke="#FDE047" strokeWidth="2" />
          </svg>
        );

      // 3. Shimmering Diamond Waterfall (شلال الألماس البراق) - Replaces 💎
      case 'gift_diamond_rain':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(56,189,248,0.8)]">
            <defs>
              <linearGradient id="diaTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#BAE6FD" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="diaFacet1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="diaFacet2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>
              <linearGradient id="diaFacet3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0C4A6E" />
                <stop offset="100%" stopColor="#7DD3FC" />
              </linearGradient>
            </defs>
            {/* Cosmic Halo Glow */}
            <circle cx="50" cy="50" r="44" fill="#0284C7" opacity="0.25" className="animate-ping" />
            {/* Radiant Starbursts in background */}
            <path d="M50 4 L53 38 L87 50 L53 62 L50 96 L47 62 L13 50 L47 38 Z" fill="#E0F2FE" opacity="0.3" />
            {/* Giant 3D Multifaceted Brilliant Diamond */}
            {/* Crown Facets */}
            <polygon points="26,36 38,18 62,18 74,36" fill="url(#diaTop)" stroke="#FFFFFF" strokeWidth="1" />
            <polygon points="12,36 26,36 38,18" fill="url(#diaFacet1)" stroke="#FFFFFF" strokeWidth="1" />
            <polygon points="74,36 88,36 62,18" fill="url(#diaFacet2)" stroke="#FFFFFF" strokeWidth="1" />
            {/* Pavilion Facets (Bottom Pointed Pyramid) */}
            <polygon points="12,36 26,36 50,88" fill="url(#diaFacet3)" stroke="#BAE6FD" strokeWidth="0.8" />
            <polygon points="26,36 50,36 50,88" fill="url(#diaFacet1)" stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="50,36 74,36 50,88" fill="url(#diaFacet2)" stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="74,36 88,36 50,88" fill="url(#diaFacet3)" stroke="#BAE6FD" strokeWidth="0.8" />
            {/* Table Facet Core Reflection */}
            <polygon points="38,20 62,20 56,32 44,32" fill="#FFFFFF" opacity="0.85" />
            {/* Floating Diamond Sparkle Stars */}
            <polygon points="22,16 24,22 30,24 24,26 22,32 20,26 14,24 20,22" fill="#FFFFFF" />
            <polygon points="82,24 84,28 88,30 84,32 82,36 80,32 76,30 80,28" fill="#FFFFFF" />
            <polygon points="50,68 52,74 58,76 52,78 50,84 48,78 42,76 48,74" fill="#FFFFFF" />
          </svg>
        );

      // 4. Cosmic Spaceship Rocket (صاروخ المجرات الفضائي) - Replaces 🚀
      case 'gift_rocket':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(249,115,22,0.8)]">
            <defs>
              <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#E2E8F0" />
                <stop offset="70%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="rocketGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id="rocketPlasma" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#67E8F9" />
                <stop offset="60%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="flameFire" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#F97316" />
                <stop offset="85%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {/* Plasma Rocket Jet Propulsion Exhaust */}
            <path d="M42 74 Q50 102, 50 102 Q50 102, 58 74 Z" fill="url(#flameFire)" className="animate-pulse" />
            <path d="M45 74 Q50 94, 50 94 Q50 94, 55 74 Z" fill="url(#rocketPlasma)" />
            {/* Swept 3D Quantum Stabilizer Wings */}
            {/* Left Wing */}
            <path d="M30 52 L14 74 L32 72 Z" fill="url(#rocketGoldTrim)" stroke="#78350F" strokeWidth="1" />
            {/* Right Wing */}
            <path d="M70 52 L86 74 L68 72 Z" fill="url(#rocketGoldTrim)" stroke="#78350F" strokeWidth="1" />
            {/* Center Fin */}
            <path d="M48 48 L52 48 L51 72 L49 72 Z" fill="#EF4444" />
            {/* Fuselage 3D Hull */}
            <path d="M50 4 Q68 28, 68 70 L32 70 Q32 28, 50 4 Z" fill="url(#rocketBody)" stroke="#334155" strokeWidth="1.2" />
            {/* Nosecone Shield */}
            <path d="M50 4 Q62 20, 62 26 L38 26 Q38 20, 50 4 Z" fill="url(#rocketGoldTrim)" />
            {/* Jet Engine Thruster Nozzle */}
            <path d="M38 70 L36 76 L64 76 L62 70 Z" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
            {/* Circular Holographic Cockpit Porch */}
            <circle cx="50" cy="38" r="9" fill="#0284C7" stroke="#FDE047" strokeWidth="2" />
            <circle cx="50" cy="38" r="6.5" fill="#38BDF8" />
            <ellipse cx="48" cy="36" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.85" />
            {/* Speed Panel Stripes */}
            <path d="M34 50 L66 50" stroke="#EF4444" strokeWidth="2.5" />
            <path d="M33 58 L67 58" stroke="url(#rocketGoldTrim)" strokeWidth="1.5" />
          </svg>
        );

      // 5. Immortal Golden Phoenix (طائر الفينيق الأسطوري الخالد) - Replaces 🦚
      case 'gift_phoenix':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_18px_rgba(239,68,68,0.85)]">
            <defs>
              <linearGradient id="phxFire" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="20%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F97316" />
                <stop offset="80%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#7F1D1D" />
              </linearGradient>
              <linearGradient id="phxTail" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="75%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {/* Radiant Sun Halo */}
            <circle cx="50" cy="45" r="38" fill="#F97316" opacity="0.2" className="animate-pulse" />
            {/* Flowing Flaming Tail Feathers */}
            <path d="M48 65 Q30 82, 38 98 Q46 86, 50 68 Z" fill="url(#phxTail)" />
            <path d="M52 65 Q70 82, 62 98 Q54 86, 50 68 Z" fill="url(#phxTail)" />
            <path d="M50 66 Q50 86, 50 100 Q50 86, 50 66 Z" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
            {/* Left Flaming Wing (Swept High) */}
            <path d="M50 48 Q20 25, 4 40 Q25 45, 20 60 Q38 52, 50 48 Z" fill="url(#phxFire)" stroke="#FFFBEB" strokeWidth="1" />
            <path d="M50 48 Q30 18, 14 26 Q28 36, 50 48 Z" fill="#FEF08A" />
            {/* Right Flaming Wing */}
            <path d="M50 48 Q80 25, 96 40 Q75 45, 80 60 Q62 52, 50 48 Z" fill="url(#phxFire)" stroke="#FFFBEB" strokeWidth="1" />
            <path d="M50 48 Q70 18, 86 26 Q72 36, 50 48 Z" fill="#FEF08A" />
            {/* Phoenix Majestic Torso */}
            <path d="M50 34 Q57 44, 55 64 Q50 66, 45 64 Q43 44, 50 34 Z" fill="url(#phxFire)" stroke="#FFFBEB" strokeWidth="1.2" />
            {/* Chest Plumage */}
            <path d="M47 44 Q50 48, 53 44 Q50 56, 47 44 Z" fill="#FFFFFF" />
            {/* Phoenix Head with Flaming Crown Crest */}
            <circle cx="50" cy="28" r="8" fill="url(#phxFire)" stroke="#FFFBEB" strokeWidth="1" />
            <polygon points="50,12 53,22 47,22" fill="#FEF08A" />
            <polygon points="46,15 49,24 43,24" fill="#F97316" />
            <polygon points="54,15 57,24 51,24" fill="#F97316" />
            {/* Sharp Golden Beak */}
            <polygon points="44,28 36,31 44,34" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
            {/* Glowing Eye */}
            <circle cx="48" cy="27" r="1.8" fill="#FFFFFF" />
            <circle cx="48" cy="27" r="1" fill="#000000" />
          </svg>
        );

      // 6. Eternal Galaxy Vortex (مجرة النجوم الأبدية) - Replaces 🌌
      case 'gift_galaxy':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_18px_rgba(168,85,247,0.85)]">
            <defs>
              <linearGradient id="galaxyVortex" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="35%" stopColor="#8B5CF6" />
                <stop offset="70%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <radialGradient id="quasarCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="60%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            {/* Dark Space Horizon */}
            <circle cx="50" cy="50" r="44" fill="#090514" stroke="#8B5CF6" strokeWidth="1" />
            {/* Outer Nebula Cloud */}
            <ellipse cx="50" cy="50" rx="42" ry="24" fill="url(#galaxyVortex)" opacity="0.45" transform="rotate(-30 50 50)" />
            <ellipse cx="50" cy="50" rx="38" ry="18" fill="url(#galaxyVortex)" opacity="0.65" transform="rotate(35 50 50)" />
            {/* Spiral Arm 1 */}
            <path d="M50 50 Q65 30, 84 40 Q92 58, 70 75 Q40 88, 20 70" fill="none" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            {/* Spiral Arm 2 */}
            <path d="M50 50 Q35 70, 16 60 Q8 42, 30 25 Q60 12, 80 30" fill="none" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            {/* Golden Stardust Dust Lanes */}
            <path d="M50 50 Q75 60, 88 52" stroke="#FDE047" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M50 50 Q25 40, 12 48" stroke="#FDE047" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Glowing Quasar Supermassive Core */}
            <circle cx="50" cy="50" r="14" fill="url(#quasarCore)" className="animate-pulse" />
            {/* Starburst Points */}
            <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
            <polygon points="50,30 52,46 68,50 52,54 50,70 48,54 32,50 48,46" fill="#FFFFFF" />
            {/* Floating Orbiting Ring */}
            <ellipse cx="50" cy="50" rx="36" ry="10" fill="none" stroke="#FDE047" strokeWidth="1" strokeDasharray="3 3" transform="rotate(-15 50 50)" />
            {/* Orbiting Planets */}
            <circle cx="78" cy="42" r="3.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="22" cy="58" r="2.8" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="0.8" />
          </svg>
        );

      // 7. Mythic Golden Dragon (تنين الذهب الأسطوري) - Replaces 🐉
      case 'gift_dragon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.85)]">
            <defs>
              <linearGradient id="iconDragonGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="iconDragonFire" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
            {/* Serpentine 3D Golden Body S-Loop */}
            <path d="M14 75 Q28 40, 52 58 Q72 74, 82 52" fill="none" stroke="#78350F" strokeWidth="16" strokeLinecap="round" />
            <path d="M14 75 Q28 40, 52 58 Q72 74, 82 52" fill="none" stroke="url(#iconDragonGold)" strokeWidth="12" strokeLinecap="round" />
            {/* Dorsal Spine Ridges */}
            <path d="M16 68 L22 55 L30 64 L40 48 L50 62 L64 50 L74 62" stroke="#FFFBEB" strokeWidth="2.5" fill="none" />
            {/* Golden Dragon Head Profile */}
            <g transform="translate(42, 10)">
              {/* Twin Antler Horns */}
              <path d="M14 20 Q10 -2, -4 -10 Q4 6, 8 20 Z" fill="#FFFBEB" stroke="#78350F" strokeWidth="1" />
              <path d="M22 18 Q26 -4, 18 -14 Q18 4, 18 18 Z" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
              {/* Head Skull */}
              <ellipse cx="22" cy="26" rx="16" ry="13" fill="url(#iconDragonGold)" stroke="#FFFBEB" strokeWidth="1" />
              {/* Snout */}
              <path d="M26 18 L48 24 Q52 28, 48 33 L26 33 Z" fill="url(#iconDragonGold)" stroke="#78350F" strokeWidth="1" />
              <path d="M28 33 L45 35 Q46 39, 40 40 L28 37 Z" fill="#D97706" stroke="#78350F" strokeWidth="0.8" />
              {/* Teeth */}
              <polygon points="32,33 34,30 36,33" fill="#FFFFFF" />
              <polygon points="38,33 40,30 42,33" fill="#FFFFFF" />
              <polygon points="44,33 46,30 48,33" fill="#FFFFFF" />
              {/* Ruby Eye */}
              <circle cx="24" cy="22" r="3.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="0.8" />
              <circle cx="23" cy="21" r="1" fill="#FFFFFF" />
              {/* Whiskers */}
              <path d="M44 28 Q56 22, 64 30" stroke="#FFFBEB" strokeWidth="1.5" fill="none" />
              <path d="M42 32 Q54 40, 62 46" stroke="#FEF08A" strokeWidth="1.2" fill="none" />
              {/* Fire Stream Erupting */}
              <path d="M48 26 Q65 20, 80 14 Q68 32, 78 40 Q58 35, 48 32 Z" fill="url(#iconDragonFire)" opacity="0.9" />
            </g>
          </svg>
        );

      // 8. Royal Golden Falcon (صقر العز والشموخ الملكي) - Replaces 🦅
      case 'gift_falcon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(56,189,248,0.7)]">
            <defs>
              <linearGradient id="iconFalconGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Outspread Majestic Wings */}
            <path d="M50 48 Q20 18, 4 30 Q24 38, 22 55 Q36 48, 50 54 Z" fill="url(#iconFalconGold)" stroke="#FFFBEB" strokeWidth="1" />
            <path d="M50 48 Q80 18, 96 30 Q76 38, 78 55 Q64 48, 50 54 Z" fill="url(#iconFalconGold)" stroke="#FFFBEB" strokeWidth="1" />
            {/* Tail Fan */}
            <polygon points="50,62 38,88 62,88" fill="#B45309" stroke="#FEF08A" strokeWidth="1" />
            {/* Falcon Torso */}
            <ellipse cx="50" cy="54" rx="14" ry="18" fill="url(#iconFalconGold)" stroke="#FFFBEB" strokeWidth="1" />
            {/* Golden Talons clutching Jewel */}
            <circle cx="50" cy="74" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
            <path d="M44 70 L48 74 M56 70 L52 74" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
            {/* Falcon Head & Crown */}
            <circle cx="50" cy="32" r="11" fill="url(#iconFalconGold)" stroke="#FFFBEB" strokeWidth="1" />
            <polygon points="50,18 53,24 57,20 54,26 46,26 43,20 47,24" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
            {/* Curved Predator Beak */}
            <path d="M44 32 Q34 35, 34 42 Q40 38, 44 38 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
            {/* Piercing Amber Eye */}
            <circle cx="48" cy="30" r="3" fill="#1C1917" stroke="#FEF08A" strokeWidth="1" />
            <circle cx="48" cy="30" r="1.8" fill="#F59E0B" />
            <circle cx="47.5" cy="29.5" r="0.8" fill="#FFFFFF" />
          </svg>
        );

      // 9. Royal Desert Lion (أسد الصحراء الملكي) - Replaces 🦁
      case 'gift_lion':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.8)]">
            <defs>
              <linearGradient id="lionMane" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Majestic Sunburst Golden Mane */}
            <path d="M50 14 L56 24 L68 18 L70 30 L82 28 L80 40 L90 44 L84 54 L92 62 L82 68 L86 78 L74 80 L72 90 L60 88 L54 96 L46 96 L40 88 L28 90 L26 80 L14 78 L18 68 L8 62 L16 54 L10 44 L20 40 L18 28 L30 30 L32 18 L44 24 Z" fill="url(#lionMane)" stroke="#FFFBEB" strokeWidth="1" />
            {/* Lion Head */}
            <ellipse cx="50" cy="54" rx="20" ry="18" fill="#FDE047" stroke="#92400E" strokeWidth="1.5" />
            {/* Royal Crown */}
            <polygon points="50,22 56,32 64,28 60,36 40,36 36,28 44,32" fill="#FFFBEB" stroke="#78350F" strokeWidth="1" />
            <circle cx="50" cy="24" r="2" fill="#EF4444" />
            {/* Emerald Eyes */}
            <ellipse cx="42" cy="48" rx="3.5" ry="2.5" fill="#10B981" stroke="#000" strokeWidth="0.8" />
            <ellipse cx="58" cy="48" rx="3.5" ry="2.5" fill="#10B981" stroke="#000" strokeWidth="0.8" />
            {/* Muzzle & Nose */}
            <ellipse cx="50" cy="58" rx="8" ry="6" fill="#FFFBEB" />
            <polygon points="50,56 46,52 54,52" fill="#451A03" />
          </svg>
        );

      // 10. Billionaire Yacht (يخت الملياردير الملكي) - Replaces 🛥️
      case 'gift_yacht':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(6,182,212,0.8)]">
            <defs>
              <linearGradient id="yachtHull" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            {/* Ocean Waves */}
            <path d="M6 82 Q30 76, 50 82 Q70 88, 94 82 L94 94 L6 94 Z" fill="#0284C7" opacity="0.8" />
            <path d="M10 85 Q35 90, 60 85 Q80 80, 90 85" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
            {/* Sleek Mega-Yacht Hull */}
            <path d="M12 76 L22 60 L86 60 Q94 74, 76 76 Z" fill="url(#yachtHull)" stroke="#0284C7" strokeWidth="1" />
            {/* Gold Waterline Stripe */}
            <path d="M14 74 L78 74" stroke="#F59E0B" strokeWidth="2" />
            {/* Multi-Deck Bridge & Superstructure */}
            <path d="M30 60 L36 46 L72 46 L76 60 Z" fill="#FFFFFF" stroke="#64748B" strokeWidth="0.8" />
            <path d="M42 46 L46 34 L66 34 L70 46 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="0.8" />
            {/* Tinted Panoramic Windows */}
            <rect x="40" y="50" width="30" height="5" rx="1.5" fill="#0284C7" opacity="0.8" />
            <rect x="48" y="38" width="16" height="4" rx="1" fill="#0284C7" opacity="0.8" />
            {/* Radar Mast & Helipad */}
            <line x1="56" y1="34" x2="56" y2="24" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="28" cy="58" r="4" fill="none" stroke="#F59E0B" strokeWidth="1" />
          </svg>
        );

      // 11. Golden Palace Castle (قصر الأساطير الذهبي) - Replaces 🏰
      case 'gift_castle':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.8)]">
            <defs>
              <linearGradient id="palaceGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
            </defs>
            {/* Central Giant Onion Dome */}
            <path d="M40 38 Q36 20, 50 10 Q64 20, 60 38 Z" fill="url(#palaceGold)" stroke="#FFFBEB" strokeWidth="1" />
            <circle cx="50" cy="8" r="2.5" fill="#EF4444" />
            {/* Side Towers & Minaret Domes */}
            <path d="M18 48 Q15 34, 24 26 Q33 34, 30 48 Z" fill="url(#palaceGold)" />
            <path d="M70 48 Q67 34, 76 26 Q85 34, 82 48 Z" fill="url(#palaceGold)" />
            {/* Main Palace Walls & Ramparts */}
            <rect x="34" y="38" width="32" height="48" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
            <rect x="18" y="48" width="16" height="38" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
            <rect x="66" y="48" width="16" height="38" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
            {/* Grand Horseshoe Arch Portal Gate */}
            <path d="M42 86 L42 66 Q50 56, 58 66 L58 86 Z" fill="#1E1B4B" stroke="#F59E0B" strokeWidth="1.5" />
            {/* Moorish Windows */}
            <path d="M46 48 Q50 42, 54 48 L54 54 L46 54 Z" fill="#0284C7" />
          </svg>
        );

      // 12. Golden Supercar (سيارة سوبركار ذهبية) - Replaces 🏎️
      case 'gift_supercar':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(249,115,22,0.8)]">
            <defs>
              <linearGradient id="carGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Aerodynamic Body Shell */}
            <path d="M8 68 L18 56 Q36 40, 62 42 L84 54 L92 64 L86 72 L12 72 Z" fill="url(#carGold)" stroke="#78350F" strokeWidth="1" />
            {/* Cockpit Canopy Glass */}
            <path d="M34 52 L42 43 L62 44 L72 52 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
            {/* Laser Headlights */}
            <polygon points="86,58 92,62 86,64" fill="#38BDF8" className="animate-pulse" />
            {/* Golden Wheels & Calipers */}
            <circle cx="26" cy="72" r="10" fill="#0F172A" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="26" cy="72" r="5" fill="#FDE047" />
            <circle cx="74" cy="72" r="10" fill="#0F172A" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="74" cy="72" r="5" fill="#FDE047" />
            {/* Rear Carbon Wing */}
            <path d="M10 52 L22 52 L20 56 L12 56 Z" fill="#0F172A" />
          </svg>
        );

      // 13. Private Jet (طائرة خاصة نفاثة) - Replaces ✈️
      case 'gift_jet':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(56,189,248,0.7)]">
            <defs>
              <linearGradient id="jetBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>
            {/* Swept Wings */}
            <polygon points="50,44 6,66 22,68 50,56" fill="#0284C7" />
            <polygon points="50,44 94,66 78,68 50,56" fill="#0284C7" />
            {/* Jet Fuselage */}
            <path d="M50 8 Q60 30, 58 84 L42 84 Q40 30, 50 8 Z" fill="url(#jetBody)" stroke="#0284C7" strokeWidth="1" />
            {/* Cockpit Windshield */}
            <ellipse cx="50" cy="24" rx="6" ry="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
            {/* Twin Rear Jet Engines */}
            <rect x="36" y="66" width="6" height="16" rx="2" fill="#F59E0B" />
            <rect x="58" y="66" width="6" height="16" rx="2" fill="#F59E0B" />
            {/* Tail Fin */}
            <polygon points="50,68 47,88 53,88" fill="#F59E0B" />
          </svg>
        );

      // 14. Diamond Crown (تاج الملوك الألماسي) - Replaces 👑
      case 'gift_crown_jewel':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.85)]">
            <defs>
              <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Crown Base Band */}
            <rect x="18" y="68" width="64" height="12" rx="3" fill="url(#crownGold)" stroke="#78350F" strokeWidth="1.2" />
            {/* Band Embedded Jewels */}
            <circle cx="28" cy="74" r="3" fill="#EF4444" stroke="#FFFBEB" strokeWidth="0.8" />
            <circle cx="39" cy="74" r="3" fill="#38BDF8" stroke="#FFFBEB" strokeWidth="0.8" />
            <circle cx="50" cy="74" r="3.5" fill="#10B981" stroke="#FFFBEB" strokeWidth="0.8" />
            <circle cx="61" cy="74" r="3" fill="#38BDF8" stroke="#FFFBEB" strokeWidth="0.8" />
            <circle cx="72" cy="74" r="3" fill="#EF4444" stroke="#FFFBEB" strokeWidth="0.8" />
            {/* Crown Spires (5 Royal Peaks) */}
            <polygon points="18,68 14,38 28,52 38,30 50,50 62,30 72,52 86,38 82,68" fill="url(#crownGold)" stroke="#78350F" strokeWidth="1.2" />
            {/* Top Jewels on Peaks */}
            <circle cx="14" cy="36" r="3.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="38" cy="28" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="50" cy="18" r="5.5" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.2" />
            <polygon points="50,8 52,14 58,16 52,18 50,24 48,18 42,16 48,14" fill="#FFFFFF" />
            <circle cx="62" cy="28" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="86" cy="36" r="3.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
          </svg>
        );

      // 15. Arabian Stallion Horse (خيل عربي أصيل) - Replaces 🐎
      case 'gift_horse':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.7)]">
            <defs>
              <linearGradient id="horseGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>
            {/* Rearing Arabian Horse Silhouette in 24k Gold */}
            <path d="M45 88 L48 70 Q58 60, 68 55 Q76 45, 68 30 L60 14 Q52 16, 44 26 L36 32 Q26 30, 20 38 Q22 46, 32 44 L38 52 L30 76 L26 88 Z" fill="url(#horseGold)" stroke="#FFFBEB" strokeWidth="1.2" />
            {/* Golden Flowing Mane */}
            <path d="M60 16 Q68 24, 64 36 Q72 44, 62 54" stroke="#FEF08A" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Flowing Tail */}
            <path d="M44 72 Q36 82, 32 94" stroke="#FEF08A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Ruby Harness */}
            <circle cx="34" cy="36" r="2.5" fill="#EF4444" />
          </svg>
        );

      // 16. Golden Damascus Sword (سيف دمشقي مذهب) - Replaces ⚔️
      case 'gift_sword':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.8)]">
            {/* Crossed Curved Scimitars */}
            {/* Sword 1 */}
            <path d="M20 80 L32 68 L76 20 Q88 12, 84 28 L40 72 L28 84 Z" fill="#E2E8F0" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="20" y1="80" x2="14" y2="86" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
            <circle cx="14" cy="86" r="3" fill="#EF4444" />
            {/* Sword 2 */}
            <path d="M80 80 L68 68 L24 20 Q12 12, 16 28 L60 72 L72 84 Z" fill="#CBD5E1" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="80" y1="80" x2="86" y2="86" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
            <circle cx="86" cy="86" r="3" fill="#EF4444" />
            {/* Center Golden Shield Emblem */}
            <circle cx="50" cy="50" r="10" fill="#F59E0B" stroke="#FFFBEB" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="5" fill="#EF4444" />
          </svg>
        );

      // 17. Royal Ruby Ring (خاتم ياقوت ملكي) - Replaces 💍
      case 'gift_ring':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(239,68,68,0.8)]">
            {/* Platinum/Gold Ring Band */}
            <circle cx="50" cy="62" r="26" fill="none" stroke="#F59E0B" strokeWidth="6" />
            <circle cx="50" cy="62" r="26" fill="none" stroke="#FEF08A" strokeWidth="3" />
            {/* Cushion-Cut Glowing Pigeon-Blood Ruby Gem */}
            <polygon points="50,14 66,26 50,38 34,26" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="50,18 60,26 50,34 40,26" fill="#DC2626" />
            <circle cx="48" cy="24" r="2" fill="#FFFFFF" />
            {/* Side Diamond Accents */}
            <circle cx="32" cy="34" r="3" fill="#38BDF8" stroke="#FFF" strokeWidth="0.8" />
            <circle cx="68" cy="34" r="3" fill="#38BDF8" stroke="#FFF" strokeWidth="0.8" />
          </svg>
        );

      // 18. Golden Dallah Coffee Pot (دلة رسلان الذهبية) - Replaces 🫖
      case 'gift_dallah':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.8)]">
            <defs>
              <linearGradient id="dallahGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Pointed Finial Lid */}
            <polygon points="50,6 54,20 46,20" fill="url(#dallahGold)" stroke="#78350F" strokeWidth="1" />
            <ellipse cx="50" cy="22" rx="10" ry="3" fill="url(#dallahGold)" />
            {/* Tall Elegant Slender Neck */}
            <path d="M45 22 L44 42 L56 42 L55 22 Z" fill="url(#dallahGold)" stroke="#78350F" strokeWidth="1" />
            {/* Curving Spout */}
            <path d="M44 38 Q22 30, 20 18 Q26 28, 44 44 Z" fill="url(#dallahGold)" stroke="#78350F" strokeWidth="1" />
            {/* Bulbous Body */}
            <path d="M44 42 Q32 60, 36 78 L64 78 Q68 60, 56 42 Z" fill="url(#dallahGold)" stroke="#78350F" strokeWidth="1.2" />
            {/* Wide Flared Base */}
            <path d="M34 78 L30 88 L70 88 L66 78 Z" fill="url(#dallahGold)" stroke="#78350F" strokeWidth="1" />
            {/* Elegant Arched Handle */}
            <path d="M56 32 Q80 40, 76 68 Q70 76, 62 76" fill="none" stroke="url(#dallahGold)" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        );

      // 19. Royal Oud Wood & Incense (دهن عود ملكي) - Replaces 🪵
      case 'gift_oud':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.7)]">
            {/* Luxury Crystal Flacon Bottle */}
            <rect x="34" y="38" width="32" height="46" rx="6" fill="#1C1917" stroke="#F59E0B" strokeWidth="2" />
            {/* Golden Pure Aged Agarwood Oil Inside */}
            <rect x="38" y="46" width="24" height="34" rx="4" fill="#B45309" opacity="0.9" />
            <rect x="42" y="50" width="16" height="26" fill="#F59E0B" opacity="0.7" />
            {/* Golden Filigree Stopper */}
            <rect x="44" y="26" width="12" height="12" rx="2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <circle cx="50" cy="18" r="8" fill="#F59E0B" stroke="#FFFBEB" strokeWidth="1.5" />
            {/* Fragrant Incense Swirls */}
            <path d="M50 10 Q40 4, 52 0" stroke="#E2E8F0" strokeWidth="1.5" fill="none" opacity="0.6" />
          </svg>
        );

      // 20. Royal Perfume (دهن مسك وعنبر) - Replaces 🧪
      case 'gift_perfume':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(236,72,153,0.7)]">
            {/* Faceted Crystal Flask */}
            <polygon points="50,30 74,45 68,84 32,84 26,45" fill="#F472B6" opacity="0.8" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="50,35 68,48 62,80 38,80 32,48" fill="#DB2777" />
            {/* Golden Atomizer Bulb & Sprayer */}
            <rect x="46" y="20" width="8" height="10" fill="#F59E0B" />
            <circle cx="36" cy="18" r="6" fill="#F43F5E" />
            <path d="M46 22 L36 18" stroke="#F59E0B" strokeWidth="2" />
          </svg>
        );

      // 21. Golden Hookah Shisha (شيشة ديوان ذهبية) - Replaces 💨
      case 'gift_shisha':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.7)]">
            {/* Carved Bohemian Glass Base */}
            <ellipse cx="50" cy="74" rx="24" ry="16" fill="#0284C7" stroke="#F59E0B" strokeWidth="2" opacity="0.85" />
            {/* Golden Brass Stem */}
            <rect x="47" y="28" width="6" height="42" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            {/* Clay Charcoal Bowl & Golden Tray */}
            <ellipse cx="50" cy="28" rx="16" ry="4" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
            <polygon points="44,28 42,16 58,16 56,28" fill="#EF4444" />
            <circle cx="50" cy="14" r="3" fill="#F97316" className="animate-ping" />
            {/* Hookah Hose */}
            <path d="M54 50 Q84 56, 76 80" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        );

      // 22. Royal Crimson Rose (وردة جورية ملكية) - Replaces 🌹
      case 'gift_rose':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(239,68,68,0.85)]">
            {/* Stem & Leaves */}
            <path d="M50 56 Q48 76, 42 94" stroke="#15803D" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M46 72 Q30 68, 32 60 Q44 62, 46 72 Z" fill="#22C55E" />
            <path d="M46 80 Q64 78, 62 70 Q50 72, 46 80 Z" fill="#22C55E" />
            {/* Layered Velvet Rose Petals in 3D */}
            <circle cx="50" cy="40" r="22" fill="#991B1B" stroke="#FDE047" strokeWidth="0.8" />
            <path d="M34 40 Q32 20, 50 20 Q68 20, 66 40 Q50 62, 34 40 Z" fill="#DC2626" />
            <path d="M40 38 Q42 26, 50 26 Q58 26, 60 38 Q50 54, 40 38 Z" fill="#EF4444" />
            {/* Rose Core Spiral with Gold Tips */}
            <ellipse cx="50" cy="36" rx="5" ry="4" fill="#FEF08A" />
          </svg>
        );

      // 23. Royal Dates Platter (رطب سكري ملكي) - Replaces 🌴
      case 'gift_dates':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.7)]">
            {/* Silver/Gold Filigree Serving Platter */}
            <ellipse cx="50" cy="68" rx="36" ry="16" fill="#FDE047" stroke="#B45309" strokeWidth="2" />
            <ellipse cx="50" cy="66" rx="32" ry="13" fill="#FFFBEB" />
            {/* Cluster of Rich Glistening Golden-Amber Dates */}
            <ellipse cx="40" cy="60" rx="9" ry="6" fill="#78350F" transform="rotate(-15 40 60)" />
            <ellipse cx="50" cy="56" rx="9" ry="6" fill="#92400E" transform="rotate(10 50 56)" />
            <ellipse cx="60" cy="60" rx="9" ry="6" fill="#78350F" transform="rotate(25 60 60)" />
            <ellipse cx="45" cy="52" rx="8" ry="5.5" fill="#B45309" transform="rotate(-5 45 52)" />
            <ellipse cx="55" cy="52" rx="8" ry="5.5" fill="#92400E" transform="rotate(15 55 52)" />
            <ellipse cx="50" cy="46" rx="7" ry="5" fill="#F59E0B" />
          </svg>
        );

      // 24. Arabic Coffee Cup (فنجان قهوة عربية) - Replaces ☕
      case 'gift_coffee':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.7)]">
            {/* Handleless Fine Bone China Fenjan with Gold Rim */}
            <path d="M26 40 L34 76 Q50 84, 66 76 L74 40 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
            {/* Rim Band */}
            <ellipse cx="50" cy="40" rx="24" ry="7" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
            {/* Golden Cardamom Coffee Liquid Surface */}
            <ellipse cx="50" cy="41" rx="21" ry="5" fill="#78350F" />
            <ellipse cx="50" cy="42" rx="14" ry="3" fill="#B45309" opacity="0.8" />
            {/* Royal Arabesque Motif on Cup */}
            <circle cx="50" cy="62" r="5" fill="#F59E0B" />
            {/* Steaming Aroma */}
            <path d="M46 32 Q42 20, 48 10" stroke="#FEF08A" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M54 30 Q58 18, 52 8" stroke="#FEF08A" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />
          </svg>
        );

      // 25. Pulsing Crystal Ruby Heart (قلب حب متوهج) - Replaces 💖
      case 'gift_heart':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_18px_rgba(244,63,94,0.85)]">
            {/* Halo Burst */}
            <circle cx="50" cy="48" r="36" fill="#FB7185" opacity="0.25" className="animate-ping" />
            {/* 3D Multifaceted Glowing Ruby Heart */}
            <path d="M50 84 L20 54 Q10 40, 22 24 Q36 14, 50 34 Q64 14, 78 24 Q90 40, 80 54 Z" fill="#E11D48" stroke="#FFFBEB" strokeWidth="1.5" />
            <path d="M50 80 L24 54 Q16 42, 26 28 Q38 18, 50 36 Q62 18, 74 28 Q84 42, 76 54 Z" fill="#F43F5E" />
            <polygon points="50,38 36,48 50,74 64,48" fill="#FDA4AF" opacity="0.6" />
            {/* Highlight Sparkles */}
            <circle cx="34" cy="28" r="3.5" fill="#FFFFFF" />
            <circle cx="38" cy="34" r="1.5" fill="#FFFFFF" />
          </svg>
        );

      // 26. Cosmic Meteor (نيزك كوني متفجر) - Replaces ☄️
      case 'gift_meteor':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_18px_rgba(249,115,22,0.9)]">
            {/* Fiery Trail Stream */}
            <polygon points="78,14 88,24 40,78 30,68" fill="#F97316" opacity="0.7" />
            <polygon points="84,10 92,18 48,72 40,64" fill="#FDE047" opacity="0.9" />
            {/* Glowing Molten Asteroid Core */}
            <circle cx="34" cy="74" r="18" fill="#78350F" stroke="#F97316" strokeWidth="2" />
            <circle cx="34" cy="74" r="14" fill="#EA580C" />
            <circle cx="32" cy="72" r="8" fill="#FDE047" />
            {/* Magma Fissures */}
            <path d="M24 70 L34 74 L44 68 M30 80 L36 74 L40 82" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      // 27. Emerald & Ruby Bouquet (باقة الياقوت والزمرد الملكية) - Replaces 💐
      case 'gift_emerald_bouquet':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(16,185,129,0.8)]">
            {/* Golden Cone Wrapper */}
            <polygon points="50,88 30,52 70,52" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <polygon points="50,84 34,54 66,54" fill="#FEF08A" opacity="0.8" />
            {/* Ruby & Emerald Crystal Blossoms */}
            <circle cx="38" cy="44" r="10" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="62" cy="44" r="10" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="50" cy="34" r="12" fill="#059669" stroke="#FFFBEB" strokeWidth="1.2" />
            <circle cx="50" cy="44" r="7" fill="#FDE047" />
            {/* Sparkle Glint */}
            <circle cx="48" cy="30" r="2" fill="#FFFFFF" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${currentSize} ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Specular Shadow Base */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-black/40 pointer-events-none" />
      {renderArtifact()}
    </div>
  );
};
