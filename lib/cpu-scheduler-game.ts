export interface CpuTask {
  id: string;
  name: string;
  icon: string;
  memory: number;
  work: number;
}

export interface CpuSchedulerMission {
  id: string;
  title: string;
  story: string;
  capacity: number;
  tasks: CpuTask[];
}

export interface ReadyProcess {
  taskId: string;
  remainingWork: number;
}

export interface CpuHistoryEntry {
  slice: number;
  taskId: string;
  event: "rotated" | "completed";
  remainingWork: number;
}

export interface CpuSchedulerState {
  missionIndex: number;
  missionCount: number;
  phase: "playing" | "solved" | "complete";
  waitingTaskIds: string[];
  ready: ReadyProcess[];
  completedTaskIds: string[];
  history: CpuHistoryEntry[];
  timeSlices: number;
  lastTaskId: string | null;
  solved: number;
  feedback: string;
}

export const CPU_SCHEDULER_MISSIONS: CpuSchedulerMission[] = [
  {
    id: "two-task-warmup", title: "双任务热身班", story: "把绘图和音乐任务装进 4 格内存，观察 CPU 轮流工作。", capacity: 4,
    tasks: [
      { id: "draw-star", name: "画星星", icon: "★", memory: 2, work: 2 },
      { id: "play-note", name: "播放音符", icon: "♫", memory: 2, work: 1 },
    ],
  },
  {
    id: "memory-gate", title: "内存门卫班", story: "三个任务不能同时装入，先完成一个才能释放空间。", capacity: 5,
    tasks: [
      { id: "open-map", name: "打开地图", icon: "图", memory: 3, work: 2 },
      { id: "build-model", name: "搭建模型", icon: "模", memory: 3, work: 1 },
      { id: "save-note", name: "保存笔记", icon: "记", memory: 2, work: 2 },
    ],
  },
  {
    id: "long-short-mix", title: "长短任务混合班", story: "长任务不能一直霸占 CPU，短任务也要轮到时间片。", capacity: 6,
    tasks: [
      { id: "render-island", name: "绘制岛屿", icon: "岛", memory: 4, work: 3 },
      { id: "check-signal", name: "检查信号", icon: "信", memory: 2, work: 2 },
      { id: "send-badge", name: "显示徽章", icon: "章", memory: 3, work: 1 },
    ],
  },
  {
    id: "busy-workshop", title: "繁忙工坊班", story: "四个任务等待进入有限内存，安排装入与轮转。", capacity: 6,
    tasks: [
      { id: "sort-files", name: "整理文件", icon: "夹", memory: 3, work: 2 },
      { id: "scan-keys", name: "读取键盘", icon: "键", memory: 2, work: 4 },
      { id: "paint-slide", name: "绘制幻灯", icon: "页", memory: 4, work: 2 },
      { id: "ring-bell", name: "播放提示", icon: "铃", memory: 1, work: 1 },
    ],
  },
  {
    id: "release-relay", title: "释放接力班", story: "不断完成并释放空间，让后面的任务接力进入。", capacity: 7,
    tasks: [
      { id: "compile-game", name: "组装游戏", icon: "游", memory: 4, work: 3 },
      { id: "load-scene", name: "载入场景", icon: "景", memory: 3, work: 3 },
      { id: "save-score", name: "保存得分", icon: "分", memory: 2, work: 2 },
      { id: "flash-light", name: "点亮信号", icon: "灯", memory: 2, work: 1 },
    ],
  },
  {
    id: "control-tower-finale", title: "控制塔总调度", story: "五个不同大小的任务，完成最后一次内存与时间片协作。", capacity: 8,
    tasks: [
      { id: "launch-world", name: "启动世界", icon: "界", memory: 5, work: 4 },
      { id: "sync-route", name: "同步航线", icon: "线", memory: 3, work: 3 },
      { id: "draw-robot", name: "绘制机器人", icon: "机", memory: 4, work: 2 },
      { id: "check-packet", name: "检查分组", icon: "包", memory: 2, work: 2 },
      { id: "show-ready", name: "显示就绪", icon: "✓", memory: 1, work: 1 },
    ],
  },
];

function normalizeRotation(rotation: number, length: number) {
  if (!Number.isFinite(rotation) || length === 0) return 0;
  return ((Math.floor(rotation) % length) + length) % length;
}

