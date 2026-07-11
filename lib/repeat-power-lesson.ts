export type LoopAction = "forward" | "turnRight";
export function expandRepeat<T>(body: readonly T[], count: number): T[] { const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0; return Array.from({ length: safeCount }, () => [...body]).flat(); }
export function runSquareLoop(repeatCount: number) {
  const program = expandRepeat<LoopAction>(["forward", "turnRight"], repeatCount); let x = 0; let y = 0; let direction = 0; let batteries = 0;
  for (const action of program) { if (action === "turnRight") direction = (direction + 1) % 4; else { const vectors = [[1, 0], [0, 1], [-1, 0], [0, -1]]; x += vectors[direction][0]; y += vectors[direction][1]; batteries += 1; } }
  return { success: repeatCount === 4 && x === 0 && y === 0, position: { x, y }, direction, batteries, expandedInstructions: program.length, program };
}
