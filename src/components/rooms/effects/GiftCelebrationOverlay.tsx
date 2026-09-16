import React, { useEffect } from 'react';
import { Gift, UserProfile } from '../../../types';
import { AvatarWithFrame } from '../../common/AvatarWithFrame';
import { X, Gift as GiftIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

    // Silent - no sounds as requested
    // Fast & responsive display duration (2.2 seconds) to reduce wait time
    const timer = setTimeout(() => {
      onDismiss();
    }, 2200);

    return () => clearTimeout(timer);
  }, [activeGiftEvent, onDismiss]);

  if (!activeGiftEvent) return null;

  const { gift, sender, receiver, comboCount } = activeGiftEvent;

  return (
    <AnimatePresence>
      <motion.div
        key={activeGiftEvent.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.08 }}
        onClick={onDismiss}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 pt-12 pb-6 overflow-y-auto bg-black/60 backdrop-blur-md cursor-pointer select-none"
      >
        {/* Top Close Button - with safe area clearance */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute top-4 left-4 p-2.5 rounded-full bg-zinc-900/95 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 shadow-2xl z-50 cursor-pointer transition-all active:scale-95"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main Card Container - Ultra-Fast Pop-In Entry */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 500, mass: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col items-center justify-center max-w-md w-full text-center pointer-events-auto my-auto"
        >
          {/* Symmetrical & Crystal Clear Banner: Sender & Receiver */}
          <div className="w-full bg-zinc-950/90 backdrop-blur-xl rounded-2xl border border-amber-500/40 p-3 sm:p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] mb-2">
            <div className="flex items-center justify-between gap-2">
              {/* Sender (المرسل) */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <AvatarWithFrame user={sender} size="sm" showCrown={false} />
                <div className="text-right min-w-0 flex-1">
                  <span className="text-[10px] text-amber-400 font-bold block leading-none mb-1">
                    المرسل
                  </span>
                  <span
                    className="text-xs sm:text-sm font-extrabold text-white truncate block max-w-[110px] sm:max-w-[135px]"
                    title={sender.nickname}
                  >
                    {sender.nickname}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-medium truncate block leading-none mt-0.5">
                    {sender.role === 'owner'
                      ? 'المالك'
                      : sender.vipTier !== 'none'
                      ? `VIP ${sender.vipTier.toUpperCase()}`
                      : 'عضو'}
                  </span>
                </div>
              </div>

              {/* Transit Gift Indicator (الوسط) */}
              <div className="flex flex-col items-center justify-center px-1.5 shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/25 to-rose-500/25 border border-amber-400/50 flex items-center justify-center shadow-inner">
                  <GiftIcon className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-[9px] font-black text-amber-300 mt-1 whitespace-nowrap">
                  أهدى إلى
                </span>
              </div>

              {/* Receiver (المستلم) */}
              <div className="flex items-center gap-2 flex-row-reverse min-w-0 flex-1 text-left">
                <AvatarWithFrame user={receiver} size="sm" showCrown={false} />
                <div className="text-left min-w-0 flex-1">
                  <span className="text-[10px] text-rose-400 font-bold block leading-none mb-1">
                    المستلم
                  </span>
                  <span
                    className="text-xs sm:text-sm font-extrabold text-white truncate block max-w-[110px] sm:max-w-[135px]"
                    title={receiver.nickname}
                  >
                    {receiver.nickname}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-medium truncate block leading-none mt-0.5">
                    {receiver.role === 'owner'
                      ? 'المالك'
                      : receiver.vipTier !== 'none'
                      ? `VIP ${receiver.vipTier.toUpperCase()}`
                      : 'عضو'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero: Large Gift Shape with fast entry & energetic pulse animation */}
          <div className="relative my-1 flex flex-col items-center justify-center">
            {/* Pulsing gentle backdrop glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.45, 0.2],
              }}
              transition={{
                duration: 1.0,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-amber-500/20 blur-3xl -z-10 pointer-events-none"
            />

            {/* Pulsing Gift Shape Wrapper */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative flex items-center justify-center gift-fast-entry transition-transform duration-150"
            >
              {gift.icon && (gift.icon.startsWith('/') || gift.icon.startsWith('http')) ? (
                <img
                  src={gift.icon}
                  alt={gift.nameAr}
                  className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 max-h-[38vh] object-contain filter drop-shadow-[0_16px_35px_rgba(0,0,0,0.9)]"
                />
              ) : (
                <div className="text-7xl sm:text-8xl md:text-9xl filter drop-shadow-[0_16px_35px_rgba(0,0,0,0.9)] select-none">
                  {gift.icon}
                </div>
              )}

              {/* Combo Multiplier Badge if sent multiple times */}
              {comboCount > 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
                  className="absolute -bottom-2 right-2 sm:right-4 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs sm:text-sm tracking-wider shadow-2xl border-2 border-yellow-200 flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5 fill-zinc-950" />
                  <span>COMBO x{comboCount}</span>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Gift Name & Coin Value */}
          <div className="mt-1 flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
              {gift.nameAr}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-700/60 text-xs font-bold text-amber-300 shadow-lg">
              <span>{gift.coins * comboCount} كوينز</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 font-normal">انقر في أي مكان للإغلاق</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
