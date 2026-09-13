export interface MythicFrameOption {
  id: string;
  nameAr: string;
  nameEn: string;
  badgeTitleAr: string;
  icon: string;
  descriptionAr: string;
  primaryColor: string;
  secondaryColor: string;
  accentGlow: string;
  glowAuraCss: string;
  borderClasses: string;
  previewRingGradient: string;
  featuresAr: string[];
}

export const MYTHIC_FRAMES: MythicFrameOption[] = [
  {
    id: 'mythic_sovereign_wings',
    nameAr: 'تاج وأجنحة السلطان الأسطوري',
    nameEn: 'Sovereign Imperial Wings',
    badgeTitleAr: 'تاج السلطان • الأجنحة المذهبة',
    icon: '👑',
    descriptionAr: 'الإطار الإمبراطوري الأسمى: أجنحة ملكية عريضة ثلاثية الطبقات مرصعة بذهب عيار 24 مع جمشت بنفسجي متلألئ وإكليل غار إمبراطوري.',
    primaryColor: '#FBBF24',
    secondaryColor: '#A855F7',
    accentGlow: 'rgba(251, 191, 36, 0.95)',
    glowAuraCss: 'radial-gradient(circle, rgba(251, 191, 36, 0.55) 0%, rgba(168, 85, 247, 0.35) 50%, transparent 80%)',
    borderClasses: 'border-2 border-yellow-200 shadow-[0_0_36px_rgba(245,158,11,0.95),0_0_18px_rgba(234,179,8,0.8)] ring-2 ring-[#FFDF73]',
    previewRingGradient: 'from-amber-400 via-purple-600 to-yellow-300',
    featuresAr: ['أجنحة ذهبية وأرجوانية ممتدة', 'جوهرة جمشت ملكية كبرى', 'إكليل غار إمبراطوري مذهب', 'هالة نورانية دوارة'],
  },
  {
    id: 'mythic_fire_dragon',
    nameAr: 'تنين اللهب الأسطوري الخالد',
    nameEn: 'Celestial Fire Dragon',
    badgeTitleAr: 'لهب التنين • ياقوت أحمر ناري',
    icon: '🐉',
    descriptionAr: 'إطار التنين السماوي الناري: ألسنة لهب من الذهب المصهور والياقوت القرمزي تحيط بالصورة مع طاقة تنين أسطورية مشتعلة.',
    primaryColor: '#EF4444',
    secondaryColor: '#F59E0B',
    accentGlow: 'rgba(239, 68, 68, 0.95)',
    glowAuraCss: 'radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, rgba(245, 158, 11, 0.35) 50%, transparent 80%)',
    borderClasses: 'border-2 border-amber-300 shadow-[0_0_36px_rgba(239,68,68,0.95),0_0_18px_rgba(245,158,11,0.8)] ring-2 ring-red-500',
    previewRingGradient: 'from-red-600 via-amber-500 to-orange-400',
    featuresAr: ['لهب تنين متوهج من الياقوت', 'حراشف ذهبية ملكية مشتعلة', 'هالة نار أسطورية متحركة', 'جوهرة قلب التنين الناري'],
  },
  {
    id: 'mythic_cosmic_nebula',
    nameAr: 'المجرة الكونية وسديم النجوم',
    nameEn: 'Cosmic Starlight Nebula',
    badgeTitleAr: 'سديم المجرات • ألماس كوني',
    icon: '🌌',
    descriptionAr: 'إطار الفضاء والمجرات الأبدية: هالة مدارية نيزكية من البنفسجي الكوني والأزرق الفيروزي مع وميض نجوم ماسية وأقواس كوكبية دوارة.',
    primaryColor: '#8B5CF6',
    secondaryColor: '#06B6D4',
    accentGlow: 'rgba(139, 92, 246, 0.95)',
    glowAuraCss: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(6, 182, 212, 0.35) 50%, transparent 80%)',
    borderClasses: 'border-2 border-cyan-200 shadow-[0_0_36px_rgba(139,92,246,0.95),0_0_18px_rgba(6,182,212,0.8)] ring-2 ring-purple-400',
    previewRingGradient: 'from-purple-600 via-indigo-500 to-cyan-400',
    featuresAr: ['مدارات نيزكية وسديم كوني', 'نجوم ماسية رباعية الرؤوس', 'أقواس هولوغرافية سماوية', 'وميض نيون فضائي ساحر'],
  },
  {
    id: 'mythic_golden_falcon',
    nameAr: 'صقر الصحراء الأسطوري المذهب',
    nameEn: 'Royal Desert Falcon',
    badgeTitleAr: 'صقر العز • ريش الذهب الصافي',
    icon: '🦅',
    descriptionAr: 'إطار الصقر الأسطوري الحر: أجنحة ومخالب صقر ذهبي شامخ مصنوع من الذهب الخالص عيار 24 مع بريق صحراوي أصيل يجسد الأصالة والعزة.',
    primaryColor: '#F59E0B',
    secondaryColor: '#FEF08A',
    accentGlow: 'rgba(245, 158, 11, 0.95)',
    glowAuraCss: 'radial-gradient(circle, rgba(245, 158, 11, 0.65) 0%, rgba(254, 240, 138, 0.4) 50%, transparent 80%)',
    borderClasses: 'border-2 border-yellow-100 shadow-[0_0_36px_rgba(245,158,11,0.95),0_0_20px_rgba(251,191,36,0.85)] ring-2 ring-amber-300',
    previewRingGradient: 'from-yellow-400 via-amber-500 to-yellow-200',
    featuresAr: ['أجنحة صقر حر مذهبة بالكامل', 'ريش ذهبي مصقول بدقة 24K', 'مخالب صقر ملكية تحمي الصورة', 'بريق شمس الصحراء المتوهج'],
  },
  {
    id: 'mythic_ruby_ottoman',
    nameAr: 'تاج الياقوت الإمبراطوري السلطاني',
    nameEn: 'Imperial Ruby Diadem',
    badgeTitleAr: 'ديوان السلطان • ياقوت دم الغزال',
    icon: '💎',
    descriptionAr: 'إطار السلطان العثماني المرصع: نقوش أرابيسك ملكية مذهبة مع أحجار ياقوت دم الغزال الأحمر الفاخر وكرات الزمرد والألماس الإمبراطوري.',
    primaryColor: '#DC2626',
    secondaryColor: '#FCD34D',
    accentGlow: 'rgba(220, 38, 38, 0.95)',
    glowAuraCss: 'radial-gradient(circle, rgba(220, 38, 38, 0.6) 0%, rgba(252, 211, 77, 0.35) 50%, transparent 80%)',
    borderClasses: 'border-2 border-rose-200 shadow-[0_0_36px_rgba(220,38,38,0.95),0_0_18px_rgba(245,158,11,0.8)] ring-2 ring-rose-400',
    previewRingGradient: 'from-rose-600 via-yellow-500 to-red-700',
    featuresAr: ['أحجار ياقوت أحمر ملكي نادرة', 'نقوش أرابيسك ذهبية عتيقة', 'إكليل سلاطين مرصع بالألماس', 'بطانة مخملية ملكية فاخرة'],
  },
  {
    id: 'mythic_cyber_glory',
    nameAr: 'شفق النيون الملكي السيادي',
    nameEn: 'Royal Cyber Prism Aurora',
    badgeTitleAr: 'شفق النيون • نبض الكريستال',
    icon: '⚡',
    descriptionAr: 'إطار النيون والمستقبل السيادي: حلقات طاقة بلورية مضيئة متداخلة بألوان الزمرد الأخضر والذهب والسيان المشرق، تنبض بتأثير كهربائي هائل.',
    primaryColor: '#10B981',
    secondaryColor: '#F59E0B',
    accentGlow: 'rgba(16, 185, 129, 0.95)',
    glowAuraCss: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(245, 158, 11, 0.35) 50%, transparent 80%)',
    borderClasses: 'border-2 border-emerald-200 shadow-[0_0_36px_rgba(16,185,129,0.95),0_0_18px_rgba(245,158,11,0.8)] ring-2 ring-emerald-400',
    previewRingGradient: 'from-emerald-500 via-teal-400 to-amber-400',
    featuresAr: ['حلقات نيون ليزرية ثلاثية الأبعاد', 'نبض طاقة هيدروجينية سيادية', 'كريستال زمردي مضيء بالكامل', 'تأثير إلكتروني ملكي مذهل'],
  },
];

export const DEFAULT_MYTHIC_FRAME_ID = 'mythic_sovereign_wings';

export const getMythicFrameById = (frameId?: string): MythicFrameOption => {
  if (!frameId) return MYTHIC_FRAMES[0];
  const found = MYTHIC_FRAMES.find((f) => f.id === frameId);
  return found || MYTHIC_FRAMES[0];
};
