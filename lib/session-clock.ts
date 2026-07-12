export type SessionPhase = "explore" | "ready" | "break";
export function getSessionClockState(elapsedSeconds: number): { minutes: number; phase: SessionPhase; label: string } {
  const safeSeconds = Number.isFinite(elapsedSeconds) ? Math.max(0, Math.floor(elapsedSeconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  if (safeSeconds >= 600) return { minutes, phase: "break", label: "已到 10 分钟，完成后离屏休息" };
  if (safeSeconds >= 480) return { minutes, phase: "ready", label: `已学习 ${minutes} 分钟，可以完成本课` };
  return { minutes, phase: "explore", label: minutes === 0 ? "探索中 · 不到 1 分钟" : `探索中 · ${minutes} 分钟` };
}
