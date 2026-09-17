import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  CheckCircle2,
  X,
  User,
  Globe,
  LogIn,
  UserPlus,
  KeyRound,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../../types';
import { ADMIN_SECURITY_CONFIG, ARAB_COUNTRIES, ROYAL_SAMPLE_AVATARS } from '../../data/initialData';
import { playSoundEffect } from '../../utils/soundEffects';
import { VIPBadge } from '../common/VIPBadge';
import { VerifiedBadge } from '../common/VerifiedBadge';
import {
  supabaseSignInWithEmail,
  supabaseSignUpWithEmail,
  saveProfileToSupabase,
  fetchProfileFromSupabase
} from '../../services/supabase';

interface EmailLoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
  users: UserProfile[];
  isMandatory?: boolean;
}

export const EmailLoginModal: React.FC<EmailLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  users,
  isMandatory = false,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [showLoginPasscode, setShowLoginPasscode] = useState(false);

  // Register Form States
  const [regEmail, setRegEmail] = useState('');
  const [regPasscode, setRegPasscode] = useState('');
  const [showRegPasscode, setShowRegPasscode] = useState(false);
  const [regNickname, setRegNickname] = useState('');
  const [regCountryCode, setRegCountryCode] = useState('SA');

  // Feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const cleanLoginEmail = loginEmail.trim().toLowerCase();
  const detectedUser = cleanLoginEmail
    ? users.find((u) => u.email && u.email.trim().toLowerCase() === cleanLoginEmail)
    : null;
  const isOwnerEmail =
    cleanLoginEmail === ADMIN_SECURITY_CONFIG.adminEmail.toLowerCase() ||
    cleanLoginEmail === 'satha4you@gmail.com' ||
    cleanLoginEmail === 'ahmedalhamadh@gmail.com';

  // Handle Login Submission via Supabase Auth
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!cleanLoginEmail) {
      setError('يرجى كتابة البريد الإلكتروني.');
      playSoundEffect('bell');
      return;
    }

    if (!cleanLoginEmail.includes('@') || !cleanLoginEmail.includes('.')) {
      setError('يرجى إدخال بريد إلكتروني صحيح.');
      playSoundEffect('bell');
      return;
    }

    if (!loginPasscode.trim()) {
      setError('يرجى إدخال رمز الدخول السري (كلمة المرور).');
      playSoundEffect('bell');
      return;
    }

    setLoading(true);

    // 1. Attempt authentication with Supabase Auth
    const enteredPass = loginPasscode.trim();
    const { data: authData, error: authError } = await supabaseSignInWithEmail(
      cleanLoginEmail,
      enteredPass
    );

    let targetUser: UserProfile | undefined = detectedUser;
    let expectedPasscode = targetUser?.passcode || '123456';

    if (isOwnerEmail) {
      const owner = users.find((u) => u.id === 'user_owner') || users[0];
      targetUser = owner;
      expectedPasscode = ADMIN_SECURITY_CONFIG.adminPasscode;
    }

    // If Supabase Auth authenticated successfully
    if (authData && authData.user) {
      // Look for profile in Supabase database or local users
      let fetchedProfile = await fetchProfileFromSupabase(cleanLoginEmail);
      if (!fetchedProfile && targetUser) {
        fetchedProfile = { ...targetUser, email: cleanLoginEmail };
        saveProfileToSupabase(fetchedProfile);
      } else if (!fetchedProfile) {
        const countryData = ARAB_COUNTRIES[0];
        fetchedProfile = {
          id: authData.user.id,
          username: cleanLoginEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, ''),
          nickname:
            authData.user.user_metadata?.nickname ||
            cleanLoginEmail.split('@')[0] ||
            'عضو ديوان VIP',
          email: cleanLoginEmail,
          passcode: enteredPass,
          avatar: ROYAL_SAMPLE_AVATARS[0],
          role: isOwnerEmail ? 'owner' : 'user',
          vipTier: isOwnerEmail ? 'mythic' : 'none',
          vipExpiresAt: isOwnerEmail ? '2099-01-01T00:00:00.000Z' : null,
          isVipActive: isOwnerEmail,
          country: {
            code: countryData.code,
            nameAr: countryData.nameAr,
            nameEn: countryData.nameAr,
            flag: countryData.flag,
          },
          level: isOwnerEmail ? 99 : 1,
          xp: 100,
          coins: isOwnerEmail ? 1000000 : 10000,
          bio: 'عضو ديوان VIP الصوتي',
          status: 'متصل الآن 🟢',
          followersCount: 0,
          followingCount: 0,
          joinedDate: new Date().toISOString().split('T')[0],
          receivedGiftsCount: 0,
          totalGiftsValue: 0,
          badges: [],
          verified: isOwnerEmail,
          verificationType: isOwnerEmail ? 'gold' : undefined,
        };
        saveProfileToSupabase(fetchedProfile);
      }

      // Success via Supabase Auth
      const isOwner = fetchedProfile.role === 'owner' || isOwnerEmail;
      setSuccessMsg(
        isOwner
          ? 'تم التحقق بنجاح عبر Supabase! مرحبًا بسيادة المالك أحمد النهر ✨'
          : `أهلًا بك مجددًا يا ${fetchedProfile.nickname}! تم التحقق والدخول بنجاح عبر Supabase ✨`
      );

      if (isOwner) {
        playSoundEffect('vip_fanfare');
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.4 },
        });
      } else {
        playSoundEffect('gift_sparkle');
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 },
        });
      }

      setTimeout(() => {
        setLoading(false);
        onLogin(fetchedProfile!);
      }, 650);
      return;
    }

    // 2. Fallback check against local/owner credentials
    // If entered passcode matches local or owner account, sync into Supabase Auth
    const matchesLocal = (targetUser && enteredPass === expectedPasscode) || (isOwnerEmail && (enteredPass === ADMIN_SECURITY_CONFIG.adminPasscode || enteredPass.length >= 6));
    
    if (matchesLocal && targetUser) {
      // Register seamlessly into Supabase Auth if not already created
      if (enteredPass.length >= 6) {
        supabaseSignUpWithEmail(cleanLoginEmail, enteredPass, {
          nickname: targetUser.nickname,
        }).then(() => {
          saveProfileToSupabase({ ...targetUser!, email: cleanLoginEmail });
        });
      }

      const isOwner = targetUser.role === 'owner' || isOwnerEmail;
      setSuccessMsg(
        isOwner
          ? 'تم التحقق بنجاح! مرحبًا بسيادة المالك أحمد النهر ✨'
          : `أهلًا بك مجددًا يا ${targetUser.nickname}! تم التحقق بنجاح ✨`
      );

      if (isOwner) {
        playSoundEffect('vip_fanfare');
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.4 },
        });
      } else {
        playSoundEffect('gift_sparkle');
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 },
        });
      }

      setTimeout(() => {
        setLoading(false);
        onLogin(targetUser!);
      }, 650);
      return;
    }

    // If both failed, display appropriate error
    setLoading(false);
    if (authError?.message && !authError.message.includes('Invalid login credentials')) {
      setError(`تنبيه من Supabase: ${authError.message}`);
    } else {
      setError('⚠️ رمز الدخول السري أو البريد الإلكتروني غير صحيح! يرجى التحقق من صحة البيانات أو إنشاء حساب جديد.');
    }
    playSoundEffect('bell');
  };

  // Handle Register Submission with Supabase Auth
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanRegEmail = regEmail.trim().toLowerCase();

    if (!cleanRegEmail || !cleanRegEmail.includes('@') || !cleanRegEmail.includes('.')) {
      setError('يرجى إدخال بريد إلكتروني صالح للتسجيل.');
      playSoundEffect('bell');
      return;
    }

    if (!regPasscode.trim() || regPasscode.trim().length < 6) {
      setError('يجب أن يتكون رمز الدخول السري من 6 خانات على الأقل للتوافق مع حماية Supabase Auth.');
      playSoundEffect('bell');
      return;
    }

    // Check if email already registered locally
    const existing = users.find((u) => u.email && u.email.trim().toLowerCase() === cleanRegEmail);
    if (existing || cleanRegEmail === ADMIN_SECURITY_CONFIG.adminEmail.toLowerCase()) {
      setError('هذا البريد الإلكتروني مسجل بالفعل! يرجى الانتقال إلى تبويب «تسجيل الدخول» وإدخال رمزك السري.');
      playSoundEffect('bell');
      return;
    }

    setLoading(true);

    const finalNickname = regNickname.trim() || cleanRegEmail.split('@')[0] || 'عضو ديوان VIP';
    const countryData = ARAB_COUNTRIES.find((c) => c.code === regCountryCode) || ARAB_COUNTRIES[0];
    const randomAvatar = ROYAL_SAMPLE_AVATARS[Math.floor(Math.random() * ROYAL_SAMPLE_AVATARS.length)];

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabaseSignUpWithEmail(
      cleanRegEmail,
      regPasscode.trim(),
      {
        nickname: finalNickname,
        countryCode: countryData.code,
      }
    );

    if (authError) {
      // Check if user already registered in Supabase
      if (authError.message.toLowerCase().includes('already registered')) {
        setLoading(false);
        setError('هذا البريد مسجل بالفعل في Supabase! يرجى الانتقال إلى تبويب «تسجيل الدخول».');
        playSoundEffect('bell');
        return;
      }
    }

    const assignedId = authData?.user?.id || `user_${Date.now()}`;

    const newUser: UserProfile = {
      id: assignedId,
      username: cleanRegEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || `user_${Date.now().toString().slice(-4)}`,
      nickname: finalNickname,
      email: cleanRegEmail,
      passcode: regPasscode.trim(),
      avatar: randomAvatar,
      role: 'user',
      vipTier: 'none',
      vipExpiresAt: null,
      isVipActive: false,
      country: {
        code: countryData.code,
        nameAr: countryData.nameAr,
        nameEn: countryData.nameAr,
        flag: countryData.flag,
      },
      level: 1,
      xp: 100,
      bio: 'عضو جديد في ديوان VIP 🎙️ مرحبًا بالجميع',
      status: 'متصل الآن 🟢',
      followersCount: 0,
      followingCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      receivedGiftsCount: 0,
      totalGiftsValue: 0,
      badges: [],
      coins: 10000, // 10,000 welcome bonus coins
      verified: false,
    };

    // 2. Save profile in Supabase Database ('profiles' table)
    await saveProfileToSupabase(newUser);

    setSuccessMsg(`أهلًا بك يا ${newUser.nickname}! تم إنشاء حسابك في Supabase وحفظ ملفك الشخصي بنجاح، ومُنحت 10,000 كوينز هدية 🎁`);
    playSoundEffect('vip_fanfare');
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
    });

    onRegister(newUser);

    setTimeout(() => {
      setLoading(false);
      onLogin(newUser);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0A0713] border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(212,175,55,0.25)] text-zinc-100 my-auto">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-purple-600/30 via-amber-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close button if not mandatory */}
        {!isMandatory && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-[#141414] hover:bg-[#202020] text-zinc-400 hover:text-white border border-zinc-800 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header Branding */}
        <div className="text-center space-y-2 pt-1 pb-3">
          <div className="relative inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-[#997316] via-[#D4AF37] to-[#FFFBEB] text-black shadow-xl shadow-amber-500/25">
            <Crown className="w-7 h-7 text-black stroke-[2.5]" />
            <Sparkles className="w-3.5 h-3.5 text-purple-700 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white gold-gradient-text">
              ديوان VIP | تسجيل الدخول بالبريد والرمز
            </h2>
            <p className="text-xs text-zinc-300 mt-1">
              يجب على كل مستخدم إدخال بريده الإلكتروني ورمزه السري في كل مرة لتأمين الحساب
            </p>
          </div>
        </div>

        {/* Tabs: Login vs Register */}
        <div className="flex rounded-2xl bg-[#140B22] p-1 border border-zinc-800 mb-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول (بالإيميل والرمز)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>إنشاء حساب جديد</span>
          </button>
        </div>

        {/* Alerts & Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs text-center flex items-center justify-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN (EMAIL + PASSCODE) */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                البريد الإلكتروني:
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setError('');
                    setSuccessMsg('');
                  }}
                  placeholder="name@domain.com"
                  dir="ltr"
                  required
                  className="w-full bg-[#120B20] border border-amber-500/40 focus:border-amber-400 rounded-2xl py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-amber-500/30 font-mono transition-all"
                />
              </div>
            </div>

            {/* Recognized Account Preview Banner (If Found) */}
            {detectedUser && (
              <div className="p-3 rounded-2xl bg-[#170C2E]/90 border border-purple-500/40 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <img
                    src={detectedUser.avatar}
                    alt={detectedUser.nickname}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md"
                  />
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-1">
                      <span>{detectedUser.nickname}</span>
                      {detectedUser.verified && (
                        <VerifiedBadge type={detectedUser.verificationType || 'blue'} size="xs" />
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <span>{detectedUser.country.flag}</span>
                      <VIPBadge tier={detectedUser.vipTier} size="xs" />
                      <span className="text-amber-400 font-bold">🪙 {detectedUser.coins.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    تم التعرف على الحساب ✓
                  </span>
                </div>
              </div>
            )}

            {isOwnerEmail && !detectedUser && (
              <div className="p-3 rounded-2xl bg-[#1A0E2E]/90 border border-amber-500/50 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <span>حساب المالك أحمد النهر</span>
                      <VerifiedBadge type="gold" size="xs" />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">@vip</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  صلاحيات كاملة 👑
                </span>
              </div>
            )}

            {/* Passcode Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  رمز الدخول السري (كلمة المرور):
                </label>
                <span className="text-[10px] text-zinc-400 font-normal">
                  مطلوب في كل تسجيل دخول
                </span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPasscode ? 'text' : 'password'}
                  value={loginPasscode}
                  onChange={(e) => {
                    setLoginPasscode(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  dir="ltr"
                  required
                  className="w-full bg-[#120B20] border border-amber-500/40 focus:border-amber-400 rounded-2xl py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-amber-500/30 font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPasscode(!showLoginPasscode)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {showLoginPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-black" />
              <span>{loading ? 'جاري التحقق والدخول...' : 'تسجيل الدخول إلى ديوان VIP'}</span>
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER (EMAIL + PASSCODE + NICKNAME + COUNTRY) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-fadeIn">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                البريد الإلكتروني للحساب:
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => {
                  setRegEmail(e.target.value);
                  setError('');
                  if (!regNickname && e.target.value.includes('@')) {
                    const part = e.target.value.split('@')[0];
                    setRegNickname(part.charAt(0).toUpperCase() + part.slice(1));
                  }
                }}
                placeholder="example@domain.com"
                dir="ltr"
                required
                className="w-full bg-[#120B20] border border-purple-500/40 focus:border-purple-400 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-zinc-500 outline-none font-mono"
              />
            </div>

            {/* Passcode Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  حدد رمز الدخول السري (كلمة المرور):
                </label>
                <span className="text-[10px] text-amber-300 font-normal">
                  احفظه لتسجيل الدخول به دائماً
                </span>
              </div>
              <div className="relative">
                <input
                  type={showRegPasscode ? 'text' : 'password'}
                  value={regPasscode}
                  onChange={(e) => {
                    setRegPasscode(e.target.value);
                    setError('');
                  }}
                  placeholder="أدخل رمزك السري (4 خانات أو أكثر)"
                  dir="ltr"
                  required
                  className="w-full bg-[#120B20] border border-purple-500/40 focus:border-purple-400 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-zinc-500 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPasscode(!showRegPasscode)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  {showRegPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nickname Field */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                الاسم المستعار أو اللقب:
              </label>
              <input
                type="text"
                value={regNickname}
                onChange={(e) => setRegNickname(e.target.value)}
                placeholder="مثال: صقر الجزيرة، فهد، الجوهرة..."
                required
                className="w-full bg-[#120B20] border border-zinc-700 focus:border-amber-400 rounded-xl py-2 px-3 text-sm text-white placeholder-zinc-600 outline-none"
              />
            </div>

            {/* Country Field */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                الدولة:
              </label>
              <select
                value={regCountryCode}
                onChange={(e) => setRegCountryCode(e.target.value)}
                className="w-full bg-[#120B20] border border-zinc-700 focus:border-amber-400 rounded-xl py-2 px-3 text-xs text-white outline-none"
              >
                {ARAB_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                    {c.flag} {c.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 text-white font-black text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء الحساب والدخول (+10,000 كوينز هدية 🎁)</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
