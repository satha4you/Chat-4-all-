import React from 'react';
import { DeviceViewMode } from '../../types';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  deviceMode: DeviceViewMode;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ deviceMode, children }) => {
  if (deviceMode === 'responsive') {
    return <div className="w-full min-h-screen pb-20">{children}</div>;
  }

  // Simulated Mobile App Shell (Flutter / Mobile view)
  return (
    <div className="min-h-screen py-6 px-2 flex flex-col items-center justify-center bg-[#050505] text-zinc-100">
      
      {/* Device Shell Outer Frame */}
      <div className="relative w-full max-w-[420px] h-[890px] rounded-[48px] bg-[#0A0A0A] p-3 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.08)] border-4 border-[#1A1A1A] flex flex-col overflow-hidden">
        
        {/* Phone Speaker & Camera Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-32 h-4 bg-[#050505] rounded-full flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
          <div className="w-10 h-1 rounded-full bg-[#1A1A1A]" />
        </div>

        {/* Mobile Status Bar */}
        <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] text-zinc-400 font-bold z-40 bg-[#080808]/90 shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-zinc-300" />
            <Wifi className="w-3 h-3 text-zinc-300" />
            <Battery className="w-3.5 h-3.5 text-zinc-300" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="relative flex-1 overflow-y-auto bg-[#050505] rounded-[36px] overflow-hidden flex flex-col">
          {children}
        </div>

        {/* Home Navigation Indicator Bar */}
        <div className="w-32 h-1 bg-zinc-700 rounded-full mx-auto mt-2 shrink-0 opacity-60" />
      </div>
    </div>
  );
};
