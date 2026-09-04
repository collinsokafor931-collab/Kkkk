import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Printer, Clock, Sparkles, PhoneCall, ArrowRight, ShieldCheck, Package } from 'lucide-react';
import { PreOrder } from '../types';
import { OriginalProductImage } from './OriginalProductImage';

interface OrderConfirmationModalProps {
  order: PreOrder | null;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
  onOpenConcierge: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onTrackOrder,
  onOpenConcierge,
}) => {
  if (!order) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-[#fdfcfb] border border-stone-300 rounded-2xl shadow-2xl text-stone-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Visual Banner */}
        <div className="p-8 text-center bg-gradient-to-b from-[#f5f3ee] to-[#fbf9f4] border-b border-stone-200 relative">
          <div className="w-16 h-16 rounded-full bg-[#fbf9f4] border border-[#946e1c]/40 flex items-center justify-center text-[#946e1c] mx-auto mb-4 shadow-md">
            <CheckCircle2 className="w-9 h-9 text-[#946e1c]" />
          </div>

          <span className="text-[10px] tracking-[0.35em] uppercase text-[#946e1c] font-semibold block mb-1">
            SHANTEL VARIETY SHOP • THE VIP EXPERIENCE
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 font-light tracking-wide mb-2">
            YOUR PRE-ORDER IS <span className="font-normal italic font-editorial text-[#946e1c]">CONFIRMED</span>
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto font-light leading-relaxed">
            Thank you, <strong className="text-stone-900 font-semibold">{order.customer.fullName}</strong>. Your allocation has been secured in our production registry.
          </p>

          {/* Order Reference Number Pill */}
          <div className="mt-5 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-[#946e1c]/50 shadow-sm">
            <span className="text-xs text-stone-500 font-medium">Reference:</span>
            <span className="font-serif text-sm sm:text-base text-[#946e1c] font-bold tracking-widest">
              {order.orderNumber}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              title="Copy reference number"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Estimated Fulfillment Timeline Callout */}
          <div className="p-5 rounded-xl bg-[#fbf9f4] border border-[#946e1c]/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-[#946e1c] font-semibold tracking-wider uppercase">
                <Clock className="w-4 h-4" />
                <span>Estimated Fulfillment Horizon</span>
              </div>
              <span className="text-xs font-semibold text-stone-900 bg-white px-3 py-1 rounded-full border border-stone-300 shadow-sm">
                {order.estimatedFulfillment}
              </span>
            </div>

            {/* Production Milestone Tracker */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-2 border-t border-stone-200">
              <div className="space-y-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#946e1c] mx-auto shadow-sm" />
                <span className="text-[#946e1c] font-semibold block">Pre-Order Confirmed</span>
                <span className="text-stone-500 text-[9px]">Today</span>
              </div>
              <div className="space-y-1">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300 mx-auto" />
                <span className="text-stone-600 block font-medium">Sourcing & Craft</span>
                <span className="text-stone-400 text-[9px]">Atelier Cycle</span>
              </div>
              <div className="space-y-1">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300 mx-auto" />
                <span className="text-stone-600 block font-medium">VIP Quality Inspection</span>
                <span className="text-stone-400 text-[9px]">Hallmark Review</span>
              </div>
              <div className="space-y-1">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300 mx-auto" />
                <span className="text-stone-600 block font-medium">White-Glove Courier</span>
                <span className="text-stone-400 text-[9px]">Direct to Client</span>
              </div>
            </div>
          </div>

          {/* Reserved Items */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-600 font-medium mb-3">
              Reserved Pre-Order Allocations ({order.items.length})
            </h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-16 rounded-lg overflow-hidden bg-[#faf8f5] border border-stone-200 shrink-0">
                      <OriginalProductImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        originalFilename={item.product.originalAssetFilename}
                        objectFit="cover"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#946e1c] font-semibold">
                        {item.product.preOrderStatus.batchName}
                      </span>
                      <h5 className="font-serif text-sm text-stone-900 font-normal">
                        {item.product.name}
                      </h5>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} • {item.payDepositOnly ? `${item.product.depositPercentage}% Deposit Paid` : 'Full Prepayment Paid'}
                      </p>
                      {item.monogramText && (
                        <p className="text-[10px] text-[#946e1c] font-medium">
                          Note / Custom: {item.monogramText}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-sm text-stone-900 font-semibold block">
                      ₦{(item.payDepositOnly
                        ? Math.round(item.product.price * (item.product.depositPercentage / 100)) * item.quantity
                        : item.product.price * item.quantity
                      ).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium block">Allocated</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Delivery Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#f8f7f4] border border-stone-200 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1 font-medium">
                Dispatch Destination
              </span>
              <p className="text-stone-900 font-medium">{order.delivery.address} {order.delivery.suite}</p>
              <p className="text-stone-600">{order.delivery.city}, {order.delivery.state} {order.delivery.postalCode}</p>
              <p className="text-stone-600">{order.delivery.country}</p>
              <p className="text-[#946e1c] text-[11px] mt-1 font-medium">Service: {order.delivery.deliveryMethod.toUpperCase()}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f7f4] border border-stone-200 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1 font-medium">
                Financial Summary
              </span>
              <div className="flex justify-between text-stone-600">
                <span>Total Pre-Order Value:</span>
                <span className="text-stone-900 font-medium">₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#946e1c] font-semibold">
                <span>Deposit Settled Today:</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
              {order.balanceDueOnDispatch > 0 && (
                <div className="flex justify-between text-stone-600 pt-1 border-t border-stone-200">
                  <span>Balance Due on Dispatch:</span>
                  <span className="text-stone-900 font-medium">₦{order.balanceDueOnDispatch.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* What Happens Next */}
          <div className="p-5 rounded-xl bg-[#fbf9f4] border border-[#946e1c]/30 space-y-3">
            <h4 className="font-serif text-sm text-stone-900 tracking-wider uppercase flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-[#946e1c]" />
              <span>What Happens Next</span>
            </h4>
            <ul className="text-xs text-stone-700 space-y-2 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-stone-900 font-semibold">Official Email Dossier:</strong> A formal pre-order confirmation email with high-resolution commission receipts has been dispatched to <strong>{order.customer.email}</strong>.
              </li>
              <li>
                <strong className="text-stone-900 font-semibold">Private Production Log:</strong> You can track live batch progress anytime using your reference number <strong>{order.orderNumber}</strong>.
              </li>
              <li>
                <strong className="text-stone-900 font-semibold">Pre-Dispatch Review:</strong> Prior to final courier dispatch, your personal concierge will reach out to confirm delivery dates and settlement of any remaining balance.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-6 border-t border-stone-200 bg-[#f5f3ee] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-xs uppercase tracking-wider text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Receipt</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenConcierge();
              }}
              className="px-4 py-2.5 rounded-lg border border-[#946e1c]/40 hover:border-[#946e1c] text-xs uppercase tracking-wider text-[#946e1c] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>VIP Concierge</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.orderNumber);
              }}
              className="px-5 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Track Order
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-[0.2em] rounded-lg transition-colors cursor-pointer shadow-md"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
