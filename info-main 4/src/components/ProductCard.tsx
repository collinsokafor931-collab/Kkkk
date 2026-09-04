import React, { useState } from 'react';
import { Eye, Plus, Clock, Sparkles, Check, Truck, Edit3, Tag } from 'lucide-react';
import { Product } from '../types';
import { OriginalProductImage } from './OriginalProductImage';
import { EditProductWritingsModal } from './EditProductWritingsModal';
import { isAdminUnlocked } from '../utils/adminAuth';
import { AdminPasswordModal } from './AdminPasswordModal';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onQuickPreOrder: (product: Product) => void;
  onProductUpdated?: (updated: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onQuickPreOrder,
  onProductUpdated,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const depositAmount = Math.round(product.price * (product.depositPercentage / 100));
  const claimedPercent = Math.round(
    ((product.preOrderStatus?.slotsClaimed || 0) / (product.preOrderStatus?.slotsTotal || 50)) * 100
  );
  const slotsRemaining = (product.preOrderStatus?.slotsTotal || 50) - (product.preOrderStatus?.slotsClaimed || 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickPreOrder(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdminUnlocked()) {
      setIsPasswordModalOpen(true);
      return;
    }
    setIsEditOpen(true);
  };

  return (
    <>
      <div
        onClick={() => onViewDetails(product)}
        onMouseEnter={() => {
          setIsHovered(true);
          if (product.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
        className="group relative rounded-2xl bg-white border border-[#e7e4dc] hover:border-[#b3882a]/50 transition-all duration-500 overflow-hidden flex flex-col justify-between cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(160,120,40,0.12)] hover:-translate-y-1"
      >
        {/* Top Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#faf8f5] p-2">
          <OriginalProductImage
            src={product.images[currentImageIndex] || product.images[0]}
            alt={product.name}
            product={product}
            originalFilename={product.originalAssetFilename}
            objectFit="contain"
            className="w-full h-full"
          />

          {/* Top Badges: Pre-Order, Space Number, Price Detected */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-1.5 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#946e1c]/40 text-[10px] font-semibold tracking-wider uppercase text-[#946e1c] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#946e1c] animate-ping" />
              <span>SPACE #{product.slotNumber || 1}</span>
            </div>

            <div className="flex items-center gap-1">
              {product.priceTagDetected && (
                <div className="px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[9px] font-semibold tracking-wider uppercase flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-200" />
                  <span>Price Tag Read</span>
                </div>
              )}

              {product.isNewDrop && !product.priceTagDetected && (
                <div className="px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-md text-[9px] font-semibold tracking-widest uppercase text-white border border-stone-700">
                  NEW DROP
                </div>
              )}
            </div>
          </div>

          {/* Quick Edit Writings button */}
          <button
            onClick={handleEditClick}
            title="Edit title, price & writings"
            className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-900 text-white backdrop-blur-xs cursor-pointer shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#e5c07b]" />
          </button>

          {/* Floating Action Overlay on Desktop Hover */}
          <div className="absolute inset-x-3.5 bottom-3.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="flex-1 py-2.5 bg-stone-950/90 hover:bg-stone-950 text-white text-[11px] font-medium tracking-[0.2em] uppercase rounded-lg border border-white/20 hover:border-[#b3882a] transition-colors flex items-center justify-center gap-1.5 backdrop-blur-md cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#e5c07b]" />
              <span>VIEW DETAILS</span>
            </button>

            <button
              onClick={handleQuickAdd}
              className={`px-4 py-2.5 rounded-lg text-[11px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#946e1c] hover:bg-[#a87d20] text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>ADDED</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>RESERVE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Information Body — "Writings Under The Image" */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Batch name & allocation progress */}
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span className="text-[#946e1c] font-semibold tracking-wider">
                {product.preOrderStatus?.batchName || 'VIP Batch Drop'}
              </span>
              <span className="text-stone-500 font-normal">
                {slotsRemaining} slots left
              </span>
            </div>

            {/* Allocation Progress Bar */}
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#946e1c] to-[#c99b2e]"
                style={{ width: `${claimedPercent}%` }}
              />
            </div>

            {/* Title with Slot indicator */}
            <h3 className="font-serif text-lg text-stone-900 font-normal tracking-wide group-hover:text-[#946e1c] transition-colors line-clamp-1 mb-1">
              {product.name}
            </h3>

            {/* Subtitle / Key specs */}
            <p className="text-xs text-stone-500 line-clamp-1 font-light mb-2">
              {product.subtitle}
            </p>

            {/* Shipping Tag */}
            <div className="flex items-center gap-1.5 text-[10px] text-stone-600 mb-3">
              <Truck className="w-3 h-3 text-[#946e1c]" />
              <span>
                Shipping:{' '}
                <strong
                  className={
                    product.shippingFee === 0 ? 'text-emerald-700 font-bold' : 'text-stone-800'
                  }
                >
                  {product.shippingFee === 0 ? 'FREE' : `₦${(product.shippingFee || 0).toLocaleString()}`}
                </strong>
              </span>
              {product.marketPrice && (
                <span className="ml-auto text-stone-400 line-through text-[10px]">
                  Market ~₦{product.marketPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Options Preview Pills */}
            {product.options && product.options.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.options.map((opt) => (
                  <span
                    key={opt.name}
                    className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200"
                  >
                    {opt.name}: {opt.values.length} options
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            {/* Dispatch Date / Timeline notice */}
            <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mb-3 bg-[#f5f3ee] px-2.5 py-1.5 rounded-md border border-stone-200">
              <Clock className="w-3 h-3 text-[#946e1c] shrink-0" />
              <span className="truncate">
                Dispatches:{' '}
                <strong className="text-stone-900 font-semibold">
                  {product.preOrderStatus?.estimatedDispatchDate || 'Oct 2026'}
                </strong>
              </span>
            </div>

            {/* Price & Deposit Terms */}
            <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-400 uppercase tracking-widest block font-light">
                  Pre-Order Price
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-lg text-stone-900 font-semibold">
                    {product.rawPriceText || `₦${product.price.toLocaleString()}`}
                  </span>
                  {product.priceTagDetected && (
                    <span className="text-[9px] text-emerald-700 font-mono font-medium">
                      (auto-read)
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#946e1c] uppercase tracking-wider block font-semibold">
                  Deposit to Lock
                </span>
                <span className="text-sm font-semibold text-[#8c6714]">
                  ₦{depositAmount.toLocaleString()}{' '}
                  <span className="text-[10px] text-stone-500 font-normal">
                    ({product.depositPercentage}%)
                  </span>
                </span>
              </div>
            </div>

            {/* Mobile Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(product);
                }}
                className="py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-medium tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3 text-stone-600" />
                <span>Details</span>
              </button>

              <button
                onClick={handleQuickAdd}
                className="py-2 bg-[#946e1c] hover:bg-[#a87d20] text-white text-[11px] font-bold tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Reserve</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Writings Modal */}
      <EditProductWritingsModal
        product={product}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSaved={(updated) => {
          if (onProductUpdated) onProductUpdated(updated);
        }}
      />

      {/* Admin Password Modal for Editing Portfolio Writings */}
      <AdminPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setIsPasswordModalOpen(false);
          setIsEditOpen(true);
        }}
        title="Admin Authorization Required"
        description={`Enter password to edit Space #${product.slotNumber || 1} writings, title, and pricing.`}
      />
    </>
  );
};
