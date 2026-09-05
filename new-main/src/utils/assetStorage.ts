// High-Capacity IndexedDB & Memory Cache for Original Uploaded Brand & Product Assets
// Guarantees that uploaded original portfolio assets are displayed verbatim with ZERO compression or AI modifications.

const DB_NAME = 'svs_portfolio_assets_db';
const STORE_NAME = 'original_portfolio_assets';
const LOCAL_STORAGE_FALLBACK_KEY = 'svs_original_asset_cache_v1';

// In-memory synchronous cache for instantaneous rendering
const memoryCache: Record<string, string> = {};
let isDbReady = false;

// Open or initialize IndexedDB
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 3);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains('portfolio_overrides_store')) {
        db.createObjectStore('portfolio_overrides_store');
      }
      if (!db.objectStoreNames.contains('custom_spaces_store')) {
        db.createObjectStore('custom_spaces_store');
      }
    };
    request.onsuccess = () => {
      isDbReady = true;
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
  });
}

// Pre-load all saved assets into memoryCache on module load
export async function loadAllSavedAssetsIntoMemory(): Promise<void> {
  try {
    // 1. Load from localStorage fallback first (fastest)
    const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(memoryCache, parsed);
    }

    // 2. Load from IndexedDB (high capacity, original resolution)
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const getAllKeysReq = store.getAllKeys();
    const getAllValsReq = store.getAll();

    getAllValsReq.onsuccess = () => {
      const keys = getAllKeysReq.result;
      const vals = getAllValsReq.result;
      if (keys && vals) {
        for (let i = 0; i < keys.length; i++) {
          const k = String(keys[i]);
          const v = String(vals[i]);
          memoryCache[k] = v;
          memoryCache[k.toLowerCase()] = v;
        }
        window.dispatchEvent(new CustomEvent('svs_assets_updated'));
      }
    };
  } catch (e) {
    console.warn('Portfolio asset pre-load error:', e);
  }
}

// Trigger initial load
if (typeof window !== 'undefined') {
  loadAllSavedAssetsIntoMemory();
}

/**
 * Synchronous lookup of a custom portfolio asset data URL by target filename.
 */
export function getCustomAssetUrl(targetFilename: string): string | null {
  if (!targetFilename) return null;

  // 1. Direct exact match in memory
  if (memoryCache[targetFilename]) return memoryCache[targetFilename];

  const targetLower = targetFilename.toLowerCase();
  const targetBase = targetLower.replace(/\.[^/.]+$/, ''); // remove extension

  // 2. Case-insensitive or base filename match
  for (const [key, val] of Object.entries(memoryCache)) {
    const keyLower = key.toLowerCase();
    const keyBase = keyLower.replace(/\.[^/.]+$/, '');
    if (keyLower === targetLower || keyBase === targetBase) {
      return val;
    }
  }

  // 3. Match by WhatsApp photo code (e.g., WA0038 or WA0049)
  const codeMatch = targetLower.match(/wa\d{4}/i);
  if (codeMatch) {
    const code = codeMatch[0].toLowerCase();
    for (const [key, val] of Object.entries(memoryCache)) {
      if (key.toLowerCase().includes(code)) {
        return val;
      }
    }
  }

  // 4. Number match for 1.jpg ... 15.jpg mapped to items WA0038..WA0052
  const numMatch = targetFilename.match(/WA00(\d{2})/i);
  if (numMatch) {
    const waNum = parseInt(numMatch[1], 10); // 38..52
    const indexNum = waNum - 37; // 1..15
    for (const [key, val] of Object.entries(memoryCache)) {
      const keyClean = key.toLowerCase().replace(/\.[^/.]+$/, '');
      if (keyClean === `${indexNum}` || keyClean === `item-${indexNum}` || keyClean === `img_${indexNum}` || keyClean === `photo_${indexNum}`) {
        return val;
      }
    }
  }

  return null;
}

/**
 * Save an original portfolio asset verbatim. Stored in IndexedDB to support unlimited original resolution.
 */
export async function saveCustomAsset(filename: string, dataUrl: string): Promise<void> {
  // Update memory cache immediately for instantaneous UI updates
  memoryCache[filename] = dataUrl;
  memoryCache[filename.toLowerCase()] = dataUrl;

  // Try to write to IndexedDB
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(dataUrl, filename);
    store.put(dataUrl, filename.toLowerCase());
  } catch (e) {
    console.warn('Failed to save to IndexedDB', e);
  }

  // Attempt lightweight localStorage fallback if size is reasonable (<500KB)
  try {
    if (dataUrl.length < 500000) {
      const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
      const map = raw ? JSON.parse(raw) : {};
      map[filename] = dataUrl;
      map[filename.toLowerCase()] = dataUrl;
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(map));
    }
  } catch {
    // LocalStorage quota may be exceeded for large raw files, which is fine since IndexedDB has it
  }

  window.dispatchEvent(new CustomEvent('svs_assets_updated'));
}

/**
 * Remove a custom asset permanently
 */
export async function removeCustomAsset(filename: string): Promise<void> {
  const targetLower = filename.toLowerCase();
  delete memoryCache[filename];
  delete memoryCache[targetLower];

  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(filename);
    store.delete(targetLower);
  } catch (e) {
    console.warn('Error deleting from IndexedDB:', e);
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      delete map[filename];
      delete map[targetLower];
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(map));
    }
  } catch {}

  window.dispatchEvent(new CustomEvent('svs_assets_updated'));
}

export function getAllSavedAssets(): Record<string, string> {
  return { ...memoryCache };
}

export async function clearCustomAssets(): Promise<void> {
  for (const k of Object.keys(memoryCache)) {
    delete memoryCache[k];
  }
  try {
    localStorage.removeItem(LOCAL_STORAGE_FALLBACK_KEY);
  } catch {}

  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch {}

  window.dispatchEvent(new CustomEvent('svs_assets_updated'));
}
