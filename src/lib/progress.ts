const KEY = "obsidian-break:progress";

export function loadHighestUnlocked(): number {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
  } catch {
    return 0;
  }
}

export function saveHighestUnlocked(index: number): void {
  try {
    const current = loadHighestUnlocked();
    if (index > current) window.localStorage.setItem(KEY, String(index));
  } catch {
    // Storage unavailable (private mode, etc). Progress simply won't persist.
  }
}
