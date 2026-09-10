import React from 'react';
import { ActiveTab, UserProfile } from '../../types';
import { Mic, Crown, Trophy, MessageSquare, User } from 'lucide-react';
import { VIPBadge } from '../common/VIPBadge';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  currentUser,
}) => {
  const tabs = [
    { id: 'rooms', label: 'الغرف الصوتية', icon: Mic },
    { id: 'vip_club', label: 'نادي الـ VIP', icon: Crown, highlight: true },
    { id: 'top_users', label: 'المتصدرين', icon: Trophy },
    { id: 'direct_messages', label: 'الرسائل', icon: MessageSquare },
    { id: 'my_profile', label: 'حسابي', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080808]/95 border-t border-zinc-800/80 backdrop-blur-lg px-2 py-1.5 transition-all max-w-7xl mx-auto">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id as ActiveTab)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-amber-400 font-extrabold scale-105'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.highlight && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-3 animate-ping" />
              )}

              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 shadow-sm'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>

              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
