import React, { useState, useEffect, useRef } from 'react';
import { getCustomAssetUrl } from '../utils/assetStorage';
import { ImageIcon, UploadCloud, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { attachImageToSlot } from '../utils/productStore';
import { isAdminUnlocked } from '../utils/adminAuth';
import { AdminPasswordModal } from './AdminPasswordModal';

interface OriginalProductImageProps {
  src: string;
  alt: string;
  product?: Product;
  originalFilename?: string;
  className?: string;
  objectFit?: 'cover' | 'contain';
  aspectRatio?: string;
  onClick?: () => void;
  allowInlineUpload?: boolean;
  onPriceDetected?: (message: string) => void;
}

export const OriginalProductImage: React.FC<OriginalProductImageProps> = ({
  src,
  alt,
  product,
  originalFilename,
  className = 'w-full h-full object-cover',
  objectFit = 'cover',
  aspectRatio,
  onClick,
  allowInlineUpload = false,
  onPriceDetected,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzingPrice, setIsAnalyzingPrice] = useState(false);
  const [detectedBadge, setDetectedBadge] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingTriggerFileInput, setPendingTriggerFileInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolveImage = () => {
    const filename = originalFilename || product?.originalAssetFilename || (src.startsWith('/products/') ? src.replace('/products/', '') : '');
    if (filename) {
      const customUrl = getCustomAssetUrl(filename);
      if (customUrl) {
        setCurrentSrc(customUrl);
        setHasError(false);
        return;
      }
    }
    setCurrentSrc(src);
  };

  useEffect(() => {
    resolveImage();
  }, [src, originalFilename, product?.originalAssetFilename]);

  useEffect(() => {
    const handleUpdate = () => {
      resolveImage();
    };
    window.addEventListener('svs_assets_updated', handleUpdate);
    window.addEventListener('svs_products_updated', handleUpdate);
    return () => {
      window.removeEventListener('svs_assets_updated', handleUpdate);
      window.removeEventListener('svs_products_updated', handleUpdate);
    };
  }, [src, originalFilename, product?.originalAssetFilename]);

  const handleError = () => {
    setHasError(true);
  };

  const handleFileDrop = async (file: File) => {
    try {
      setIsAnalyzingPrice(true);
      setDetectedBadge(null);

      if (product) {
        const result = await attachImageToSlot(product, file, originalFilename || file.name);
        if (result.success && result.detectedData) {
          const priceText = result.detectedData.rawPriceText || `₦${result.detectedData.detectedPrice.toLocaleString()}`;
          setDetectedBadge(`Price Tag: ${priceText}`);
          if (onPriceDetected) {
            onPriceDetected(`Detected price tag ${priceText} for Space #${product.slotNumber || 1}! Writings updated.`);
          }
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const res = e.target?.result as string;
          if (res) {
            setCurrentSrc(res);
            setHasError(false);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Error handling file attach & price detection:', err);
    } finally {
      setIsAnalyzingPrice(false);
      setTimeout(() => setDetectedBadge(null), 5000);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    if (!allowInlineUpload) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleTriggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdminUnlocked()) {
      setPendingTriggerFileInput(true);
      setIsPasswordModalOpen(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const onDragLeave = (e: React.DragEvent) => {
    if (!allowInlineUpload) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    if (!allowInlineUpload) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!isAdminUnlocked()) {
        setPendingFile(file);
        setIsPasswordModalOpen(true);
        return;
      }
      handleFileDrop(file);
    }
  };

  const handlePasswordSuccess = () => {
    if (pendingFile) {
      const fileToProcess = pendingFile;
      setPendingFile(null);
      handleFileDrop(fileToProcess);
    } else if (pendingTriggerFileInput) {
      setPendingTriggerFileInput(false);
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative w-full h-full bg-[#f6f4ef] flex items-center justify-center overflow-hidden select-none ${aspectRatio || ''} ${
          isDragOver ? 'ring-2 ring-[#946e1c] ring-inset' : ''
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              if (!isAdminUnlocked()) {
                setPendingFile(file);
                setIsPasswordModalOpen(true);
                return;
              }
              handleFileDrop(file);
            }
          }}
        />

        {/* Analyzing / Detection overlay */}
        {isAnalyzingPrice && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white">
            <Loader2 className="w-7 h-7 text-[#e5c07b] animate-spin mb-2" />
            <p className="text-xs font-semibold tracking-wide">Reading Price Tag...</p>
            <p className="text-[10px] text-stone-300 mt-1">Calibrating writings automatically</p>
          </div>
        )}

        {/* Detected Badge Notification */}
        {detectedBadge && !isAnalyzingPrice && (
          <div className="absolute top-2 inset-x-2 z-20 px-2.5 py-1.5 rounded-lg bg-emerald-600/95 text-white text-[11px] font-semibold tracking-wide flex items-center justify-center gap-1.5 shadow-md animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            <span>{detectedBadge}</span>
          </div>
        )}

        {!hasError && currentSrc ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={currentSrc}
              alt={alt}
              onError={handleError}
              referrerPolicy="no-referrer"
              className={`${className} ${
                objectFit === 'contain' ? 'object-contain p-2' : 'object-cover'
              } transition-transform duration-500 ease-out`}
              loading="lazy"
            />

            {allowInlineUpload && (
              <button
                type="button"
                onClick={handleTriggerUpload}
                title="Replace / update original file (Password protected)"
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 backdrop-blur-xs cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#e5c07b]" />
                <span>Replace</span>
              </button>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-5 text-center text-stone-600 bg-gradient-to-b from-[#faf8f4] to-[#f3efe6]">
            <div className="w-11 h-11 rounded-full bg-white border border-[#946e1c]/30 flex items-center justify-center text-[#946e1c] mb-2 shadow-xs">
              <ImageIcon className="w-5 h-5 text-[#946e1c]" />
            </div>

            <h5 className="text-xs font-semibold text-stone-800 line-clamp-1 mb-1 max-w-[90%]">
              {alt}
            </h5>

            <span className="text-[10px] font-mono text-[#946e1c] bg-[#946e1c]/10 px-2 py-0.5 rounded border border-[#946e1c]/20 mb-2">
              {originalFilename || product?.originalAssetFilename || 'Space Available'}
            </span>

            {allowInlineUpload && (
              <button
                type="button"
                onClick={handleTriggerUpload}
                className="mt-1 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-300 text-[11px] font-medium text-stone-800 hover:text-stone-900 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#946e1c]" />
                <span>Attach Original File</span>
              </button>
            )}

            <span className="text-[9px] text-stone-400 mt-2">
              Auto-detects price tag • 100% untweaked
            </span>
          </div>
        )}
      </div>

      {/* Admin Password Modal for Attaching Original File */}
      <AdminPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingFile(null);
          setPendingTriggerFileInput(false);
        }}
        onSuccess={handlePasswordSuccess}
        title="Admin Authorization Required"
        description="Enter password to attach or replace original portfolio photos."
      />
    </>
  );
};
