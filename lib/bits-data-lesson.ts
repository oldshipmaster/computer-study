export type Bit = 0 | 1;
export function bitsToNumber(bits: readonly Bit[]): number { return bits.reduce<number>((value, bit) => value * 2 + bit, 0); }
export function numberToBits(value: number, width: number): Bit[] { const max = 2 ** width - 1; const safe = Math.max(0, Math.min(max, Math.floor(Number.isFinite(value) ? value : 0))); return safe.toString(2).padStart(width, "0").split("").map((bit) => Number(bit) as Bit); }
export function bitsToColor(bits: readonly Bit[]): string { const key = bits.slice(0, 3).join(""); return ({ "000": "black", "001": "blue", "010": "green", "011": "cyan", "100": "red", "101": "magenta", "110": "yellow", "111": "white" } as Record<string, string>)[key] ?? "unknown"; }
