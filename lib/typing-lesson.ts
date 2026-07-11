export interface TypingTask {
  target: string;
  kind: "exact" | "correction" | "ime";
}

export interface TypingEvaluation {
  complete: boolean;
  feedback: string;
  useful: boolean;
}

export function evaluateTypingTask(
  task: TypingTask,
  value: string,
  compositionState: boolean,
): TypingEvaluation {
  if (compositionState) {
    return { complete: false, feedback: "正在选择中文，请完成输入法选词。", useful: true };
  }
  if (value === task.target) {
    return { complete: true, feedback: "输入正确，通信信号已点亮！", useful: true };
  }
  if (task.kind === "correction" && value.startsWith(task.target)) {
    return { complete: false, feedback: "多了字符，试试退格键把它擦掉。", useful: true };
  }
  const useful = task.target.startsWith(value) && value.length > 0;
  return {
    complete: false,
    feedback: useful ? "方向正确，继续输入。" : "没关系，对照目标文字慢慢来。",
    useful,
  };
}

export function normalizeTypingResumeStage(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(5, Math.floor(value)))
    : 0;
}
