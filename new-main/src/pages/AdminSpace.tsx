import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  UploadCloud,
  Edit3,
  Trash2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileImage,
  Layers,
  Truck,
  Eye,
  X,
  Loader2,
  FolderPlus,
  Database,
  ExternalLink,
  CheckSquare,
  Square,
  Check,
  ChevronLeft,
  ChevronRight,
  Tag,
} from 'lucide-react';
import { Product } from '../types';
import {
  getMergedProducts,
  attachImageToSlot,
  resetSlotWritings,
  removeImageFromSlot,
  addCustomPortfolioSpace,
  deleteCustomPortfolioSpace,
  deleteSpaces,
  restoreDeletedSpaces,
  getDeletedCount,
  getAllStoredOverrides,
  getCustomPortfolioSpaces,
} from '../utils/productStore';
import {
  isAdminUnlocked,
  verifyAdminPassword,
  lockAdminSession,
} from '../utils/adminAuth';
import { EditProductWritingsModal } from '../components/EditProductWritingsModal';
import { OriginalProductImage } from '../components/OriginalProductImage';
import { getAllSavedAssets } from '../utils/assetStorage';
import { CATEGORIES } from '../data/products';
import { getAllSections, getSectionLabel, SectionItem } from '../utils/sectionStore';
import { SectionSelector } from '../components/SectionSelector';

interface AdminSpaceProps {
  onBackToStorefront: () => void;
  initialTargetSlot?: number;
  onPreviewProduct?: (product: Product) => void;
}

