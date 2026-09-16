import React, { useState } from 'react';
import { UserProfile, VIPTier, VIPSubscriptionRequest, OwnerContactInfo } from '../../types';
import { VIP_CONFIGS, OWNER_CONTACT_INFO } from '../../data/initialData';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPBadge } from '../common/VIPBadge';
import { VIPName } from '../common/VIPName';
import { RealisticCrown } from '../common/RealisticCrown';
import { Floating3DCrownAnimation } from '../profile/Floating3DCrownAnimation';
import { LuxuryGamingProfile } from '../profile/LuxuryGamingProfile';
import { 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Send, 
  Check, 
  ArrowRight,
  Info,
  Clock,
  Zap,
  HelpCircle,
  ExternalLink,
  Mail,
  Gem,
  Award,
  Shield,
  Layers,
  Edit,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from '../../utils/soundEffects';
import { 
  MYTHIC_FRAMES, 
  DEFAULT_MYTHIC_FRAME_ID, 
  MythicFrameOption, 
  getMythicFrameById 
} from '../../data/mythicFrames';

interface VIPStoreViewProps {
  currentUser: UserProfile;
  contactInfo?: OwnerContactInfo;
  onSubmitRequest: (request: VIPSubscriptionRequest) => void;
  onOpenDirectContact: () => void;
  onEditContactInfo?: () => void;
  onSelectMythicFrame?: (frameId: string) => void;
}

export const VIPStoreView: React.FC<VIPStoreViewProps> = ({
  currentUser,
  contactInfo = OWNER_CONTACT_INFO,
  onSubmitRequest,
  onOpenDirectContact,
  onEditContactInfo,
  onSelectMythicFrame,
}) => {
  const isOwner = currentUser.role === 'owner' || currentUser.id === 'user_owner';
  const isMythicUser = currentUser.vipTier === 'mythic';
  const [selectedTier, setSelectedTier] = useState<VIPTier>('gold');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'telegram' | 'phone'>('whatsapp');
  const [contactDetails, setContactDetails] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [notes, setNotes] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [activeMythicFrameId, setActiveMythicFrameId] = useState<string>(
    currentUser.mythicFrameId || DEFAULT_MYTHIC_FRAME_ID
  );
  const [mythicSuccessMsg, setMythicSuccessMsg] = useState<string | null>(null);

  const handleChooseMythicFrame = (frame: MythicFrameOption) => {
    if (!isMythicUser) {
      setSelectedTier('mythic');
      setShowRequestModal(true);
      playSoundEffect('bell');
      return;
    }

    setActiveMythicFrameId(frame.id);
    onSelectMythicFrame?.(frame.id);
    playSoundEffect('vip_fanfare');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#A855F7', '#EF4444', '#06B6D4', '#10B981'],
      });
    } catch (e) {
      console.warn(e);
    }
    setMythicSuccessMsg(`تم اعتماد إطار "${frame.nameAr}" بنجاح لحسابك الأسطوري!`);
    setTimeout(() => {
      setMythicSuccessMsg(null);
    }, 4500);
  };

  const [previewCrownTier, setPreviewCrownTier] = useState<VIPTier>('mythic');

  const crownDataMap: Record<VIPTier, { title: string; subtitle: string; desc: string; icon: string; stones: string }> = {
    bronze: {
      title: 'تاج صقر العز 3D',
      subtitle: 'صقر البرونز • VIP 1',
      desc: 'تصميم بأجنحة الصقر السهمية والريش البرونزي المصقول مع درع كهرماني عتيق يرمز للشجاعة.',
      icon: '🦅',
      stones: 'برونز عتيق • كهرمان ناري • ترصيع سهمي',
    },
    silver: {
      title: 'تاج ذئب الفضة القوطي 3D',
      subtitle: 'ذئب الفضة • VIP 2',
      desc: 'تصميم هلال الفضة البلاتيني النقي مع أقواس جليدية وألماس فيروزي سياني يعكس البريق الملكي.',
      icon: '🐺',
      stones: 'فضة بلاتينية • ألماس جليدي • فيروز سياني',
    },
    gold: {
      title: 'تاج نسر الذهب وقرص الشمس 3D',
      subtitle: 'نسر الذهب • VIP 3',
      desc: 'سبعة ألسنة شمسية مشعة من ذهب عيار 24 مع إكليل الغار الإمبراطوري وياقوت ناري أحمر متوهج.',
      icon: '🦅',
      stones: 'ذهب خالص 24K • ياقوت أحمر ناري • إكليل غار',
    },
    royal: {
      title: 'تاج أسد السيادة الإمبراطوري 3D',
      subtitle: 'أسد رويال • VIP 4',
      desc: 'تاج إمبراطوري متقاطع بأربعة أقواس ذهبية ثقيلة، كرة الصولجان، ومرصع بياقوت الزفير الأزرق الملكي.',
      icon: '🦁',
      stones: 'أقواس سيادية • زفير أزرق ملكي • صولجان ذهبي',
    },
    mythic: {
      title: 'تاج سلطان الأساطير المجنح 3D',
      subtitle: 'سلطان أسطوري • VIP 5',
      desc: 'قمة الفخامة الملكية: أجنحة كونية مجنحة متوهجة، نجمة القمة اللامعة، وجمشت بنفسجي وألماس أرجواني.',
      icon: '👑',
      stones: 'أجنحة كونية • جمشت ملكي بنفسجي • ألماس إمبراطوري',
    },
    none: {
      title: 'تاج كلاسيكي',
      subtitle: 'عادي',
      desc: 'تاج تقليدي أنيق للمنصة الصوتية.',
      icon: '✨',
      stones: 'ذهب كلاسيكي',
    },
  };

  const tiers: VIPTier[] = ['bronze', 'silver', 'gold', 'royal', 'mythic'];

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactDetails.trim()) return;

    const newReq: VIPSubscriptionRequest = {
      id: 'req_' + Date.now(),
      userId: currentUser.id,
      user: currentUser,
      requestedTier: selectedTier,
      requestedDurationMonths: durationMonths,
      contactMethod,
      contactDetails: contactDetails.trim(),
      notes: notes.trim() || 'طلب اشتراك وتفعيل يدوي من قبل المالك.',
      paymentReference: paymentRef.trim() || undefined,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    onSubmitRequest(newReq);
    playSoundEffect('vip_fanfare');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setShowRequestModal(false);
    }, 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-8 animate-fadeIn text-zinc-100">
      
      {/* Hero Royal Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#181408] via-[#101014] to-[#0A0A0A] border border-amber-500/25 p-6 md:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-black mb-3">
              <Crown className="w-4 h-4" />
              <span>نظام العضويات الملكية VIP</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
              تميّز بالتاج الملكي وإطار الذهب الأرجواني الفاخر
            </h1>
            <p className="text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed">
              احصل على اسم براق، إطار ملكي ذهبي أرجواني فاخر (Royal Golden Purple VIP Frame) لصورتك الشخصية، ودخول حصري لأرقى الغرف الصوتية.
            </p>
          </div>

          {/* Current user VIP status card */}
          <div className="bg-[#08080A]/95 border border-amber-500/30 backdrop-blur-md rounded-2xl p-4 sm:p-5 w-full md:w-auto md:min-w-[320px] text-right shrink-0 shadow-xl">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 border-b border-zinc-800/80 pb-1.5">
              <span className="font-bold">عضويتك الحالية في المنصة</span>
              <span className="text-[10px] text-amber-400 font-mono">حساب معتمد</span>
            </div>
            <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
              <VIPName user={currentUser} size="md" />
              <VIPBadge tier={currentUser.vipTier} size="sm" shortText={true} />
            </div>
            {currentUser.isVipActive && currentUser.vipExpiresAt ? (
              <div className="text-[11px] text-amber-300/90 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>مفعلة حتى: {new Date(currentUser.vipExpiresAt).toLocaleDateString('ar-SA')}</span>
              </div>
            ) : (
              <div className="text-[11px] text-zinc-400 flex items-center justify-between bg-zinc-900/80 px-2.5 py-1.5 rounded-xl border border-zinc-800">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>عضوية عادية (غير مفعلة)</span>
                </span>
                <span className="text-amber-400 text-[10px] font-bold">تتطلب تفعيل المالك</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direct Contact to Owner Banner (Strict Manual Subscription Notice) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0A0E] border border-amber-500/30 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-3.5 text-right flex-1">
          <div className="p-3 rounded-2xl bg-amber-500 text-black shrink-0 font-black shadow-lg shadow-amber-500/20">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-amber-300">
                طريقة الاشتراك والتفعيل اليدوي المباشر
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                المالك أحمد النهر
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
              {contactInfo.customInstructionsAr || OWNER_CONTACT_INFO.customInstructionsAr}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-300 flex-wrap">
              {contactInfo.whatsappNumber && (
                <div className="flex items-center gap-1.5 bg-zinc-900/90 px-2.5 py-1 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500">واتساب:</span>
                  <span className="font-mono text-emerald-400 dir-ltr">{contactInfo.whatsappNumber}</span>
                </div>
              )}
              {contactInfo.telegramHandle && (
                <div className="flex items-center gap-1.5 bg-zinc-900/90 px-2.5 py-1 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500">تيليجرام:</span>
                  <span className="font-mono text-sky-400 dir-ltr">{contactInfo.telegramHandle}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Symmetrical Balanced Action Grid */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col gap-2.5">
          {/* Primary Row: 2 equal-width prominent buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="h-11 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-black text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <Send className="w-4 h-4 text-black stroke-[2.5]" />
              <span>إرسال طلب ترقية للمالك</span>
            </button>

            {(contactInfo.whatsappLink || contactInfo.whatsappNumber) && (
              <a
                href={contactInfo.whatsappLink || `https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-98"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>واتساب المالك المباشر</span>
              </a>
            )}
          </div>

          {/* Secondary Row: Balanced supportive actions */}
          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={onOpenDirectContact}
              className="flex-1 h-10 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>ملف تواصل المالك</span>
            </button>

            <a
              href={`mailto:${contactInfo.email || OWNER_CONTACT_INFO.email}?subject=طلب ترقية VIP ديوان الصوت`}
              className="flex-1 h-10 px-3 rounded-xl bg-[#141416] hover:bg-[#1E1E22] text-zinc-200 border border-zinc-700/80 text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-98"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>راسل بالبريد</span>
            </a>

            {isOwner && onEditContactInfo && (
              <button
                type="button"
                onClick={onEditContactInfo}
                className="flex-1 h-10 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                title="تعديل معلومات التواصل الرسمية في المنصة"
              >
                <Edit className="w-3.5 h-3.5 text-amber-400" />
                <span>تعديل التواصل</span>
              </button>
            )}
          </div>
        </div>
      </div>


      {/* MASTER ROYAL VIP CARD & FRAME SHOWCASE (1:1 Reference Photo Match) */}
      <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#140624] via-[#0E031A] to-[#080210] border-2 border-amber-500/50 shadow-2xl overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-amber-500/20 pb-4 text-center md:text-right">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-xs font-black mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>التصميم الملكي الأسطوري الحصري</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center justify-center md:justify-start gap-2">
                <span>معاينة حية لبطاقة وإطار الملف الشخصي الملكي</span>
                <Crown className="w-5 h-5 text-amber-400" />
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl">
                شاهد كيف يظهر ملفك الشخصي وإطار صورتك بالهيبة الملكية (الأسد الإمبراطوري، أجنحة الجمشت، الراية المخملية، وإكليل الغار الذهبي)
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-amber-300 font-bold">الرتبة المعاينة:</span>
              <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-mono font-black text-xs">
                {selectedTier.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Master Card Live Rendering */}
          <div className="max-w-3xl mx-auto drop-shadow-2xl">
            <LuxuryGamingProfile
              user={currentUser}
              tier={selectedTier}
              onSelectTier={(tier) => {
                setSelectedTier(tier);
                playSoundEffect('vip_fanfare');
              }}
              onUpgradeClick={(tier) => {
                setSelectedTier(tier);
                setShowRequestModal(true);
              }}
            />
          </div>

          {/* 4 Royal Badges Explanation from Reference Image */}
          <div className="pt-4 border-t border-amber-500/20">
            <div className="text-center mb-4">
              <span className="text-xs font-black text-amber-300 tracking-wide uppercase">
                الأوسمة والرموز الملكية الأربعة على بطاقة العضوية
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-[#090214] border border-amber-500/30 text-center">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto mb-1.5 text-amber-400">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="font-black text-xs text-amber-300 tracking-wider">PREMIUM</div>
                <div className="text-[10px] text-zinc-400 mt-1">تثبيت الصوت وتصدر المقاعد الملكية</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#090214] border border-purple-500/30 text-center">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center mx-auto mb-1.5 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="font-black text-xs text-purple-300 tracking-wider">EXCLUSIVE</div>
                <div className="text-[10px] text-zinc-400 mt-1">دخول الغرف المغلقة وحفلات النخبة</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#090214] border border-yellow-500/30 text-center">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-400 flex items-center justify-center mx-auto mb-1.5 text-yellow-400">
                  <Gem className="w-4 h-4" />
                </div>
                <div className="font-black text-xs text-yellow-300 tracking-wider">ELITE</div>
                <div className="text-[10px] text-zinc-400 mt-1">إطار الذهب المرصع بالجمشت البنفسجي</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#090214] border border-emerald-500/30 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto mb-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-black text-xs text-emerald-300 tracking-wider">TRUSTED</div>
                <div className="text-[10px] text-zinc-400 mt-1">علامة التوثيق وحصانة كاملة من الكتم</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 VIP Tiers Comparison Cards */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-black text-zinc-100">باقات ورتب الـ VIP المتاحة</h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">اختر الباقة المناسبة لمستواك في الديوان</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {tiers.map((t) => {
            const config = VIP_CONFIGS[t];
            const isSelected = selectedTier === t;
            const isCurrent = currentUser.vipTier === t;

            return (
              <div
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`relative rounded-3xl p-4 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  t === 'mythic'
                    ? 'bg-gradient-to-b from-[#1C0512] via-[#2A0824] to-[#0A050D] border-yellow-400/80 shadow-xl shadow-rose-950/40 ring-1 ring-yellow-400/50'
                    : t === 'royal'
                    ? 'bg-[#0E0C12] border-purple-500/40 hover:border-purple-400 shadow-lg shadow-purple-950/20'
                    : t === 'gold'
                    ? 'bg-[#100E08] border-amber-500/50 hover:border-amber-400 shadow-lg shadow-amber-950/20 ring-1 ring-amber-400/30'
                    : t === 'silver'
                    ? 'bg-[#0D0E10] border-slate-600/40 hover:border-slate-400'
                    : 'bg-[#0F0C0A] border-amber-800/40 hover:border-amber-700'
                } ${isSelected ? 'scale-[1.02] ring-2 ring-amber-400' : 'opacity-90 hover:opacity-100'}`}
              >
                {/* Popular / Recommended Tag */}
                {t === 'mythic' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 via-purple-600 to-amber-500 text-black font-black text-[9px] shadow-lg animate-pulse whitespace-nowrap border border-yellow-200">
                    سلطان أسطوري VIP 5
                  </div>
                )}
                {t === 'royal' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 via-amber-400 to-purple-800 text-white font-black text-[9px] shadow animate-pulse whitespace-nowrap border border-amber-300">
                    أسد رويال VIP 4
                  </div>
                )}
                {t === 'gold' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black text-[9px] shadow whitespace-nowrap border border-yellow-200">
                    نسر الذهب VIP 3
                  </div>
                )}
                {t === 'silver' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-400 via-slate-300 to-purple-600 text-slate-950 font-black text-[9px] shadow whitespace-nowrap border border-purple-300">
                    ذئب الفضة VIP 2
                  </div>
                )}
                {t === 'bronze' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-700 via-purple-800 to-amber-600 text-amber-200 font-black text-[9px] shadow whitespace-nowrap border border-amber-400">
                    صقر البرونز VIP 1
                  </div>
                )}

                <div>
                  {/* Avatar preview with custom frame */}
                  <div className="flex justify-center my-2">
                    <AvatarWithFrame
                      avatarUrl={currentUser.avatar}
                      vipTier={t}
                      size="lg"
                      showCrown={true}
                    />
                  </div>

                  {/* Tier Title */}
                  <div className="text-center mt-2 mb-2">
                    <div className="text-[10px] text-amber-400 font-mono font-black uppercase">
                      {t === 'mythic' ? 'MYTHIC SULTAN' : t === 'royal' ? 'ROYAL LION' : t === 'gold' ? 'GOLD EAGLE' : t === 'silver' ? 'SILVER WOLF' : 'BRONZE FALCON'}
                    </div>
                    <h3 className="text-base font-black truncate text-white">{config.nameAr}</h3>
                    <div className="text-[11px] text-zinc-400">{config.priceDescriptionAr}</div>
                  </div>

                  {/* Dedicated 3D Crown Shape tailored specifically to this tier's rank */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewCrownTier(t);
                    }}
                    className="my-2.5 p-2 rounded-2xl bg-[#08070D] border border-amber-500/25 flex flex-col items-center justify-center text-center group/crown hover:border-amber-400/70 transition-all cursor-pointer shadow-inner"
                    title="انقر لتكبير ومعاينة تفاصيل التاج ثلاثي الأبعاد"
                  >
                    <div className="text-[10px] text-amber-300 font-bold mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{crownDataMap[t].title}</span>
                    </div>
                    <div className="py-1">
                      <RealisticCrown tier={t} size="lg" animated={true} />
                    </div>
                    <div className="text-[9px] text-zinc-400 leading-snug line-clamp-2 px-1 mt-1">
                      {crownDataMap[t].desc}
                    </div>
                  </div>

                  {/* Live VIP Name Preview */}
                  <div className="bg-[#050505] rounded-xl p-2 text-center mb-3 border border-zinc-800">
                    <div className="text-[10px] text-zinc-400 mb-1">شكل الاسم بالرتبة:</div>
                    <VIPName nickname={currentUser.nickname} vipTier={t} size="sm" showCrown={true} />
                  </div>

                  {/* Perks list */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[10px] font-bold text-zinc-300">المميزات الحصرية:</div>
                    {config.perks.slice(0, 5).map((perk, i) => (
                      <div key={i} className="text-[11px] text-zinc-300 flex items-start gap-1 leading-relaxed">
                        <Check className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select / Request Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(t);
                    setShowRequestModal(true);
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-md ${
                    t === 'mythic'
                      ? 'bg-gradient-to-r from-yellow-400 via-rose-500 to-purple-600 hover:from-yellow-300 text-black font-black shadow-rose-900/50'
                      : t === 'royal'
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 text-white shadow-purple-900/40'
                      : t === 'gold'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black shadow-amber-500/20'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span className="truncate">طلب تفعيل {config.nameAr}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXCLUSIVE MYTHIC VIP FRAMES SHOWCASE & SELECTOR (HIGHEST TIER EXCLUSIVE) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-b from-[#1E0616] via-[#14051B] to-[#0A040E] border-2 border-amber-400/60 p-5 sm:p-7 md:p-8 shadow-2xl relative overflow-hidden ring-1 ring-amber-400/30">
        {/* Subtle Background Radial Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/25 via-purple-600/30 to-amber-500/25 border border-amber-400/60 text-amber-300 text-xs font-black mb-2.5 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>ميزة حصرية خاصة بأعلى فئة فقط (VIP الأسطوري)</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center justify-center gap-2">
            <span>صالة اختيار إطارات VIP الأسطوري الملكية</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
            تمتلك أعلى رتبة في الديوان امتيازاً فريداً من نوعه: <span className="text-amber-300 font-bold">حرية اختيار شكل ونوع الإطار الملكي</span> الذي يحيط بصورتك في جميع الغرف والملفات، مع خيارات أسطورية مستوحاة من عروش السلاطين، لهب التنانين، سديم المجرات، وصقور الصحراء.
          </p>
        </div>

        {/* Status Alert Banner */}
        <div className="relative z-10 mb-6">
          {isMythicUser ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-900/30 to-amber-500/15 border border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0 text-amber-300">
                  <Check className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-black text-amber-300 flex items-center gap-1.5 justify-center sm:justify-start">
                    <span>ميزة الاختيار مفعلة بالكامل لحسابك الملكي</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-[10px] text-amber-200 border border-amber-400/40">VIP 5 MYTHIC</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    اختر أي إطار من التشكيلة الأسطورية أدناه وسيتم اعتماده وتحديثه فوراً لصورتك وملفك الشخصي.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[11px] text-zinc-400">الإطار المعتمد الآن:</span>
                <span className="px-2.5 py-1 rounded-xl bg-[#0F041A] border border-amber-400 text-amber-300 font-bold text-xs">
                  {getMythicFrameById(activeMythicFrameId).nameAr}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#14061A]/90 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-950/80 border border-purple-500/60 flex items-center justify-center shrink-0 text-purple-300">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-black text-purple-200 flex items-center gap-1.5 justify-center sm:justify-start">
                    <span>ميزة حصرية مقفلة - خاصة فقط برتبة VIP الأسطوري (VIP 5)</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    أنت حالياً برتبة ({currentUser.vipTier === 'none' ? 'عضو عادي' : VIP_CONFIGS[currentUser.vipTier]?.nameAr}). لا يستطيع المشتركون في الفئات الأخرى تغيير شكل الإطار. يمكنك معاينة الأشكال أدناه والترقية لفتح كامل التشكيلة.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedTier('mythic');
                  setShowRequestModal(true);
                  playSoundEffect('vip_fanfare');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-300 hover:brightness-110 text-black font-black text-xs shadow-lg flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
              >
                <Crown className="w-4 h-4 text-black" />
                <span>الترقية إلى VIP الأسطوري لفتح الإطارات</span>
              </button>
            </div>
          )}

          {/* Success toast notification */}
          {mythicSuccessMsg && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs font-black flex items-center justify-center gap-2 animate-bounce shadow-xl">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{mythicSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* 6 Mythic Frames Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {MYTHIC_FRAMES.map((frame) => {
            const isActive = isMythicUser && activeMythicFrameId === frame.id;

            return (
              <div
                key={frame.id}
                onClick={() => handleChooseMythicFrame(frame)}
                className={`relative rounded-2xl p-4 md:p-5 border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-b from-[#25072B] via-[#1A0520] to-[#0D0312] border-yellow-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] ring-2 ring-yellow-400'
                    : 'bg-[#0E0416]/90 border-purple-900/50 hover:border-amber-400/60 hover:bg-[#150620]'
                }`}
              >
                {/* Active Selected Badge */}
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-[10px] shadow-lg flex items-center gap-1 border border-yellow-200">
                    <Check className="w-3 h-3 text-black stroke-[3]" />
                    <span>إطارك المعتمد حالياً</span>
                  </div>
                )}

                <div>
                  {/* Card Top Title & Icon */}
                  <div className="flex items-center justify-between gap-2 border-b border-purple-900/40 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{frame.icon}</span>
                      <div>
                        <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                          {frame.nameAr}
                        </h4>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {frame.nameEn}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: frame.primaryColor }}
                        title="اللون الأساسي"
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: frame.secondaryColor }}
                        title="اللون الثانوي"
                      />
                    </div>
                  </div>

                  {/* Frame Live Avatar Preview */}
                  <div className="py-4 my-2 flex flex-col items-center justify-center bg-[#07020B]/70 rounded-2xl border border-purple-900/30">
                    <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                      <AvatarWithFrame
                        avatarUrl={currentUser.avatar}
                        vipTier="mythic"
                        mythicFrameId={frame.id}
                        size="xl"
                        showCrown={true}
                      />
                    </div>
                    <span className="mt-3 text-[11px] font-bold text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30">
                      {frame.badgeTitleAr}
                    </span>
                  </div>

                  {/* Frame Description */}
                  <p className="text-xs text-zinc-300 leading-relaxed mt-2 mb-3 min-h-[38px]">
                    {frame.descriptionAr}
                  </p>

                  {/* Features badges */}
                  <div className="grid grid-cols-2 gap-1.5 my-3">
                    {frame.featuresAr.map((feat, idx) => (
                      <div
                        key={idx}
                        className="text-[10px] text-zinc-300 bg-[#170524] px-2 py-1 rounded-lg border border-purple-900/40 flex items-center gap-1 truncate"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-3 border-t border-purple-900/30 mt-2">
                  {isMythicUser ? (
                    isActive ? (
                      <button
                        disabled
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-black flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Check className="w-4 h-4 text-black stroke-[3]" />
                        <span>الإطار المعتمد لصورتك</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseMythicFrame(frame);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-[#1F0728] hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 text-amber-300 hover:text-black border border-amber-400/50 flex items-center justify-center gap-1.5 shadow-md transition-all duration-200"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>اختيار وتفعيل هذا الإطار الملكي</span>
                      </button>
                    )
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTier('mythic');
                        setShowRequestModal(true);
                        playSoundEffect('bell');
                      }}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#14061A] hover:bg-purple-950/80 text-zinc-400 hover:text-amber-300 border border-purple-900/60 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>ترقية إلى VIP الأسطوري لفتح الإطار</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-3xl bg-gradient-to-b from-[#110B18] via-[#09060E] to-[#050408] border border-amber-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black mb-2">
            <Crown className="w-3.5 h-3.5" />
            <span>معرض التيجان الملكية ثلاثية الأبعاد الحصرية</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            شكل وتصميم التاج ثلاثي الأبعاد لكل رتبة VIP
          </h3>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            تم تصميم كل تاج بشكل هندسي ثلاثي الأبعاد فريد يعكس هوية الرتبة والحيوان الرمزي مع دوران فضائي بطيء وتوهج نبضي تفاعلي عند التمرير.
          </p>
        </div>

        {/* Tier Selector Buttons for 3D Crown Inspection */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => {
                setPreviewCrownTier(t);
                playSoundEffect('bell');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                previewCrownTier === t
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-[#0B0912] hover:bg-[#141020] text-zinc-300 border border-zinc-800'
              }`}
            >
              <span>{crownDataMap[t].icon}</span>
              <span>{crownDataMap[t].subtitle}</span>
            </button>
          ))}
        </div>

        {/* Interactive 3D Floating Stage */}
        <div className="max-w-2xl mx-auto rounded-2xl bg-[#040306] border border-amber-500/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
          <div className="w-48 h-48 relative flex items-center justify-center shrink-0">
            <Floating3DCrownAnimation
              tier={previewCrownTier}
              size="hero"
              showAmbientLight={true}
              showRays={true}
              showSparkles={true}
            />
          </div>

          <div className="flex-1 space-y-3 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40">
                {crownDataMap[previewCrownTier].subtitle}
              </span>
              <h4 className="text-lg font-black text-white">
                {crownDataMap[previewCrownTier].title}
              </h4>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {crownDataMap[previewCrownTier].desc}
            </p>

            <div className="p-3 rounded-xl bg-[#0A0712] border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <div className="text-amber-400 font-bold">المعادن والأحجار الكريمة:</div>
              <div>{crownDataMap[previewCrownTier].stones}</div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                يظهر هذا التاج عائمًا ومتحركًا فوق صورتك بالديوان الصوتي.
              </span>
              <button
                onClick={() => {
                  setSelectedTier(previewCrownTier);
                  setShowRequestModal(true);
                }}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-black shadow hover:from-amber-400 transition-all cursor-pointer"
              >
                طلب هذه الرتبة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0A0A0A] border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
            
            {requestSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h3 className="text-lg font-black text-white">تم إرسال طلب التفعيل بنجاح!</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  تم إرسال بياناتك إلى لوحة تحكم المالك مباشرة وسيتم تفعيل رتبة {VIP_CONFIGS[selectedTier].nameAr} فور مراجعة الدفع الخارجي.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-black">طلب تفعيل {VIP_CONFIGS[selectedTier].nameAr}</h3>
                  </div>
                  <button onClick={() => setShowRequestModal(false)} className="text-zinc-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSubmitRequest} className="mt-4 space-y-4 text-right">
                  
                  {/* Selected Tier Banner */}
                  <div className="p-3 bg-[#050505] rounded-2xl border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-zinc-400">الباقة المختارة:</div>
                      <div className="text-sm font-black text-amber-300">{VIP_CONFIGS[selectedTier].nameAr}</div>
                    </div>
                    <VIPBadge tier={selectedTier} size="md" />
                  </div>

                  {/* Duration selection */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">مدة الاشتراك المطلوبة:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { m: 1, label: 'شهر' },
                        { m: 3, label: '3 أشهر' },
                        { m: 6, label: '6 أشهر' },
                        { m: 12, label: 'سنة كاملة' },
                      ].map((item) => (
                        <button
                          key={item.m}
                          type="button"
                          onClick={() => setDurationMonths(item.m)}
                          className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                            durationMonths === item.m
                              ? 'border-amber-400 bg-amber-500 text-black font-black'
                              : 'border-zinc-800 bg-[#050505] text-zinc-300 hover:bg-[#121212]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Method */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">طريقة التواصل المفضلة:</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {[
                        { id: 'whatsapp', name: 'واتساب', icon: '💬' },
                        { id: 'telegram', name: 'تيليجرام', icon: '✈️' },
                        { id: 'phone', name: 'اتصال هاتفي', icon: '📞' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setContactMethod(m.id as any)}
                          className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 ${
                            contactMethod === m.id
                              ? 'border-amber-400 bg-amber-950/40 text-amber-300'
                              : 'border-zinc-800 bg-[#050505] text-zinc-400 hover:bg-[#121212]'
                          }`}
                        >
                          <span>{m.icon}</span>
                          <span>{m.name}</span>
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      required
                      value={contactDetails}
                      onChange={(e) => setContactDetails(e.target.value)}
                      placeholder={
                        contactMethod === 'whatsapp'
                          ? 'رقم الواتساب مع مفتاح الدولة (+966...)'
                          : contactMethod === 'telegram'
                          ? 'معرّف تيليجرام (@username)'
                          : 'رقم الهاتف'
                      }
                      className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Payment Reference code (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">رقم مرجع الحوالة / إشعار الدفع (اختياري):</label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="مثال: TRX-993847 أو اسم صاحب الحساب"
                      className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">ملاحظات للمالك:</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أي تفاصيل إضافية تريد إبلاغ المالك بها..."
                      className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      إرسال الطلب للمالك
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
