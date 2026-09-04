import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  // Check for uploaded or stored logo
  const [logoSrc, setLogoSrc] = useState<string | null>(() => {
    return localStorage.getItem('svs_custom_logo_url') || '/shantel-logo.png';
  });
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    // Check if custom logo was saved or if alternate paths exist
    const handleStorage = () => {
      const stored = localStorage.getItem('svs_custom_logo_url');
      if (stored) {
        setLogoSrc(stored);
        setImgError(false);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('logoUpdated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('logoUpdated', handleStorage);
    };
  }, []);

  const handleImageError = () => {
    // If /shantel-logo.png fails, try /logo.png before fallback
    if (logoSrc === '/shantel-logo.png') {
      setLogoSrc('/logo.png');
    } else if (logoSrc === '/logo.png') {
      setLogoSrc('/assets/logo.png');
    } else {
      setImgError(true);
    }
  };

  // Dimensions based on size
  const dimensions = {
    sm: 'h-8 max-w-[140px]',
    md: 'h-11 max-w-[200px]',
    lg: 'h-16 max-w-[280px]',
    hero: 'h-24 md:h-32 max-w-[360px]'
  }[size];

  // If an actual image asset is found and successfully loaded, render it directly
  if (logoSrc && !imgError) {
    return (
      <div className={`inline-flex flex-col items-center justify-center ${className}`}>
        <img
          src={logoSrc}
          alt="Shantel Variety Shop - The VIP Experience"
          className={`${dimensions} object-contain transition-transform duration-300`}
          onError={handleImageError}
        />
        {showSubtitle && size === 'hero' && (
          <span className="mt-2 tracking-[0.35em] text-[11px] uppercase font-light text-[#d4af37]">
            The VIP Experience
          </span>
        )}
      </div>
    );
  }

  // Authentic typographic and crest brand mark fallback when image file is loading or being linked
  return (
    <div className={`inline-flex flex-col items-center justify-center text-center select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#d4af37]/60" />
        <span className="text-[#d4af37] text-xs">✦</span>
        <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#d4af37]/60" />
      </div>

      <span
        className={`font-serif tracking-[0.25em] font-semibold text-white uppercase ${
          size === 'sm'
            ? 'text-sm'
            : size === 'md'
            ? 'text-base md:text-lg'
            : size === 'lg'
            ? 'text-xl md:text-2xl'
            : 'text-2xl md:text-4xl'
        }`}
      >
        SHANTEL VARIETY SHOP
      </span>

      {showSubtitle && (
        <span
          className={`tracking-[0.35em] uppercase text-[#d4af37] font-medium ${
            size === 'sm' ? 'text-[9px]' : size === 'hero' ? 'text-xs md:text-sm mt-1.5' : 'text-[10px]'
          }`}
        >
          “The VIP Experience”
        </span>
      )}
    </div>
  );
};
