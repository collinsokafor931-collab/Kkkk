import { Product } from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';
import { saveCustomAsset, getCustomAssetUrl, removeCustomAsset } from './assetStorage';
import { detectProductWritingsFromImage, DetectedProductData } from './priceDetector';

const STORAGE_KEY = 'svs_custom_product_writings_v3';
const CUSTOM_SPACES_KEY = 'svs_custom_portfolio_spaces_v1';
const DELETED_SPACES_KEY = 'svs_deleted_spaces_v1';

export interface ProductOverride {
  name?: string;
  subtitle?: string;
  price?: number;
  rawPriceText?: string;
  shippingFee?: number;
  depositPercentage?: number;
  category?: string;
  description?: string;
  details?: string[];
  specifications?: Record<string, string>;
  priceTagDetected?: boolean;
  isCustomUploaded?: boolean;
  customAssetFilename?: string;
  // Memory or small thumbnail copy
  customImage?: string;
}

// In-memory overrides cache for instantaneous synchronous reads
let memoryOverrides: Record<string, ProductOverride> | null = null;
let memoryCustomSpaces: Product[] | null = null;
let memoryDeletedSpaces: Set<string> | null = null;

export function getDeletedSpaceIds(): Set<string> {
  if (memoryDeletedSpaces !== null) {
    return memoryDeletedSpaces;
  }
  try {
    const raw = localStorage.getItem(DELETED_SPACES_KEY);
    memoryDeletedSpaces = new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    console.error('Error loading deleted spaces from localStorage:', e);
    memoryDeletedSpaces = new Set();
  }
  return memoryDeletedSpaces || new Set();
}

export function saveDeletedSpaceIds(ids: Set<string>): void {
  try {
    memoryDeletedSpaces = ids;
    localStorage.setItem(DELETED_SPACES_KEY, JSON.stringify(Array.from(ids)));
    window.dispatchEvent(new CustomEvent('svs_products_updated'));
  } catch (e) {
    console.error('Error saving deleted spaces to localStorage:', e);
  }
}

export function deleteSpaces(productIds: string[]): void {
  if (!productIds || productIds.length === 0) return;
  const currentDeleted = new Set(getDeletedSpaceIds());
  productIds.forEach((id) => currentDeleted.add(id));

  // If custom spaces were deleted, clean them up as well
  const customSpaces = getCustomPortfolioSpaces();
  const remainingCustom = customSpaces.filter((s) => !productIds.includes(s.id));
  if (remainingCustom.length !== customSpaces.length) {
    saveCustomPortfolioSpaces(remainingCustom);
  }

  saveDeletedSpaceIds(currentDeleted);
}

export function restoreDeletedSpaces(productIds?: string[]): void {
  const currentDeleted = new Set(getDeletedSpaceIds());
  if (!productIds) {
    currentDeleted.clear();
  } else {
    productIds.forEach((id) => currentDeleted.delete(id));
  }
  saveDeletedSpaceIds(currentDeleted);
}

export function getDeletedCount(): number {
  return getDeletedSpaceIds().size;
}

export function getAllStoredOverrides(): Record<string, ProductOverride> {
  if (memoryOverrides !== null) {
    return memoryOverrides;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    memoryOverrides = raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error loading product overrides from localStorage:', e);
    memoryOverrides = {};
  }
  return memoryOverrides || {};
}

export function saveProductOverride(productId: string, override: ProductOverride): void {
  try {
    const all = getAllStoredOverrides();
    // Strip giant base64 strings from localStorage to prevent QuotaExceededError
    const safeOverride = { ...override };
    if (safeOverride.customImage && safeOverride.customImage.length > 200000) {
      // Don't store giant base64 directly in localStorage JSON; rely on assetStorage (IndexedDB)
      delete safeOverride.customImage;
    }

    all[productId] = { ...all[productId], ...safeOverride };
    memoryOverrides = all;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('svs_products_updated'));
  } catch (e) {
    console.error('Error saving product override:', e);
  }
}

export function resetSlotWritings(productId: string): void {
  try {
    const all = getAllStoredOverrides();
    if (all[productId]) {
      // Preserve custom image reference if present, reset textual fields
      const existing = all[productId];
      if (existing.customAssetFilename || existing.isCustomUploaded) {
        all[productId] = {
          isCustomUploaded: existing.isCustomUploaded,
          customAssetFilename: existing.customAssetFilename,
          customImage: existing.customImage,
        };
      } else {
        delete all[productId];
      }
      memoryOverrides = all;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('svs_products_updated'));
    }
  } catch (e) {
    console.error('Error resetting slot writings:', e);
  }
}

