export type AlgorithmArenaMode = "linear" | "binary" | "sort" | "dependency" | "efficiency" | "relay";
export type AlgorithmArenaPhase = "playing" | "step-solved" | "mission-solved" | "complete";
export type VisualItemState = "normal" | "active" | "done" | "blocked";

export interface AlgorithmVisualItem {
  id: string;
  label: string;
  state?: VisualItemState;
}

export interface AlgorithmArenaStep {
  prompt: string;
  options: Array<{ id: string; label: string }>;
  answerId: string;
  explanation: string;
  evidence: string;
  wrongFeedback: string;
  visual: { label: string; items: AlgorithmVisualItem[]; note: string };
}

export interface AlgorithmArenaMission {
  id: string;
  title: string;
  story: string;
  mode: AlgorithmArenaMode;
  skill: string;
  courseId: string;
  steps: AlgorithmArenaStep[];
}

export interface AlgorithmArenaState {
  index: number;
  missionCount: number;
  stepIndex: number;
  solved: number;
  phase: AlgorithmArenaPhase;
  evidence: string[];
  feedback: string;
}

function option(id: string, label: string) {
  return { id, label };
}

function item(id: string, label: string, state: VisualItemState = "normal"): AlgorithmVisualItem {
  return { id, label, state };
}

export const ALGORITHM_ARENA_MISSIONS: AlgorithmArenaMission[] = [
  {
    id: "linear-scout",
    title: "逐格侦察",
    story: "无序货架藏着 11 号零件。侦察器只能从左到右逐格确认。",
    mode: "linear",
    skill: "线性搜索",
    courseId: "linear-search",
    steps: [
      { prompt: "侦察器第一步必须检查哪一格？", options: [option("check-0", "第 1 格 · 8"), option("check-1", "第 2 格 · 3"), option("check-2", "第 3 格 · 11")], answerId: "check-0", explanation: "线性搜索从第一项开始，不会因为目标看起来在后面就跳格。", evidence: "第 1 格：8 ≠ 11", wrongFeedback: "顺序侦察还不能跳格，先观察最左边的第 1 格。", visual: { label: "无序货架", items: [item("n0", "8", "active"), item("n1", "3"), item("n2", "11"), item("n3", "6"), item("n4", "14")], note: "黄色扫描框表示下一格" } },
      { prompt: "8 不是目标，下一步检查哪里？", options: [option("check-0", "再查第 1 格"), option("check-1", "第 2 格 · 3"), option("check-3", "跳到第 4 格")], answerId: "check-1", explanation: "没有找到就向右移动一格，继续逐项比较。", evidence: "第 2 格：3 ≠ 11", wrongFeedback: "观察已经检查的证据，再按从左到右的顺序移动一格。", visual: { label: "无序货架", items: [item("n0", "8", "done"), item("n1", "3", "active"), item("n2", "11"), item("n3", "6"), item("n4", "14")], note: "8 已排除，扫描框右移一格" } },
      { prompt: "3 也不是目标，侦察器接着检查哪里？", options: [option("check-4", "第 5 格 · 14"), option("check-2", "第 3 格 · 11"), option("stop", "现在停止")], answerId: "check-2", explanation: "第 3 格就是目标，线性搜索找到后立即停止。", evidence: "第 3 格：11 = 目标，停止", wrongFeedback: "还没有找到目标，也没有查完；观察扫描框紧邻的下一格。", visual: { label: "无序货架", items: [item("n0", "8", "done"), item("n1", "3", "done"), item("n2", "11", "active"), item("n3", "6"), item("n4", "14")], note: "前两格已排除，目标可能就在下一格" } },
    ],
  },
  {
    id: "binary-radar",
    title: "对半雷达",
    story: "有序频道里藏着 17。利用大小关系，每次排除不可能的一半。",
    mode: "binary",
    skill: "二分搜索",
    courseId: "binary-search",
    steps: [
      { prompt: "范围是第 1–7 格，先检查哪个中间位置？", options: [option("mid-1", "第 2 格 · 5"), option("mid-3", "第 4 格 · 11"), option("mid-5", "第 6 格 · 17")], answerId: "mid-3", explanation: "七个有序项目的中间是第 4 格。先检查中点才能可靠地减半。", evidence: "中点 11 < 17，排除第 1–4 格", wrongFeedback: "观察当前范围的左右边界，选择正中间的位置。", visual: { label: "当前范围 1–7", items: [2, 5, 8, 11, 14, 17, 20].map((value, index) => item(`b${index}`, String(value), index === 3 ? "active" : "normal")), note: "资料已从小到大排序" } },
      { prompt: "17 比 11 大，剩余第 5–7 格；新的中点在哪里？", options: [option("mid-4", "第 5 格 · 14"), option("mid-5", "第 6 格 · 17"), option("mid-6", "第 7 格 · 20")], answerId: "mid-5", explanation: "剩余三格的中点是第 6 格，正好找到 17。", evidence: "新中点 17 = 目标，只检查 2 次", wrongFeedback: "先排除小于等于 11 的左半，再观察剩余三格的中点。", visual: { label: "当前范围 5–7", items: [2, 5, 8, 11, 14, 17, 20].map((value, index) => item(`b${index}`, String(value), index < 4 ? "blocked" : index === 5 ? "active" : "normal")), note: "灰色范围已由大小证据排除" } },
    ],
  },
  {
    id: "neighbor-sort",
    title: "邻居交换赛",
    story: "排序机器人沿轨道比较相邻数字，顺序错误就交换。",
    mode: "sort",
    skill: "冒泡排序",
    courseId: "bubble-sort",
    steps: [
      { prompt: "第一对邻居 4、1 顺序错误，执行什么？", options: [option("swap-01", "交换 4 和 1"), option("keep-01", "保持不动"), option("swap-23", "先交换 3 和 2")], answerId: "swap-01", explanation: "从左向右比较相邻项，4 大于 1，所以交换。", evidence: "4、1 交换 → 1、4、3、2", wrongFeedback: "观察扫描框里的第一对邻居；左边更大时应该交换。", visual: { label: "轨道：4 · 1 · 3 · 2", items: [item("s0", "4", "active"), item("s1", "1", "active"), item("s2", "3"), item("s3", "2")], note: "扫描从最左边的相邻对开始" } },
      { prompt: "现在是 1、4、3、2；下一对 4、3 怎么处理？", options: [option("keep-12", "保持 4、3"), option("swap-12", "交换 4 和 3"), option("restart", "回到开头")], answerId: "swap-12", explanation: "4 大于右边的 3，交换后较大的 4 继续向右移动。", evidence: "4、3 交换 → 1、3、4、2", wrongFeedback: "观察当前相邻对，左边的 4 比右边的 3 大。", visual: { label: "轨道：1 · 4 · 3 · 2", items: [item("s0", "1", "done"), item("s1", "4", "active"), item("s2", "3", "active"), item("s3", "2")], note: "同一轮继续向右比较" } },
      { prompt: "现在是 1、3、4、2；4、2 怎么处理？", options: [option("swap-23", "交换 4 和 2"), option("keep-23", "保持不动"), option("done", "已经完全有序")], answerId: "swap-23", explanation: "交换后最大的 4 到达最右端，第一轮结束。", evidence: "4、2 交换 → 1、3、2、4", wrongFeedback: "4 还在 2 的左边，顺序仍然错误，需要交换这对邻居。", visual: { label: "轨道：1 · 3 · 4 · 2", items: [item("s0", "1", "done"), item("s1", "3", "done"), item("s2", "4", "active"), item("s3", "2", "active")], note: "本轮最大的数字会移动到最右端" } },
      { prompt: "第二轮发现 3、2 顺序错误，最后一步是什么？", options: [option("swap-12-final", "交换 3 和 2"), option("swap-03", "交换 1 和 4"), option("stop", "不用再检查")], answerId: "swap-12-final", explanation: "交换 3 和 2 后得到 1、2、3、4，轨道完全有序。", evidence: "3、2 交换 → 1、2、3、4", wrongFeedback: "观察还没有按从小到大排列的相邻对 3、2。", visual: { label: "轨道：1 · 3 · 2 · 4", items: [item("s0", "1", "done"), item("s1", "3", "active"), item("s2", "2", "active"), item("s3", "4", "done")], note: "两端已经就位，只剩中间一对" } },
    ],
  },
  {
    id: "dependency-launch",
    title: "依赖发射台",
    story: "发布探测器前，要按依赖完成扫描、设计、组装和测试。",
    mode: "dependency",
    skill: "任务分解",
    courseId: "task-decomposition",
    steps: [
      { prompt: "哪项任务没有未完成的依赖，可以先开始？", options: [option("scan", "扫描需求"), option("build", "组装探测器"), option("test", "完成测试")], answerId: "scan", explanation: "扫描需求不依赖其他任务，是整条任务链的起点。", evidence: "完成扫描需求，解锁设计路线", wrongFeedback: "观察依赖箭头；还不能选择需要前一步结果的任务。", visual: { label: "任务依赖图", items: [item("scan", "扫描", "active"), item("plan", "设计", "blocked"), item("build", "组装", "blocked"), item("test", "测试", "blocked")], note: "只有没有未完成依赖的节点可执行" } },
      { prompt: "扫描完成后，哪个任务被解锁？", options: [option("plan", "设计路线"), option("test", "完成测试"), option("launch", "直接发射")], answerId: "plan", explanation: "设计路线依赖扫描结果，现在可以执行。", evidence: "完成设计路线，解锁组装", wrongFeedback: "顺着扫描节点发出的依赖箭头找下一项。", visual: { label: "任务依赖图", items: [item("scan", "扫描", "done"), item("plan", "设计", "active"), item("build", "组装", "blocked"), item("test", "测试", "blocked")], note: "已完成节点会为下一项提供结果" } },
      { prompt: "设计完成，下一项可执行任务是什么？", options: [option("build", "组装探测器"), option("scan", "重复扫描"), option("test", "跳到测试")], answerId: "build", explanation: "组装需要设计结果；测试又需要组装结果，不能跳步。", evidence: "完成组装，解锁测试", wrongFeedback: "测试仍被组装任务挡住，观察当前亮起的节点。", visual: { label: "任务依赖图", items: [item("scan", "扫描", "done"), item("plan", "设计", "done"), item("build", "组装", "active"), item("test", "测试", "blocked")], note: "当前所有依赖已经满足的节点会亮起" } },
      { prompt: "探测器已经组装，发射前最后要做什么？", options: [option("launch", "直接发射"), option("test", "完成测试"), option("plan", "重新设计")], answerId: "test", explanation: "测试依赖组装结果，是发射前最后一道检查。", evidence: "完成测试，整条任务链有效", wrongFeedback: "观察尚未完成但已经解锁的最后一个节点。", visual: { label: "任务依赖图", items: [item("scan", "扫描", "done"), item("plan", "设计", "done"), item("build", "组装", "done"), item("test", "测试", "active")], note: "合法顺序必须让每个任务的依赖先完成" } },
    ],
  },
  {
    id: "efficiency-referee",
    title: "效率裁判席",
    story: "比较方法前先看资料是否有序、规模多大，以及公平的步骤证据。",
    mode: "efficiency",
    skill: "算法效率",
    courseId: "algorithm-efficiency",
    steps: [
      { prompt: "7 张无序卡片只找一次，哪种方法可以直接开始？", options: [option("linear", "线性搜索"), option("binary", "二分搜索"), option("either", "随便选都一样")], answerId: "linear", explanation: "二分搜索依赖有序资料；这里直接逐个检查更可靠。", evidence: "无序 7 项：选择线性搜索", wrongFeedback: "先观察资料条件：它没有排序，不能安全排除一半。", visual: { label: "无序小资料", items: [9, 2, 7, 1, 6, 4, 8].map((value, index) => item(`e${index}`, String(value))), note: "是否有序比按钮名字更重要" } },
      { prompt: "64 个编号已经有序，需要反复查找，哪种方法通常更省比较？", options: [option("linear", "线性搜索，最多 64 次"), option("binary", "二分搜索，约 7 次"), option("shuffle", "先打乱再找")], answerId: "binary", explanation: "有序资料允许每次排除一半，规模增大时优势更明显。", evidence: "有序 64 项：二分约 7 次，线性最多 64 次", wrongFeedback: "观察相同输入下的步骤证据：7 次和 64 次差别很大。", visual: { label: "相同输入的工作量", items: [item("linear", "线性 ≤64", "normal"), item("binary", "二分 ≤7", "active")], note: "公平比较必须使用相同输入规模" } },
      { prompt: "怎样证明谁更高效，证据才公平？", options: [option("same-input", "相同输入下记录步骤数"), option("color", "看哪个动画颜色更亮"), option("name", "看哪个名字更短")], answerId: "same-input", explanation: "控制相同输入并记录操作次数，才能比较方法的工作量。", evidence: "裁判规则：同一输入、记录步骤、再比较", wrongFeedback: "效率要用可重复的工作量证据，观察哪项能真正计数。", visual: { label: "裁判证据板", items: [item("input", "相同输入", "active"), item("steps", "步骤计数", "active"), item("result", "比较结果", "active")], note: "不以颜色、名字或一次运气作证据" } },
    ],
  },
  {
    id: "algorithm-relay",
    title: "算法接力赛",
    story: "把混乱资料变成可快速查找的资料，再用证据解释整套方案。",
    mode: "relay",
    skill: "综合选择",
    courseId: "algorithm-efficiency",
    steps: [
      { prompt: "资料是 12、3、9、6，要为很多次查找做准备；先做什么？", options: [option("sort", "先排序资料"), option("binary", "直接二分搜索"), option("delete", "删除一半资料")], answerId: "sort", explanation: "二分搜索前必须建立有序条件。", evidence: "冒泡整理 → 3、6、9、12", wrongFeedback: "观察资料是否有序；没有顺序就不能根据大小排除一半。", visual: { label: "待整理资料", items: [item("r0", "12", "active"), item("r1", "3", "active"), item("r2", "9"), item("r3", "6")], note: "先创造快速查找需要的条件" } },
      { prompt: "资料已变成 3、6、9、12；反复寻找 9，接棒哪种搜索？", options: [option("linear", "每次从头逐个找"), option("binary", "每次检查中点并减半"), option("random", "随机点一格")], answerId: "binary", explanation: "资料已排序且会反复查找，二分搜索能利用有序信息。", evidence: "有序资料接棒二分搜索", wrongFeedback: "观察刚刚获得的有序条件，以及会反复查找这个目标。", visual: { label: "已排序资料", items: [item("r0", "3"), item("r1", "6", "active"), item("r2", "9", "active"), item("r3", "12")], note: "中点比较后可以排除不可能的一半" } },
      { prompt: "最后怎样向裁判解释这套组合更合适？", options: [option("evidence", "同一资料下记录整理成本和多次查找步骤"), option("pretty", "因为卡片排好后更漂亮"), option("fast", "只说‘我觉得更快’")], answerId: "evidence", explanation: "算法选择要结合准备成本、使用次数和可计数的步骤证据。", evidence: "完整论证：条件 + 步骤数 + 使用次数", wrongFeedback: "结论需要能被别人重复检查的步骤证据。", visual: { label: "综合证据链", items: [item("condition", "先排序", "done"), item("method", "再二分", "done"), item("proof", "数步骤", "active")], note: "算法没有脱离条件的永远冠军" } },
    ],
  },
];

