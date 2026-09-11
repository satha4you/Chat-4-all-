import React, { useState } from 'react';
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
  Edit3
} from 'lucide-react';
import { playSoundEffect } from '../../utils/soundEffects';

interface OwnerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo: OwnerContactInfo;
  currentUser: UserProfile;
  onOpenAdminDashboard?: () => void;
  onRequestUpgrade?: () => void;
}

export const OwnerContactModal: React.FC<OwnerContactModalProps> = ({
  isOpen,
  onClose,
  contactInfo,
  currentUser,
  onOpenAdminDashboard,
  onRequestUpgrade,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const isOwner = currentUser.role === 'owner' || currentUser.id === 'user_owner';

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    playSoundEffect('bell');
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
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
      <div className="relative w-full max-w-lg bg-[#0C0D14] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-zinc-100 overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">ملف التواصل مع المالك</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>معتمد رسميًا</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                لطلب ترقية VIP، الاستفسارات الخاصة، أو الشراكات الرسمية
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="relative z-10 py-4 space-y-4 text-right">
          
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
          {isOwner && onOpenAdminDashboard && (
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">أنت مسجل كمالك للمنصة</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminDashboard();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition-all flex items-center gap-1 shadow"
              >
                <span>تعديل معلومات التواصل</span>
                <Crown className="w-3 h-3 text-black" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors"
          >
            إغلاق
          </button>

          {onRequestUpgrade && (
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
