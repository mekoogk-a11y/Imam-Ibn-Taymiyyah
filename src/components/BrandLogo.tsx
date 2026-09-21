import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'wordmark-ar' | 'wordmark-en' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: { box: 'w-8 h-8', text: 'text-sm', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', text: 'text-base', sub: 'text-xs' },
    lg: { box: 'w-14 h-14', text: 'text-xl', sub: 'text-sm' },
    xl: { box: 'w-20 h-20', text: 'text-2xl', sub: 'text-base' },
  }[size];

  // SVG Emblem: Open Book + Islamic 8-pointed Rub el Hizb Geometric Star + Subtle Reed Pen Nib
  const LogoEmblem = ({ isMonochrome = false }: { isMonochrome?: boolean }) => {
    const bgFill = isMonochrome ? '#111111' : '#422D1F';
    const goldStroke = isMonochrome ? '#FFFFFF' : '#9B783E';
    const accentStroke = isMonochrome ? '#CCCCCC' : '#D4AF37';
    const paperStroke = isMonochrome ? '#888888' : '#F7F4EC';

    return (
      <svg
        viewBox="0 0 64 64"
        className={`${sizeClasses.box} shrink-0 transition-transform duration-300 group-hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded Octagonal Shield Base */}
        <rect width="64" height="64" rx="14" fill={bgFill} />

        {/* Outer 8-Pointed Star Motif Inlay */}
        <g stroke={goldStroke} strokeWidth="1" opacity="0.4">
          <rect x="14" y="14" width="36" height="36" rx="2" transform="rotate(0 32 32)" />
          <rect x="14" y="14" width="36" height="36" rx="2" transform="rotate(45 32 32)" />
        </g>

        {/* Central Traditional Open Manuscript Folios */}
        <path
          d="M16 22C16 19.8 23 18 32 18C41 18 48 19.8 48 22V44C48 41.8 41 40 32 40C23 40 16 41.8 16 44V22Z"
          fill="none"
          stroke={accentStroke}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Spine of the Manuscript */}
        <path d="M32 18V40" stroke={accentStroke} strokeWidth="2" strokeLinecap="round" />

        {/* Subtle Ruled Scholarly Lines on Left & Right Folios */}
        <path d="M21 27H28M21 32H26" stroke={paperStroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M36 27H43M38 32H43" stroke={paperStroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

        {/* Traditional Reed Pen (Qalam) Nib Symbolizing Transmission & Inquiry */}
        <path
          d="M32 9L35.5 15H28.5L32 9Z"
          fill={accentStroke}
        />
        <path d="M32 9V13" stroke={bgFill} strokeWidth="0.8" />

        {/* Central Illumination Dot */}
        <circle cx="32" cy="46" r="2.2" fill={accentStroke} />
      </svg>
    );
  };

  if (variant === 'icon') {
    return <LogoEmblem />;
  }

  if (variant === 'monochrome') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <LogoEmblem isMonochrome />
        <div className="flex flex-col">
          <span className={`font-scholarly font-bold text-[#111111] leading-tight ${sizeClasses.text}`}>
            موسوعة ابن تيمية
          </span>
          <span className={`font-mono-num tracking-wider text-[#555555] uppercase ${sizeClasses.sub}`}>
            IBN TAYMIYYAH
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'wordmark-ar') {
    return (
      <span className={`font-scholarly font-bold text-[#422D1F] ${sizeClasses.text} ${className}`}>
        موسوعة ابن تيمية
      </span>
    );
  }

  if (variant === 'wordmark-en') {
    return (
      <span className={`font-brand font-semibold tracking-wider text-[#422D1F] uppercase ${sizeClasses.text} ${className}`}>
        IBN TAYMIYYAH
      </span>
    );
  }

  // Full Brand Logo (Emblem + Arabic Wordmark + English Brand)
  return (
    <div className={`group flex items-center gap-3.5 select-none ${className}`}>
      <LogoEmblem />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span className={`font-scholarly font-bold text-[#3B2515] leading-tight ${sizeClasses.text}`}>
            موسوعة شيخ الإسلام ابن تيمية
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-brand tracking-widest text-[#7A5835] uppercase font-semibold ${sizeClasses.sub}`}>
            IBN TAYMIYYAH ENCYCLOPEDIA
          </span>
          <span className="hidden sm:inline text-[#B5A895] text-[10px]">•</span>
          <span className="hidden sm:inline font-scholarly text-[#8B7B69] text-[11px]">
            تراثٌ علمي موثّق
          </span>
        </div>
      </div>
    </div>
  );
};
