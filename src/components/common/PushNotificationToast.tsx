import React, { useEffect, useState } from 'react';
import { PushNotification, PushNotificationColor } from '../../types';
import { Bell, Crown, Sparkles, X, Volume2, ShieldCheck, Flame } from 'lucide-react';

interface PushNotificationToastProps {
  notification: PushNotification | null;
  onDismiss: () => void;
  isMobileShell?: boolean;
}

const COLOR_STYLES: Record<
  PushNotificationColor,
  {
    gradient: string;
    border: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
    iconColor: string;
    progressBar: string;
    titleColor: string;
  }
> = {
  royal_gold: {
    gradient: 'from-[#2A1B04] via-[#1F1403] to-[#120B02]',
    border: 'border-amber-400/60',
    glow: 'shadow-[0_10px_35px_rgba(245,158,11,0.35)]',
    badgeBg: 'bg-amber-500/25 border-amber-400/50',
    badgeText: 'text-amber-300',
    iconColor: 'text-amber-400',
    progressBar: 'bg-gradient-to-r from-amber-400 to-yellow-300',
    titleColor: 'text-amber-200',
  },
  emerald: {
    gradient: 'from-[#032314] via-[#02180E] to-[#010E08]',
    border: 'border-emerald-400/60',
    glow: 'shadow-[0_10px_35px_rgba(16,185,129,0.35)]',
    badgeBg: 'bg-emerald-500/25 border-emerald-400/50',
    badgeText: 'text-emerald-300',
    iconColor: 'text-emerald-400',
    progressBar: 'bg-gradient-to-r from-emerald-400 to-teal-300',
    titleColor: 'text-emerald-200',
  },
  crimson: {
    gradient: 'from-[#29050A] via-[#1D0307] to-[#110104]',
    border: 'border-rose-500/60',
    glow: 'shadow-[0_10px_35px_rgba(244,63,94,0.35)]',
    badgeBg: 'bg-rose-500/25 border-rose-400/50',
    badgeText: 'text-rose-300',
    iconColor: 'text-rose-400',
    progressBar: 'bg-gradient-to-r from-rose-500 to-orange-400',
    titleColor: 'text-rose-200',
  },
  sapphire: {
    gradient: 'from-[#04162E] via-[#030F20] to-[#010914]',
    border: 'border-sky-400/60',
    glow: 'shadow-[0_10px_35px_rgba(56,189,248,0.35)]',
    badgeBg: 'bg-sky-500/25 border-sky-400/50',
    badgeText: 'text-sky-300',
    iconColor: 'text-sky-400',
    progressBar: 'bg-gradient-to-r from-sky-400 to-cyan-300',
    titleColor: 'text-sky-200',
  },
  violet: {
    gradient: 'from-[#20052B] via-[#16031E] to-[#0D0112]',
    border: 'border-purple-400/60',
    glow: 'shadow-[0_10px_35px_rgba(192,132,252,0.35)]',
    badgeBg: 'bg-purple-500/25 border-purple-400/50',
    badgeText: 'text-purple-300',
    iconColor: 'text-purple-400',
    progressBar: 'bg-gradient-to-r from-purple-400 to-pink-400',
    titleColor: 'text-purple-200',
  },
};

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onDismiss,
  isMobileShell = false,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!notification) {
      setProgress(100);
      return;
    }

    const duration = (notification.durationSeconds || 8) * 1000;
    const intervalTime = 50;
    const decrement = (intervalTime / duration) * 100;

    setProgress(100);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return Math.max(0, prev - decrement);
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const style = COLOR_STYLES[notification.colorScheme] || COLOR_STYLES.royal_gold;

  return (
    <div
      className={`${
        isMobileShell ? 'absolute top-3 inset-x-3' : 'fixed top-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[540px]'
      } z-[999999] animate-bounce-short select-none transition-all duration-300`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.gradient} border-2 ${style.border} ${style.glow} p-4 text-white backdrop-blur-xl`}
      >
        {/* Progress Bar indicator at top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-black/40">
          <div
            className={`h-full ${style.progressBar} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-start gap-3.5 pt-1">
          {/* Glowing Avatar or Crown Icon */}
          <div className="relative shrink-0">
            {notification.senderAvatar ? (
              <div className="relative">
                <img
                  src={notification.senderAvatar}
                  alt={notification.senderName || 'Owner'}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-amber-500 text-black border border-black shadow">
                  <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-black shadow-lg">
                <Crown className="w-6 h-6 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-black flex items-center gap-1 ${style.badgeBg} ${style.badgeText}`}
                >
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>تنبيه فوري من المالك</span>
                </span>
                {notification.senderName && (
                  <span className="text-[11px] text-zinc-300 font-bold">
                    • {notification.senderName}
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onDismiss}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="إغلاق التنبيه"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Title */}
            <h4 className={`text-sm sm:text-base font-black ${style.titleColor} leading-tight mb-1 flex items-center gap-1.5`}>
              <Bell className={`w-4 h-4 shrink-0 ${style.iconColor} animate-wiggle`} />
              <span>{notification.title}</span>
            </h4>

            {/* Notification Message */}
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium line-clamp-3">
              {notification.message}
            </p>

            {/* Bottom Meta */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="flex items-center gap-1 text-amber-300/90 font-medium">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>مرسل مباشرة لجميع المستخدمين المتصلين في نفس اللحظة</span>
              </span>
              <span className="font-mono text-zinc-500">
                {new Date(notification.timestamp).toLocaleTimeString('ar-SA', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
