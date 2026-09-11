import React from 'react';
import { UserProfile, DeviceViewMode } from '../../types';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPBadge } from '../common/VIPBadge';
import { VIPName } from '../common/VIPName';
import { 
  Crown, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Bell, 
  Plus, 
  Sparkles,
  Coins,
  LogOut,
  LogIn
} from 'lucide-react';

interface AppHeaderProps {
  currentUser: UserProfile;
  activeRole: string;
  deviceMode: DeviceViewMode;
  onToggleDeviceMode: () => void;
  onOpenAdmin: () => void;
  onOpenCreateRoom: () => void;
  onOpenProfile: () => void;
  onOpenVipStore: () => void;
  pendingRequestsCount: number;
  goldParticlesEnabled?: boolean;
  onToggleGoldParticles?: () => void;
  onLogout?: () => void;
  onOpenAdminAuth?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentUser,
  deviceMode,
  onToggleDeviceMode,
  onOpenAdmin,
  onOpenCreateRoom,
  onOpenProfile,
  onOpenVipStore,
  pendingRequestsCount,
  goldParticlesEnabled = true,
  onToggleGoldParticles,
  onLogout,
  onOpenAdminAuth,
}) => {
  const isOwner = currentUser.role === 'owner' || currentUser.id === 'user_owner';
  const isOwnerOrAdmin = isOwner || currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080511]/95 border-b border-amber-500/20 backdrop-blur-md px-3 sm:px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => window.location.reload()}>
          <div className="relative p-2 rounded-2xl bg-gradient-to-tr from-[#997316] via-[#D4AF37] to-[#FFFBEB] text-black shadow-lg shadow-amber-500/10">
            <Crown className="w-5 h-5 text-black" />
            <Sparkles className="w-2.5 h-2.5 text-purple-700 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base md:text-lg font-black tracking-tight gold-gradient-text">
                ديوان VIP
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 text-amber-300 border border-amber-500/40 font-black">
                ROYAL
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              المنصة الصوتية الملكية
            </p>
          </div>
        </div>

        {/* Center Quick Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Create Room Button */}
          <button
            onClick={onOpenCreateRoom}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-extrabold text-xs shadow-md shadow-amber-500/10 flex items-center gap-1 sm:gap-1.5 transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black stroke-[3]" />
            <span className="hidden sm:inline">غرفة جديدة</span>
          </button>

          {/* Device Frame Switcher (Hidden on narrow mobile to keep header clean) */}
          <button
            onClick={onToggleDeviceMode}
            className="hidden sm:flex p-2 rounded-xl bg-[#120B20] hover:bg-[#1A102E] text-zinc-300 hover:text-amber-400 border border-zinc-800 text-xs font-bold items-center gap-1.5 transition-colors"
            title={deviceMode === 'mobile_shell' ? 'التبديل إلى عرض الويب المتجاوب' : 'التبديل إلى معاينة تطبيق الجوال'}
          >
            {deviceMode === 'mobile_shell' ? (
              <>
                <Monitor className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-[11px]">عرض ويب</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-zinc-300" />
                <span className="hidden md:inline text-[11px]">معاينة جوال</span>
              </>
            )}
          </button>

          {/* Ambient Royal Gold Falling Particles Toggle (Hidden on narrow mobile) */}
          {onToggleGoldParticles && (
            <button
              onClick={onToggleGoldParticles}
              className={`hidden md:flex p-2 rounded-xl border text-xs font-bold items-center gap-1.5 transition-all ${
                goldParticlesEnabled
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                  : 'bg-[#120B20] hover:bg-[#1A102E] text-zinc-400 border-zinc-800'
              }`}
              title={goldParticlesEnabled ? 'إيقاف تساقط الأوراق الذهبية' : 'تفعيل تساقط الأوراق الذهبية'}
            >
              <Sparkles
                className={`w-4 h-4 ${
                  goldParticlesEnabled ? 'text-amber-400 animate-pulse' : 'text-zinc-500'
                }`}
              />
              <span className="hidden lg:inline text-[11px]">
                {goldParticlesEnabled ? 'أوراق ذهبية ✨' : 'المظهر العادي'}
              </span>
            </button>
          )}

          {/* Admin Dashboard Trigger (Owner Panel) */}
          {isOwnerOrAdmin ? (
            <button
              onClick={onOpenAdmin}
              className="relative px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#200B3B] to-[#361162] hover:from-[#2B0E50] text-purple-200 border border-purple-400/50 text-xs font-black flex items-center gap-1 sm:gap-1.5 shadow-md transition-all hover:scale-105 shrink-0"
            >
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              <span>لوحة المالك</span>
              {pendingRequestsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>
          ) : (
            onOpenAdminAuth && (
              <button
                onClick={onOpenAdminAuth}
                className="px-2.5 py-1.5 rounded-xl bg-[#140826] hover:bg-[#200D3D] text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-all shrink-0"
                title="تسجيل الدخول كمالك الحساب"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">دخول المالك</span>
              </button>
            )
          )}
        </div>

        {/* Right User Balance & Avatar Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* User Coins & VIP status */}
          <button
            onClick={onOpenVipStore}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#120B20] border border-amber-500/30 text-xs hover:border-amber-500/60 transition-colors"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-black text-amber-300">{currentUser.coins.toLocaleString()}</span>
            <VIPBadge tier={currentUser.vipTier} size="xs" showText={false} />
          </button>

          {/* User Avatar & Name */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0 px-1"
          >
            <AvatarWithFrame
              user={currentUser}
              size="sm"
              showCrown={true}
              className="group-hover:scale-105 transition-transform"
            />
            <div className="hidden lg:flex flex-col text-right">
              <VIPName user={currentUser} size="xs" />
              <span className="text-[10px] text-zinc-400">{currentUser.country.flag} @{currentUser.username}</span>
            </div>
          </div>

          {/* Quick Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
              title="تسجيل الخروج من الحساب"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline text-[11px]">خروج</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