export function buildCpuSchedulerDeck(rotation: number): CpuSchedulerMission[] {
  const offset = normalizeRotation(rotation, CPU_SCHEDULER_MISSIONS.length);
  return [...CPU_SCHEDULER_MISSIONS.slice(offset), ...CPU_SCHEDULER_MISSIONS.slice(0, offset)];
}

export function createCpuSchedulerState(mission: CpuSchedulerMission, missionCount: number): CpuSchedulerState {
  return {
    missionIndex: 0, missionCount: Math.max(0, Math.floor(missionCount)), phase: "playing",
    waitingTaskIds: mission.tasks.map((task) => task.id), ready: [], completedTaskIds: [], history: [],
    timeSlices: 0, lastTaskId: null, solved: 0,
    feedback: "从等待区装入一个任务。装入会申请内存，但还没有使用 CPU。",
  };
}

export function getUsedMemory(state: CpuSchedulerState, mission: CpuSchedulerMission) {
  return state.ready.reduce((total, process) => total + (mission.tasks.find((task) => task.id === process.taskId)?.memory ?? 0), 0);
}

export function loadCpuTask(state: CpuSchedulerState, mission: CpuSchedulerMission, taskId: string, activationDetail = 1): CpuSchedulerState {
  if (state.phase !== "playing" || activationDetail > 1 || !state.waitingTaskIds.includes(taskId)) return state;
  const task = mission.tasks.find((candidate) => candidate.id === taskId);
  if (!task) return state;
  const used = getUsedMemory(state, mission);
  if (used + task.memory > mission.capacity) return {
    ...state, feedback: `${task.name}需要 ${task.memory} 格内存，现在只剩 ${mission.capacity - used} 格。先让队列中的任务完成并释放空间。`,
  };
  return {
    ...state, waitingTaskIds: state.waitingTaskIds.filter((id) => id !== taskId),
    ready: [...state.ready, { taskId, remainingWork: task.work }],
    feedback: `${task.name}已申请 ${task.memory} 格内存，进入就绪队尾。`,
  };
}

export function runCpuTimeSlice(state: CpuSchedulerState, mission: CpuSchedulerMission, activationDetail = 1): CpuSchedulerState {
  if (state.phase !== "playing" || activationDetail > 1) return state;
  if (state.ready.length === 0) return { ...state, feedback: "就绪队列是空的。先从等待区装入一个任务，CPU 才有工作。" };
  const current = state.ready[0];
  const task = mission.tasks.find((candidate) => candidate.id === current.taskId);
  if (!task) return state;
  const remainingWork = Math.max(0, current.remainingWork - 1);
  const ready = state.ready.slice(1).map((process) => ({ ...process }));
  let completedTaskIds = [...state.completedTaskIds];
  const event = remainingWork === 0 ? "completed" as const : "rotated" as const;
  if (remainingWork === 0) completedTaskIds = [...completedTaskIds, task.id];
  else ready.push({ taskId: task.id, remainingWork });
  const timeSlices = state.timeSlices + 1;
  const history = [...state.history, { slice: timeSlices, taskId: task.id, event, remainingWork }].slice(-12);
  const complete = completedTaskIds.length === mission.tasks.length;
  return {
    ...state, ready, completedTaskIds, history, timeSlices, lastTaskId: task.id,
    phase: complete ? "solved" : "playing", solved: complete ? state.solved + 1 : state.solved,
    feedback: complete
      ? "本班所有任务完成，CPU 与内存协作成功！"
      : remainingWork === 0
        ? `${task.name}完成，自动释放 ${task.memory} 格内存。`
        : `${task.name}运行了 1 个时间片，还剩 ${remainingWork} 片，已移动到队尾。`,
  };
}

export function advanceCpuSchedulerMission(state: CpuSchedulerState, nextMission: CpuSchedulerMission, activationDetail = 1): CpuSchedulerState {
  if (state.phase !== "solved" || activationDetail > 1) return state;
  if (state.missionIndex >= state.missionCount - 1) return { ...state, phase: "complete", feedback: "六个 CPU 调度班次全部完成！" };
  return {
    ...createCpuSchedulerState(nextMission, state.missionCount), missionIndex: state.missionIndex + 1, solved: state.solved,
    feedback: "新班次已开始。先比较任务大小和可用内存。",
  };
}
