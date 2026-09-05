import React from 'react';
import { X, Trash2, Clock, Sparkles, ArrowRight, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { OriginalProductImage } from './OriginalProductImage';

interface PreOrderCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onToggleDeposit: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
}

export const PreOrderCartDrawer: React.FC<PreOrderCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onToggleDeposit,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  // Calculate totals
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const fullRetailSubtotal = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const totalDueToday = items.reduce((sum, item) => {
    const unitPrice = item.product.price;
    const depositUnit = Math.round(unitPrice * (item.product.depositPercentage / 100));
    const effectiveUnitPrice = item.payDepositOnly ? depositUnit : unitPrice;
    return sum + effectiveUnitPrice * item.quantity;
  }, 0);

  const balanceDueOnDispatch = fullRetailSubtotal - totalDueToday;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md md:max-w-lg bg-[#fdfcfb] border-l border-stone-300 h-full flex flex-col justify-between shadow-2xl text-stone-900">
        {/* Cart Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#f5f3ee]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f3efe6] flex items-center justify-center text-[#946e1c] border border-[#946e1c]/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg tracking-wider text-stone-900">Pre-Order Cart</h3>
              <p className="text-xs text-stone-500">
                {totalItemsCount} {totalItemsCount === 1 ? 'allocation reserved' : 'allocations reserved'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200/60 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-base text-stone-800 mb-1">Your Pre-Order Cart is Empty</h4>
              <p className="text-xs text-stone-500 max-w-xs mb-6">
                Explore our upcoming batch collections and secure your luxury pieces prior to public release.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-stone-900 text-white font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-black transition-colors cursor-pointer shadow-md"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            items.map((item) => {
              const depositUnit = Math.round(item.product.price * (item.product.depositPercentage / 100));
              const effectiveUnitPrice = item.payDepositOnly ? depositUnit : item.product.price;
              const itemTotalDue = effectiveUnitPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white border border-stone-200 flex flex-col gap-3 relative group shadow-sm"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#faf8f5] shrink-0 border border-stone-200">
                      <OriginalProductImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        originalFilename={item.product.originalAssetFilename}
                        objectFit="cover"
                        className="w-full h-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] tracking-wider uppercase text-[#946e1c] font-semibold block truncate">
                          {item.product.preOrderStatus.batchName}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="Remove from pre-order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-serif text-sm text-stone-900 font-normal truncate">
                        {item.product.name}
                      </h4>

                      {/* Selected Options */}
                      <div className="text-[11px] text-stone-600 mt-1 space-y-0.5">
                        {Object.entries(item.selectedOptions).map(([key, val]) => (
                          <div key={key}>
                            <span className="text-stone-400">{key}:</span> {val}
                          </div>
                        ))}
                        {item.monogramText && (
                          <div className="text-[#8c6714] font-medium">
                            <span>Note:</span> {item.monogramText}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dispatch Window Callout */}
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-600 bg-[#f8f7f4] px-2.5 py-1 rounded border border-stone-200">
                    <Clock className="w-3 h-3 text-[#946e1c]" />
                    <span>
                      Est. Dispatch: <strong className="text-stone-900 font-semibold">{item.product.preOrderStatus.estimatedDispatchDate}</strong>
                    </span>
                  </div>

                  {/* Quantity & Deposit Selector */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center justify-center text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-stone-900 font-medium px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center justify-center text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Deposit Switch */}
                    <button
                      onClick={() => onToggleDeposit(item.id)}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer ${
                        item.payDepositOnly
                          ? 'border-[#946e1c] bg-[#f3efe6] text-[#8c6714] font-semibold'
                          : 'border-stone-300 text-stone-600 hover:text-stone-900 bg-white'
                      }`}
                    >
                      {item.payDepositOnly
                        ? `${item.product.depositPercentage}% Deposit (₦${(depositUnit * item.quantity).toLocaleString()})`
                        : `Full Prepay (₦${(item.product.price * item.quantity).toLocaleString()})`}
                    </button>

                    <div className="text-right">
                      <span className="font-serif text-sm text-stone-900 font-semibold">
                        ₦{itemTotalDue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-[#f5f3ee] space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Total Pre-Order Value</span>
                <span className="text-stone-900 font-medium">₦{fullRetailSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#946e1c] font-semibold">
                <span>Deposit Due Today</span>
                <span className="text-base font-serif font-bold">₦{totalDueToday.toLocaleString()}</span>
              </div>
              {balanceDueOnDispatch > 0 && (
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>Balance Payable Prior to Dispatch</span>
                  <span>₦{balanceDueOnDispatch.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="p-2.5 rounded bg-[#f3efe6] border border-stone-300 text-[10px] text-stone-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#946e1c] shrink-0" />
              <span>Direct factory import with quality inspection prior to final delivery.</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              id="cart-continue-to-checkout-btn"
              className="w-full py-4 bg-stone-900 hover:bg-black text-white font-bold text-xs tracking-[0.25em] uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg"
            >
              <span>CONTINUE TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 text-[#e5c07b]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
