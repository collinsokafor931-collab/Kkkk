import React from 'react';
import { Sparkles, CheckCircle, Package, Truck, Compass, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onExploreClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onExploreClick }) => {
  const steps = [
    {
      num: '01',
      title: 'CHOOSE',
      subtitle: 'Browse the collection and select what you want.',
      description: 'Explore our curated runway editions, bespoke fine jewelry, and limited leather goods. Review detailed material specifications, craft origin, and expected batch dispatch windows.',
      icon: Sparkles,
      tag: 'Bespoke Selection'
    },
    {
      num: '02',
      title: 'PRE-ORDER',
      subtitle: 'Choose your options and submit your pre-order.',
      description: 'Customize your options—sizes, leather finishes, personalized initials, and hardware accents. Reserve your slot in the active production allocation with full prepayment or 30% deposit.',
      icon: CheckCircle,
      tag: 'Guaranteed Quota'
    },
    {
      num: '03',
      title: 'WE SOURCE/PREPARE',
      subtitle: 'Your order is processed according to the stated pre-order timeline.',
      description: 'Our European and artisan ateliers source grade-A materials and handcraft your piece to exact commission. Receive regular milestone updates and private photography as your piece nears completion.',
      icon: Package,
      tag: 'Artisanal Craft'
    },
    {
      num: '04',
      title: 'DELIVERY',
      subtitle: 'You receive your order when it is ready.',
      description: 'Following rigorous VIP quality control and hallmarking, your order is secured in signature archival presentation packaging and dispatched via insured white-glove courier directly to your door.',
      icon: Truck,
      tag: 'White-Glove VIP'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f3efe6] border border-stone-200 text-[10px] tracking-[0.3em] uppercase text-[#946e1c] font-semibold mb-4">
          <Compass className="w-3 h-3" />
          <span>The Pre-Order Model</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-wide mb-5">
          HOW PRE-ORDER <span className="font-normal italic font-editorial gold-gradient-text">WORKS</span>
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Unlike ordinary mass-market stores, Shantel Variety Shop commissions only what is ordered. 
          This guarantees pristine quality, eliminates warehouse deadstock, and awards you exceptional luxury at fair atelier valuations.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e4dc] hover:border-[#b3882a]/50 transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(160,120,40,0.1)]"
            >
              <div>
                {/* Step number and tag */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl sm:text-4xl font-light tracking-widest text-[#946e1c]/60 group-hover:text-[#946e1c] transition-colors">
                    {step.num}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#f5f3ee] text-stone-700 border border-stone-200 font-medium">
                    {step.tag}
                  </span>
                </div>

                {/* Step Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#f3efe6] border border-stone-200 group-hover:border-[#946e1c]/40 flex items-center justify-center text-[#946e1c] mb-6 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Step Title */}
                <h3 className="font-serif text-xl text-stone-900 tracking-wider mb-2 group-hover:text-[#946e1c] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-stone-800 font-medium tracking-wide mb-3 leading-snug">
                  {step.subtitle}
                </p>

                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress connection indicator */}
              <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400">
                <span>Phase 0{idx + 1} of 04</span>
                <span className="text-[#946e1c] opacity-0 group-hover:opacity-100 transition-opacity">✦</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Assurance Card */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#f5f3ee] border border-stone-300 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-[#946e1c]/15 flex items-center justify-center text-[#946e1c] shrink-0 border border-[#946e1c]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base text-stone-900 tracking-wide font-medium">
              Complete Pre-Order Peace of Mind
            </h4>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              All pre-orders come with real-time milestone notifications, a 14-day modification window, and guaranteed dispatch horizons backed by our VIP concierge team.
            </p>
          </div>
        </div>

        <button
          onClick={onExploreClick}
          className="px-6 py-3 bg-stone-900 text-white hover:bg-black font-semibold text-xs tracking-widest uppercase rounded-full transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>Reserve A Piece</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#e5c07b]" />
        </button>
      </div>
    </section>
  );
};
