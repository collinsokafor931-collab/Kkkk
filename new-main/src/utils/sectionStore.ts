export interface SectionItem {
  id: string;
  label: string;
  isCustom?: boolean;
}

export const DEFAULT_SECTIONS: SectionItem[] = [
  { id: 'attached', label: 'PHOTO ATTACHED' },
  { id: 'pending', label: 'AWAITING PHOTO' },
  { id: 'home', label: 'AMBIENT & HOME' },
  { id: 'accessories', label: 'FASHION & JEWELRY' },
  { id: 'kitchen', label: 'KITCHEN & DINING' },
  { id: 'solar', label: 'SOLAR & POWER' },
  { id: 'appliances', label: 'APPLIANCES' },
];

const SECTIONS_STORAGE_KEY = 'svs_portfolio_sections_v2';

export function getCustomSections(): SectionItem[] {
  try {
    const raw = localStorage.getItem(SECTIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading custom sections:', e);
    return [];
  }
}

export function getAllSections(): SectionItem[] {
  const custom = getCustomSections();
  const defaultIds = new Set(DEFAULT_SECTIONS.map((s) => s.id));
  const uniqueCustom = custom.filter((s) => !defaultIds.has(s.id));
  return [...DEFAULT_SECTIONS, ...uniqueCustom];
}

export function addCustomSection(rawName: string): SectionItem {
  const trimmed = rawName.trim();
  if (!trimmed) {
    throw new Error('Section name cannot be empty');
  }

  const label = trimmed.toUpperCase();
  const slug = 'sec-' + trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = slug || `sec-${Date.now()}`;

  const all = getAllSections();
  const existing = all.find(
    (s) => s.id === id || s.label.toLowerCase() === label.toLowerCase()
  );

  if (existing) {
    return existing;
  }

  const newSection: SectionItem = {
    id,
    label,
    isCustom: true,
  };

  const custom = getCustomSections();
  const updated = [...custom, newSection];
  try {
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('svs_sections_updated', { detail: newSection }));
  } catch (e) {
    console.error('Error saving custom section:', e);
  }

  return newSection;
}

export function deleteCustomSection(sectionId: string): void {
  const custom = getCustomSections();
  const updated = custom.filter((s) => s.id !== sectionId);
  try {
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('svs_sections_updated'));
  } catch (e) {
    console.error('Error deleting custom section:', e);
  }
}

export function getSectionLabel(id?: string): string {
  if (!id) return 'AMBIENT & HOME';
  const all = getAllSections();
  const found = all.find((s) => s.id === id);
  if (found) return found.label;
  return id.toUpperCase();
}