export function buildAlgorithmArenaDeck(rotation: number): AlgorithmArenaMission[] {
  const safeRotation = Number.isFinite(rotation) ? Math.max(0, Math.floor(rotation)) : 0;
  const offset = ALGORITHM_ARENA_MISSIONS.length === 0 ? 0 : safeRotation % ALGORITHM_ARENA_MISSIONS.length;
  return [...ALGORITHM_ARENA_MISSIONS.slice(offset), ...ALGORITHM_ARENA_MISSIONS.slice(0, offset)];
}

export function createAlgorithmArenaState(missionCount: number): AlgorithmArenaState {
  const safeCount = Number.isFinite(missionCount) ? Math.max(0, Math.floor(missionCount)) : 0;
  return { index: 0, missionCount: safeCount, stepIndex: 0, solved: 0, phase: safeCount === 0 ? "complete" : "playing", evidence: [], feedback: "观察证据，选择下一步。" };
}

export function chooseAlgorithmAction(state: AlgorithmArenaState, mission: AlgorithmArenaMission, actionId: string, activationDetail = 1): AlgorithmArenaState {
  if (activationDetail > 1 || state.phase !== "playing") return state;
  const step = mission.steps[state.stepIndex];
  if (!step || !step.options.some((candidate) => candidate.id === actionId)) return state;
  if (actionId !== step.answerId) return { ...state, feedback: step.wrongFeedback };
  const finalStep = state.stepIndex === mission.steps.length - 1;
  return { ...state, phase: finalStep ? "mission-solved" : "step-solved", evidence: [...state.evidence, step.evidence], feedback: step.explanation };
}

export function advanceAlgorithmStep(state: AlgorithmArenaState, mission: AlgorithmArenaMission, activationDetail = 1): AlgorithmArenaState {
  if (activationDetail > 1 || state.phase !== "step-solved" || state.stepIndex >= mission.steps.length - 1) return state;
  return { ...state, stepIndex: state.stepIndex + 1, phase: "playing", feedback: "证据已记录，继续观察下一步。" };
}

export function advanceAlgorithmMission(state: AlgorithmArenaState, activationDetail = 1): AlgorithmArenaState {
  if (activationDetail > 1 || state.phase !== "mission-solved") return state;
  const solved = Math.min(state.missionCount, state.solved + 1);
  if (state.index >= state.missionCount - 1) return { ...state, solved, phase: "complete", feedback: "六关证据链全部完成。" };
  return { ...state, index: state.index + 1, stepIndex: 0, solved, phase: "playing", evidence: [], feedback: "新一关开始，先观察可见证据。" };
}
