import { Product } from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';
import { saveCustomAsset, getCustomAssetUrl } from './assetStorage';
import { detectProductWritingsFromImage, DetectedProductData } from './priceDetector';

const STORAGE_KEY = 'svs_custom_product_writings_v2';

export interface ProductOverride {
  name?: string;
  subtitle?: string;
  price?: number;
  rawPriceText?: string;
  shippingFee?: number;
  category?: string;
  description?: string;
  details?: string[];
  specifications?: Record<string, string>;
  priceTagDetected?: boolean;
  isCustomUploaded?: boolean;
  customImage?: string;
}

export function getAllStoredOverrides(): Record<string, ProductOverride> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading product overrides:', e);
    return {};
  }
}

export function saveProductOverride(productId: string, override: ProductOverride): void {
  try {
    const all = getAllStoredOverrides();
    all[productId] = { ...all[productId], ...override };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('svs_products_updated'));
  } catch (e) {
    console.error('Error saving product override:', e);
  }
}

export function getMergedProducts(): Product[] {
  const overrides = getAllStoredOverrides();

  return SAMPLE_PRODUCTS.map((prod) => {
    const override = overrides[prod.id];
    let customImg = override?.customImage;

    // Also check if an asset was saved under originalAssetFilename
    if (!customImg && prod.originalAssetFilename) {
      const assetUrl = getCustomAssetUrl(prod.originalAssetFilename);
      if (assetUrl) {
        customImg = assetUrl;
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

  // 1. Save asset to IndexedDB storage
  await saveCustomAsset(targetFilename, dataUrl);
  if (product.originalAssetFilename && product.originalAssetFilename !== targetFilename) {
    await saveCustomAsset(product.originalAssetFilename, dataUrl);
  }

  // 2. Automatically detect price tag and writings
  const slotNum = product.slotNumber || 1;
  const detected = await detectProductWritingsFromImage(dataUrl, targetFilename, slotNum);

  // 3. Save overrides for this product slot
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
    customImage: dataUrl,
  });

  return { success: true, detectedData: detected };
}

export function resetAllWritings(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('svs_products_updated'));
}
