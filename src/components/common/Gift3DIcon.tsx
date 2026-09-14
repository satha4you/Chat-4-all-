import React from 'react';

interface Gift3DIconProps {
  giftId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Gift3DIcon: React.FC<Gift3DIconProps> = ({
  giftId,
  size = 'md',
  className = '',
}) => {

  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const currentSize = sizeMap[size] || sizeMap.md;


  const giftImages: Record<string, string> = {

    // الهدايا الأساسية
    gift_supercar: 'car.png',
    gift_castle: 'castle.png',
    gift_heart: 'heart.png',
    gift_dates: 'nakhla.png',
    gift_galaxy: 'planets.png',
    gift_sword: 'sword.png',
    gift_tree: 'tree.png',
    gift_clouds: 'clouds.png',
    gift_crown_jewel: 'crown.png',
    gift_diamond_rain: 'diamond.png',
    gift_dallah: 'kettle.png',
    gift_rose: 'rose.png',
    gift_treasure_chest: 'treasure-chest.png',
    gift_yacht: 'yacht.png',
    gift_jet: 'airplane.png',
    gift_coffee: 'coffee.png',
    gift_lion: 'lion.png',
    gift_oud: 'wood.png',
    gift_ring: 'ring.png',
    gift_rocket: 'rocket.png',
    gift_golden_throne: 'the-throne.png',
    gift_perfume: 'musk.png',

  };


  const imageName = giftImages[giftId];


  return (
    <div
      className={`
        relative inline-flex
        items-center justify-center
        shrink-0 select-none
        ${currentSize}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >

      {/* إضاءة وظل ثلاثي الأبعاد */}
      <div
        className="
          absolute inset-0
          rounded-2xl
          bg-gradient-to-br
          from-white/20
          via-transparent
          to-black/40
          pointer-events-none
        "
      />


      {imageName ? (

        <img
          src={`/assets/gifts/${imageName}`}
          alt={giftId}
          loading="lazy"
          className="
            relative
            w-full
            h-full
            object-contain
            drop-shadow-[0_6px_15px_rgba(255,215,0,0.45)]
            animate-[giftFloat_3s_ease-in-out_infinite]
          "
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

      ) : (

        <div
          className="
            text-4xl
            animate-pulse
          "
        >
          🎁
        </div>

      )}

    </div>
  );
};
