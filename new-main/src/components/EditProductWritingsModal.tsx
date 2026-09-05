import React, { useState, useEffect } from 'react';
import { X, Check, Tag, UploadCloud, Sparkles, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { saveProductOverride, attachImageToSlot, removeImageFromSlot } from '../utils/productStore';
import { SectionSelector } from './SectionSelector';
import { detectProductWritingsFromImage } from '../utils/priceDetector';

interface EditProductWritingsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedProduct: Product) => void;
  initialAttachFile?: File | null;
}

export const EditProductWritingsModal: React.FC<EditProductWritingsModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaved,
  initialAttachFile = null,
}) => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [depositPercentage, setDepositPercentage] = useState<number>(50);
  const [category, setCategory] = useState<string>('home');
  const [description, setDescription] = useState('');

  // Photo Attachment inside the modal
  const [attachedFile, setAttachedFile] = useState<File | null>(initialAttachFile);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDetectingPrice, setIsDetectingPrice] = useState<boolean>(false);
  const [detectedTagNotice, setDetectedTagNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSubtitle(product.subtitle);
      setPrice(product.price);
      setShippingFee(product.shippingFee || 0);
      setDepositPercentage(product.depositPercentage || 50);
      setCategory(product.category || 'home');
      setDescription(product.description || '');

      // Existing image preview
      const currentImage = product.images && product.images.length > 0 ? product.images[0] : null;
      setImagePreview(currentImage);
      setAttachedFile(null);
      setDetectedTagNotice(null);

      if (initialAttachFile) {
        processNewFile(initialAttachFile, product.slotNumber || 1);
      }
    }
  }, [product, initialAttachFile]);

  if (!isOpen || !product) return null;

  const processNewFile = async (file: File, slotNum: number) => {
    setAttachedFile(file);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);

      // Try running OCR price detection
      setIsDetectingPrice(true);
      try {
        const detected = await detectProductWritingsFromImage(dataUrl, file.name, slotNum);
        if (detected.priceTagFound) {
          setPrice(detected.detectedPrice);
          setDetectedTagNotice(`Detected price tag: ₦${detected.detectedPrice.toLocaleString()}`);
          if (detected.name && (!name || name.startsWith('Portfolio Space #'))) {
            setName(detected.name);
          }
          if (detected.subtitle && !subtitle) {
            setSubtitle(detected.subtitle);
          }
        }
      } catch (e) {
        console.error('Detection error:', e);
      } finally {
        setIsDetectingPrice(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processNewFile(e.target.files[0], product.slotNumber || 1);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processNewFile(e.dataTransfer.files[0], product.slotNumber || 1);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImages = product.images;
      let finalIsCustomUploaded = product.isCustomUploaded;

      // 1. If a new file was attached in this modal, persist it permanently
      if (attachedFile) {
        const attachRes = await attachImageToSlot(product, attachedFile);
        finalIsCustomUploaded = true;
      }

      const cleanPrice = Number(price) || 0;
      const cleanShipping = Number(shippingFee) || 0;

      const override = {
        name,
        subtitle,
        price: cleanPrice,
        rawPriceText: `₦${cleanPrice.toLocaleString()}`,
        shippingFee: cleanShipping,
        depositPercentage,
        category, // Selected section (PHOTO ATTACHED, AWAITING PHOTO, AMBIENT & HOME, FASHION & JEWELRY, or new custom section)
        description,
        priceTagDetected: Boolean(detectedTagNotice || product.priceTagDetected),
        isCustomUploaded: finalIsCustomUploaded,
      };

      saveProductOverride(product.id, override);

      const updated: Product = {
        ...product,
        ...override,
      };

      onSaved(updated);
      onClose();
    } catch (err) {
      console.error('Error saving writings and section:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#946e1c]/15 text-[#946e1c] flex items-center justify-center">
            <Tag className="w-5 h-5 text-[#946e1c]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Attach File & Put Write-Up
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-[#946e1c]/15 text-[#946e1c] text-xs font-mono font-semibold">
                Space #{product.slotNumber || 1}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Attach the original photo, edit writings, and assign to your chosen section.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-5 text-xs">
          {/* PHOTO ATTACHMENT DROPZONE */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-[#946e1c]" />
                <span>Original Photo Attachment</span>
              </span>
              {imagePreview && (
                <span className="text-[11px] text-emerald-700 font-medium lowercase">
                  Photo loaded
                </span>
              )}
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={handleDrop}
              className="relative p-3.5 border-2 border-dashed border-stone-300 hover:border-[#946e1c] rounded-2xl bg-stone-50 transition-colors cursor-pointer flex flex-col sm:flex-row items-center gap-4"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                title="Click or drag an image here to attach"
              />

              {/* Thumbnail preview */}
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0 relative flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Space preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-stone-400" />
                )}
                {isDetectingPrice && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-medium p-1 text-center">
                    Scanning Price...
                  </div>
                )}
              </div>

              {/* Dropzone prompt */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-stone-800 font-medium mb-1">
                  <span className="text-[#946e1c] font-semibold">Click to upload photo</span>
                  <span>or drag and drop</span>
                </div>
                <p className="text-[11px] text-stone-500 mb-1">
                  Supports PNG, JPG, WEBP. Price tags are automatically read with zero AI distortion.
                </p>

                {detectedTagNotice && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[11px] font-semibold border border-emerald-300">
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    <span>{detectedTagNotice}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION / CATEGORY SELECTOR (PHOTO ATTACHED, AWAITING PHOTO, AMBIENT & HOME, FASHION & JEWELRY, + ADD NEW SECTION) */}
          <div className="pt-2 pb-2 border-y border-stone-200">
            <SectionSelector
              value={category}
              onChange={(newCat) => setCategory(newCat)}
            />
          </div>

          {/* PRODUCT WRITE-UP: TITLE & SUBTITLE */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                Space Title / Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Double-Headed Water Ripple & Sunset Ambient Lamp"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c] bg-stone-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                Subtitle / Key Specs
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Dual Optical Projection Heads • Sunset Glow & Water Ripple Refraction"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c] bg-stone-50 focus:bg-white"
              />
            </div>
          </div>

          {/* PRICE & SHIPPING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                Pre-Order Price (₦) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-mono font-semibold text-sm focus:outline-none focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c] bg-stone-50 focus:bg-white"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block font-mono">
                Formatted: ₦{price.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                Shipping Fee (₦)
              </label>
              <input
                type="number"
                min={0}
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-mono text-sm focus:outline-none focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c] bg-stone-50 focus:bg-white"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block font-mono">
                {shippingFee === 0 ? 'Free Shipping (₦0)' : `₦${shippingFee.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
              Description / Write-Up Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of materials, procurement status, and specifications..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c] bg-stone-50 focus:bg-white resize-none"
            />
          </div>

          {/* BUTTONS */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#946e1c] to-[#b3882a] hover:from-[#a37920] hover:to-[#c49733] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-white" />
              <span>{isSaving ? 'Saving...' : 'Save Writings & Section'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
