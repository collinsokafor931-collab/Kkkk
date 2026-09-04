import React from 'react';
import { ArrowRight, Sparkles, Clock, Shield, Award } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onHowItWorksClick }) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#f9f8f5]">
      {/* Warm Ambient Background with subtle champagne lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#f9f8f5] via-[#faf8f4] to-[#f4f1ea]">
        {/* Warm Alabaster Vignette */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#f9f8f5]/60 to-[#f9f8f5]" />
      </div>

      {/* Floating subtle ambient champagne light accents */}
      <div className="absolute inset-0 z-1 pointer-events-none opacity-60">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full bg-[#d4af37]/15 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full bg-[#e8d5a7]/25 blur-[120px]" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* VIP Exclusivity Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full subtle-glass-gold mb-6 text-xs font-medium tracking-[0.25em] uppercase text-[#8c6714] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#946e1c] animate-spin" style={{ animationDuration: '8s' }} />
          <span>The VIP Experience • Bespoke Pre-Order Atelier</span>
        </div>

        {/* Brand Headline Sub-marker - Pure Typography (No Logo Image) */}
        <div className="mb-4 flex items-center gap-3">
          <span className="h-[1px] w-6 bg-[#946e1c]/40" />
          <span className="font-serif text-xs sm:text-sm tracking-[0.3em] uppercase text-stone-800 font-semibold">
            SHANTEL VARIETY SHOP
          </span>
          <span className="h-[1px] w-6 bg-[#946e1c]/40" />
        </div>

        {/* Main Cinematic Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-stone-900 max-w-4xl leading-[1.12] mb-6">
          Your Next Favorite Piece <br className="hidden sm:inline" />
          <span className="font-normal italic font-editorial gold-gradient-text">Starts Here.</span>
        </h1>

        {/* Supporting Narrative - Clear Pre-Order Purpose */}
        <p className="max-w-2xl text-base sm:text-lg text-stone-600 font-light leading-relaxed mb-10 tracking-wide">
          Reserved for connoisseurs of the rare. Shantel Variety Shop curates bespoke haute couture, artisan leathercraft, and collector timepieces crafted strictly to pre-order allocation. Experience the poise of mindful luxury—secured before production, finished exclusively for you.
        </p>

        {/* Dual Primary & Secondary Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onShopClick}
            id="hero-shop-preorder-btn"
            className="w-full sm:w-auto px-8 py-4 bg-stone-900 hover:bg-black text-white font-semibold text-xs tracking-[0.25em] uppercase rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>SHOP PRE-ORDER</span>
            <ArrowRight className="w-4 h-4 text-[#e5c07b] transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onHowItWorksClick}
            id="hero-how-it-works-btn"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-stone-50 text-stone-800 hover:text-[#946e1c] font-medium text-xs tracking-[0.25em] uppercase rounded-full border border-stone-300 hover:border-[#946e1c] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-[#946e1c]" />
            <span>HOW PRE-ORDER WORKS</span>
          </button>
        </div>

        {/* Micro Value Metrics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-stone-200 w-full max-w-4xl text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#f3efe6] border border-stone-200 text-[#946e1c]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-900 font-medium">Guaranteed Windows</p>
              <p className="text-[11px] text-stone-500">Strict batch fulfillment timelines</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#f3efe6] border border-stone-200 text-[#946e1c]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-900 font-medium">Limited Batches</p>
              <p className="text-[11px] text-stone-500">Numbered collector editions</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#f3efe6] border border-stone-200 text-[#946e1c]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-900 font-medium">30% Reservation</p>
              <p className="text-[11px] text-stone-500">Reserve now, balance on dispatch</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#f3efe6] border border-stone-200 text-[#946e1c]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-900 font-medium">VIP Concierge</p>
              <p className="text-[11px] text-stone-500">White-glove private tracking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
