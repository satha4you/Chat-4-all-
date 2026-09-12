import React, { useState, useEffect } from 'react';
import { OwnerContactInfo, UserProfile } from '../../types';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Send, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink, 
  Crown, 
  ShieldCheck, 
  Sparkles,
  X,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';
import { playSoundEffect } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { OWNER_CONTACT_INFO } from '../../data/initialData';

interface OwnerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo: OwnerContactInfo;
  currentUser: UserProfile;
  initialEditMode?: boolean;
  onUpdateContactInfo?: (newInfo: Partial<OwnerContactInfo>) => void;
  onOpenAdminDashboard?: () => void;
  onRequestUpgrade?: () => void;
}

export const OwnerContactModal: React.FC<OwnerContactModalProps> = ({
  isOpen,
  onClose,
  contactInfo,
  currentUser,
  initialEditMode = false,
  onUpdateContactInfo,
  onOpenAdminDashboard,
  onRequestUpgrade,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const isOwner = currentUser.role === 'owner' || currentUser.id === 'user_owner';

  // Form edit states
  const [editWhatsApp, setEditWhatsApp] = useState(contactInfo.whatsappNumber || '');
  const [editTelegram, setEditTelegram] = useState(contactInfo.telegramHandle || '');
  const [editEmail, setEditEmail] = useState(contactInfo.email || '');
  const [editPhone, setEditPhone] = useState(contactInfo.phone || '');
  const [editSupportHours, setEditSupportHours] = useState(contactInfo.supportHours || '');
  const [editInstructions, setEditInstructions] = useState(contactInfo.customInstructionsAr || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setIsEditing(initialEditMode);
  }, [initialEditMode, isOpen]);

  useEffect(() => {
    setEditWhatsApp(contactInfo.whatsappNumber || '');
    setEditTelegram(contactInfo.telegramHandle || '');
    setEditEmail(contactInfo.email || '');
    setEditPhone(contactInfo.phone || '');
    setEditSupportHours(contactInfo.supportHours || '');
    setEditInstructions(contactInfo.customInstructionsAr || '');
  }, [contactInfo]);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    playSoundEffect('bell');
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTg = editTelegram.replace('@', '').trim();
    const cleanWa = editWhatsApp.replace(/[^0-9+]/g, '').trim();

    const updated: Partial<OwnerContactInfo> = {
      whatsappNumber: editWhatsApp.trim(),
      whatsappLink: cleanWa ? `https://wa.me/${cleanWa.replace('+', '')}` : '',
      telegramHandle: editTelegram.trim().startsWith('@') ? editTelegram.trim() : (editTelegram.trim() ? `@${editTelegram.trim()}` : ''),
      telegramLink: cleanTg ? `https://t.me/${cleanTg}` : '',
      email: editEmail.trim(),
      phone: editPhone.trim(),
      supportHours: editSupportHours.trim(),
      customInstructionsAr: editInstructions.trim(),
    };

    if (onUpdateContactInfo) {
      onUpdateContactInfo(updated);
    }

    setSaveSuccess(true);
    playSoundEffect('vip_fanfare');
    confetti({ particleCount: 40, spread: 50 });

    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1500);
  };

  const handleResetDefaults = () => {
    setEditWhatsApp(OWNER_CONTACT_INFO.whatsappNumber);
    setEditTelegram(OWNER_CONTACT_INFO.telegramHandle);
    setEditEmail(OWNER_CONTACT_INFO.email);
    setEditPhone(OWNER_CONTACT_INFO.phone);
    setEditSupportHours(OWNER_CONTACT_INFO.supportHours || '');
    setEditInstructions(OWNER_CONTACT_INFO.customInstructionsAr);
    if (onUpdateContactInfo) {
      onUpdateContactInfo(OWNER_CONTACT_INFO);
    }
    playSoundEffect('bell');
  };

  const cleanWhatsappNumber = contactInfo.whatsappNumber.replace(/[^0-9+]/g, '');
  const actualWhatsappUrl = contactInfo.whatsappLink || `https://wa.me/${cleanWhatsappNumber.replace('+', '')}`;
  const cleanTelegram = contactInfo.telegramHandle.replace('@', '');
  const actualTelegramUrl = contactInfo.telegramLink || `https://t.me/${cleanTelegram}`;

  return (
    <div 
      id="owner_contact_modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-text"
    >
      <div className="relative w-full max-w-lg bg-[#0C0D14] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-zinc-100 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  {isEditing ? 'تعديل معلومات التواصل (المالك)' : 'ملف التواصل مع المالك'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>معتمد رسميًا</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {isEditing ? 'حدّث وسائل التواصل الرسمية لتظهر فوراً في كافة أرجاء المنصة' : 'لطلب ترقية VIP، الاستفسارات الخاصة، أو الشراكات الرسمية'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isOwner && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-all"
                title="تعديل معلومات التواصل"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تعديل</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn shrink-0">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>تم حفظ وتعميم معلومات التواصل بنجاح في كافة أرجاء المنصة!</span>
          </div>
        )}

        {/* Content Body */}
        <div className="relative z-10 py-4 space-y-4 text-right overflow-y-auto flex-1 pr-1">
          {isEditing ? (
            /* Inline Editing Form for Platform Owner */
            <form onSubmit={handleSaveContactInfo} className="space-y-3.5">
              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>رقم الواتساب الرسمي (مع مفتاح الدولة):</span>
                </label>
                <input
                  type="text"
                  value={editWhatsApp}
                  onChange={(e) => setEditWhatsApp(e.target.value)}
                  placeholder="+966 50 000 0000"
                  dir="ltr"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Telegram */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>معرف التيليجرام (@username):</span>
                </label>
                <input
                  type="text"
                  value={editTelegram}
                  onChange={(e) => setEditTelegram(e.target.value)}
                  placeholder="@owner_telegram"
                  dir="ltr"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>البريد الإلكتروني الرسمي المعتمد:</span>
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="contact@satha.com"
                  dir="ltr"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>رقم الهاتف المباشر (اختياري):</span>
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+966 50 000 0000"
                  dir="ltr"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Support Hours */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>أوقات وساعات الرد والتواصل:</span>
                </label>
                <input
                  type="text"
                  value={editSupportHours}
                  onChange={(e) => setEditSupportHours(e.target.value)}
                  placeholder="يوميًا من 10 صباحًا حتى 2 بعد منتصف الليل بتوقيت مكة"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>نص التوجيهات والتعليمات للأعضاء عند طلب الترقية:</span>
                </label>
                <textarea
                  rows={3}
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                  placeholder="يرجى التواصل عبر الواتساب أو البريد مع ذكر اسم المستخدم ونوع الباقة المطلوبة..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              {/* Action buttons inside form */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center gap-1 border border-zinc-800"
                  title="استعادة الافتراضي"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>افتراضي</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black text-xs font-black shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التعديلات فورًا</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Normal View */
            <>
              {/* Custom Instructions Banner */}
              {contactInfo.customInstructionsAr && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900/60 to-amber-950/30 border border-amber-500/30 text-xs text-amber-200 leading-relaxed shadow-inner">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تعليمات وتوجيهات المالك لطلب الترقية:</span>
                  </div>
                  <p className="text-zinc-300 text-xs">{contactInfo.customInstructionsAr}</p>
                </div>
              )}

              {/* Contact Channels Grid */}
              <div className="space-y-2.5">
                
                {/* Email Channel */}
                <div className="p-3 rounded-2xl bg-[#07080D] border border-zinc-800/90 flex items-center justify-between gap-2 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-zinc-500">البريد الإلكتروني المعتمد:</div>
                      <div className="font-mono text-xs font-bold text-amber-300 truncate">
                        {contactInfo.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(contactInfo.email, 'email')}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs flex items-center gap-1"
                      title="نسخ البريد"
                    >
                      {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`mailto:${contactInfo.email}?subject=طلب ترقية أو استفسار - ديوان VIP&body=مرحبًا مالك المنصة،%0D%0A%0D%0Aاسم الحساب: ${currentUser.nickname} (@${currentUser.username})%0D%0Aالموضوع:%20`}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1 shadow transition-all active:scale-95"
                    >
                      <span>مراسلة</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* WhatsApp Channel */}
                <div className="p-3 rounded-2xl bg-[#07080D] border border-zinc-800/90 flex items-center justify-between gap-2 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-zinc-500">رقم واتساب المالك المباشر:</div>
                      <div className="font-mono text-xs font-bold text-zinc-200 dir-ltr text-right truncate">
                        {contactInfo.whatsappNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(contactInfo.whatsappNumber, 'whatsapp')}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs flex items-center gap-1"
                      title="نسخ الرقم"
                    >
                      {copiedField === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={actualWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 shadow transition-all active:scale-95"
                    >
                      <span>محادثة</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Telegram Channel */}
                <div className="p-3 rounded-2xl bg-[#07080D] border border-zinc-800/90 flex items-center justify-between gap-2 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                      <Send className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-zinc-500">تيليجرام المالك:</div>
                      <div className="font-mono text-xs font-bold text-sky-300 dir-ltr text-right truncate">
                        {contactInfo.telegramHandle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(contactInfo.telegramHandle, 'telegram')}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs flex items-center gap-1"
                      title="نسخ المعرف"
                    >
                      {copiedField === 'telegram' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={actualTelegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black flex items-center gap-1 shadow transition-all active:scale-95"
                    >
                      <span>تيليجرام</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Phone direct call if provided */}
                {contactInfo.phone && contactInfo.phone !== contactInfo.whatsappNumber && (
                  <div className="p-3 rounded-2xl bg-[#07080D] border border-zinc-800/90 flex items-center justify-between gap-2 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-zinc-500">هاتف الاتصال:</div>
                        <div className="font-mono text-xs font-bold text-zinc-200 dir-ltr text-right truncate">
                          {contactInfo.phone}
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-bold flex items-center gap-1 shadow transition-all"
                    >
                      <span>اتصال</span>
                      <Phone className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Support Hours */}
              {contactInfo.supportHours && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-900 text-[11px] text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>أوقات الرد والتواصل: {contactInfo.supportHours}</span>
                </div>
              )}

              {/* Owner Control Actions (Visible if current user is owner) */}
              {isOwner && (
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-amber-300">أنت مسجل كمالك للمنصة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-black" />
                      <span>تعديل معلومات التواصل هنا</span>
                    </button>
                    {onOpenAdminDashboard && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenAdminDashboard();
                        }}
                        className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold"
                      >
                        لوحة التحكم
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors"
          >
            إغلاق
          </button>

          {!isEditing && onRequestUpgrade && (
            <button
              onClick={() => {
                onClose();
                onRequestUpgrade();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black text-xs font-black shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>تقديم طلب ترقية VIP الآن</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
