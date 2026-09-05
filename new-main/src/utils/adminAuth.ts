const ADMIN_STORAGE_KEY = 'svs_admin_unlocked';
const ADMIN_PASSWORD = 'omosereehiz1989';

export function isAdminUnlocked(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminUnlocked(unlocked: boolean): void {
  try {
    if (unlocked) {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent('svs_admin_auth_changed', { detail: { unlocked } }));
  } catch (e) {
    console.error('Error saving admin auth state:', e);
  }
}

export function lockAdminSession(): void {
  setAdminUnlocked(false);
}

export function verifyAdminPassword(password: string): boolean {
  if (password.trim() === ADMIN_PASSWORD) {
    setAdminUnlocked(true);
    return true;
  }
  return false;
}
