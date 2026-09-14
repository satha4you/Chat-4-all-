import React, { useEffect } from 'react';
import { Gift, UserProfile } from '../../../types';
import { AvatarWithFrame } from '../../common/AvatarWithFrame';
import { VIPBadge } from '../../common/VIPBadge';
import { VIPName } from '../../common/VIPName';
import { getGiftEffectConfig } from '../../../utils/giftEffects';
import { GiftParticleCanvas } from './GiftParticleCanvas';
import { GiftSceneAnimation } from './GiftSceneAnimation';
import { GoldenDragonEffect } from './GoldenDragonEffect';
import { RoyalFalconEffect } from './RoyalFalconEffect';
import { Sparkles, Crown, X, Heart, Zap } from 'lucide-react';

export interface ActiveGiftEvent {
  id: string;
  gift: Gift;
  sender: UserProfile;
  receiver: UserProfile;
  comboCount: number;
  timestamp: number;
}

interface GiftCelebrationOverlayProps {
  activeGiftEvent: ActiveGiftEvent | null;
  onDismiss: () => void;
}

export const GiftCelebrationOverlay: React.FC<GiftCelebrationOverlayProps> = ({
  activeGiftEvent,
  onDismiss,
}) => {
  useEffect(() => {
    if (!activeGiftEvent) return;

    // High value dragon/falcon gets 5 seconds to complete cinematic screen flight
    const isHighValue =
      activeGiftEvent.gift.coins >= 1200 ||
      activeGiftEvent.gift.id === 'gift_dragon' ||
      activeGiftEvent.gift.id === 'gift_falcon';
    const duration = isHighValue ? 5000 : 4200;

    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [activeGiftEvent, onDismiss]);

  if (!activeGiftEvent) return null;

  const { gift, sender, receiver, comboCount } = activeGiftEvent;
  const config = getGiftEffectConfig(gift.id);

  // Check if this high value gift activates the Golden Dragon effect
  const isDragon =
    gift.id === 'gift_dragon' ||
    gift.animationType === 'dragon' ||
    gift.coins >= 25000 ||
    ['gift_galaxy', 'gift_phoenix', 'gift_rocket', 'gift_golden_throne', 'gift_meteor', 'gift_lion'].includes(gift.id);

  // Check if this high value gift activates the Royal Golden Falcon effect
  const isFalcon =
    !isDragon &&
    (gift.id === 'gift_falcon' ||
      gift.animationType === 'falcon' ||
      (gift.coins >= 1200 && gift.coins < 25000));

  // 1. High-Value Mythic Golden Dragon Visual Effect
  if (isDragon) {
    return (
      <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none select-none">
        {/* Close Button at top left */}
        <button
          onClick={onDismiss}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-black/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-amber-500/50 shadow-lg z-50 pointer-events-auto cursor-pointer transition-colors"
          title="إغلاق التأثير"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Golden Particle Canvas */}
        <GiftParticleCanvas
          isActive={!!activeGiftEvent}
          config={{
            ...config,
            colors: ['#FFDF00', '#F59E0B', '#EF4444', '#FFFFFF'],
          }}
          durationMs={4800}
        />

        {/* Golden Dragon Component Traversing Screen */}
        <GoldenDragonEffect event={activeGiftEvent} />
      </div>
    );
  }

  // 2. High-Value Royal Falcon Visual Effect
  if (isFalcon) {
    return (
      <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none select-none">
        {/* Close Button at top left */}
        <button
          onClick={onDismiss}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-black/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-cyan-400/50 shadow-lg z-50 pointer-events-auto cursor-pointer transition-colors"
          title="إغلاق التأثير"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Falcon Sparkle Particle Canvas */}
        <GiftParticleCanvas
          isActive={!!activeGiftEvent}
          config={{
            ...config,
            colors: ['#38BDF8', '#F59E0B', '#FFFBEB', '#FFD700'],
          }}
          durationMs={4600}
        />

        {/* Royal Falcon Component Soaring Across Screen */}
        <RoyalFalconEffect event={activeGiftEvent} />
      </div>
    );
  }

  // 3. Standard & Other Themed Gifts (Center Card + Particles)

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 overflow-hidden pointer-events-none select-none">
      
      {/* 0. Full-Screen Interactive Themed Scene Animation */}
      <GiftSceneAnimation gift={gift} comboCount={comboCount} />

      {/* 1. Dynamic Particle Canvas (Sparkles, floating emojis, stars) */}
      <GiftParticleCanvas
        isActive={!!activeGiftEvent}
        config={config}
        durationMs={4200}
      />

      {/* 2. Ambient radial background glow */}
      <div
        className="absolute w-[360px] h-[360px] md:w-[500px] md:h-[500px] rounded-full blur-[90px] opacity-40 animate-pulse pointer-events-none"
        style={{ backgroundColor: config.colors[0] }}
      />

      {/* 3. Main Center Floating Celebration Card */}
      <div className="relative pointer-events-auto max-w-md w-full animate-in zoom-in-75 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute -top-3 -left-3 p-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 shadow-lg z-20 cursor-pointer transition-colors"
          title="إغلاق التأثير"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Card Container */}
        <div
          className="relative rounded-3xl p-5 md:p-6 overflow-hidden backdrop-blur-xl border shadow-2xl text-center"
          style={{
            backgroundColor: 'rgba(10, 10, 14, 0.88)',
            borderColor: config.colors[0],
            boxShadow: `0 0 35px ${config.borderGlowColor}`,
          }}
        >
          {/* Subtle rotating ray aura behind gift */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div
              className="w-80 h-80 rounded-full animate-spin [animation-duration:18s]"
              style={{
                background: `conic-gradient(from 0deg, ${config.colors[0]}, transparent, ${config.colors[1] || '#FFFFFF'}, transparent, ${config.colors[0]})`,
              }}
            />
          </div>

          {/* Top Tag / Rarity Banner */}
          <div className="relative z-10 flex items-center justify-center gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-black text-white shadow-lg bg-gradient-to-r ${config.rarityBadgeBg} flex items-center gap-1.5`}
            >
              <Crown className="w-3 h-3 text-yellow-300" />
              <span>{config.rarityLabelAr}</span>
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </span>

            {comboCount > 1 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black tracking-wider animate-pulse flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>COMBO x{comboCount}</span>
              </span>
            )}
          </div>

          {/* Sender & Receiver Presentation */}
          <div className="relative z-10 flex items-center justify-between gap-2 px-2 py-2 mb-4 bg-zinc-950/60 rounded-2xl border border-zinc-800/80">
            {/* Sender */}
            <div className="flex items-center gap-2 text-right min-w-0">
              <AvatarWithFrame user={sender} size="sm" showCrown={true} />
              <div className="min-w-0">
                <span className="text-[10px] text-zinc-400 block font-bold">المرسل</span>
                <VIPName user={sender} size="xs" />
              </div>
            </div>

            {/* Glowing Transfer Arrow / Heart */}
            <div className="flex flex-col items-center px-2">
              <div className="p-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
            </div>

            {/* Receiver */}
            <div className="flex items-center gap-2 text-left flex-row-reverse min-w-0">
              <AvatarWithFrame user={receiver} size="sm" showCrown={true} />
              <div className="min-w-0 text-left">
                <span className="text-[10px] text-zinc-400 block font-bold">المستلم</span>
                <VIPName user={receiver} size="xs" />
              </div>
            </div>
          </div>

          {/* Huge Animated Gift Icon in Center */}
          <div className="relative z-10 my-3 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Outer Pulsing Glow */}
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-60 animate-ping"
                style={{ backgroundColor: config.colors[0] }}
              />
              
              {/* Large Gift Icon */}
              <div className="relative text-7xl md:text-8xl transform hover:scale-110 transition-transform duration-300 animate-bounce">
                {gift.icon}
              </div>
            </div>

            {/* Gift Title & Value */}
            <h3 className="text-lg md:text-xl font-black text-white mt-3 tracking-wide drop-shadow-md">
              {gift.nameAr}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                القيمة: {gift.coins * comboCount} 🪙
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                ({gift.rarity.toUpperCase()})
              </span>
            </div>
          </div>

          {/* Bottom Interactive Notice */}
          <p className="relative z-10 text-[10px] text-zinc-400 mt-2">
            تم إطلاق التأثيرات البصرية الخاصة وقصاصات الورق الملون في أرجاء الغرفة ✨
          </p>
        </div>
      </div>
    </div>
  );
};
