export function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromStorage<T>(key: string): T | null {
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}

export function backupStorage(): string {
  return JSON.stringify(localStorage);
}

export function restoreStorage(backup: string): void {
  try {
    const data = JSON.parse(backup);
    Object.keys(data).forEach((key) => {
      localStorage.setItem(key, data[key]);
    });
  } catch {
    // handle error
  }
}