export const AdminSpace: React.FC<AdminSpaceProps> = ({
  onBackToStorefront,
  initialTargetSlot,
  onPreviewProduct,
}) => {
  // Authentication State
  const [unlocked, setUnlocked] = useState<boolean>(() => isAdminUnlocked());
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Products Data
  const [products, setProducts] = useState<Product[]>(() => getMergedProducts());
  const [sections, setSections] = useState<SectionItem[]>(() => getAllSections());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'with-file' | 'pending-file' | 'custom-spaces'>('all');
  const [targetSlotInput, setTargetSlotInput] = useState<string>(initialTargetSlot ? String(initialTargetSlot) : '');

  // Active Modals & Operations
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [initialAttachFileForModal, setInitialAttachFileForModal] = useState<File | null>(null);
  const [isAddSpaceModalOpen, setIsAddSpaceModalOpen] = useState(false);
  const [uploadingSlotId, setUploadingSlotId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Delete Spaces Mode & Batch Selection States
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedSpaceIds, setSelectedSpaceIds] = useState<Set<string>>(new Set());
  const [deleteBatchIndex, setDeleteBatchIndex] = useState(0);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [deletedCount, setDeletedCount] = useState<number>(() => getDeletedCount());
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [spacePendingSingleDelete, setSpacePendingSingleDelete] = useState<Product | null>(null);

  // Add Space Form State
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceSubtitle, setNewSpaceSubtitle] = useState('');
  const [newSpacePrice, setNewSpacePrice] = useState<number>(15000);
  const [newSpaceShipping, setNewSpaceShipping] = useState<number>(2500);
  const [newSpaceCategory, setNewSpaceCategory] = useState<string>('home');
  const [newSpaceDeposit, setNewSpaceDeposit] = useState<number>(50);
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [newSpaceImageFile, setNewSpaceImageFile] = useState<File | null>(null);
  const [newSpaceImagePreview, setNewSpaceImagePreview] = useState<string | null>(null);

  // Hidden Trigger reference & input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadProduct, setActiveUploadProduct] = useState<Product | null>(null);

  // Refresh products on event
  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getMergedProducts());
      setSections(getAllSections());
    };
    window.addEventListener('svs_products_updated', handleUpdate);
    window.addEventListener('svs_assets_updated', handleUpdate);
    window.addEventListener('svs_sections_updated', handleUpdate);
    return () => {
      window.removeEventListener('svs_products_updated', handleUpdate);
      window.removeEventListener('svs_assets_updated', handleUpdate);
      window.removeEventListener('svs_sections_updated', handleUpdate);
    };
  }, []);

  // Jump to slot if initialTargetSlot provided
  useEffect(() => {
    if (initialTargetSlot) {
      setSearchQuery(`Slot #${initialTargetSlot}`);
    }
  }, [initialTargetSlot]);

  // Handle password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passwordInput)) {
      setUnlocked(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  const handleLock = () => {
    lockAdminSession();
    setUnlocked(false);
  };

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Trigger file attachment for a slot
  const handleTriggerAttachFile = (product: Product) => {
    setActiveUploadProduct(product);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !activeUploadProduct) return;
    const file = e.target.files[0];
    const product = activeUploadProduct;

    // Immediately open modal with the selected file loaded so user can edit writings & pick/add section
    setInitialAttachFileForModal(file);
    setEditingProduct(product);
    setActiveUploadProduct(null);
  };

  // Drag and drop directly onto space card
  const handleDropOnSpace = async (e: React.DragEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || !e.dataTransfer.files[0]) return;
    const file = e.dataTransfer.files[0];

    // Immediately open modal with the dropped file loaded so user can edit writings & pick/add section
    setInitialAttachFileForModal(file);
    setEditingProduct(product);
  };

  // Remove attached image
  const handleRemoveImage = async (product: Product) => {
    if (confirm(`Remove custom attached photo from Space #${product.slotNumber}? It will revert to the default placeholder until a new photo is attached.`)) {
      await removeImageFromSlot(product);
      setProducts(getMergedProducts());
      showToast(`Photo removed from Space #${product.slotNumber}.`);
    }
  };

  // Reset writings
  const handleResetWritings = (product: Product) => {
    if (confirm(`Reset writings for Space #${product.slotNumber} back to original default?`)) {
      resetSlotWritings(product.id);
      setProducts(getMergedProducts());
      showToast(`Writings for Space #${product.slotNumber} reset to default.`);
    }
  };

  // Batch Size & Deletion Calculations
  const BATCH_SIZE = 30;
  const totalDeleteBatches = Math.max(1, Math.ceil(products.length / BATCH_SIZE));
  const currentBatchProducts = products.slice(
    deleteBatchIndex * BATCH_SIZE,
    (deleteBatchIndex + 1) * BATCH_SIZE
  );

  const isCurrentBatchAllSelected =
    currentBatchProducts.length > 0 &&
    currentBatchProducts.every((p) => selectedSpaceIds.has(p.id));

  const toggleSelectSpace = (id: string) => {
    const next = new Set(selectedSpaceIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedSpaceIds(next);
  };

  const toggleSelectAllCurrentBatch = () => {
    const next = new Set(selectedSpaceIds);
    if (isCurrentBatchAllSelected) {
      currentBatchProducts.forEach((p) => next.delete(p.id));
    } else {
      currentBatchProducts.forEach((p) => next.add(p.id));
    }
    setSelectedSpaceIds(next);
  };

  const select30SpacesOnce = () => {
    const next = new Set(selectedSpaceIds);
    currentBatchProducts.forEach((p) => next.add(p.id));
    setSelectedSpaceIds(next);
  };

  const deselectCurrentBatch = () => {
    const next = new Set(selectedSpaceIds);
    currentBatchProducts.forEach((p) => next.delete(p.id));
    setSelectedSpaceIds(next);
  };

  const clearAllSelectedSpaces = () => {
    setSelectedSpaceIds(new Set());
  };

  const handleConfirmDeleteSelectedSpaces = () => {
    const idsToDelete: string[] = Array.from(selectedSpaceIds);
    if (idsToDelete.length === 0) return;

    deleteSpaces(idsToDelete);
    const updated = getMergedProducts();
    setProducts(updated);
    setDeletedCount(getDeletedCount());
    setSelectedSpaceIds(new Set());
    setIsConfirmDeleteModalOpen(false);

    const newTotalBatches = Math.max(1, Math.ceil(updated.length / BATCH_SIZE));
    if (deleteBatchIndex >= newTotalBatches) {
      setDeleteBatchIndex(Math.max(0, newTotalBatches - 1));
    }

    showToast(`${idsToDelete.length} portfolio space${idsToDelete.length > 1 ? 's' : ''} deleted successfully.`);
  };

  const handleConfirmSingleDelete = () => {
    if (!spacePendingSingleDelete) return;
    deleteSpaces([spacePendingSingleDelete.id]);
    const updated = getMergedProducts();
    setProducts(updated);
    setDeletedCount(getDeletedCount());
    const deletedSlot = spacePendingSingleDelete.slotNumber;
    setSpacePendingSingleDelete(null);
    showToast(`Space #${deletedSlot || ''} deleted from portfolio.`);
  };

  const handleRestoreDeletedSpaces = () => {
    restoreDeletedSpaces();
    const updated = getMergedProducts();
    setProducts(updated);
    setDeletedCount(0);
    setIsRestoreModalOpen(false);
    showToast('All deleted portfolio spaces have been restored.');
  };

  // Delete custom space
  const handleDeleteCustomSpace = (spaceId: string, slotNum?: number) => {
    if (confirm(`Delete custom Space #${slotNum || ''}? This action cannot be undone.`)) {
      deleteCustomPortfolioSpace(spaceId);
      setProducts(getMergedProducts());
      showToast(`Custom Space #${slotNum || ''} deleted.`);
    }
  };

  // Handle Add Portfolio Space form submission
  const handleCreateSpaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) {
      alert('Please enter a space title / name.');
      return;
    }

    let imageBase64: string | undefined = undefined;
    if (newSpaceImageFile) {
      imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(newSpaceImageFile);
      });
    }

    const created = addCustomPortfolioSpace({
      name: newSpaceName,
      subtitle: newSpaceSubtitle || 'VIP Atelier Bespoke Collection',
      price: Number(newSpacePrice) || 10000,
      shippingFee: Number(newSpaceShipping) || 2500,
      category: newSpaceCategory,
      depositPercentage: Number(newSpaceDeposit) || 50,
      description: newSpaceDescription || `Custom portfolio space. Dedicated luxury allocation.`,
      imageFileOrUrl: imageBase64,
    });

    setProducts(getMergedProducts());
    setIsAddSpaceModalOpen(false);
    // Reset fields
    setNewSpaceName('');
    setNewSpaceSubtitle('');
    setNewSpacePrice(15000);
    setNewSpaceShipping(2500);
    setNewSpaceDescription('');
    setNewSpaceImageFile(null);
    setNewSpaceImagePreview(null);

    showToast(`Space #${created.slotNumber} created successfully and added to the portfolio!`);
  };

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const slotStr = `#${prod.slotNumber || ''}`;
    const nameMatch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    const subtitleMatch = prod.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const slotMatch = slotStr.includes(searchQuery) || String(prod.slotNumber).includes(searchQuery);
    const matchesSearch = !searchQuery || nameMatch || subtitleMatch || slotMatch;

    const hasPhoto = Boolean(prod.isCustomUploaded);
    let matchesCategory = true;
    if (selectedCategory === 'attached') {
      matchesCategory = hasPhoto || prod.category === 'attached';
    } else if (selectedCategory === 'pending') {
      matchesCategory = !hasPhoto || prod.category === 'pending';
    } else if (selectedCategory !== 'all') {
      matchesCategory = prod.category === selectedCategory;
    }

    let matchesStatus = true;
    if (filterStatus === 'with-file') {
      matchesStatus = Boolean(prod.isCustomUploaded);
    } else if (filterStatus === 'pending-file') {
      matchesStatus = !prod.isCustomUploaded;
    } else if (filterStatus === 'custom-spaces') {
      matchesStatus = prod.id.startsWith('svs-custom');
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalSpaces = products.length;
  const customSpacesCount = products.filter((p) => p.id.startsWith('svs-custom')).length;
  const attachedPhotosCount = products.filter((p) => p.isCustomUploaded).length;
  const priceDetectedCount = products.filter((p) => p.priceTagDetected).length;

  // -------------------------------------------------------------
  // GATED PASSWORD VIEW (When Admin is Locked)
  // -------------------------------------------------------------
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#14120e] text-stone-100 flex flex-col justify-between selection:bg-[#946e1c] selection:text-white">
        {/* Navigation back */}
        <div className="p-6 flex items-center justify-between border-b border-stone-800">
          <button
            onClick={onBackToStorefront}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e5c07b]" />
            <span>Return to Storefront</span>
          </button>

          <span className="text-[11px] font-mono uppercase tracking-widest text-[#e5c07b]/70">
            Shantel Variety Shop • Restricted Area
          </span>
        </div>

        {/* Center Password Gate */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-[#1d1a15] border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#946e1c]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-[#946e1c]/15 border border-[#946e1c]/40 text-[#e5c07b] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock className="w-8 h-8 text-[#e5c07b]" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-wide mb-2">
              Admin Space
            </h1>

            <p className="text-xs text-stone-400 font-light leading-relaxed mb-8">
              This space is locked to manage portfolio spaces, attach original photos, and edit writings. Enter the master administrator password to continue.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="text-left">
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-medium mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    placeholder="Enter admin password..."
                    autoFocus
                    className={`w-full px-4 py-3.5 rounded-xl bg-stone-900/90 border ${
                      passwordError
                        ? 'border-rose-500/80 ring-2 ring-rose-500/20'
                        : 'border-stone-700 focus:border-[#946e1c] focus:ring-2 focus:ring-[#946e1c]/20'
                    } text-white placeholder-stone-600 text-sm outline-hidden transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Incorrect admin password. Please try again.</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#946e1c] to-[#b3882a] hover:from-[#a37920] hover:to-[#c49733] text-white font-semibold text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#946e1c]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Admin Space</span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
              <span>Secure Session Guard</span>
              <button
                onClick={onBackToStorefront}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
              >
                Back to Public View
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 text-center text-xs text-stone-600 border-t border-stone-800">
          Shantel Variety Shop • Portfolio Storage Engine: IndexedDB Permanent Vault Active
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // UNLOCKED ADMIN SPACE MANAGEMENT VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-stone-900 pb-24">
      {/* Hidden File Input for Triggering Attachments */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Floating Action Success Toast */}
      {actionSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-stone-900 text-white shadow-2xl border border-[#946e1c] text-xs font-medium flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ADMIN TOP CONTROL BAR */}
      <header className="sticky top-0 z-30 bg-stone-950 text-white border-b border-stone-800 shadow-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStorefront}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors text-xs font-medium cursor-pointer border border-stone-700"
              title="Return to the customer-facing storefront"
            >
              <ArrowLeft className="w-4 h-4 text-[#e5c07b]" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl text-white font-medium tracking-wide">
                  Admin Space
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Unlocked
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Exclusive console to attach original files, edit writings, and manage portfolio spaces.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Primary "+ Add Portfolio Space" Button */}
            <button
              onClick={() => setIsAddSpaceModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#946e1c] to-[#b3882a] hover:from-[#a37920] hover:to-[#c49733] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Portfolio Space</span>
            </button>

            {/* Delete Spaces Button (Toggles Delete Mode for 30-space batch deletion) */}
            <button
              onClick={() => {
                setIsDeleteMode((prev) => !prev);
                setSelectedSpaceIds(new Set());
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 cursor-pointer border ${
                isDeleteMode
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 ring-2 ring-rose-400 animate-pulse'
                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 hover:text-white border-rose-800'
              }`}
              title="Delete Portfolio Spaces (Batch select 30 spaces at once)"
            >
              <Trash2 className="w-4 h-4 text-rose-300" />
              <span>{isDeleteMode ? 'Exit Delete Mode' : 'Delete Spaces'}</span>
            </button>

            {/* Hidden quick action button for user's specific request: "have a hidden button to add portfolio space" */}
            <button
              onClick={() => setIsAddSpaceModalOpen(true)}
              title="Quick Add Space (Hidden Trigger)"
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-500 hover:text-[#e5c07b] border border-stone-800 transition-colors cursor-pointer"
              aria-label="Add Portfolio Space Trigger"
            >
              <FolderPlus className="w-4 h-4" />
            </button>

            {/* Lock Button */}
            <button
              onClick={handleLock}
              className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-rose-950/60 hover:text-rose-300 border border-stone-700 text-stone-300 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
              title="Lock Admin Space now"
            >
              <Lock className="w-3.5 h-3.5 text-[#e5c07b]" />
              <span className="hidden md:inline">Lock Space</span>
            </button>
          </div>
        </div>
      </header>

      {/* METRICS & PERSISTENCE BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white border border-[#e7e4dc] shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block mb-1">
              Total Portfolio Spaces
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl text-stone-900 font-semibold">{totalSpaces}</span>
              {customSpacesCount > 0 && (
                <span className="text-[11px] text-[#946e1c] font-medium">
                  (+{customSpacesCount} custom added)
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e7e4dc] shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block mb-1">
              Original Files Attached
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl text-emerald-800 font-semibold">{attachedPhotosCount}</span>
              <span className="text-[11px] text-stone-500">
                of {totalSpaces} preserved
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e7e4dc] shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block mb-1">
              Price Tags Auto-Detected
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl text-[#946e1c] font-semibold">{priceDetectedCount}</span>
              <span className="text-[11px] text-stone-500">
                calibrated
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e7e4dc] shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block mb-1 flex items-center gap-1">
              <Database className="w-3 h-3 text-[#946e1c]" />
              <span>Durable Storage Engine</span>
            </span>
            <div className="text-xs text-stone-700 font-medium mt-1">
              IndexedDB Permanent Vault
            </div>
            <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Persists on refresh & exit</span>
            </span>
          </div>
        </div>

        {/* DELETED SPACES RECOVERY BANNER */}
        {deletedCount > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-wrap items-center justify-between gap-3 text-rose-950 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-semibold">
                  {deletedCount} Portfolio Space{deletedCount > 1 ? 's' : ''} Currently Deleted
                </span>
                <p className="text-[11px] text-rose-700">
                  These spaces are hidden from the active storefront catalog. You can restore them anytime with full persistence.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRestoreModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-200 hover:bg-rose-300 text-rose-900 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-800" />
              <span>Restore Deleted Spaces</span>
            </button>
          </div>
        )}

        {isDeleteMode ? (
          /* ============================================================= */
          /* DEDICATED DELETE SPACES VIEW (30 SPACES EACH + SELECT ALL ON TOP) */
          /* ============================================================= */
          <div className="space-y-6 pb-20">
            {/* Top Control Bar in Delete Mode */}
            <div className="bg-stone-900 text-white p-5 sm:p-6 rounded-3xl border border-rose-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
                    <span>Delete Portfolio Spaces</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-600/50 text-rose-300 text-xs font-mono font-medium">
                      Select Box Mode Active
                    </span>
                  </h2>
                </div>
                <p className="text-xs text-stone-300 max-w-2xl">
                  Each space has a select box. Use the <strong>Select All 30 Spaces</strong> box on top of each batch to select and delete 30 spaces at once.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
                {selectedSpaceIds.size > 0 && (
                  <button
                    onClick={clearAllSelectedSpaces}
                    className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    Clear Selection ({selectedSpaceIds.size})
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsDeleteMode(false);
                    setSelectedSpaceIds(new Set());
                  }}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium cursor-pointer transition-colors"
                >
                  Exit Delete Mode
                </button>

                <button
                  onClick={() => setIsConfirmDeleteModalOpen(true)}
                  disabled={selectedSpaceIds.size === 0}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 ${
                    selectedSpaceIds.size > 0
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white cursor-pointer ring-2 ring-rose-400 animate-pulse'
                      : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>
                    {selectedSpaceIds.size === 30
                      ? 'Delete 30 Selected Spaces Once'
                      : `Delete ${selectedSpaceIds.size} Selected Space${selectedSpaceIds.size === 1 ? '' : 's'}`}
                  </span>
                </button>
              </div>
            </div>

            {/* MASTER SELECT ALL BOX ON TOP OF 30 PORTFOLIO SPACES */}
            <div className="bg-white rounded-2xl border-2 border-rose-300 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <label className="flex items-center gap-3.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isCurrentBatchAllSelected}
                    onChange={toggleSelectAllCurrentBatch}
                    className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 border-stone-400 cursor-pointer accent-rose-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm sm:text-base">
                        Select All 30 Portfolio Spaces (Batch {deleteBatchIndex + 1} of {totalDeleteBatches})
                      </span>
                      {currentBatchProducts.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-mono font-medium">
                          Slots #{currentBatchProducts[0]?.slotNumber} – #{currentBatchProducts[currentBatchProducts.length - 1]?.slotNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Check this box on top of these 30 portfolio spaces to select and delete all 30 spaces at once.
                    </p>
                  </div>
                </label>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={select30SpacesOnce}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-4 h-4 text-rose-700" />
                    <span>Select All 30 Spaces Once</span>
                  </button>
                  <button
                    onClick={deselectCurrentBatch}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Deselect Batch
                  </button>
                </div>
              </div>

              {/* BATCH TABS (30 SPACES EACH) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mr-1 shrink-0">
                    Batches of 30:
                  </span>
                  {Array.from({ length: totalDeleteBatches }).map((_, idx) => {
                    const batchStart = idx * BATCH_SIZE + 1;
                    const batchEnd = Math.min((idx + 1) * BATCH_SIZE, products.length);
                    const isCurrent = idx === deleteBatchIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setDeleteBatchIndex(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer shrink-0 ${
                          isCurrent
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        Batch {idx + 1} ({batchStart}–{batchEnd})
                      </button>
                    );
                  })}
                </div>

                {/* Prev / Next 30 Spaces Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setDeleteBatchIndex((prev) => Math.max(0, prev - 1))}
                    disabled={deleteBatchIndex === 0}
                    className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 text-xs"
                    title="Previous 30 Spaces"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev 30</span>
                  </button>
                  <span className="text-xs text-stone-600 font-mono">
                    Batch {deleteBatchIndex + 1} / {totalDeleteBatches}
                  </span>
                  <button
                    onClick={() => setDeleteBatchIndex((prev) => Math.min(totalDeleteBatches - 1, prev + 1))}
                    disabled={deleteBatchIndex >= totalDeleteBatches - 1}
                    className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 text-xs"
                    title="Next 30 Spaces"
                  >
                    <span className="hidden sm:inline">Next 30</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 30 SPACES APPEAR WITH SELECT BOX ON EACH OF THEM */}
            {currentBatchProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
                <p className="text-sm text-stone-500">No portfolio spaces available in this batch.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentBatchProducts.map((product) => {
                  const isSelected = selectedSpaceIds.has(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => toggleSelectSpace(product.id)}
                      className={`rounded-2xl border-2 transition-all p-3.5 flex flex-col justify-between cursor-pointer select-none group relative ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/80 shadow-md ring-2 ring-rose-400'
                          : 'border-stone-200 bg-white hover:border-rose-300 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* SELECT BOX ON EACH SPACE */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <label
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectSpace(product.id)}
                              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-stone-400 cursor-pointer accent-rose-600"
                            />
                            <span
                              className={`text-xs font-mono font-bold ${
                                isSelected ? 'text-rose-900' : 'text-stone-800'
                              }`}
                            >
                              SPACE #{product.slotNumber}
                            </span>
                          </label>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isSelected
                                ? 'bg-rose-600 text-white'
                                : 'bg-stone-100 text-stone-500 group-hover:bg-rose-100 group-hover:text-rose-800'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </span>
                        </div>

                        {/* Thumbnail Image */}
                        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200 mb-2.5">
                          <OriginalProductImage
                            product={product}
                            allowInlineUpload={false}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-rose-900/25 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                                <Check className="w-5 h-5" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Writings Info */}
                        <h4 className="font-serif text-xs font-semibold text-stone-900 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-stone-500 line-clamp-1 mb-1.5">
                          {product.subtitle}
                        </p>
                        <div className="text-xs font-bold text-stone-900 font-mono">
                          {product.rawPriceText || `₦${product.price.toLocaleString()}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* FLOATING ACTION BAR WHEN SPACES ARE SELECTED */}
            {selectedSpaceIds.size > 0 && (
              <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-8 z-40 max-w-md mx-auto sm:mx-0 p-4 rounded-2xl bg-stone-950 text-white border-2 border-rose-500 shadow-2xl flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-rose-300 font-semibold block">
                    {selectedSpaceIds.size} Space{selectedSpaceIds.size > 1 ? 's' : ''} Marked
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Ready to delete with 1 click
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearAllSelectedSpaces}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsConfirmDeleteModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer animate-pulse"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>
                      {selectedSpaceIds.size === 30 ? 'Delete 30 Spaces Once' : `Delete (${selectedSpaceIds.size})`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD MANAGEMENT VIEW */
          <div>
            {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e7e4dc] shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search space by title, subtitle, or slot number (e.g. 12 or #45)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#946e1c] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  filterStatus === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All ({products.length})
              </button>

              <button
                onClick={() => setFilterStatus('with-file')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  filterStatus === 'with-file'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                With Attached File ({attachedPhotosCount})
              </button>

              <button
                onClick={() => setFilterStatus('pending-file')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  filterStatus === 'pending-file'
                    ? 'bg-[#946e1c] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Pending File ({totalSpaces - attachedPhotosCount})
              </button>

              {customSpacesCount > 0 && (
                <button
                  onClick={() => setFilterStatus('custom-spaces')}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                    filterStatus === 'custom-spaces'
                      ? 'bg-stone-900 text-[#e5c07b]'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Custom Added ({customSpacesCount})
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-stone-100">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold mr-1 shrink-0">
              Categories:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#946e1c] text-white font-medium'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Sections
            </button>
            {sections.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                  selectedCategory === cat.id
                    ? 'bg-[#946e1c] text-white font-medium shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{cat.label}</span>
                {cat.isCustom && <span className="text-[10px] text-amber-300">★</span>}
              </button>
            ))}
          </div>
        </div>

        {/* SPACES GRID HEADER */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-stone-600">
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> portfolio spaces
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 hidden sm:inline">
              Drag and drop any image onto a space card to attach it instantly
            </span>
          </div>
        </div>

        {/* SPACES MANAGEMENT CARDS */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
            <Search className="w-8 h-8 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-stone-800 mb-1">No portfolio spaces found</h3>
            <p className="text-xs text-stone-500 mb-4">Try adjusting your search criteria or filter tags.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilterStatus('all');
              }}
              className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isCustomSpace = product.id.startsWith('svs-custom');
              const isUploadingThis = uploadingSlotId === product.id;

              return (
                <div
                  key={product.id}
                  id={`admin-space-slot-${product.slotNumber}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => handleDropOnSpace(e, product)}
                  className="bg-white rounded-2xl border border-[#e7e4dc] hover:border-[#b3882a]/60 transition-all p-5 flex flex-col justify-between shadow-xs hover:shadow-md group"
                >
                  <div>
                    {/* Card Top Meta */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[11px] font-mono font-semibold tracking-wider">
                          #{product.slotNumber} SPACE
                        </span>
                        {isCustomSpace && (
                          <span className="px-2 py-0.5 rounded-full bg-[#946e1c]/15 text-[#946e1c] text-[10px] font-semibold tracking-wide border border-[#946e1c]/30 uppercase">
                            Custom Added
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#946e1c]/10 text-[#946e1c] text-[10px] font-bold tracking-wider uppercase border border-[#946e1c]/30 flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 shrink-0" />
                          <span>{getSectionLabel(product.category)}</span>
                        </span>

                        {product.isCustomUploaded ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-medium flex items-center gap-1 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Original Photo Attached</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-medium border border-stone-200">
                            Awaiting File
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Image Box & Attach / Replace Zone */}
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200 mb-4 flex items-center justify-center">
                      <OriginalProductImage
                        product={product}
                        allowInlineUpload={false}
                        className="w-full h-full object-cover"
                      />

                      {isUploadingThis && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-20">
                          <Loader2 className="w-6 h-6 text-[#e5c07b] animate-spin mb-2" />
                          <span className="text-xs font-semibold">Reading Image & Calibrating Writings...</span>
                        </div>
                      )}

                      {/* Overlaid quick tag reading notice */}
                      {product.priceTagDetected && !isUploadingThis && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-semibold tracking-wide flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                          <span>Price Tag Read</span>
                        </div>
                      )}
                    </div>

                    {/* Writings Under The Image */}
                    <div className="space-y-1.5 mb-4">
                      <h3 className="font-serif text-base text-stone-900 font-medium line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-1 font-light">
                        {product.subtitle}
                      </p>

                      <div className="flex items-baseline justify-between pt-2 border-t border-stone-100 text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                            Pre-Order Price
                          </span>
                          <strong className="text-sm font-serif text-stone-900">
                            {product.rawPriceText || `₦${product.price.toLocaleString()}`}
                          </strong>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                            Shipping Fee
                          </span>
                          <span className="text-stone-700 font-medium">
                            {product.shippingFee === 0 ? 'FREE' : `₦${(product.shippingFee || 0).toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ADMIN ACTION BUTTONS (KEPT IN THIS PAGE AS REQUESTED) */}
                  <div className="pt-3 border-t border-stone-200/80 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* 1. ATTACH / REPLACE ORIGINAL FILE */}
                      <button
                        onClick={() => handleTriggerAttachFile(product)}
                        className="py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-[#e5c07b]" />
                        <span>{product.isCustomUploaded ? 'Replace File' : 'Attach File'}</span>
                      </button>

                      {/* 2. EDIT WRITING */}
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="py-2 px-3 rounded-lg bg-[#946e1c] hover:bg-[#a87d20] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-white" />
                        <span>Edit Writings</span>
                      </button>
                    </div>

                    {/* Secondary Actions: Remove File, Reset Writings, Delete Custom Space */}
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      {product.isCustomUploaded && (
                        <button
                          onClick={() => handleRemoveImage(product)}
                          className="text-stone-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Photo</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleResetWritings(product)}
                        className="text-stone-500 hover:text-stone-800 transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        title="Reset writings to original defaults"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Writings</span>
                      </button>

                      {/* Delete space button */}
                      <button
                        onClick={() => setSpacePendingSingleDelete(product)}
                        className="text-rose-600 hover:text-rose-800 transition-colors cursor-pointer flex items-center gap-1 ml-3"
                        title="Delete this space from portfolio"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Space</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}
  </div>

      {/* ------------------------------------------------------------- */}
      {/* EDIT PRODUCT WRITINGS MODAL */}
      {/* ------------------------------------------------------------- */}
      {editingProduct && (
        <EditProductWritingsModal
          product={editingProduct}
          isOpen={Boolean(editingProduct)}
          initialAttachFile={initialAttachFileForModal}
          onClose={() => {
            setEditingProduct(null);
            setInitialAttachFileForModal(null);
          }}
          onSaved={(updated) => {
            setProducts(getMergedProducts());
            setEditingProduct(null);
            setInitialAttachFileForModal(null);
            showToast(`Writings & section for Space #${updated.slotNumber} updated and saved!`);
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADD PORTFOLIO SPACE MODAL ("hidden button to add portfolio space") */}
      {/* ------------------------------------------------------------- */}
      {isAddSpaceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl my-auto bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 p-6 sm:p-8">
            <button
              onClick={() => setIsAddSpaceModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#946e1c]/15 text-[#946e1c] flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-[#946e1c]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-normal text-stone-900">
                  Add New Portfolio Space
                </h3>
                <p className="text-xs text-stone-500">
                  Instantly creates an additional portfolio slot and saves it permanently.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSpaceSubmit} className="space-y-4 mt-6">
              {/* Space Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                  Space Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="e.g. Sculptural Travertine Cocktail Table"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c]"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                  Subtitle / Material Summary
                </label>
                <input
                  type="text"
                  value={newSpaceSubtitle}
                  onChange={(e) => setNewSpaceSubtitle(e.target.value)}
                  placeholder="e.g. Hand-Honed Italian Travertine • Bespoke Atelier"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c]"
                />
              </div>

              {/* Price & Shipping */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                    Pre-Order Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newSpacePrice}
                    onChange={(e) => setNewSpacePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                    Shipping Fee (₦)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newSpaceShipping}
                    onChange={(e) => setNewSpaceShipping(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c]"
                  />
                </div>
              </div>

              {/* Deposit % to Lock */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                  Deposit % to Lock
                </label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={newSpaceDeposit}
                  onChange={(e) => setNewSpaceDeposit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-[#946e1c]"
                />
              </div>

              {/* Section / Category Selector with Add New Section */}
              <div className="pt-2 pb-2 border-y border-stone-200">
                <SectionSelector
                  value={newSpaceCategory}
                  onChange={(cat) => setNewSpaceCategory(cat)}
                />
              </div>

              {/* Initial Original File Upload (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                  Attach Initial Original Photo (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-stone-300 border-dashed rounded-xl hover:border-[#946e1c] transition-colors cursor-pointer relative bg-stone-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setNewSpaceImageFile(file);
                        const reader = new FileReader();
                        reader.onload = () => setNewSpaceImagePreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="space-y-1 text-center">
                    {newSpaceImagePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={newSpaceImagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border border-stone-300 mb-2"
                        />
                        <span className="text-xs text-emerald-700 font-medium">
                          {newSpaceImageFile?.name} attached
                        </span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-8 w-8 text-[#946e1c]" />
                        <div className="flex text-xs text-stone-600 justify-center">
                          <span className="font-semibold text-[#946e1c]">Click to upload</span>
                          <span className="pl-1">or drag and drop</span>
                        </div>
                        <p className="text-[10px] text-stone-400">PNG, JPG, WEBP up to 25MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newSpaceDescription}
                  onChange={(e) => setNewSpaceDescription(e.target.value)}
                  placeholder="Describe the piece, materials, and allocation details..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-[#946e1c]"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddSpaceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#946e1c] to-[#b3882a] hover:from-[#a37920] hover:to-[#c49733] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Space</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------------- */}
      {/* BATCH DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {isConfirmDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg my-auto bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden text-stone-900 p-6 sm:p-8">
            <button
              onClick={() => setIsConfirmDeleteModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  Delete {selectedSpaceIds.size} Portfolio Space{selectedSpaceIds.size > 1 ? 's' : ''}?
                </h3>
                <span className="text-xs text-rose-600 font-semibold uppercase tracking-wider">
                  {selectedSpaceIds.size === 30 ? 'Batch Deletion: 30 Spaces at Once' : 'Permanent Catalog Action'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 mb-5 text-xs text-rose-950 space-y-1.5">
              <p className="font-semibold">
                You are about to delete {selectedSpaceIds.size} space{selectedSpaceIds.size > 1 ? 's' : ''} from the portfolio:
              </p>
              <p className="text-rose-800 text-[11px]">
                These spaces will be immediately removed from the customer storefront and active grid. You can recover them later using "Restore Deleted Spaces" if needed.
              </p>
            </div>

            {/* Selected slots summary preview */}
            <div className="mb-6 max-h-36 overflow-y-auto p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                Selected Spaces:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {products
                  .filter((p) => selectedSpaceIds.has(p.id))
                  .map((p) => (
                    <span
                      key={p.id}
                      className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 text-xs font-mono font-medium border border-rose-200"
                    >
                      #{p.slotNumber} {p.name.slice(0, 16)}
                    </span>
                  ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteSelectedSpaces}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {selectedSpaceIds.size === 30 ? 'Yes, Delete 30 Spaces Once' : `Yes, Delete (${selectedSpaceIds.size}) Spaces`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SINGLE SPACE DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {spacePendingSingleDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 p-6 sm:p-8">
            <button
              onClick={() => setSpacePendingSingleDelete(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Delete Space #{spacePendingSingleDelete.slotNumber}?
                </h3>
                <span className="text-xs text-stone-500 font-mono">
                  {spacePendingSingleDelete.name}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-6">
              Are you sure you want to delete this space from the portfolio? It will be hidden from the storefront and customer catalog.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSpacePendingSingleDelete(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Space</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* RESTORE ALL DELETED SPACES MODAL */}
      {/* ------------------------------------------------------------- */}
      {isRestoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 p-6 sm:p-8">
            <button
              onClick={() => setIsRestoreModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Restore {deletedCount} Deleted Space{deletedCount > 1 ? 's' : ''}?
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  Catalog Recovery
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-6">
              This will restore all previously deleted portfolio spaces back into the catalog and storefront with their saved photo attachments and custom writings intact.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsRestoreModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRestoreDeletedSpaces}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#946e1c] to-[#b3882a] hover:from-[#a37920] hover:to-[#c49733] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restore All Spaces</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
