import React, { useState } from 'react';
import { UserProfile, ChatMessage, Gift } from '../../types';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPBadge } from '../common/VIPBadge';
import { VIPName } from '../common/VIPName';
import { INITIAL_GIFTS } from '../../data/initialData';
import { MessageSquare, Send, Gift as GiftIcon, Sparkles, Check, CheckCheck, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from '../../utils/soundEffects';

interface DirectMessagesViewProps {
  currentUser: UserProfile;
  users: UserProfile[];
  onUserClick: (user: UserProfile) => void;
  targetUser?: UserProfile | null;
}

export const DirectMessagesView: React.FC<DirectMessagesViewProps> = ({
  currentUser,
  users,
  onUserClick,
  targetUser,
}) => {
  const otherUsers = users.filter((u) => u.id !== currentUser.id);
  const [selectedUser, setSelectedUser] = useState<UserProfile>(targetUser || otherUsers[0] || currentUser);
  const [inputText, setInputText] = useState('');
  const [showGiftSelector, setShowGiftSelector] = useState(false);

  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({
    user_owner: [
      {
        id: 'dm_1',
        sender: otherUsers[0] || currentUser,
        content: 'مرحبًا بك في منصة ديوان VIP! يسعدنا تواجدك معنا، لأي استفسارات أو اشتراكات لا تتردد في مراسلتي.',
        type: 'text',
        timestamp: '10:30 ص',
      },
    ],
  });

  const currentMessages = chatHistory[selectedUser.id] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: 'dm_' + Date.now(),
      sender: currentUser,
      content: inputText.trim(),
      type: 'text',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMsg],
    }));

    setInputText('');

    // Simulated reply after 1.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: 'reply_' + Date.now(),
        sender: selectedUser,
        content: `أهلًا بك يا ${currentUser.nickname} 👑، تم استلام رسالتك بكل سرور! نتشرف بوجودك في ديواننا الصوتي.`,
        type: 'text',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), replyMsg],
      }));
      playSoundEffect('bell');
    }, 1500);
  };

  const handleSendGift = (gift: Gift) => {
    playSoundEffect('gift_sparkle');
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    const giftMsg: ChatMessage = {
      id: 'dm_gift_' + Date.now(),
      sender: currentUser,
      content: `أرسل لك هدية ${gift.nameAr} ${gift.icon} بقيمة ${gift.coins} كوينز!`,
      type: 'gift',
      giftData: {
        gift,
        count: 1,
        receiverName: selectedUser.nickname,
      },
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), giftMsg],
    }));
    setShowGiftSelector(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-4 h-[calc(100vh-140px)] flex flex-col md:flex-row rounded-3xl bg-[#0F1018] border border-amber-500/30 overflow-hidden shadow-2xl text-zinc-100 animate-fadeIn">
      
      {/* Users Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-zinc-800 flex flex-col shrink-0">
        <div className="p-3.5 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            المحادثات الخاصة
          </h2>
          <span className="text-[11px] text-zinc-500">{otherUsers.length} جهات اتصال</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40">
          {otherUsers.length === 0 ? (
            <div className="p-6 text-center text-zinc-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-amber-500/60" />
              <p className="text-xs font-bold text-zinc-300">لا توجد محادثات أعضاء حاليًا</p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                تم تنظيف الحسابات التجريبية. ستظهر رسائل واستفسارات الأعضاء الجدد فور انضمامهم للمنصة.
              </p>
            </div>
          ) : (
            otherUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                  selectedUser.id === user.id
                    ? 'bg-amber-950/40 border-r-2 border-amber-400'
                    : 'hover:bg-zinc-900/60'
                }`}
              >
                <AvatarWithFrame user={user} size="sm" showCrown={true} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <VIPName user={user} size="xs" />
                    <VIPBadge tier={user.vipTier} size="xs" showText={false} />
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{user.status || user.bio || 'متاح في الديوان'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {otherUsers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0B0C12] text-zinc-400 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-b from-amber-500/20 to-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
            <Crown className="w-8 h-8 text-amber-400" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-base font-black text-white">صندوق المحادثات والرسائل الخاصة للمالك</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              أنت مسجل حاليًا بصفتك المالك الرسمي العام <span className="text-amber-400 font-bold">{currentUser.nickname}</span>.
              يمكنك استقبال رسائل الأعضاء، الرد على الاستفسارات، وإهداء الهدايا الفاخرة مباشرة هنا.
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400">
            ✉️ البريد الرسمي المعتمد للتواصل: <span className="text-amber-300 font-mono">Satha4you@gmail.com</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-[#0B0C12] overflow-hidden">
        
        {/* Chat Top Header */}
        <div className="p-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onUserClick(selectedUser)}
          >
            <AvatarWithFrame user={selectedUser} size="sm" showCrown={true} />
            <div>
              <VIPName user={selectedUser} size="sm" />
              <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                <span>{selectedUser.country.flag}</span>
                <span>{selectedUser.country.nameAr}</span>
                <span>•</span>
                <span className="text-emerald-400">متصل الآن</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGiftSelector(!showGiftSelector)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <GiftIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إهداء</span>
            </button>
          </div>
        </div>

        {/* Gift Selector Popdown */}
        {showGiftSelector && (
          <div className="p-3 bg-zinc-950 border-b border-amber-500/40 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300">اختر هدية خاصة لـ {selectedUser.nickname}:</span>
              <button onClick={() => setShowGiftSelector(false)} className="text-xs text-zinc-400">✕</button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {INITIAL_GIFTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleSendGift(g)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-amber-950/60 border border-zinc-800 flex flex-col items-center group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{g.icon}</span>
                  <span className="text-[9px] text-zinc-300 mt-1 truncate w-full text-center">{g.nameAr}</span>
                  <span className="text-[9px] text-amber-400 font-bold">{g.coins} 🪙</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 opacity-40" />
              <p>ابدأ محادثة خاصة مع {selectedUser.nickname}</p>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMine = msg.sender.id === currentUser.id;

              if (msg.type === 'gift') {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-amber-950/60 to-zinc-900 border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-2 shadow">
                      <GiftIcon className="w-4 h-4 text-rose-400" />
                      <span>{msg.content}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMine ? 'justify-start' : 'justify-end'}`}
                >
                  {!isMine && (
                    <AvatarWithFrame user={msg.sender} size="xs" showCrown={false} />
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow ${
                      isMine
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-black font-semibold rounded-br-xs'
                        : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-bl-xs'
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <div
                      className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                        isMine ? 'text-black/70' : 'text-zinc-500'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMine && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`اكتب رسالة خاصة إلى ${selectedUser.nickname}...`}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-black transition-all shadow"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>
      )}
    </div>
  );
};
