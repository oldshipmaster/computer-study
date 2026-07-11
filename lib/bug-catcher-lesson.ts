export type BugType = "order" | "count" | "branch";
export type FixId = "swap-first-two" | "repeat-four" | "swap-branches";
export interface BugCase { id: string; title: string; program: string[]; expected: string; actual: string; bugType: BugType; correctFix: FixId; }
export const BUG_CASES: BugCase[] = [
  { id: "order", title: "工具还没拿就开始修桥", program: ["修桥", "拿工具", "返回"], expected: "先拿工具再修桥", actual: "机器人空手停住了", bugType: "order", correctFix: "swap-first-two" },
  { id: "count", title: "正方形少了一条边", program: ["重复 3 次", "前进", "右转"], expected: "画出四条边", actual: "只画出三条边", bugType: "count", correctFix: "repeat-four" },
  { id: "branch", title: "晴天机器人却撑伞", program: ["如果下雨", "戴帽子", "否则", "撑伞"], expected: "晴天戴帽子", actual: "晴天撑伞", bugType: "branch", correctFix: "swap-branches" },
];
export function diagnoseBug(bugCase: BugCase) { return { bugType: bugCase.bugType, evidence: `期望：${bugCase.expected}；实际：${bugCase.actual}` }; }
export function applyFix(bugCase: BugCase, fix: FixId) { const fixed = fix === bugCase.correctFix; return { fixed, feedback: fixed ? "修改与证据吻合，重新测试通过。" : "这次修改还没有解释观察到的证据，请回到第一个不同点。" }; }
