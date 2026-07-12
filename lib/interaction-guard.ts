export function isRepeatedPointerActivation(detail: number): boolean {
  return Number.isFinite(detail) && detail > 1;
}
