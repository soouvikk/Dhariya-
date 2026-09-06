import React, { useState } from 'react';

interface CollegeImageProps {
  coverImageUrl?: string;
  logoUrl?: string;
  collegeName: string;
  shortName?: string;
  alt?: string;
  className?: string;
  aspect?: 'video' | 'square' | 'wide' | 'auto';
  showInitialsOnFallback?: boolean;
}

export const CollegeImage: React.FC<CollegeImageProps> = ({
  coverImageUrl,
  logoUrl,
  collegeName,
  shortName,
  alt,
  className = '',
  aspect = 'video',
  showInitialsOnFallback = true,
}) => {
  const [coverFailed, setCoverFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  // Generate clean 2-3 letter initials from name
  const getInitials = (name: string, short?: string) => {
    if (short && short.length <= 5) return short;
    return name
      .split(' ')
      .filter((w) => !['of', 'in', 'and', 'the', '&', 'for'].includes(w.toLowerCase()))
      .slice(0, 3)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  };

  const initials = getInitials(collegeName, shortName);

  const aspectClass = {
    video: 'aspect-16/9',
    square: 'aspect-square',
    wide: 'aspect-21/9',
    auto: 'h-full w-full',
  }[aspect];

  // 1. Try Cover Image
  if (coverImageUrl && !coverFailed) {
    return (
      <div className={`relative overflow-hidden bg-[#171A3A] ${aspectClass} ${className}`}>
        <img
          src={coverImageUrl}
          alt={alt || collegeName}
          referrerPolicy="no-referrer"
          onError={() => setCoverFailed(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171A3A]/80 via-transparent to-transparent opacity-60" />
      </div>
    );
  }

  // 2. Try College Logo (if cover failed or wasn't provided)
  if (logoUrl && !logoFailed) {
    return (
      <div
        className={`relative overflow-hidden bg-[#FAFAF7] border-b-2 border-[#171A3A]/15 flex items-center justify-center p-4 ${aspectClass} ${className}`}
      >
        <img
          src={logoUrl}
          alt={alt || `${collegeName} logo`}
          referrerPolicy="no-referrer"
          onError={() => setLogoFailed(true)}
          className="max-h-16 max-w-[80%] object-contain"
        />
      </div>
    );
  }

  // 3. Fallback: Dhariya Editorial Branded Initials & Placeholder
  if (showInitialsOnFallback) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#171A3A] to-[#2B1B54] text-white flex flex-col items-center justify-center p-4 border-b-2 border-[#171A3A] select-none ${aspectClass} ${className}`}
      >
        <div className="font-mono text-xs uppercase tracking-widest text-[#A79BFF] mb-1 font-bold">
          Dhariya Verified Archive
        </div>
        <div className="font-extrabold text-3xl sm:text-4xl tracking-tighter text-white">
          {initials}
        </div>
        <div className="text-[11px] text-white/60 font-medium truncate max-w-[80%] mt-1">
          {collegeName}
        </div>
      </div>
    );
  }

  return null;
};
