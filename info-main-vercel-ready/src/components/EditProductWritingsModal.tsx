import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Tag, FileText, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { saveProductOverride } from '../utils/productStore';

interface EditProductWritingsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedProduct: Product) => void;
}

export const EditProductWritingsModal: React.FC<EditProductWritingsModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [depositPercentage, setDepositPercentage] = useState<number>(50);
  const [category, setCategory] = useState<string>('home');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSubtitle(product.subtitle);
      setPrice(product.price);
      setShippingFee(product.shippingFee || 0);
      setDepositPercentage(product.depositPercentage || 50);
      setCategory(product.category);
      setDescription(product.description);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrice = Number(price) || 0;
    const cleanShipping = Number(shippingFee) || 0;

    const override = {
      name,
      subtitle,
      price: cleanPrice,
      rawPriceText: `₦${cleanPrice.toLocaleString()}`,
      shippingFee: cleanShipping,
      category,
      description,
      priceTagDetected: true,
    };

    saveProductOverride(product.id, override);

    const updated: Product = {
      ...product,
      ...override,
    };

    onSaved(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#946e1c]/10 text-[#946e1c] flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#946e1c] font-semibold">
            Space #{product.slotNumber || 1} of 200
          </span>
        </div>

        <h3 className="font-serif text-xl text-stone-900 mb-4">Edit Product Writings</h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Product Title */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Product Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#946e1c] focus:bg-white text-xs"
              placeholder="e.g. Double-Headed Water Ripple Lamp"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Subtitle / Key Specs</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#946e1c] focus:bg-white text-xs"
              placeholder="e.g. Dual Projection Heads • 2400W Power"
            />
          </div>

          {/* Price & Shipping */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Pre-Order Price (₦)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={0}
                required
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-[#946e1c] focus:bg-white text-xs"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                Formatted: ₦{price.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Shipping Fee (₦)</label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#946e1c] focus:bg-white text-xs"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                {shippingFee === 0 ? 'Free Shipping' : `₦${shippingFee.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#946e1c] text-xs cursor-pointer"
            >
              <option value="home">Ambient & Home</option>
              <option value="accessories">Fashion & Jewelry</option>
              <option value="kitchen">Kitchen & Dining</option>
              <option value="solar">Solar & Power</option>
              <option value="appliances">Heavy Appliances</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#946e1c] focus:bg-white text-xs resize-none"
              placeholder="Detailed description of this product..."
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-stone-900 hover:bg-black text-white font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-[#e5c07b]" />
              <span>Save Writings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
