import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { PreOrderCartDrawer } from './components/PreOrderCartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { TrustSection } from './components/TrustSection';
import { AboutSection } from './components/AboutSection';
import { ConciergeModal } from './components/ConciergeModal';
import { AssetManagerModal } from './components/AssetManagerModal';
import { Footer } from './components/Footer';
import { AdminSpace } from './pages/AdminSpace';
import { CATEGORIES } from './data/products';
import { getAllSections, SectionItem } from './utils/sectionStore';
import { Product, CartItem, PreOrder } from './types';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Clock,
  Check,
  AlertCircle,
  Camera,
  Upload,
  FileImage,
  ChevronLeft,
  ChevronRight,
  Grid,
  Lock,
  Plus,
} from 'lucide-react';
import { getAllSavedAssets } from './utils/assetStorage';
import { getMergedProducts, attachImageToSlot } from './utils/productStore';

export default function App() {
  // Navigation & Active Section Tracking
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPageView, setCurrentPageView] = useState<'storefront' | 'admin'>('storefront');
  const [adminTargetSlot, setAdminTargetSlot] = useState<number | undefined>(undefined);

  // Product Catalog & Dynamic State for 200 Spaces
  const [products, setProducts] = useState<Product[]>(() => getMergedProducts());
  const [sections, setSections] = useState<SectionItem[]>(() => getAllSections());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'slot' | 'price-asc' | 'price-desc' | 'dispatch'>('slot');

  // Pagination for 200 Spaces
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(24);

  // Interactive Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PreOrder | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerInitialCode, setTrackerInitialCode] = useState('');
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false);

  // Quick Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('svs_preorder_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders State (Persisted in localStorage)
  const [orders, setOrders] = useState<PreOrder[]>(() => {
    try {
      const saved = localStorage.getItem('svs_preorder_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('svs_preorder_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('svs_preorder_orders', JSON.stringify(orders));
  }, [orders]);

  const [savedAssets, setSavedAssets] = useState<Record<string, string>>(() => getAllSavedAssets());
  const [loadedAssetCount, setLoadedAssetCount] = useState<number>(() => Object.keys(getAllSavedAssets()).length);

  useEffect(() => {
    const updateAll = () => {
      const merged = getMergedProducts();
      setProducts(merged);
      setSections(getAllSections());
      const assets = getAllSavedAssets();
      setSavedAssets(assets);
      setLoadedAssetCount(
        merged.filter(
          (p) =>
            Boolean(assets[p.originalAssetFilename || '']) ||
            Boolean(assets[(p.originalAssetFilename || '').toLowerCase()]) ||
            p.isCustomUploaded
        ).length
      );
    };
    window.addEventListener('svs_assets_updated', updateAll);
    window.addEventListener('svs_products_updated', updateAll);
    window.addEventListener('svs_sections_updated', updateAll);
    return () => {
      window.removeEventListener('svs_assets_updated', updateAll);
      window.removeEventListener('svs_products_updated', updateAll);
      window.removeEventListener('svs_sections_updated', updateAll);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setCurrentPageView((prev) => (prev === 'admin' ? 'storefront' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleDirectBulkImport = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    showToast(`Scanning price tags for ${files.length} attached file(s)...`);
    let count = 0;
    const currentProds = getMergedProducts();
    const assets = getAllSavedAssets();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filenameLower = file.name.toLowerCase();

      // Find matched space
      let target = currentProds.find(
        (p) => p.originalAssetFilename && p.originalAssetFilename.toLowerCase() === filenameLower
      );

      if (!target) {
        // Next available empty space
        target = currentProds.find(
          (p) =>
            !p.isCustomUploaded &&
            !assets[p.originalAssetFilename || ''] &&
            !assets[(p.originalAssetFilename || '').toLowerCase()]
        );
      }

      if (!target && i < currentProds.length) {
        target = currentProds[i];
      }

      if (target) {
        try {
          const res = await attachImageToSlot(target, file);
          if (res.success) {
            count++;
            const priceText =
              res.detectedData?.rawPriceText || `₦${res.detectedData?.detectedPrice?.toLocaleString()}`;
            showToast(`✓ Space #${target.slotNumber}: Price tag ${priceText} detected! Writings updated.`);
          }
        } catch (err) {
          console.error('Error attaching slot:', err);
        }
      }
    }

    setProducts(getMergedProducts());
    showToast(`✓ Completed! ${count} photo(s) attached with price tag auto-detection.`);
  };

  // Add to Pre-Order Cart
  const handleAddToPreOrder = (
    product: Product,
    selectedOptions: Record<string, string>,
    quantity: number,
    payDepositOnly: boolean,
    monogramText?: string
  ) => {
    const itemId = `${product.id}-${JSON.stringify(selectedOptions)}-${monogramText || ''}-${payDepositOnly}`;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((it) => it.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedOptions,
          monogramText,
          quantity,
          payDepositOnly,
        },
      ];
    });

    showToast(`“${product.name}” reserved in pre-order cart.`);
  };

  // Quick Pre-order directly from Card
  const handleQuickPreOrder = (product: Product) => {
    const defaultOptions: Record<string, string> = {};
    (product.options || []).forEach((opt) => {
      defaultOptions[opt.name] = opt.default || opt.values[0];
    });
    handleAddToPreOrder(product, defaultOptions, 1, true);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleToggleDeposit = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, payDepositOnly: !item.payDepositOnly } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleOrderCompleted = (newOrder: PreOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setConfirmedOrder(newOrder);
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter & Sort Products across all 200 spaces
  const filteredProducts = products
    .filter((p) => {
      const assetFilename = p.originalAssetFilename || '';
      const hasPhoto = Boolean(
        savedAssets[assetFilename] ||
          savedAssets[assetFilename.toLowerCase()] ||
          p.isCustomUploaded
      );

      if (selectedCategory === 'attached') {
        if (!hasPhoto && p.category !== 'attached') return false;
      } else if (selectedCategory === 'pending') {
        if (hasPhoto && p.category !== 'pending') return false;
      } else if (selectedCategory !== 'all') {
        if (p.category !== selectedCategory) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const slotSearch = `space #${p.slotNumber} slot #${p.slotNumber} space ${p.slotNumber} #${p.slotNumber} ${p.slotNumber}`;
        const matchesQuery =
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          slotSearch.includes(q) ||
          (p.rawPriceText && p.rawPriceText.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'slot') return (a.slotNumber || 1) - (b.slotNumber || 1);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'dispatch') {
        return (a.preOrderStatus?.estimatedDispatchDate || '').localeCompare(
          b.preOrderStatus?.estimatedDispatchDate || ''
        );
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const displayedProducts =
    itemsPerPage >= 200
      ? filteredProducts
      : filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalCartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  if (currentPageView === 'admin') {
    return (
      <AdminSpace
        onBackToStorefront={() => setCurrentPageView('storefront')}
        initialTargetSlot={adminTargetSlot}
        onPreviewProduct={(prod) => {
          setCurrentPageView('storefront');
          setSelectedProduct(prod);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-stone-900 flex flex-col selection:bg-[#946e1c] selection:text-white">
      {/* Sticky Luxury Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => {
          setTrackerInitialCode('');
          setIsTrackerOpen(true);
        }}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenAssetManager={() => setIsAssetManagerOpen(true)}
        onOpenAdminSpace={() => {
          setAdminTargetSlot(undefined);
          setCurrentPageView('admin');
        }}
        onNavigateSection={handleNavigateSection}
        activeSection={activeSection}
      />

      {/* Hero Section */}
      <Hero
        onShopClick={() => handleNavigateSection('collection')}
        onHowItWorksClick={() => handleNavigateSection('how-it-works')}
      />

      {/* How Pre-Order Works 4-Step Section */}
      <HowItWorks onExploreClick={() => handleNavigateSection('collection')} />

      {/* PRE-ORDER COLLECTION SECTION */}
      <section id="collection" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fbf9f4] border border-[#946e1c]/30 text-[10px] tracking-[0.3em] uppercase text-[#946e1c] font-semibold mb-3">
              <Sparkles className="w-3 h-3" />
              <span>200 Pre-Order Portfolio Spaces</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-light tracking-wide">
              PRE-ORDER <span className="font-normal italic font-editorial text-[#946e1c]">COLLECTION</span>
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
              Explore 200 authentic pre-order spaces. When you attach your original photos, the price tag and writings under each image automatically update with zero AI distortion.
            </p>
          </div>

          {/* Quick Notice Badge */}
          <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#946e1c]/30 flex items-center gap-3 text-xs shrink-0 shadow-xs">
            <Clock className="w-4 h-4 text-[#946e1c] shrink-0" />
            <div>
              <span className="text-stone-900 font-medium block">200 Spaces Active</span>
              <span className="text-[11px] text-stone-500">{loadedAssetCount} original photos attached</span>
            </div>
          </div>
        </div>

        {/* Authentic Portfolio Asset Import Bar */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#faf8f4] to-[#f4efe3] border border-[#d8cfbe] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#946e1c]/30 flex items-center justify-center text-[#946e1c] shrink-0 shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                  Attach Original Files (200 Spaces Available)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Auto Price Tag Detection
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Drop your original files directly onto any card, or import in bulk. The writings under the image automatically change to match the price tag on the photo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <label className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm">
              <Upload className="w-3.5 h-3.5 text-[#e5c07b]" />
              <span>Bulk Attach Files</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleDirectBulkImport(e.target.files)}
              />
            </label>

            <button
              onClick={() => setIsAssetManagerOpen(true)}
              className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium border border-stone-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileImage className="w-3.5 h-3.5 text-[#946e1c]" />
              <span>Manage 200 Spaces</span>
            </button>

            {/* Hidden Button to Add Portfolio Space / Admin Access */}
            <button
              onClick={() => {
                setAdminTargetSlot(undefined);
                setCurrentPageView('admin');
              }}
              className="px-3 py-2 bg-stone-100 hover:bg-[#946e1c]/10 text-stone-700 hover:text-[#946e1c] text-xs font-medium border border-stone-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Add Portfolio Space (Admin Locked)"
            >
              <Plus className="w-3.5 h-3.5 text-[#946e1c]" />
              <span className="hidden sm:inline">Add Space</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#946e1c] text-white font-semibold shadow-sm'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                All 200 Spaces
              </button>
              {sections.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#946e1c] text-white font-semibold shadow-sm'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Space #1 to #200, title, price..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 rounded-full bg-white border border-stone-300 text-xs text-stone-700 focus:outline-none focus:border-[#946e1c] cursor-pointer"
                >
                  <option value="slot">Space # Order (1 to 200)</option>
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="dispatch">Earliest Dispatch</option>
                </select>
              </div>

              <div className="relative hidden sm:block">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-full bg-stone-100 border border-stone-300 text-xs text-stone-700 focus:outline-none focus:border-[#946e1c] cursor-pointer font-mono"
                >
                  <option value={24}>24 / page</option>
                  <option value={48}>48 / page</option>
                  <option value={200}>All 200</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-stone-900 mb-1">No Pre-Order Spaces Match Your Filter</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              Try adjusting your search terms or view all 200 spaces across categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white font-semibold text-xs tracking-wider uppercase rounded-full cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={(prod) => setSelectedProduct(prod)}
                  onQuickPreOrder={handleQuickPreOrder}
                  onProductUpdated={() => setProducts(getMergedProducts())}
                  onOpenAdminSpace={(slot) => {
                    setAdminTargetSlot(slot);
                    setCurrentPageView('admin');
                  }}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="text-xs text-stone-500">
                  Showing Spaces{' '}
                  <strong className="text-stone-900 font-mono font-semibold">
                    {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                  </strong>{' '}
                  of{' '}
                  <strong className="text-stone-900 font-mono font-semibold">
                    {filteredProducts.length}
                  </strong>{' '}
                  spaces
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      handleNavigateSection('collection');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 9) }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            handleNavigateSection('collection');
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-[#946e1c] text-white font-bold'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      handleNavigateSection('collection');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* About & VIP Ethos Section */}
      <AboutSection />

      {/* Trust & VIP Assurance Section */}
      <TrustSection onOpenConcierge={() => setIsConciergeOpen(true)} />

      {/* Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenTracker={() => {
          setTrackerInitialCode('');
          setIsTrackerOpen(true);
        }}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenAdminSpace={() => {
          setAdminTargetSlot(undefined);
          setCurrentPageView('admin');
        }}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToPreOrder={handleAddToPreOrder}
        onProductUpdated={() => setProducts(getMergedProducts())}
        onOpenAdminSpace={(slot) => {
          setSelectedProduct(null);
          setAdminTargetSlot(slot);
          setCurrentPageView('admin');
        }}
      />

      {/* Pre-Order Cart Drawer */}
      <PreOrderCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onToggleDeposit={handleToggleDeposit}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderCompleted}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={(code) => {
          setConfirmedOrder(null);
          setTrackerInitialCode(code);
          setIsTrackerOpen(true);
        }}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialOrderCode={trackerInitialCode}
        orders={orders}
      />

      {/* VIP Concierge WhatsApp Modal */}
      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />

      {/* Original Asset Manager & 200 Spaces Vault */}
      <AssetManagerModal
        isOpen={isAssetManagerOpen}
        onClose={() => setIsAssetManagerOpen(false)}
      />

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-stone-950/95 text-white rounded-xl shadow-2xl border border-stone-800 text-xs font-medium flex items-center gap-2 backdrop-blur-md animate-slide-up">
          <Sparkles className="w-4 h-4 text-[#e5c07b] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
