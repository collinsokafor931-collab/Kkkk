import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle, Package, Truck, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { PreOrder } from '../types';
import { OriginalProductImage } from './OriginalProductImage';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: PreOrder[];
  initialOrderNumber?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderNumber = '',
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);
  const [searched, setSearched] = useState(Boolean(initialOrderNumber));

  // Find order in session orders or fallback to simulated mock for demo numbers
  const matchedOrder = orders.find(
    (o) => o.orderNumber.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  // Simulated fallback order for preview demonstration if they search a demo reference
  const isDemo = !matchedOrder && searchQuery.trim().length > 3;
  const activeOrder: PreOrder | null = matchedOrder || (isDemo ? {
    orderNumber: searchQuery.trim().toUpperCase(),
    createdAt: '2026-08-28T14:22:00Z',
    customer: {
      fullName: 'VIP Patron',
      email: 'client@exclusive.com',
      phone: '+1 (555) 234-8900',
      contactPreference: 'email',
    },
    delivery: {
      address: '740 Park Avenue',
      suite: 'Suite 12B',
      city: 'New York',
      state: 'NY',
      postalCode: '10021',
      country: 'United States',
      deliveryMethod: 'white-glove',
    },
    items: [
      {
        id: 'demo-1',
        product: {
          id: 'svs-water-ripple-lamp',
          name: 'Double-Headed Water Ripple & Sunset Ambient Lamp',
          subtitle: 'Dual Projection Heads • Sunset Glow & Dreamy Water Ripple Lighting',
          category: 'home',
          price: 10000,
          depositPercentage: 50,
          originalAssetFilename: 'IMG-20260830-WA0038.jpg',
          images: ['/products/IMG-20260830-WA0038.jpg'],
          description: '',
          details: [],
          specifications: {},
          options: [],
          preOrderStatus: {
            batchName: 'Pre-Order Batch 01',
            isOpen: true,
            slotsTotal: 25,
            slotsClaimed: 18,
            estimatedDispatchDate: 'Nov 10 — Nov 20, 2026',
            preOrderClosingDate: 'Oct 25, 2026',
            productionStage: 'Factory Processing & Inspection',
          },
        },
        selectedOptions: { 'Color': 'Burgundy Wine' },
        quantity: 1,
        payDepositOnly: true,
      },
    ],
    subtotal: 18500,
    depositAmount: 9250,
    balanceDueOnDispatch: 9250,
    shippingFee: 2000,
    total: 11250,
    status: 'Crafting',
    estimatedFulfillment: 'Nov 10 — Nov 20, 2026',
  } : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto bg-[#fdfcfb] border border-stone-300 rounded-2xl shadow-2xl text-stone-900 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-[#f5f3ee] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#946e1c]/15 flex items-center justify-center text-[#946e1c]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-stone-900 font-medium tracking-wide">
                Track Pre-Order Allocation
              </h3>
              <p className="text-xs text-stone-500">Live Atelier & Dispatch Tracker</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-6 border-b border-stone-200 bg-[#fbf9f4]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Pre-Order Reference (e.g. SVS-VIP-83921)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-stone-900 hover:bg-black text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Lookup
            </button>
          </form>

          {orders.length > 0 && !searched && (
            <div className="mt-3 flex items-center gap-2 text-xs text-stone-600">
              <span>Recent in this browser session:</span>
              <button
                onClick={() => {
                  setSearchQuery(orders[orders.length - 1].orderNumber);
                  setSearched(true);
                }}
                className="text-[#946e1c] underline cursor-pointer font-medium"
              >
                {orders[orders.length - 1].orderNumber}
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {searched && activeOrder ? (
            <div className="space-y-6">
              {/* Order Status Banner */}
              <div className="p-5 rounded-xl bg-[#fbf9f4] border border-[#946e1c]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#946e1c] font-semibold block mb-1">
                    Pre-Order Allocation Status
                  </span>
                  <h4 className="font-serif text-xl text-stone-900 font-medium">
                    {activeOrder.orderNumber}
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Client: {activeOrder.customer.fullName}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                    {activeOrder.status === 'Confirmed' ? 'Atelier In-Queue' : activeOrder.status}
                  </span>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Target Dispatch: <strong className="text-stone-900">{activeOrder.estimatedFulfillment}</strong>
                  </p>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-3">
                <h5 className="text-xs uppercase tracking-wider text-stone-600 font-medium">
                  Production & Dispatch Timeline
                </h5>
                <div className="relative pl-6 space-y-6 border-l-2 border-stone-200">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#946e1c] border-4 border-[#fdfcfb]" />
                    <h6 className="text-xs text-[#946e1c] font-semibold">Pre-Order Allocation Registered</h6>
                    <p className="text-[11px] text-stone-600">Order confirmed and reserved in master batch ledger.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#946e1c]/70 border-4 border-[#fdfcfb]" />
                    <h6 className="text-xs text-stone-900 font-semibold">Material Sourcing & Workshop Commission</h6>
                    <p className="text-[11px] text-stone-600">Mulberry silk, box calfskin, and precious metals allocated to master artisans.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-stone-300 border-4 border-[#fdfcfb]" />
                    <h6 className="text-xs text-stone-700 font-medium">VIP Quality Control & Assay Hallmarking</h6>
                    <p className="text-[11px] text-stone-500">Scheduled 5 days prior to final courier dispatch.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-stone-300 border-4 border-[#fdfcfb]" />
                    <h6 className="text-xs text-stone-700 font-medium">Insured White-Glove Courier Delivery</h6>
                    <p className="text-[11px] text-stone-500">Final private appointment and signature sign-off.</p>
                  </div>
                </div>
              </div>

              {/* Order Items Snapshot */}
              <div>
                <h5 className="text-xs uppercase tracking-wider text-stone-600 font-medium mb-3">
                  Commissioned Pieces
                </h5>
                <div className="space-y-2">
                  {activeOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="p-3 rounded-lg bg-white border border-stone-200 flex items-center justify-between text-xs shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded overflow-hidden bg-[#faf8f5] border border-stone-200 shrink-0">
                          <OriginalProductImage
                            src={it.product.images[0]}
                            alt={it.product.name}
                            originalFilename={it.product.originalAssetFilename}
                            objectFit="cover"
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-serif text-stone-900 font-medium">{it.product.name}</p>
                          <p className="text-stone-500 text-[11px]">Qty: {it.quantity}</p>
                        </div>
                      </div>
                      <span className="text-stone-900 font-semibold font-serif">
                        ₦{(it.product.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : searched ? (
            <div className="text-center py-10">
              <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <p className="text-sm text-stone-800 mb-1 font-medium">No pre-order found for "{searchQuery}"</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Please verify your reference number from your confirmation email or contact the VIP Concierge for assistance.
              </p>
            </div>
          ) : (
            <div className="text-center py-10">
              <Sparkles className="w-8 h-8 text-[#946e1c] mx-auto mb-3" />
              <p className="text-sm text-stone-800 mb-1 font-medium">Enter your pre-order reference number</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Track your active production stage, view estimated dispatch windows, and manage delivery instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
