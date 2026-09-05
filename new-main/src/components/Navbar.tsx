import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Compass, ShieldCheck, Sparkles, Menu, X, PhoneCall, UploadCloud, Lock } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenConcierge: () => void;
  onOpenAssetManager?: () => void;
  onOpenLogoManager?: () => void;
  onOpenAdminSpace?: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracker,
  onOpenConcierge,
  onOpenAssetManager,
  onOpenAdminSpace,
  onNavigateSection,
  activeSection,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'collection', label: 'Pre-Order Collection' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'The VIP Experience' },
    { id: 'trust', label: 'Assurance' }
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#f9f8f5]/95 backdrop-blur-xl border-b border-[#e7e4dc] py-3 shadow-md'
          : 'bg-[#f9f8f5]/85 backdrop-blur-md border-b border-[#e7e4dc]/70 py-4'
      }`}
    >
      {/* Top micro-bar with VIP announcement */}
      <div className="hidden lg:flex justify-between items-center px-8 pb-2 text-[11px] uppercase tracking-[0.25em] text-stone-500 border-b border-stone-200/80">
        <div className="flex items-center gap-2 text-[#946e1c] font-medium">
          <Sparkles className="w-3 h-3" />
          <span>Autumn 2026 VIP Pre-Order Allocations Now Open</span>
        </div>
        <div className="flex items-center gap-6">
          {onOpenAssetManager && (
            <button
              onClick={onOpenAssetManager}
              className="text-[#946e1c] hover:text-stone-900 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Upload and preserve original product photos"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#946e1c]" />
              <span>Original Photos Vault</span>
            </button>
          )}
          {onOpenAdminSpace && (
            <button
              onClick={onOpenAdminSpace}
              className="text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-300 px-2.5 py-0.5 rounded-full font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Admin Space (Password Protected)"
            >
              <Lock className="w-3 h-3 text-[#946e1c]" />
              <span>Admin Space</span>
            </button>
          )}
          <button
            onClick={onOpenTracker}
            className="hover:text-stone-900 text-stone-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3 h-3 text-[#946e1c]" />
            <span>Track Pre-Order Status</span>
          </button>
          <button
            onClick={onOpenConcierge}
            className="hover:text-stone-900 text-stone-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3 h-3 text-[#946e1c]" />
            <span>VIP Client Concierge</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between pt-2">
        {/* Left: Navigation links */}
        <nav className="hidden md:flex items-center space-x-7">
          {navItems.slice(0, 3).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-xs uppercase tracking-[0.2em] transition-all cursor-pointer relative py-1 ${
                activeSection === item.id
                  ? 'text-[#946e1c] font-semibold'
                  : 'text-stone-700 hover:text-[#946e1c]'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#946e1c]" />
              )}
            </button>
          ))}
        </nav>

        {/* Center: Brand Typography - No Logo Image */}
        <div
          onClick={() => handleNavClick('hero')}
          className="cursor-pointer transition-transform hover:scale-[1.01] flex flex-col items-center justify-center text-center px-4 select-none"
        >
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-3 sm:w-5 bg-[#946e1c]/40" />
            <span className="font-serif tracking-[0.22em] font-semibold text-stone-900 text-sm sm:text-base md:text-lg uppercase">
              SHANTEL VARIETY SHOP
            </span>
            <span className="h-[1px] w-3 sm:w-5 bg-[#946e1c]/40" />
          </div>
          <span className="text-[8px] sm:text-[9px] tracking-[0.35em] uppercase text-[#946e1c] font-medium mt-0.5">
            THE VIP EXPERIENCE
          </span>
        </div>

        {/* Right: Actions & remaining nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.slice(3).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-xs uppercase tracking-[0.2em] transition-all cursor-pointer relative py-1 ${
                activeSection === item.id
                  ? 'text-[#946e1c] font-semibold'
                  : 'text-stone-700 hover:text-[#946e1c]'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#946e1c]" />
              )}
            </button>
          ))}

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            id="nav-preorder-cart-btn"
            className="relative px-4 py-2 rounded-full border border-stone-300 hover:border-[#946e1c] bg-white hover:bg-stone-50 transition-all flex items-center gap-2.5 cursor-pointer group shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#946e1c] group-hover:scale-110 transition-transform" />
            <span className="text-xs uppercase tracking-widest font-medium text-stone-800">
              Pre-Order Cart
            </span>
            {cartCount > 0 ? (
              <span className="w-5 h-5 rounded-full bg-[#946e1c] text-white font-bold text-[10px] flex items-center justify-center shadow">
                {cartCount}
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-stone-400 group-hover:bg-[#946e1c] transition-colors" />
            )}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-lg border border-stone-300 bg-white text-stone-900 cursor-pointer shadow-sm"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#946e1c]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#946e1c] text-white font-bold text-[9px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-950 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f9f8f5] border-b border-stone-300 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left py-2 text-sm uppercase tracking-widest text-stone-800 hover:text-[#946e1c] transition-colors border-b border-stone-200"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 flex flex-col space-y-3">
            {onOpenAssetManager && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssetManager();
                }}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#946e1c] font-semibold py-1 hover:text-stone-900"
              >
                <UploadCloud className="w-4 h-4 text-[#946e1c]" />
                <span>Original Photos Vault</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-700 py-1 hover:text-[#946e1c]"
            >
              <Compass className="w-4 h-4 text-[#946e1c]" />
              <span>Track Pre-Order Status</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConcierge();
              }}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-700 py-1 hover:text-[#946e1c]"
            >
              <PhoneCall className="w-4 h-4 text-[#946e1c]" />
              <span>VIP Client Concierge</span>
            </button>
            {onOpenAdminSpace && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminSpace();
                }}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#946e1c] font-semibold py-2 hover:text-stone-900 border-t border-stone-200"
              >
                <Lock className="w-4 h-4 text-[#946e1c]" />
                <span>Admin Space (Locked)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
