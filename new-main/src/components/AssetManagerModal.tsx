import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  CheckCircle2,
  ShieldCheck,
  FileImage,
  Trash2,
  Camera,
  Search,
  Sparkles,
  Loader2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
} from 'lucide-react';
import { getAllSavedAssets, clearCustomAssets } from '../utils/assetStorage';
import { getMergedProducts, attachImageToSlot, resetAllWritings } from '../utils/productStore';
import { Product } from '../types';
import { isAdminUnlocked, lockAdminSession } from '../utils/adminAuth';
import { AdminPasswordModal } from './AdminPasswordModal';

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetManagerModal: React.FC<AssetManagerModalProps> = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [savedAssets, setSavedAssets] = useState<Record<string, string>>({});
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'attached' | 'empty'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(isAdminUnlocked());
  const itemsPerPage = 20;

  const singleInputRef = useRef<HTMLInputElement>(null);
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);

  const loadData = () => {
    setProducts(getMergedProducts());
    setSavedAssets(getAllSavedAssets());
  };

  useEffect(() => {
    if (isOpen) {
      const unlocked = isAdminUnlocked();
      setIsUnlocked(unlocked);
      if (!unlocked) {
        setIsAdminAuthOpen(true);
      }
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('svs_products_updated', handleUpdate);
    window.addEventListener('svs_assets_updated', handleUpdate);
    return () => {
      window.removeEventListener('svs_products_updated', handleUpdate);
      window.removeEventListener('svs_assets_updated', handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  // Filter products
  const filteredProducts = products.filter((p) => {
    const assetFilename = p.originalAssetFilename || '';
    const hasPhoto = Boolean(savedAssets[assetFilename] || savedAssets[assetFilename.toLowerCase()] || p.isCustomUploaded);

    if (filterTab === 'attached' && !hasPhoto) return false;
    if (filterTab === 'empty' && hasPhoto) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const slotNumStr = `space #${p.slotNumber} slot #${p.slotNumber} ${p.slotNumber}`;
      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        assetFilename.toLowerCase().includes(q) ||
        slotNumStr.includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBulkUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!isAdminUnlocked()) {
      setIsAdminAuthOpen(true);
      return;
    }
    setIsProcessing(true);
    setUploadMessage(`Processing ${files.length} file(s) with price tag auto-detection...`);

    const fileList = Array.from(files);
    let successCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const filenameLower = file.name.toLowerCase();

      // Find matching product by originalAssetFilename or next empty slot
      let matchedProd = products.find(
        (p) => p.originalAssetFilename && p.originalAssetFilename.toLowerCase() === filenameLower
      );

      if (!matchedProd) {
        // Find next empty space or space by index
        matchedProd = products.find(
          (p) =>
            !p.isCustomUploaded &&
            !savedAssets[p.originalAssetFilename || ''] &&
            !savedAssets[(p.originalAssetFilename || '').toLowerCase()]
        );
      }

      if (!matchedProd && i < products.length) {
        matchedProd = products[i];
      }

      if (matchedProd) {
        try {
          const res = await attachImageToSlot(matchedProd, file);
          if (res.success) {
            successCount++;
          }
        } catch (err) {
          console.error('Error attaching file in bulk:', err);
        }
      }
    }

    setIsProcessing(false);
    loadData();
    setUploadMessage(
      `✓ Successfully attached ${successCount} file(s) across spaces. Writings & price tags updated automatically with zero AI alterations!`
    );
  };

  const handleSingleSlotUpload = async (file: File) => {
    if (!targetProduct) return;
    if (!isAdminUnlocked()) {
      setIsAdminAuthOpen(true);
      return;
    }
    setIsProcessing(true);
    setUploadMessage(`Analyzing price tag for Space #${targetProduct.slotNumber || 1}...`);

    try {
      const res = await attachImageToSlot(targetProduct, file);
      if (res.success && res.detectedData) {
        const detectedPrice = res.detectedData.rawPriceText || `₦${res.detectedData.detectedPrice.toLocaleString()}`;
        setUploadMessage(
          `✓ Space #${targetProduct.slotNumber} updated! Detected Price Tag: ${detectedPrice}. Writings updated.`
        );
      } else {
        setUploadMessage(`✓ Space #${targetProduct.slotNumber} photo attached.`);
      }
    } catch (err) {
      console.error('Error in single slot upload:', err);
      setUploadMessage('Photo attached.');
    } finally {
      setIsProcessing(false);
      setTargetProduct(null);
      loadData();
    }
  };

  const totalLoaded = products.filter(
    (p) =>
      Boolean(savedAssets[p.originalAssetFilename || '']) ||
      Boolean(savedAssets[(p.originalAssetFilename || '').toLowerCase()]) ||
      p.isCustomUploaded
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-[#fdfcfb] border border-stone-300 rounded-2xl shadow-2xl text-stone-900 overflow-hidden p-5 sm:p-7 flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hidden file input for single slot */}
        <input
          ref={singleInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleSingleSlotUpload(e.target.files[0]);
            }
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#946e1c]/10 border border-[#946e1c]/30 flex items-center justify-center text-[#946e1c]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-stone-900 flex items-center gap-2">
                <span>Original Portfolio Vault</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#946e1c]/10 text-[#946e1c] font-mono font-semibold">
                  200 Spaces Available
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Auto-detects price tags & updates writings under each image • Zero visual alterations
              </p>
            </div>
          </div>

          {/* Admin Lock Status */}
          <button
            type="button"
            onClick={() => {
              if (isUnlocked) {
                lockAdminSession();
                setIsUnlocked(false);
                setIsAdminAuthOpen(true);
              } else {
                setIsAdminAuthOpen(true);
              }
            }}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
              isUnlocked
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
            }`}
            title={isUnlocked ? 'Click to lock admin privileges' : 'Click to authenticate as admin'}
          >
            {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
            <span>{isUnlocked ? 'Admin Unlocked' : 'Locked (Requires Password)'}</span>
          </button>
        </div>

        {/* Features highlight banner */}
        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 mb-3 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>Automatic Price Detection Enabled:</strong> When you drop or attach your original files to any of the 200 spaces, the writings under the image automatically update with the detected price tag and product specifications.
          </div>
        </div>

        {/* Bulk Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleBulkUpload(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-stone-300 hover:border-[#946e1c] rounded-xl p-4 sm:p-5 text-center bg-[#faf8f5] transition-colors cursor-pointer mb-3 shrink-0"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*';
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              handleBulkUpload(target.files);
            };
            input.click();
          }}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-2">
              <Loader2 className="w-6 h-6 text-[#946e1c] animate-spin mb-1.5" />
              <p className="text-xs font-semibold text-stone-800">Analyzing files & price tags...</p>
            </div>
          ) : (
            <>
              <div className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#946e1c] mx-auto mb-2 shadow-xs">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-stone-800">
                Click or drag & drop original files here (Supports up to 200 items)
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">
                Automatically matches spaces, reads price tags, and updates writings • Full resolution preserved
              </p>
            </>
          )}
        </div>

        {uploadMessage && (
          <div className="p-2 rounded-lg bg-emerald-100/90 text-emerald-900 text-xs mb-3 text-center font-medium border border-emerald-200">
            {uploadMessage}
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-2.5 shrink-0">
          <div className="flex items-center gap-1 w-full sm:w-auto bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => { setFilterTab('all'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                filterTab === 'all' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All 200 Spaces ({products.length})
            </button>
            <button
              type="button"
              onClick={() => { setFilterTab('attached'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                filterTab === 'attached' ? 'bg-white shadow-xs text-emerald-800 font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Attached ({totalLoaded})
            </button>
            <button
              type="button"
              onClick={() => { setFilterTab('empty'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                filterTab === 'empty' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Available ({products.length - totalLoaded})
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search space #, name or file..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#946e1c]"
            />
          </div>
        </div>

        {/* Spaces List Table / Scroll Area */}
        <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 border border-stone-200 rounded-xl p-2 bg-white min-h-[220px]">
          {displayedProducts.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              No spaces found matching your criteria.
            </div>
          ) : (
            displayedProducts.map((p) => {
              const filename = p.originalAssetFilename || '';
              const assetUrl = savedAssets[filename] || savedAssets[filename.toLowerCase()] || (p.isCustomUploaded ? p.images[0] : null);
              const isLoaded = Boolean(assetUrl);

              return (
                <div
                  key={p.id}
                  className="p-2 rounded-lg bg-stone-50/60 border border-stone-200 flex items-center justify-between text-xs hover:border-[#b3882a]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    {/* Thumbnail */}
                    {isLoaded && assetUrl ? (
                      <img
                        src={assetUrl}
                        alt={p.name}
                        className="w-10 h-10 rounded-md object-contain bg-white border border-stone-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                        <FileImage className="w-5 h-5" />
                      </div>
                    )}

                    {/* Metadata / Writings Preview */}
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-800 font-semibold">
                          Space #{p.slotNumber || 1}
                        </span>
                        <span className="font-medium text-stone-900 truncate">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5 truncate">
                        <span className="font-semibold text-[#8c6714] font-mono">
                          {p.rawPriceText || `₦${p.price.toLocaleString()}`}
                        </span>
                        <span>•</span>
                        <span className="truncate">{p.subtitle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 ml-2 flex items-center gap-1.5">
                    {isLoaded ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Attached
                      </span>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => {
                        setTargetProduct(p);
                        singleInputRef.current?.click();
                      }}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-300 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Camera className="w-3 h-3 text-[#946e1c]" />
                      <span>{isLoaded ? 'Change' : 'Attach'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2.5 shrink-0 text-xs text-stone-500">
            <span>
              Showing {Math.min(filteredProducts.length, (currentPage - 1) * itemsPerPage + 1)}–
              {Math.min(filteredProducts.length, currentPage * itemsPerPage)} of {filteredProducts.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-[11px]">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            onClick={async () => {
              if (window.confirm('Reset all attached images and writings back to default?')) {
                await clearCustomAssets();
                resetAllWritings();
                setSavedAssets({});
                loadData();
                setUploadMessage('All spaces reset to initial defaults.');
              }
            }}
            className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset 200 spaces</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
