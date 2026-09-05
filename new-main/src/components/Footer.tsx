import React from 'react';
import { Sparkles, Shield, Compass, PhoneCall, ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenTracker: () => void;
  onOpenConcierge: () => void;
  onOpenLogoManager?: () => void;
  onOpenAdminSpace?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenTracker,
  onOpenConcierge,
  onOpenAdminSpace,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f5f3ee] border-t border-stone-300 text-stone-600 text-xs relative pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-200">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="cursor-pointer inline-block" onClick={scrollToTop}>
              <span className="font-serif text-lg tracking-wider font-semibold text-stone-900 block">
                SHANTEL VARIETY SHOP
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#946e1c] font-medium block">
                The VIP Experience
              </span>
            </div>
            <p className="text-stone-600 text-xs font-light leading-relaxed max-w-sm">
              Shantel Variety Shop is a luxury pre-order atelier providing discerning patrons exclusive access to bespoke couture, fine leather goods, and collector timepieces.
            </p>
          </div>

          {/* Quick Pre-Order Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm text-stone-900 tracking-widest uppercase font-semibold">Pre-Order Atelier</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection('collection')}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Autumn 2026 Batch Allocations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('collection')}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Haute Couture & Silks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('collection')}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Luxury Calfskin Luggage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('collection')}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Fine Jewelry & Timepieces
                </button>
              </li>
            </ul>
          </div>

          {/* Client Experience */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm text-stone-900 tracking-widest uppercase font-semibold">Client Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-[#946e1c] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3 h-3 text-[#946e1c]" />
                  <span>Track Pre-Order Status</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenConcierge}
                  className="hover:text-[#946e1c] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3 h-3 text-[#946e1c]" />
                  <span>Private VIP Concierge</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('how-it-works')}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  How Pre-Order Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trust')}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  The VIP Standard of Trust
                </button>
              </li>
              {onOpenAdminSpace && (
                <li>
                  <button
                    onClick={onOpenAdminSpace}
                    className="hover:text-[#946e1c] transition-colors cursor-pointer flex items-center gap-1.5 text-stone-500 font-medium"
                  >
                    <Lock className="w-3 h-3 text-[#946e1c]" />
                    <span>Admin Space (Locked)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter / Exclusive Drops */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm text-stone-900 tracking-widest uppercase font-semibold">VIP Registry</h4>
            <p className="text-[11px] text-stone-500">
              Receive confidential notices 48 hours prior to public batch allocations.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-[#946e1c] font-medium">
              <Sparkles className="w-3 h-3" />
              <span>Members-Only Invitations</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Shantel Variety Shop. All Rights Reserved. “The VIP Experience”.</p>
          <div className="flex items-center gap-6">
            <span>Pre-Order Atelier Terms</span>
            <span>Insured White-Glove Transport</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer shadow-sm"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
