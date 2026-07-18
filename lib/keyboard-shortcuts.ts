export interface PrimaryShortcutEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}

export function matchesPrimaryShortcut(event: PrimaryShortcutEvent, expectedKey: string): boolean {
  if (expectedKey.length !== 1 || !event.key) return false;
  return (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === expectedKey.toLowerCase();
}

export function numberShortcutIndex(key: string, optionCount: number): number | null {
  if (!Number.isFinite(optionCount)) return null;
  const safeOptionCount = Math.max(0, Math.floor(optionCount));
  const index = Number(key) - 1;
  return Number.isInteger(index) && index >= 0 && index < safeOptionCount ? index : null;
}
