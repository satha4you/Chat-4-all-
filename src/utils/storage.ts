import { UserProfile } from '../types';

/**
 * Robust LocalStorage helper that catches QuotaExceededError and recovers space
 * by purging disposable transient data (such as chat caches and old logs)
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: unknown) {
    console.warn(`[Storage] Failed to set item "${key}", attempting cache cleanup...`, err);
    try {
      // 1. Purge old room chat caches to free space
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('royal_room_chat_') || k.startsWith('royal_temp_'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // 2. Retry setItem
      localStorage.setItem(key, value);
      console.log(`[Storage] Cleaned up ${keysToRemove.length} temporary cache items and saved successfully.`);
      return true;
    } catch (retryErr) {
      console.error(`[Storage] Critical: Unable to save "${key}" even after cache cleanup:`, retryErr);
      return false;
    }
  }
}

/**
 * Safely saves the current user profile to both their private user key
 * and the active profile slot so it can never be lost on page reload
 */
export function saveUserProfile(user: UserProfile): void {
  if (!user || !user.id) return;
  safeSetItem(`royal_voice_user_${user.id}`, JSON.stringify(user));
  safeSetItem('royal_voice_active_profile', JSON.stringify(user));
}

/**
 * Load an individual user profile if saved independently
 */
export function loadUserProfile(userId: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(`royal_voice_user_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn(`[Storage] Failed to load individual profile for ${userId}:`, e);
  }
  return null;
}

/**
 * Load and merge users safely without wiping edits or stripping custom accounts
 */
export function loadAllUsers(initialUsers: UserProfile[]): UserProfile[] {
  try {
    const saved = localStorage.getItem('royal_voice_users');
    let baseUsers: UserProfile[] = initialUsers;

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Map of saved users by ID
        const userMap = new Map<string, UserProfile>();

        // Add parsed users from storage
        parsed.forEach((u: UserProfile) => {
          if (u && u.id) {
            userMap.set(u.id, u);
          }
        });

        // Add any initial users that might not exist yet
        initialUsers.forEach((u) => {
          if (!userMap.has(u.id)) {
            userMap.set(u.id, u);
          }
        });

        baseUsers = Array.from(userMap.values());
      }
    }

    // Check if active profile backup exists
    try {
      const activeRaw = localStorage.getItem('royal_voice_active_profile');
      if (activeRaw) {
        const activeProfile: UserProfile = JSON.parse(activeRaw);
        if (activeProfile && activeProfile.id) {
          const idx = baseUsers.findIndex((u) => u.id === activeProfile.id);
          if (idx !== -1) {
            baseUsers[idx] = { ...baseUsers[idx], ...activeProfile };
          } else {
            baseUsers.unshift(activeProfile);
          }
        }
      }
    } catch {
      // Ignore backup error
    }

    // Also check individual user backups
    baseUsers = baseUsers.map((u) => {
      try {
        const ind = localStorage.getItem(`royal_voice_user_${u.id}`);
        if (ind) {
          const parsedInd = JSON.parse(ind);
          return { ...u, ...parsedInd };
        }
      } catch {
        // Ignore
      }
      return u;
    });

    return baseUsers;
  } catch (e) {
    console.warn('[Storage] Error loading all users, falling back to initial data:', e);
    return initialUsers;
  }
}

/**
 * Compress an image file to a lightweight data URL (max ~15-25KB)
 * to avoid exceeding browser LocalStorage limits.
 */
export function compressImage(file: File, maxDim = 180, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('فشل تحميل الصورة للضغط'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('فشل قراءة ملف الصورة'));
    reader.readAsDataURL(file);
  });
}
