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
