import React, { useState } from 'react';
import { X, Send, Sparkles, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';

interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConciergeModal: React.FC<ConciergeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState('Bespoke Pre-Order Allocation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && contact.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto bg-[#fdfcfb] border border-stone-300 rounded-2xl shadow-2xl text-stone-900 overflow-hidden p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#946e1c]/15 flex items-center justify-center text-[#946e1c] border border-[#946e1c]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-stone-900 font-medium">VIP Client Concierge</h3>
            <p className="text-xs text-stone-500">Shantel Variety Shop • Private Desk</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-lg text-stone-900">Inquiry Received</h4>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              Thank you, {name}. A dedicated Shantel Variety Shop concierge will contact you within 2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Connect with our atelier specialists regarding bespoke sizing, private allocations, international courier arrangements, or custom commission requests.
            </p>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Client Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lady Vivienne"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Email or WhatsApp Number *
              </label>
              <input
                type="text"
                required
                placeholder="client@luxury.com or +1 (555) 000-0000"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Subject of Inquiry
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#946e1c]"
              >
                <option value="Bespoke Pre-Order Allocation">Bespoke Pre-Order Allocation</option>
                <option value="Made-to-Measure Tailoring Query">Made-to-Measure Tailoring Query</option>
                <option value="Batch Delivery Window & White Glove">Batch Delivery Window & White Glove</option>
                <option value="Corporate / Private Salon Event">Corporate / Private Salon Event</option>
                <option value="Direct Wire / Cryptographic Settlement">Private Settlement Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Message / Particulars
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about the piece you have in mind or any custom requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-stone-500">Concierge Desk: Mon - Sun (24/7)</span>
              <button
                type="submit"
                className="px-6 py-3 bg-stone-900 hover:bg-black text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Concierge</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
