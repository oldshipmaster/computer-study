export type HarborMode = "array" | "linked" | "stack" | "queue" | "tree" | "graph";
export type HarborPhase = "playing" | "step-solved" | "mission-solved" | "complete";
export type HarborItemState = "normal" | "active" | "done" | "blocked";

export interface HarborVisualItem {
  id: string;
  label: string;
  meta: string;
  state?: HarborItemState;
}

export interface HarborStep {
  prompt: string;
  options: Array<{ id: string; label: string }>;
  answerId: string;
  explanation: string;
  evidence: string;
  wrongFeedback: string;
  visual: { label: string; items: HarborVisualItem[]; note: string };
}

export interface HarborMission {
  id: string;
  title: string;
  story: string;
  skill: string;
  courseId: string;
  mode: HarborMode;
  steps: HarborStep[];
}

export interface HarborState {
  index: number;
  missionCount: number;
  stepIndex: number;
  solved: number;
  phase: HarborPhase;
  evidence: string[];
  feedback: string;
}

const option = (id: string, label: string) => ({ id, label });
const item = (id: string, label: string, meta: string, state: HarborItemState = "normal"): HarborVisualItem => ({ id, label, meta, state });

export const DATA_STRUCTURE_HARBOR_MISSIONS: HarborMission[] = [
  {
    id: "array-containers", title: "数组货柜排", story: "连续货柜都有固定索引，可以直接定位，不必从头逐个打开。", skill: "直接索引", courseId: "array-lockers", mode: "array",
    steps: [
      { prompt: "调度单要求读取索引 3，直接打开哪只货柜？", options: [option("read-2", "索引 2 · 灯"), option("read-3", "索引 3 · 帆"), option("read-4", "索引 4 · 锚")], answerId: "read-3", explanation: "数组用索引直接对应位置；索引从 0 开始，所以索引 3 是第 4 格。", evidence: "读取 items[3] → 帆", wrongFeedback: "观察每只货柜下方的固定索引，直接找标有 3 的位置。", visual: { label: "连续数组货柜", items: [item("a0", "桨", "索引 0"), item("a1", "图", "索引 1"), item("a2", "灯", "索引 2"), item("a3", "帆", "索引 3", "active"), item("a4", "锚", "索引 4")], note: "索引是位置编号，不是货物名称" } },
      { prompt: "把索引 1 的“图”更新成“雷达”，应该改哪一格？", options: [option("write-0", "更新第 0 格"), option("write-1", "更新第 1 格"), option("append", "在末尾新增")], answerId: "write-1", explanation: "更新数组指定索引只改变对应位置，其他货柜保持不动。", evidence: "写入 items[1] = 雷达，长度仍为 5", wrongFeedback: "观察索引与位置的一一对应关系；任务指定的是索引 1。", visual: { label: "连续数组货柜", items: [item("a0", "桨", "索引 0"), item("a1", "图 → 雷达", "索引 1", "active"), item("a2", "灯", "索引 2"), item("a3", "帆", "索引 3", "done"), item("a4", "锚", "索引 4")], note: "直接更新不会移动其他位置" } },
    ],
  },
  {
    id: "linked-treasure-line", title: "链表寻宝线", story: "节点散落在不同地址，只能从头节点沿 next 指针到达星图。", skill: "指针遍历", courseId: "linked-treasure", mode: "linked",
    steps: [
      { prompt: "从头节点 A 出发，A.next 指向哪里？", options: [option("node-c", "节点 C · 地址 42"), option("node-b", "节点 B · 地址 07"), option("nearest", "画面最近的节点")], answerId: "node-c", explanation: "链表按 next 指针连接，不按地址大小或画面距离移动。", evidence: "HEAD → A(18) → C(42)", wrongFeedback: "观察 A 卡片上的 next 箭头，而不是节点在画面上的距离。", visual: { label: "链表节点", items: [item("A", "A", "地址18 · next→42", "active"), item("B", "B", "地址07 · next→91"), item("C", "C", "地址42 · next→07"), item("D", "★", "地址91 · next→null")], note: "地址可以不连续，next 决定顺序" } },
      { prompt: "来到 C(42)，C.next = 07；下一站是哪一个节点？", options: [option("node-a", "A · 地址 18"), option("node-b", "B · 地址 07"), option("node-d", "星图 · 地址 91")], answerId: "node-b", explanation: "C 的 next 保存地址 07，所以沿指针到达 B。", evidence: "C(42) → B(07)", wrongFeedback: "把 next 数值 07 和每张节点卡的地址进行匹配。", visual: { label: "链表节点", items: [item("A", "A", "地址18", "done"), item("B", "B", "地址07", "active"), item("C", "C", "地址42 · next→07", "done"), item("D", "★", "地址91")], note: "指针把不连续地址串成一条顺序" } },
      { prompt: "B.next = 91；怎样取得星图并安全停止？", options: [option("node-d", "前往地址 91，遇到 null 停止"), option("restart", "跳回头节点"), option("guess", "随机打开一个节点")], answerId: "node-d", explanation: "沿 B.next 到达星图节点；它的 next 是 null，表示链表结束。", evidence: "B(07) → ★(91) → null，停止", wrongFeedback: "观察 B 的 next 地址和星图节点的结束标记。", visual: { label: "链表节点", items: [item("A", "A", "地址18", "done"), item("C", "C", "地址42", "done"), item("B", "B", "地址07 · next→91", "done"), item("D", "★", "地址91 · next→null", "active")], note: "null 表示没有下一个节点" } },
    ],
  },
  {
    id: "stack-crane", title: "栈顶卸货塔", story: "三只货箱从底到顶叠放，吊车只能接触最上面的栈顶。", skill: "后进先出", courseId: "stack-queue-dock", mode: "stack",
    steps: [
      { prompt: "蓝箱、橙箱、绿箱依次入栈后，第一次 pop 卸下谁？", options: [option("pop-blue", "蓝箱 · 最早进入"), option("pop-green", "绿箱 · 栈顶"), option("pop-orange", "橙箱 · 中间")], answerId: "pop-green", explanation: "最后进入的绿箱位于栈顶，必须最先离开。", evidence: "pop() → 绿箱，栈顶变为橙箱", wrongFeedback: "吊车只能从最上面操作，观察哪只货箱标着栈顶。", visual: { label: "从底到顶的栈", items: [item("blue", "蓝箱", "栈底"), item("orange", "橙箱", "中层"), item("green", "绿箱", "栈顶", "active")], note: "push 和 pop 都发生在同一端" } },
      { prompt: "绿箱离开后，新的栈顶是谁？", options: [option("pop-blue", "蓝箱"), option("pop-orange", "橙箱"), option("empty", "栈已经空了")], answerId: "pop-orange", explanation: "橙箱现在暴露在顶部，是下一次 pop 的对象。", evidence: "pop() → 橙箱，栈顶变为蓝箱", wrongFeedback: "观察绿箱移除后的最上层，栈只能继续从顶部卸货。", visual: { label: "从底到顶的栈", items: [item("blue", "蓝箱", "栈底"), item("orange", "橙箱", "新栈顶", "active"), item("green", "绿箱", "已卸下", "done")], note: "后进入的货箱先离开" } },
      { prompt: "最后一次 pop 会得到什么？", options: [option("pop-blue", "蓝箱"), option("pop-green", "绿箱再次出现"), option("none", "什么都不取")], answerId: "pop-blue", explanation: "蓝箱最早进入、最后离开，完整证明后进先出。", evidence: "pop() → 蓝箱，栈变空", wrongFeedback: "观察还留在栈里的唯一货箱。", visual: { label: "从底到顶的栈", items: [item("blue", "蓝箱", "栈顶也是栈底", "active"), item("orange", "橙箱", "已卸下", "done"), item("green", "绿箱", "已卸下", "done")], note: "LIFO：Last In, First Out" } },
    ],
  },
  {
    id: "queue-bridge", title: "队首通行桥", story: "红、蓝、绿三艘小艇依次从队尾加入，桥闸按到达顺序放行。", skill: "先进先出", courseId: "stack-queue-dock", mode: "queue",
    steps: [
      { prompt: "桥闸第一次 dequeue 应该放行谁？", options: [option("serve-red", "红艇 · 队首"), option("serve-green", "绿艇 · 队尾"), option("serve-blue", "蓝艇 · 中间")], answerId: "serve-red", explanation: "红艇最早进入队列，位于队首，应该最先离开。", evidence: "dequeue() → 红艇，蓝艇成为队首", wrongFeedback: "观察队首和队尾标签，桥闸只能从队首放行。", visual: { label: "从队首到队尾", items: [item("red", "红艇", "队首", "active"), item("blue", "蓝艇", "第2位"), item("green", "绿艇", "队尾")], note: "新成员从队尾加入，旧成员从队首离开" } },
      { prompt: "红艇离开后，下一艘按顺序是谁？", options: [option("serve-green", "绿艇"), option("serve-blue", "蓝艇"), option("serve-red", "红艇再次进入")], answerId: "serve-blue", explanation: "蓝艇比绿艇更早到达，现在成为队首。", evidence: "dequeue() → 蓝艇，绿艇成为队首", wrongFeedback: "观察剩余小艇原来的到达顺序，不能从队尾插队。", visual: { label: "从队首到队尾", items: [item("red", "红艇", "已放行", "done"), item("blue", "蓝艇", "新队首", "active"), item("green", "绿艇", "队尾")], note: "FIFO 保持先到先服务" } },
      { prompt: "队列里最后放行哪艘艇？", options: [option("serve-green", "绿艇"), option("serve-blue", "蓝艇再次出现"), option("close", "直接关闭桥闸")], answerId: "serve-green", explanation: "绿艇最后加入，所以最后离开，队列变空。", evidence: "dequeue() → 绿艇，队列变空", wrongFeedback: "观察队列中尚未放行的唯一成员。", visual: { label: "从队首到队尾", items: [item("red", "红艇", "已放行", "done"), item("blue", "蓝艇", "已放行", "done"), item("green", "绿艇", "队首也是队尾", "active")], note: "FIFO：First In, First Out" } },
    ],
  },
  {
    id: "tree-library", title: "树形图书馆", story: "从根目录寻找“火星”资料，每一步只能走向当前节点的子分支。", skill: "层级路径", courseId: "tree-library", mode: "tree",
    steps: [
      { prompt: "从根目录出发，“火星”最可能在哪个一级分支？", options: [option("science", "科学"), option("stories", "故事"), option("music", "音乐")], answerId: "science", explanation: "树从根向下分层；火星资料属于科学分支。", evidence: "根目录 / 科学", wrongFeedback: "观察父节点下面的分类关系，选择包含目标的子分支。", visual: { label: "图书馆树", items: [item("root", "根目录", "第0层", "done"), item("science", "科学", "第1层", "active"), item("stories", "故事", "第1层"), item("music", "音乐", "第1层")], note: "树的每个子节点只有一个直接父节点" } },
      { prompt: "进入“科学”后，下一层应该选择哪个子分支？", options: [option("space", "太空"), option("plants", "植物"), option("root", "根目录")], answerId: "space", explanation: "太空是科学的子节点，也是通往火星的正确分支。", evidence: "根目录 / 科学 / 太空", wrongFeedback: "观察科学节点下面的直接子节点及目标主题。", visual: { label: "图书馆树", items: [item("science", "科学", "父节点", "done"), item("space", "太空", "子节点", "active"), item("plants", "植物", "子节点"), item("machines", "机器", "子节点")], note: "路径由父节点到子节点逐层变具体" } },
      { prompt: "在“太空”分支下，选择哪个叶子节点完成路径？", options: [option("mars", "火星"), option("moon", "月球"), option("ocean", "海洋")], answerId: "mars", explanation: "火星叶子节点没有更深子分支，目标路径完成。", evidence: "根 / 科学 / 太空 / 火星", wrongFeedback: "观察当前父节点下与目标同名的叶子节点。", visual: { label: "图书馆树", items: [item("space", "太空", "父节点", "done"), item("mars", "火星", "叶子", "active"), item("moon", "月球", "叶子"), item("stars", "恒星", "叶子")], note: "从根到叶子的节点序列就是完整路径" } },
    ],
  },
  {
    id: "graph-routes", title: "图路线调度台", story: "航站图可以有多条连接和环，目标是在不重复节点的情况下从 A 最短到 E。", skill: "图最短路", courseId: "graph-routes", mode: "graph",
    steps: [
      { prompt: "从 A 出发，哪条相邻边进入通往 E 的两步最短路线？", options: [option("go-b", "A → B"), option("go-c", "A → C"), option("go-e", "A → E（没有这条边）")], answerId: "go-c", explanation: "C 与 A、E 都直接相邻，所以 A→C→E 只需两条边。", evidence: "从 A 访问相邻节点 C", wrongFeedback: "观察真实连接关系；只能沿边移动，并比较哪位邻居直接连着 E。", visual: { label: "航站图", items: [item("A", "A", "相邻 B、C", "done"), item("B", "B", "相邻 A、D"), item("C", "C", "相邻 A、D、E", "active"), item("D", "D", "相邻 B、C、E"), item("E", "E", "目标")], note: "图节点可以有多个邻居，也可能形成环" } },
      { prompt: "来到 C 后，哪一步直接到达目标且不绕路？", options: [option("go-a", "C → A"), option("go-d", "C → D"), option("go-e", "C → E")], answerId: "go-e", explanation: "C 与 E 有直接边，沿这条边即可到达目标。", evidence: "从 C 沿边到 E，总计 2 条边", wrongFeedback: "观察 C 的邻接关系和目标位置，选择直接相连的 E。", visual: { label: "航站图", items: [item("A", "A", "已访问", "done"), item("B", "B", "未访问"), item("C", "C", "当前位置", "done"), item("D", "D", "可绕行"), item("E", "E", "目标", "active")], note: "避免返回已访问节点可以防止在环里打转" } },
      { prompt: "怎样证明 A→C→E 是最短路线？", options: [option("count", "比较候选路线的边数"), option("pretty", "看节点颜色是否漂亮"), option("repeat", "重复访问 A 和 C")], answerId: "count", explanation: "最短路用经过的边数作为可检查证据；这条路线只有 2 条边。", evidence: "A→C→E：2 条边，比 A→B→D→E 的 3 条更短", wrongFeedback: "路线长短要用可计数的关系证明，观察每条候选路径经过几条边。", visual: { label: "候选路线比较", items: [item("short", "A→C→E", "2 条边", "active"), item("long", "A→B→D→E", "3 条边"), item("loop", "A→C→A…", "出现重复", "blocked")], note: "最短不是画面距离最短，而是边数或总代价最小" } },
    ],
  },
];

