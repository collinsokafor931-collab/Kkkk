import React from 'react';
import { Sparkles, Diamond, Compass, Check } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Authentic VIP Sourcing Charter */}
        <div className="lg:col-span-6 relative">
          <div className="rounded-2xl bg-gradient-to-br from-[#faf8f4] to-[#f4f0e6] border border-[#e5dfd3] p-8 sm:p-10 shadow-xl relative overflow-hidden">
            {/* Subtle decorative background watermark */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#946e1c]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#946e1c]/10 border border-[#946e1c]/30 flex items-center justify-center text-[#946e1c]">
                  <Diamond className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#946e1c] font-semibold block">
                    Direct Manufacturer Protocol
                  </span>
                  <h3 className="font-serif text-xl text-stone-900 font-medium">The VIP Standard</h3>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium uppercase tracking-wider">
                Verified Sourcing
              </span>
            </div>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#946e1c]/10 flex items-center justify-center text-[#946e1c] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 mb-0.5">100% Authentic Factory Allocations</h4>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    Direct access to production runs without intermediate retail markups or inflated warehouse margins.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#946e1c]/10 flex items-center justify-center text-[#946e1c] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 mb-0.5">Untouched Original Visuals</h4>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    Real product photos straight from factory sample lots and overseas consignments — zero artificial AI modifications.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#946e1c]/10 flex items-center justify-center text-[#946e1c] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 mb-0.5">Dedicated Cargo & Delivery Guarantee</h4>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    Transparent shipping rates with complete customs clearance and nationwide courier dispatch across Nigeria.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
              <span>Shantel Variety Shop • Est. 2026</span>
              <span className="font-serif italic text-stone-700 font-medium">“Luxury Direct to You”</span>
            </div>
          </div>
        </div>

        {/* Right Column: Brand Story & Philosophy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf9f4] border border-[#946e1c]/30 text-[10px] tracking-[0.3em] uppercase text-[#946e1c] font-semibold">
            <Diamond className="w-3 h-3" />
            <span>The VIP Experience</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-light tracking-wide leading-[1.18]">
            CURATED RARITY. <br />
            <span className="font-normal italic font-editorial text-[#946e1c]">
              TAILORED EXCLUSIVELY FOR YOU.
            </span>
          </h2>

          <p className="text-stone-700 text-sm sm:text-base font-light leading-relaxed">
            Founded on the conviction that the most cherished belongings are commissioned with intention, 
            <strong className="font-semibold text-stone-900"> Shantel Variety Shop</strong> transforms contemporary e-commerce into a private salon experience.
          </p>

          <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed">
            By operating on a strictly disciplined pre-order model, we bypass the compromises of standard industrial fashion. 
            No overstocked warehouses. No diluted artisan standards. Only peerless silks, Grade-A leathers, and hand-beveled precious metals 
            commissioned in small, numbered allocations for discerning patrons around the globe.
          </p>

          {/* Pillars List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 text-xs text-stone-700">
              <div className="w-5 h-5 rounded-full bg-[#946e1c]/15 flex items-center justify-center text-[#946e1c] shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <strong className="text-stone-900 font-semibold">Mindful Sustainable Production:</strong> Raw materials are acquired strictly for reserved commissions, virtually eliminating industrial waste.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-stone-700">
              <div className="w-5 h-5 rounded-full bg-[#946e1c]/15 flex items-center justify-center text-[#946e1c] shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <strong className="text-stone-900 font-semibold">Uncompromising Material Provenance:</strong> Handcrafted in European and master ateliers with certified origins and authentic hallmarking.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-stone-700">
              <div className="w-5 h-5 rounded-full bg-[#946e1c]/15 flex items-center justify-center text-[#946e1c] shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <strong className="text-stone-900 font-semibold">Personal Concierge Privilege:</strong> Direct communication with client specialists from reservation through unboxing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
