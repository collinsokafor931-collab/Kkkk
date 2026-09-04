import React from 'react';
import { ShieldCheck, Clock, Award, Headphones, Lock, CheckCircle2 } from 'lucide-react';

interface TrustSectionProps {
  onOpenConcierge: () => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ onOpenConcierge }) => {
  const assurances = [
    {
      icon: Clock,
      title: 'Guaranteed Fulfillment Horizons',
      description: 'Every pre-order is bound by a strict batch delivery window. In the rare event of workshop delays, our VIP concierge provides instant proactive options.',
    },
    {
      icon: ShieldCheck,
      title: 'Bespoke Quality Assurance',
      description: 'Zero mass manufacturing. Every piece undergoes rigorous double-tier inspection and receives our official Shantel Variety Shop Certificate of Authenticity.',
    },
    {
      icon: Lock,
      title: 'Transparent Pricing & Deposit Security',
      description: 'Pay either 100% upfront or reserve with a 30% deposit, with the remainder payable only upon final dispatch readiness. No hidden charges or import surprises.',
    },
    {
      icon: Headphones,
      title: 'Dedicated 1-on-1 VIP Concierge',
      description: 'Direct communication via phone, WhatsApp, or email. From bespoke sizing queries to private viewing requests, your concierge is at your command.',
    },
  ];

  return (
    <section id="trust" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#946e1c] font-semibold block mb-3">
          SHANTEL VARIETY SHOP ASSURANCE
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-light tracking-wide mb-4">
          THE VIP STANDARD OF <span className="font-normal italic font-editorial text-[#946e1c]">TRUST</span>
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Pre-ordering luxury requires absolute confidence. We protect your commission with uncompromising craftsmanship standards, secure deposit vaults, and white-glove transparency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {assurances.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-[#946e1c]/50 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#fbf9f4] border border-stone-200 group-hover:border-[#946e1c]/40 flex items-center justify-center text-[#946e1c] mb-5 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg text-stone-900 tracking-wide mb-2 group-hover:text-[#946e1c] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-[10px] text-stone-500 uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3 text-[#946e1c]" />
                <span>Verified Standard</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Concierge Banner */}
      <div className="mt-12 p-8 rounded-2xl bg-[#fbf9f4] border border-[#946e1c]/35 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-left">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#946e1c] font-semibold">
            Need Guidance on a Pre-Order?
          </span>
          <h4 className="font-serif text-xl text-stone-900">Speak Directly With Our Private Concierge</h4>
          <p className="text-xs text-stone-600 max-w-xl">
            Whether you require bespoke made-to-measure sizing, custom colorway inquiries, or corporate gifting allocations, our dedicated concierge is available 7 days a week.
          </p>
        </div>

        <button
          onClick={onOpenConcierge}
          className="px-7 py-3.5 bg-stone-900 hover:bg-black text-white font-semibold text-xs tracking-[0.2em] uppercase rounded-full transition-colors cursor-pointer shrink-0 shadow-md"
        >
          Contact VIP Concierge
        </button>
      </div>
    </section>
  );
};