export function buildHarborDeck(rotation: number): HarborMission[] {
  const safeRotation = Number.isFinite(rotation) ? Math.max(0, Math.floor(rotation)) : 0;
  const offset = DATA_STRUCTURE_HARBOR_MISSIONS.length === 0 ? 0 : safeRotation % DATA_STRUCTURE_HARBOR_MISSIONS.length;
  return [...DATA_STRUCTURE_HARBOR_MISSIONS.slice(offset), ...DATA_STRUCTURE_HARBOR_MISSIONS.slice(0, offset)];
}

export function createHarborState(missionCount: number): HarborState {
  const safeCount = Number.isFinite(missionCount) ? Math.max(0, Math.floor(missionCount)) : 0;
  return { index: 0, missionCount: safeCount, stepIndex: 0, solved: 0, phase: safeCount === 0 ? "complete" : "playing", evidence: [], feedback: "观察结构关系，选择下一步操作。" };
}

export function chooseHarborAction(state: HarborState, mission: HarborMission, actionId: string, activationDetail = 1): HarborState {
  if (activationDetail > 1 || state.phase !== "playing") return state;
  const step = mission.steps[state.stepIndex];
  if (!step || !step.options.some((candidate) => candidate.id === actionId)) return state;
  if (actionId !== step.answerId) return { ...state, feedback: step.wrongFeedback };
  return { ...state, phase: state.stepIndex === mission.steps.length - 1 ? "mission-solved" : "step-solved", evidence: [...state.evidence, step.evidence], feedback: step.explanation };
}

export function advanceHarborStep(state: HarborState, mission: HarborMission, activationDetail = 1): HarborState {
  if (activationDetail > 1 || state.phase !== "step-solved" || state.stepIndex >= mission.steps.length - 1) return state;
  return { ...state, stepIndex: state.stepIndex + 1, phase: "playing", feedback: "结构证据已装船，继续观察下一步。" };
}

export function advanceHarborMission(state: HarborState, activationDetail = 1): HarborState {
  if (activationDetail > 1 || state.phase !== "mission-solved") return state;
  const solved = Math.min(state.missionCount, state.solved + 1);
  if (state.index >= state.missionCount - 1) return { ...state, solved, phase: "complete", feedback: "六座码头的结构证据全部完成。" };
  return { ...state, index: state.index + 1, stepIndex: 0, solved, phase: "playing", evidence: [], feedback: "新码头已接入，先观察结构快照。" };
}