export async function removeImageFromSlot(product: Product): Promise<void> {
  const targetFilename = product.originalAssetFilename || `slot-${product.slotNumber || 1}.jpg`;
  await removeCustomAsset(targetFilename);
  if (product.originalAssetFilename) {
    await removeCustomAsset(product.originalAssetFilename);
  }
  await removeCustomAsset(`slot_img_${product.id}`);

  // Update override
  const all = getAllStoredOverrides();
  if (all[product.id]) {
    all[product.id].isCustomUploaded = false;
    delete all[product.id].customAssetFilename;
    delete all[product.id].customImage;
    memoryOverrides = all;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
  window.dispatchEvent(new CustomEvent('svs_products_updated'));
}

export function getCustomPortfolioSpaces(): Product[] {
  if (memoryCustomSpaces !== null) {
    return memoryCustomSpaces;
  }
  try {
    const raw = localStorage.getItem(CUSTOM_SPACES_KEY);
    memoryCustomSpaces = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading custom portfolio spaces:', e);
    memoryCustomSpaces = [];
  }
  return memoryCustomSpaces || [];
}

export function saveCustomPortfolioSpaces(spaces: Product[]): void {
  try {
    memoryCustomSpaces = spaces;
    localStorage.setItem(CUSTOM_SPACES_KEY, JSON.stringify(spaces));
    window.dispatchEvent(new CustomEvent('svs_products_updated'));
  } catch (e) {
    console.error('Error saving custom portfolio spaces:', e);
  }
}

export function addCustomPortfolioSpace(data: {
  name: string;
  subtitle?: string;
  price: number;
  shippingFee?: number;
  category?: string;
  description?: string;
  depositPercentage?: number;
  slotNumber?: number;
  imageFileOrUrl?: string;
}): Product {
  const existingSpaces = getCustomPortfolioSpaces();
  const allCurrent = getMergedProducts();

  // Find next available slot number
  const maxSlot = allCurrent.reduce((max, p) => Math.max(max, p.slotNumber || 0), 200);
  const nextSlotNumber = data.slotNumber || maxSlot + 1;
  const newId = `svs-custom-slot-${nextSlotNumber}-${Date.now()}`;
  const assetFilename = `CUSTOM-SLOT-${nextSlotNumber}.jpg`;

  const newProduct: Product = {
    id: newId,
    slotNumber: nextSlotNumber,
    name: data.name || `Custom Portfolio Space #${nextSlotNumber}`,
    subtitle: data.subtitle || 'VIP Bespoke Atelier Allocation',
    category: data.category || 'home',
    price: data.price || 5000,
    rawPriceText: `₦${(data.price || 5000).toLocaleString()}`,
    shippingFee: data.shippingFee !== undefined ? data.shippingFee : 2000,
    originalAssetFilename: assetFilename,
    depositPercentage: data.depositPercentage || 50,
    images: data.imageFileOrUrl ? [data.imageFileOrUrl] : [`/products/Slot-${nextSlotNumber}.jpg`],
    description: data.description || `Custom portfolio space #${nextSlotNumber}. Dedicated luxury pre-order allocation.`,
    details: [
      `Custom Space #${nextSlotNumber} Priority Allocation`,
      'VIP Pre-Order direct factory procurement',
      'Insured nationwide courier delivery',
    ],
    specifications: {
      'Space Allocation': `Custom Slot #${nextSlotNumber}`,
      'Status': data.imageFileOrUrl ? 'Original Photo Attached' : 'Awaiting Original File',
      'Pre-Order Price': `₦${(data.price || 5000).toLocaleString()}`,
      'Shipping Fee': `₦${(data.shippingFee || 2000).toLocaleString()}`,
    },
    options: [
      {
        name: 'Allocation Option',
        values: ['Standard VIP Allocation', 'Express Direct Drop'],
        default: 'Standard VIP Allocation',
      },
    ],
    preOrderStatus: {
      batchName: `VIP Atelier Drop ${Math.ceil(nextSlotNumber / 20)}`,
      isOpen: true,
      slotsTotal: 50,
      slotsClaimed: 0,
      estimatedDispatchDate: 'Oct 20 — Nov 10, 2026',
      preOrderClosingDate: 'Oct 05, 2026',
      productionStage: 'Pre-order Open',
    },
    featured: true,
    isNewDrop: true,
    isCustomUploaded: Boolean(data.imageFileOrUrl),
  };

  const updatedSpaces = [...existingSpaces, newProduct];
  saveCustomPortfolioSpaces(updatedSpaces);

  if (data.imageFileOrUrl) {
    saveCustomAsset(assetFilename, data.imageFileOrUrl);
  }

  return newProduct;
}

export function deleteCustomPortfolioSpace(spaceId: string): void {
  const existingSpaces = getCustomPortfolioSpaces();
  const updated = existingSpaces.filter((s) => s.id !== spaceId);
  saveCustomPortfolioSpaces(updated);

  // Mark as deleted in general list as well
  deleteSpaces([spaceId]);

  // Also clean up overrides
  const all = getAllStoredOverrides();
  if (all[spaceId]) {
    delete all[spaceId];
    memoryOverrides = all;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
  window.dispatchEvent(new CustomEvent('svs_products_updated'));
}

export function getMergedProducts(includeDeleted: boolean = false): Product[] {
  const overrides = getAllStoredOverrides();
  const customSpaces = getCustomPortfolioSpaces();
  const deletedIds = getDeletedSpaceIds();
  const basePool = [...SAMPLE_PRODUCTS, ...customSpaces];
  const activePool = includeDeleted ? basePool : basePool.filter((p) => !deletedIds.has(p.id));

  return activePool.map((prod) => {
    const override = overrides[prod.id];
    let customImg = override?.customImage;

    // Also check if an asset was saved under originalAssetFilename or slot identifier
    if (!customImg) {
      if (override?.customAssetFilename) {
        customImg = getCustomAssetUrl(override.customAssetFilename) || undefined;
      }
      if (!customImg && prod.originalAssetFilename) {
        customImg = getCustomAssetUrl(prod.originalAssetFilename) || undefined;
      }
      if (!customImg) {
        customImg = getCustomAssetUrl(`slot_img_${prod.id}`) || undefined;
      }
    }

    if (!override && !customImg) {
      return prod;
    }

    const updatedImages = customImg ? [customImg, ...prod.images.filter((img) => img !== customImg)] : prod.images;

    return {
      ...prod,
      name: override?.name || prod.name,
      subtitle: override?.subtitle || prod.subtitle,
      price: override?.price !== undefined ? override.price : prod.price,
      rawPriceText: override?.rawPriceText || prod.rawPriceText || `₦${(override?.price || prod.price).toLocaleString()}`,
      shippingFee: override?.shippingFee !== undefined ? override.shippingFee : prod.shippingFee,
      depositPercentage: override?.depositPercentage !== undefined ? override.depositPercentage : prod.depositPercentage,
      category: override?.category || prod.category,
      description: override?.description || prod.description,
      details: override?.details || prod.details,
      specifications: override?.specifications || prod.specifications,
      priceTagDetected: override?.priceTagDetected ?? prod.priceTagDetected ?? false,
      isCustomUploaded: override?.isCustomUploaded ?? (Boolean(customImg) || false),
      images: updatedImages,
    };
  });
}

export async function attachImageToSlot(
  product: Product,
  fileOrDataUrl: File | string,
  filename?: string
): Promise<{ success: boolean; detectedData?: DetectedProductData }> {
  const targetFilename = filename || (typeof fileOrDataUrl === 'string' ? product.originalAssetFilename || `slot-${product.slotNumber || 1}.jpg` : fileOrDataUrl.name);

  // Read data URL
  let dataUrl: string;
  if (typeof fileOrDataUrl === 'string') {
    dataUrl = fileOrDataUrl;
  } else {
    dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    });
  }

  // 1. Save asset to IndexedDB storage permanently
  await saveCustomAsset(targetFilename, dataUrl);
  if (product.originalAssetFilename && product.originalAssetFilename !== targetFilename) {
    await saveCustomAsset(product.originalAssetFilename, dataUrl);
  }
  await saveCustomAsset(`slot_img_${product.id}`, dataUrl);

  // 2. Automatically detect price tag and writings
  const slotNum = product.slotNumber || 1;
  const detected = await detectProductWritingsFromImage(dataUrl, targetFilename, slotNum);

  // 3. Save overrides for this product slot permanently (persisting to localStorage & IndexedDB)
  saveProductOverride(product.id, {
    name: detected.name,
    subtitle: detected.subtitle,
    price: detected.detectedPrice,
    rawPriceText: detected.rawPriceText,
    category: detected.category,
    description: detected.description,
    details: detected.details,
    specifications: detected.specifications,
    priceTagDetected: detected.priceTagFound,
    isCustomUploaded: true,
    customAssetFilename: targetFilename,
    customImage: dataUrl,
  });

  return { success: true, detectedData: detected };
}

export function resetAllWritings(): void {
  localStorage.removeItem(STORAGE_KEY);
  memoryOverrides = {};
  window.dispatchEvent(new CustomEvent('svs_products_updated'));
}
