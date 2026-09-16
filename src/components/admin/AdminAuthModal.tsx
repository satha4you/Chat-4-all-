import React, { useState } from 'react';
import { Crown, Lock, ShieldCheck, Eye, EyeOff, X, KeyRound, CheckCircle2, Mail, Sparkles, LogIn } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from '../../utils/soundEffects';
import { ADMIN_SECURITY_CONFIG } from '../../data/initialData';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onLoginAsOwner?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLoginAsOwner,
}) => {
  const [email, setEmail] = useState(ADMIN_SECURITY_CONFIG.adminEmail);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (enteredEmail: string, enteredPass: string) => {
    setError('');
    const cleanEmail = enteredEmail.trim().toLowerCase();
    const cleanPass = enteredPass.trim();

    const expectedEmail = ADMIN_SECURITY_CONFIG.adminEmail.toLowerCase();
    const expectedPass = ADMIN_SECURITY_CONFIG.adminPasscode;

    if (cleanEmail === expectedEmail && cleanPass === expectedPass) {
      setIsSuccess(true);
      playSoundEffect('vip_fanfare');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.4 },
      });

      setTimeout(() => {
        setIsSuccess(false);
        setPasscode('');
        // Switch active user to Owner account immediately!
        onLoginAsOwner?.();
        // Open Admin Dashboard simultaneously
        onSuccess();
      }, 700);
    } else {
      setError('البريد الإلكتروني أو رمز الدخول السري غير صحيح! تأكد من إدخال بيانات المالك المعتمدة.');
      playSoundEffect('bell');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, passcode);
  };

  const handleQuickOwnerFill = () => {
    setEmail(ADMIN_SECURITY_CONFIG.adminEmail);
    setPasscode(ADMIN_SECURITY_CONFIG.adminPasscode);
    handleLogin(ADMIN_SECURITY_CONFIG.adminEmail, ADMIN_SECURITY_CONFIG.adminPasscode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-[#0A0713] border-2 border-amber-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(212,175,55,0.25)] text-zinc-100 overflow-hidden">
        
        {/* Decorative Top Violet-Gold Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-purple-600/20 via-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-[#141414] hover:bg-[#202020] text-zinc-400 hover:text-white border border-zinc-800 transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 pt-2 pb-2">
          <div className="relative inline-flex p-4 rounded-3xl bg-gradient-to-tr from-[#997316] via-[#D4AF37] to-[#FFFBEB] text-black shadow-xl shadow-amber-500/20 font-black">
            <Crown className="w-8 h-8 text-black" />
            <Sparkles className="w-4 h-4 text-purple-700 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-black text-white gold-gradient-text">
              تسجيل الدخول بصلاحيات المالك العام 👑
            </h3>
            <p className="text-xs text-zinc-300 mt-1">
              يتم تحويل حسابك فورًا إلى «المالك أحمد النهر» لتتحدث وتكتب وتدير المنصة
            </p>
          </div>

          {/* Quick One-Click Owner Login Shortcut */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleQuickOwnerFill}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-950 via-amber-950 to-purple-950 border border-amber-400/60 hover:border-amber-300 text-amber-200 hover:text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>دخول سريع مباشر كمالك الحساب ⚡ (تلقائي)</span>
            </button>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-amber-300">أهلاً بك يا صاحب السمو الملكي! 👑</h4>
            <p className="text-xs text-zinc-300">
              تم تسجيل الدخول بنجاح بحساب المالك (الحديث والكتابة والإدارة كلها مفعلة)...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 mt-3 text-right">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  البريد الإلكتروني المعتمد للمالك:
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Owner Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Satha4you@gmail.com"
                className="w-full bg-[#120D1D] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-left dir-ltr"
              />
            </div>

            {/* Passcode Field */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  رمز الدخول السري (Passcode):
                </span>
                <span className="text-[10px] text-zinc-500 font-normal">كلمة المرور</span>
              </label>

              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#120D1D] border border-zinc-700/80 rounded-xl pr-3.5 pl-10 py-2.5 text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-left dir-ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs text-center font-bold animate-fadeIn">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول كـ «المالك أحمد النهر» وتفعيل اللوحة</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <p className="text-[11px] text-zinc-400">
                الرمز السري المعتمد للمالك: <span className="text-amber-400 font-mono">admin8899</span>
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
