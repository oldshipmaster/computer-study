export type RepairInstruction = "wake" | "collect" | "repair" | "return";
export const TARGET_SEQUENCE: RepairInstruction[] = ["wake", "collect", "repair", "return"];
export function executeSequence(program: readonly string[]) {
  const completed: string[] = [];
  for (let index = 0; index < program.length; index += 1) {
    if (program[index] !== TARGET_SEQUENCE[index]) return { success: false, completed, firstMismatch: index };
    completed.push(program[index]);
  }
  return { success: completed.length === TARGET_SEQUENCE.length, completed, firstMismatch: completed.length === TARGET_SEQUENCE.length ? null : completed.length };
}
export function moveInstruction<T>(queue: readonly T[], from: number, to: number): T[] {
  if (from < 0 || from >= queue.length || to < 0 || to >= queue.length) return [...queue];
  const next = [...queue]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next;
}
