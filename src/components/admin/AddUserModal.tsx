import React, { useState, useRef } from 'react';
import { UserProfile, VIPTier } from '../../types';
import {
  X,
  UserPlus,
  Crown,
  Sparkles,
  Send,
  Upload,
  Camera,
  KeyRound,
  ShieldCheck,
  Check,
  RotateCcw,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { ARAB_COUNTRIES, ROYAL_SAMPLE_AVATARS, VIP_CONFIGS, INITIAL_BADGES } from '../../data/initialData';
import { VIPBadge } from '../common/VIPBadge';
import { VerifiedBadge, VerificationType } from '../common/VerifiedBadge';
import { compressImage } from '../../utils/storage';
import { playSoundEffect } from '../../utils/soundEffects';
import { saveProfileToSupabase } from '../../services/supabase';
import confetti from 'canvas-confetti';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingUsers: UserProfile[];
  onAddUser: (newUser: UserProfile, initialMessage?: string) => void;
  currentUser: UserProfile;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  existingUsers,
  onAddUser,
  currentUser,
}) => {
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('123456');
  const [selectedCountryCode, setSelectedCountryCode] = useState('SA');
  const [vipTier, setVipTier] = useState<VIPTier>('none');
  const [verificationType, setVerificationType] = useState<VerificationType | 'none'>('none');
  const [coins, setCoins] = useState<number>(10000);
  const [level, setLevel] = useState<number>(1);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(ROYAL_SAMPLE_AVATARS[0]);
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);

  // Direct message options
  const [sendMessage, setSendMessage] = useState<boolean>(true);
  const [messageText, setMessageText] = useState<string>(
    'مرحبًا بك في منصة ديوان VIP! 👑 يسعدنا انضمامك إلى مجتمعنا الصوتي الراقي. تم إنشاء حسابك بنجاح من قِبل إدارة المنصة، ونتمنى لك أسعد الأوقات في الغرف الصوتية.'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleGenerateRandomPasscode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setPasscode(randomCode);
    playSoundEffect('bell');
  };

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('حجم الصورة كبير جدًا. الحد الأقصى 10 ميجابايت');
      return;
    }
    try {
      const compressed = await compressImage(file, 200, 0.75);
      setCustomAvatarPreview(compressed);
      setSelectedAvatar(compressed);
      playSoundEffect('bell');
    } catch {
      setUploadError('حدث خطأ أثناء معالجة الصورة');
    }
  };

  const applyTemplate = (type: 'welcome' | 'vip' | 'credentials') => {
    playSoundEffect('bell');
    const targetName = nickname.trim() || 'عزيزنا العضو';
    if (type === 'welcome') {
      setMessageText(
        `مرحبًا بك يا ${targetName} في منصة ديوان VIP! 👑 يسعدنا انضمامك إلى مجتمعنا الصوتي الراقي. تم إنشاء وتفعيل حسابك بنجاح من قِبل الإدارة.`
      );
    } else if (type === 'vip') {
      const tierName = VIP_CONFIGS[vipTier]?.nameAr || 'VIP';
      setMessageText(
        `تهانينا الحارة يا ${targetName}! ✨ تم منحك عضوية «${tierName}» الملكية في ديوان VIP. استمتع بمزايا التاج، والإطار الفاخر، وأولوية التحدث في الغرف الصوتية.`
      );
    } else if (type === 'credentials') {
      setMessageText(
        `أهلًا بك يا ${targetName}! إليك بيانات دخولك الرسمية إلى ديوان VIP:\n- اسم المستخدم: @${username.replace(/^@/, '').trim() || 'user'}\n- رمز المرور السري: ${passcode}\nيرجى الاحتفاظ برمز المرور الخاص بك وعدم مشاركته مع أحد 🛡️.`
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanNickname = nickname.trim();
    const cleanUsername = username.replace(/^@/, '').trim().toLowerCase();

    if (!cleanNickname) {
      setErrorMsg('يرجى كتابة الاسم المعروض (اللقب)');
      return;
    }

    if (!cleanUsername) {
      setErrorMsg('يرجى كتابة اسم المستخدم (Username)');
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,25}$/.test(cleanUsername)) {
      setErrorMsg('اسم المستخدم يجب أن يتكون من أحرف إنجليزية وأرقام وعلامة _ فقط (من 3 إلى 25 حرفًا)');
      return;
    }

    // Check uniqueness
    const exists = existingUsers.some(
      (u) => u.username.toLowerCase() === cleanUsername
    );
    if (exists) {
      setErrorMsg(`اسم المستخدم @${cleanUsername} مستخدم بالفعل، يرجى اختيار اسم مستخدم آخر`);
      return;
    }

    setIsSubmitting(true);

    const countryObj = ARAB_COUNTRIES.find((c) => c.code === selectedCountryCode) || {
      code: 'SA',
      nameAr: 'المملكة العربية السعودية',
      flag: '🇸🇦',
    };

    const isVerified = verificationType !== 'none';
    const finalVerificationType = verificationType !== 'none' ? verificationType : undefined;

    const newUserId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newUser: UserProfile = {
      id: newUserId,
      username: cleanUsername,
      nickname: cleanNickname,
      avatar: selectedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanNickname)}&background=D4AF37&color=000`,
      role: 'user',
      vipTier,
      isVipActive: vipTier !== 'none',
      vipExpiresAt: vipTier !== 'none' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      country: {
        code: countryObj.code,
        nameAr: countryObj.nameAr,
        nameEn: countryObj.code,
        flag: countryObj.flag,
      },
      level: Math.max(1, level),
      xp: Math.max(1, level) * 100,
      coins: Math.max(0, coins),
      passcode: passcode.trim() || '123456',
      verified: isVerified,
      verificationType: finalVerificationType,
      bio: 'عضو مميز في ديوان VIP الصوتي ✨',
      status: 'متواجد في ديوان VIP',
      followersCount: 0,
      followingCount: 1,
      joinedDate: new Date().toISOString().split('T')[0],
      receivedGiftsCount: 0,
      totalGiftsValue: 0,
      badges: [INITIAL_BADGES[0]],
    };

    // Trigger celebration
    playSoundEffect('vip_fanfare');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.4 },
    });

    // Save profile to Supabase
    saveProfileToSupabase(newUser);

    onAddUser(newUser, sendMessage ? messageText.trim() : undefined);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl my-6 bg-[#0E0F14] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-zinc-100">
        
        {/* Top Header Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/50 via-[#181226] to-[#0E0F14] border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center shadow-lg shadow-amber-500/20 font-black">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>إضافة مستخدم جديد للمنصة</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  لوحة المالك
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400">
                أنشئ حساب العضو وحدد رتبته، مع خيار إرسال رسالة ترحيبية فورية إلى محادثاته الخاصة ✉️
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* 1. Account Core Details */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 pb-1 border-b border-zinc-800/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>البيانات الأساسية للحساب</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  الاسم المعروض (اللقب) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="مثال: سلطان القوافي أو سارة"
                  className="w-full bg-[#141620] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  اسم المستخدم (Username) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-2 text-zinc-500 text-xs font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                    placeholder="sultan_99"
                    className="w-full bg-[#141620] border border-zinc-800 rounded-xl pr-8 pl-3 py-2 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-amber-500 dir-ltr text-right"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-amber-400" />
                    <span>الرمز السري للدخول (Passcode)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPasscode}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline"
                  >
                    توليد تلقائي ⚡
                  </button>
                </div>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-[#141620] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">الدولة</label>
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="w-full bg-[#141620] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {ARAB_COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code} className="bg-zinc-900">
                      {country.flag} {country.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Avatar Selection */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 pb-1 border-b border-zinc-800/80">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>الصورة الرمزية (Avatar)</span>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md shrink-0 bg-black">
                <img
                  src={selectedAvatar}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {ROYAL_SAMPLE_AVATARS.slice(0, 6).map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(imgUrl);
                        setCustomAvatarPreview(null);
                        playSoundEffect('bell');
                      }}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedAvatar === imgUrl
                          ? 'border-amber-400 scale-110 shadow-lg'
                          : 'border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>رفع صورة خاصة من الجهاز</span>
                  </button>
                </div>
                {uploadError && (
                  <p className="text-[11px] text-red-400">{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          {/* 3. VIP & Privileges Configuration */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 pb-1 border-b border-zinc-800/80">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>الرتبة والتوثيق والكوينز</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* VIP Tier */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">رتبة العضوية VIP</label>
                <select
                  value={vipTier}
                  onChange={(e) => setVipTier(e.target.value as VIPTier)}
                  className="w-full bg-[#141620] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="none">عضو عادي (مجاني)</option>
                  <option value="bronze">VIP 1 برونزي</option>
                  <option value="silver">VIP 2 فضي</option>
                  <option value="gold">VIP 3 ذهبي</option>
                  <option value="diamond">VIP 4 ألماسي</option>
                  <option value="royal">VIP 5 ملكي</option>
                  <option value="mythic">VIP 6 خرافي أسطوري</option>
                </select>
              </div>

              {/* Verification */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">شارة التوثيق الرسمية</label>
                <select
                  value={verificationType}
                  onChange={(e) => setVerificationType(e.target.value as any)}
                  className="w-full bg-[#141620] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="none">بدون توثيق</option>
                  <option value="blue">توثيق أزرق 🛡️ (حساب رسمي)</option>
                  <option value="gold">توثيق ذهبي ⭐ (شخصية ملكية)</option>
                </select>
              </div>

              {/* Initial Coins */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">الرصيد الابتدائي 🪙</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={coins}
                  onChange={(e) => setCoins(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#141620] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Instant Welcome/Direct Message Section (User Request Highlight) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#181428] to-[#0E0F14] border border-amber-500/40 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendMessage}
                  onChange={(e) => setSendMessage(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-zinc-700 focus:ring-amber-500 focus:ring-offset-0"
                />
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>إرسال رسالة للمستخدم بعد الإضافة مباشرة ✉️</span>
                </span>
              </label>

              {sendMessage && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  سيتم الإرسال تلقائيًا فور الإنشاء
                </span>
              )}
            </div>

            {sendMessage && (
              <div className="space-y-2 pt-1">
                {/* Template buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-zinc-400">قوالب جاهزة:</span>
                  <button
                    type="button"
                    onClick={() => applyTemplate('welcome')}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium"
                  >
                    ترحيب رسمي 👑
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('vip')}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 font-medium"
                  >
                    تهنئة برتبة VIP ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('credentials')}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sky-300 border border-sky-500/30 font-medium"
                  >
                    بيانات الدخول والرمز السري 🔑
                  </button>
                </div>

                <textarea
                  rows={3}
                  required={sendMessage}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="اكتب الرسالة التي ستصل للعضو في صندوق محادثاته الخاصة..."
                  className="w-full bg-[#0C0D12] border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                />

                <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <span>المرسل:</span>
                  <span className="font-bold text-amber-300">{currentUser.nickname}</span>
                  <span className="text-zinc-500 font-mono">(@{currentUser.username})</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-black" />
              <span>{sendMessage ? 'إضافة المستخدم وإرسال الرسالة 🚀' : 'إضافة المستخدم فقط'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
