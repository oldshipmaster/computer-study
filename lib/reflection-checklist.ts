export function toggleReflectionItem(current: readonly number[], index: number, itemCount: number): number[] {
  const valid = new Set(current.filter((item) => Number.isInteger(item) && item >= 0 && item < itemCount));
  if (!Number.isInteger(index) || index < 0 || index >= itemCount) return [...valid].sort((a, b) => a - b);
  if (valid.has(index)) valid.delete(index); else valid.add(index);
  return [...valid].sort((a, b) => a - b);
}
