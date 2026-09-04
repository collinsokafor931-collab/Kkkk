import React, { useState } from 'react';
import { X, Clock, ShieldCheck, Sparkles, Check, ChevronRight, HelpCircle, ArrowRight, Share2, Layers, Truck, Edit3 } from 'lucide-react';
import { Product } from '../types';
import { OriginalProductImage } from './OriginalProductImage';
import { EditProductWritingsModal } from './EditProductWritingsModal';
import { isAdminUnlocked } from '../utils/adminAuth';
import { AdminPasswordModal } from './AdminPasswordModal';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToPreOrder: (
    product: Product,
    selectedOptions: Record<string, string>,
    quantity: number,
    payDepositOnly: boolean,
    monogramText?: string
  ) => void;
  onProductUpdated?: (updated: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToPreOrder,
  onProductUpdated,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEditWritingsOpen, setIsEditWritingsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>(product);

  // Sync currentProduct when product prop changes
  React.useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  const handleEditWritingsClick = () => {
    if (!isAdminUnlocked()) {
      setIsPasswordModalOpen(true);
      return;
    }
    setIsEditWritingsOpen(true);
  };
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((opt) => {
      initial[opt.name] = opt.default || opt.values[0];
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [payDepositOnly, setPayDepositOnly] = useState(true);
  const [monogramText, setMonogramText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const depositRate = product.depositPercentage;
  const unitPrice = product.price;
  const depositPerUnit = Math.round(unitPrice * (depositRate / 100));
  const totalAmount = unitPrice * quantity;
  const totalDueToday = payDepositOnly ? depositPerUnit * quantity : totalAmount;
  const balanceDueLater = payDepositOnly ? totalAmount - totalDueToday : 0;

  const slotsClaimed = product.preOrderStatus.slotsClaimed;
  const slotsTotal = product.preOrderStatus.slotsTotal;
  const slotsRemaining = slotsTotal - slotsClaimed;
  const percentClaimed = Math.round((slotsClaimed / slotsTotal) * 100);

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAdd = () => {
    setAddedAnimation(true);
    onAddToPreOrder(product, selectedOptions, quantity, payDepositOnly, monogramText);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-[#fdfcfb] border border-stone-300 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.25)] overflow-hidden text-stone-900 flex flex-col max-h-[92vh]">
        {/* Sticky Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#f5f3ee] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-[#f3efe6] border border-[#946e1c]/40 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#946e1c]">
              {product.preOrderStatus.batchName}
            </span>
            <span className="hidden sm:inline text-xs text-stone-600">
              Allocations Open • Closes {product.preOrderStatus.preOrderClosingDate}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEditWritingsClick}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs"
              title="Edit writings & details (Requires admin password)"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#946e1c]" />
              <span className="hidden sm:inline font-medium">Edit Writings</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-stone-200/60 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isCopied ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200/60 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Editorial Product Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#faf8f5] border border-stone-200 group">
              <OriginalProductImage
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                product={product}
                originalFilename={product.originalAssetFilename}
                objectFit="contain"
                className="w-full h-full"
              />
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#946e1c]/40 text-[10px] tracking-widest text-[#946e1c] uppercase font-semibold shadow-sm">
                  Pre-Order Direct Import
                </div>
              </div>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#946e1c] shadow-[0_0_10px_rgba(148,110,28,0.3)]'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <OriginalProductImage
                      src={imgUrl}
                      alt={`${product.name} preview ${idx + 1}`}
                      className="w-full h-full"
                      objectFit="cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Artisan Craft Specifications */}
            <div className="p-5 rounded-xl bg-[#f8f7f4] border border-stone-200 space-y-3 text-xs">
              <h4 className="font-serif text-sm text-stone-900 tracking-wider uppercase flex items-center gap-2 font-medium">
                <Layers className="w-4 h-4 text-[#946e1c]" />
                <span>Product Specifications</span>
              </h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-stone-700">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-stone-500 block text-[10px] uppercase tracking-wider">{key}</span>
                    <span className="text-stone-900 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pre-Order Selection & Timeline */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Title */}
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#946e1c] font-semibold block mb-2">
                SHANTEL VARIETY SHOP • THE VIP EXPERIENCE
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 tracking-wide font-normal mb-2">
                {product.name}
              </h2>

              <p className="text-sm text-stone-600 font-light mb-4">
                {product.subtitle}
              </p>

              {/* Price & Shipping Breakdown */}
              <div className="p-4 rounded-xl bg-[#f8f7f4] border border-stone-200 mb-6 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-medium">Pre-Order Price</span>
                    <span className="font-serif text-2xl text-stone-900 font-semibold">
                      ₦{product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#946e1c] uppercase tracking-wider block font-semibold">
                      Lock With Deposit ({product.depositPercentage}%)
                    </span>
                    <span className="font-serif text-xl text-[#946e1c] font-semibold">
                      ₦{depositPerUnit.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#946e1c]" />
                    <span>Shipping Fee:</span>
                    <strong className={product.shippingFee === 0 ? 'text-emerald-700 font-bold' : 'text-stone-800'}>
                      {product.shippingFee === 0 ? 'FREE (₦0)' : `₦${product.shippingFee?.toLocaleString()}`}
                    </strong>
                  </div>
                  {product.marketPrice && (
                    <span className="text-stone-500 text-[11px]">
                      Regular Market Value: <span className="line-through">₦{product.marketPrice.toLocaleString()}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* PRE-ORDER TIMELINE CALLOUT */}
              <div className="p-4 rounded-xl bg-[#fbf9f4] border border-[#946e1c]/35 mb-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#946e1c]">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold tracking-wider uppercase">Fulfillment Horizon</span>
                  </div>
                  <span className="text-stone-600 text-[11px]">
                    Estimated Dispatch: <strong className="text-stone-900 font-semibold">{product.preOrderStatus.estimatedDispatchDate}</strong>
                  </span>
                </div>

                {/* Quota Progress */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-600 mb-1.5">
                    <span>Active Allocation Quota</span>
                    <span>
                      <strong className="text-[#946e1c] font-semibold">{slotsClaimed} of {slotsTotal}</strong> reserved ({slotsRemaining} slots remaining)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#946e1c] to-[#c99b2e]" style={{ width: `${percentClaimed}%` }} />
                  </div>
                </div>

                {/* 4-Stage Production Roadmap */}
                <div className="pt-2 border-t border-stone-200 grid grid-cols-4 gap-1 text-center">
                  <div className="text-[9px] text-[#946e1c]">
                    <span className="block font-semibold">1. Pre-Order</span>
                    <span className="text-[8px] text-stone-600">Open Now</span>
                  </div>
                  <div className="text-[9px] text-stone-600">
                    <span className="block font-semibold">2. Sourcing</span>
                    <span className="text-[8px] text-stone-500">Bespoke Silk/Gold</span>
                  </div>
                  <div className="text-[9px] text-stone-600">
                    <span className="block font-semibold">3. Crafting</span>
                    <span className="text-[8px] text-stone-500">Atelier Assembly</span>
                  </div>
                  <div className="text-[9px] text-stone-600">
                    <span className="block font-semibold">4. Dispatch</span>
                    <span className="text-[8px] text-stone-500">Insured Delivery</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Product Options Selector */}
              <div className="space-y-4 mb-6">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="uppercase tracking-wider text-stone-600 font-medium">
                        Select {option.name}:
                      </span>
                      <span className="text-[#946e1c] font-semibold">
                        {selectedOptions[option.name]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((val) => {
                        const isSelected = selectedOptions[option.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionSelect(option.name, val)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#946e1c] text-white font-semibold shadow'
                                : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Optional Monogram Input */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="uppercase tracking-wider text-stone-600 font-medium">
                      Complimentary VIP Monogramming (Optional):
                    </span>
                    <span className="text-stone-500 text-[11px]">Up to 3 Initials</span>
                  </div>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="e.g. SVS"
                    value={monogramText}
                    onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                  />
                </div>
              </div>

              {/* Quantity Selector & Payment Option Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#f8f7f4] border border-stone-200 mb-6">
                <div>
                  <label className="text-[11px] text-stone-600 uppercase tracking-wider block mb-2 font-medium">
                    Pre-Order Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm"
                    >
                      -
                    </button>
                    <span className="font-serif text-lg text-stone-900 w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(slotsRemaining, quantity + 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-stone-600 uppercase tracking-wider block mb-2 font-medium">
                    Pre-Order Payment Terms
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPayDepositOnly(true)}
                      className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all ${
                        payDepositOnly
                          ? 'bg-[#946e1c] text-white font-semibold shadow-sm'
                          : 'bg-white text-stone-600 border border-stone-300'
                      }`}
                    >
                      {product.depositPercentage}% Deposit Now
                    </button>
                    <button
                      onClick={() => setPayDepositOnly(false)}
                      className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all ${
                        !payDepositOnly
                          ? 'bg-stone-900 text-white font-semibold'
                          : 'bg-white text-stone-600 border border-stone-300'
                      }`}
                    >
                      Pay 100% Prepay
                    </button>
                  </div>
                </div>
              </div>

              {/* Pre-Order Notice Terms */}
              <div className="p-3.5 rounded-lg bg-[#fbf9f4] border border-stone-200 text-[11px] text-stone-700 flex items-start gap-2.5 mb-6">
                <ShieldCheck className="w-4 h-4 text-[#946e1c] shrink-0 mt-0.5" />
                <span>
                  <strong>Important Pre-Order Terms:</strong> Direct-import allocation for {product.preOrderStatus.batchName}. 
                  {balanceDueLater > 0 ? ` Balance of ₦${balanceDueLater.toLocaleString()} is requested prior to dispatch verification.` : ' Fully pre-paid, zero balance due on arrival.'}
                </span>
              </div>
            </div>

            {/* Bottom CTA Action Button */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-4">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest block">
                  {payDepositOnly ? 'Deposit Due Today' : 'Total Due Today'}
                </span>
                <span className="font-serif text-2xl text-[#946e1c] font-semibold">
                  ₦{totalDueToday.toLocaleString()}
                </span>
                {balanceDueLater > 0 && (
                  <span className="text-[10px] text-stone-500 block">
                    Balance of ₦{balanceDueLater.toLocaleString()} on dispatch
                  </span>
                )}
              </div>

              <button
                onClick={handleAdd}
                id="modal-add-to-preorder-btn"
                className={`flex-1 w-full py-4 rounded-xl font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white scale-95'
                    : 'bg-stone-900 hover:bg-black text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>PRE-ORDER RESERVED</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#e5c07b]" />
                    <span>ADD TO PRE-ORDER</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Edit Writings Modal */}
      <EditProductWritingsModal
        product={currentProduct}
        isOpen={isEditWritingsOpen}
        onClose={() => setIsEditWritingsOpen(false)}
        onSaved={(updated) => {
          setCurrentProduct(updated);
          if (onProductUpdated) onProductUpdated(updated);
        }}
      />

      {/* Admin Password Modal for Editing Details */}
      <AdminPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setIsPasswordModalOpen(false);
          setIsEditWritingsOpen(true);
        }}
        title="Admin Authorization Required"
        description={`Enter password to edit Space #${currentProduct.slotNumber || 1} writings, specifications, and pricing.`}
      />
    </div>
  );
};
