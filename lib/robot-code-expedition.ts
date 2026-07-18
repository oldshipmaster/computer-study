export type RobotDirection = "north" | "east" | "south" | "west";
export type RobotCommand = "forward" | "turnLeft" | "turnRight" | "repeatForward2" | "ifBlockedTurnRight";
export type AtomicRobotCommand = "forward" | "turnLeft" | "turnRight" | "conditionNoop";
export interface RobotPoint { row: number; col: number; }
export interface RobotStart extends RobotPoint { direction: RobotDirection; }

export interface RobotCodeMission {
  id: string;
  title: string;
  story: string;
  concept: string;
  start: RobotStart;
  goal: RobotPoint;
  energy: RobotPoint[];
  obstacles: RobotPoint[];
  maxCommands: number;
  allowedCommands: RobotCommand[];
}

export interface RobotTraceStep {
  sourceIndex: number;
  command: AtomicRobotCommand;
  position: RobotPoint;
  direction: RobotDirection;
  collectedEnergy: string[];
  event: string;
}

export interface RobotRunResult {
  status: "success" | "incomplete" | "collision" | "invalid";
  trace: RobotTraceStep[];
  finalPosition: RobotPoint;
  finalDirection: RobotDirection;
  collectedEnergy: string[];
  feedback: string;
}

export interface RobotCodeState {
  missionIndex: number;
  missionCount: number;
  queue: RobotCommand[];
  phase: "building" | "tracing" | "failed" | "solved" | "complete";
  run: RobotRunResult | null;
  traceCursor: number;
  solved: number;
  feedback: string;
}

const BASIC_COMMANDS: RobotCommand[] = ["forward", "turnLeft", "turnRight"];
const LOOP_COMMANDS: RobotCommand[] = [...BASIC_COMMANDS, "repeatForward2"];
const ALL_COMMANDS: RobotCommand[] = [...LOOP_COMMANDS, "ifBlockedTurnRight"];

export const ROBOT_CODE_MISSIONS: RobotCodeMission[] = [
  {
    id: "straight-signal",
    title: "直线信号站",
    story: "沿着最短的直线收好两颗能量，再停进传送门。",
    concept: "程序会从第一条开始，按顺序逐条执行。",
    start: { row: 4, col: 0, direction: "east" }, goal: { row: 4, col: 3 },
    energy: [{ row: 4, col: 1 }, { row: 4, col: 2 }], obstacles: [], maxCommands: 3,
    allowedCommands: ["forward"],
  },
  {
    id: "corner-courier",
    title: "转角快递线",
    story: "先向北，再转进右侧通道，把两颗能量送到终点。",
    concept: "转向只改变朝向，下一条前进才会改变位置。",
    start: { row: 4, col: 0, direction: "north" }, goal: { row: 2, col: 2 },
    energy: [{ row: 3, col: 0 }, { row: 2, col: 1 }], obstacles: [], maxCommands: 5,
    allowedCommands: BASIC_COMMANDS,
  },
  {
    id: "loop-shortcut",
    title: "循环捷径桥",
    story: "路线和上一关相似，但指令槽更少，必须让重复块帮忙。",
    concept: "重复前进 2 格会展开成两次连续的前进一步。",
    start: { row: 4, col: 0, direction: "north" }, goal: { row: 2, col: 2 },
    energy: [{ row: 3, col: 0 }, { row: 2, col: 1 }], obstacles: [], maxCommands: 3,
    allowedCommands: LOOP_COMMANDS,
  },
  {
    id: "sensor-gate",
    title: "障碍传感门",
    story: "机器人一出发就面对墙壁，让条件指令替它观察再转向。",
    concept: "条件会在运行到这一刻时检查前方，而不是提前猜。",
    start: { row: 4, col: 2, direction: "north" }, goal: { row: 4, col: 4 },
    energy: [{ row: 4, col: 3 }], obstacles: [{ row: 3, col: 2 }], maxCommands: 2,
    allowedCommands: ALL_COMMANDS,
  },
  {
    id: "observe-then-turn",
    title: "先走再观察",
    story: "先靠近墙壁，条件才会变成真；随后用重复块穿过横向通道。",
    concept: "同一条件在不同位置可能得到不同结果。",
    start: { row: 4, col: 0, direction: "north" }, goal: { row: 3, col: 2 },
    energy: [{ row: 3, col: 1 }], obstacles: [{ row: 2, col: 0 }], maxCommands: 3,
    allowedCommands: ALL_COMMANDS,
  },
  {
    id: "expedition-finale",
    title: "星港综合远征",
    story: "把顺序、转向、重复和条件组合起来，穿过折线航道。",
    concept: "复杂任务可以拆成几个可观察、可调试的小步骤。",
    start: { row: 4, col: 0, direction: "north" }, goal: { row: 1, col: 3 },
    energy: [{ row: 3, col: 1 }, { row: 2, col: 2 }, { row: 1, col: 3 }],
    obstacles: [{ row: 2, col: 0 }, { row: 4, col: 3 }], maxCommands: 7,
    allowedCommands: ALL_COMMANDS,
  },
];

export const robotPointKey = (point: RobotPoint) => `${point.row}-${point.col}`;

export function robotCommandShortcutIndex(key: string, commandCount: number): number | null {
  if (!/^[1-5]$/.test(key)) return null;
  const index = Number(key) - 1;
  return index < Math.max(0, Math.floor(commandCount)) ? index : null;
}

function normalizeRotation(rotation: number, length: number) {
  if (!Number.isFinite(rotation) || length === 0) return 0;
  return ((Math.floor(rotation) % length) + length) % length;
}

export function buildRobotMissionDeck(rotation: number): RobotCodeMission[] {
  const offset = normalizeRotation(rotation, ROBOT_CODE_MISSIONS.length);
  return [...ROBOT_CODE_MISSIONS.slice(offset), ...ROBOT_CODE_MISSIONS.slice(0, offset)];
}

function nextPoint(position: RobotPoint, direction: RobotDirection): RobotPoint {
  const delta: Record<RobotDirection, [number, number]> = {
    north: [-1, 0], east: [0, 1], south: [1, 0], west: [0, -1],
  };
  return { row: position.row + delta[direction][0], col: position.col + delta[direction][1] };
}

function turn(direction: RobotDirection, amount: -1 | 1): RobotDirection {
  const directions: RobotDirection[] = ["north", "east", "south", "west"];
  const index = directions.indexOf(direction);
  return directions[(index + amount + directions.length) % directions.length];
}

function isBlocked(mission: RobotCodeMission, point: RobotPoint) {
  return point.row < 0 || point.row >= 5 || point.col < 0 || point.col >= 5
    || mission.obstacles.some((obstacle) => robotPointKey(obstacle) === robotPointKey(point));
}

export function runRobotProgram(mission: RobotCodeMission, program: readonly string[]): RobotRunResult {
  const initialPosition = { row: mission.start.row, col: mission.start.col };
  const invalid = program.length === 0 || program.length > mission.maxCommands
    || program.some((command) => !mission.allowedCommands.includes(command as RobotCommand));
  if (invalid) return {
    status: "invalid", trace: [], finalPosition: initialPosition, finalDirection: mission.start.direction,
    collectedEnergy: [], feedback: "程序包含未开放的指令，或超过了这一关的指令槽。",
  };

  let position = initialPosition;
  let direction = mission.start.direction;
  let collectedEnergy: string[] = [];
  const trace: RobotTraceStep[] = [];

  const collectAtPosition = () => {
    const key = robotPointKey(position);
    if (mission.energy.some((energy) => robotPointKey(energy) === key) && !collectedEnergy.includes(key)) {
      collectedEnergy = [...collectedEnergy, key];
      return true;
    }
    return false;
  };

  const record = (sourceIndex: number, command: AtomicRobotCommand, event: string) => {
    trace.push({ sourceIndex, command, position: { ...position }, direction, collectedEnergy: [...collectedEnergy], event });
  };

  const moveForward = (sourceIndex: number) => {
    const next = nextPoint(position, direction);
    if (isBlocked(mission, next)) {
      record(sourceIndex, "forward", "前方是障碍或地图边界，机器人停下了。");
      return false;
    }
    position = next;
    const collected = collectAtPosition();
    record(sourceIndex, "forward", collected ? "前进一步，并收集到一颗能量。" : "前进一步。");
    return true;
  };

  for (let sourceIndex = 0; sourceIndex < program.length; sourceIndex += 1) {
    const command = program[sourceIndex] as RobotCommand;
    if (command === "forward" && !moveForward(sourceIndex)) return {
      status: "collision", trace, finalPosition: position, finalDirection: direction, collectedEnergy,
      feedback: `第 ${sourceIndex + 1} 条指令让机器人遇到障碍或边界，程序停在这里。`,
    };
    if (command === "repeatForward2") {
      for (let repeat = 0; repeat < 2; repeat += 1) {
        if (!moveForward(sourceIndex)) return {
          status: "collision", trace, finalPosition: position, finalDirection: direction, collectedEnergy,
          feedback: `第 ${sourceIndex + 1} 条重复指令的第 ${repeat + 1} 步遇到障碍，程序停在这里。`,
        };
      }
    }
    if (command === "turnLeft" || command === "turnRight") {
      direction = turn(direction, command === "turnLeft" ? -1 : 1);
      record(sourceIndex, command, command === "turnLeft" ? "向左转，只改变朝向。" : "向右转，只改变朝向。");
    }
    if (command === "ifBlockedTurnRight") {
      if (isBlocked(mission, nextPoint(position, direction))) {
        direction = turn(direction, 1);
        record(sourceIndex, "turnRight", "条件为真：前方挡住了，所以向右转。");
      } else {
        record(sourceIndex, "conditionNoop", "条件为假：前方没有挡住，所以不用转向。");
      }
    }
  }

  const reachedGoal = robotPointKey(position) === robotPointKey(mission.goal);
  const hasAllEnergy = collectedEnergy.length === mission.energy.length;
  const status = reachedGoal && hasAllEnergy ? "success" : "incomplete";
  let feedback = "程序运行完了，但还需要调整。";
  if (!reachedGoal && !hasAllEnergy) feedback = "程序结束时还没到终点，也有能量没有收齐。看看最后的位置。";
  else if (!reachedGoal) feedback = "能量收齐了，但机器人还没停在终点。";
  else if (!hasAllEnergy) feedback = "机器人到终点了，但还有能量没有收齐。";
  if (status === "success") feedback = "程序成功：到达终点，并收齐了全部能量！";
  return { status, trace, finalPosition: position, finalDirection: direction, collectedEnergy, feedback };
}

export function createRobotCodeState(missionCount: number): RobotCodeState {
  return {
    missionIndex: 0, missionCount: Math.max(0, Math.floor(missionCount)), queue: [], phase: "building",
    run: null, traceCursor: -1, solved: 0, feedback: "从指令库添加程序，再逐步运行观察结果。",
  };
}

function canEdit(state: RobotCodeState) {
  return state.phase === "building" || state.phase === "failed";
}

function withEditedQueue(state: RobotCodeState, queue: RobotCommand[], feedback: string): RobotCodeState {
  return { ...state, queue, phase: "building", run: null, traceCursor: -1, feedback };
}

export function addRobotCommand(state: RobotCodeState, mission: RobotCodeMission, command: string, activationDetail = 1): RobotCodeState {
  if (!canEdit(state) || activationDetail > 1 || state.queue.length >= mission.maxCommands || !mission.allowedCommands.includes(command as RobotCommand)) return state;
  return withEditedQueue(state, [...state.queue, command as RobotCommand], "指令已加入程序。可以继续编辑或开始运行。");
}

export function moveRobotCommand(state: RobotCodeState, from: number, to: number): RobotCodeState {
  if (!canEdit(state) || from < 0 || from >= state.queue.length || to < 0 || to >= state.queue.length || from === to) return state;
  const queue = [...state.queue];
  const [command] = queue.splice(from, 1);
  queue.splice(to, 0, command);
  return withEditedQueue(state, queue, "指令顺序已调整。重新运行看看变化。");
}

export function removeRobotCommand(state: RobotCodeState, index: number): RobotCodeState {
  if (!canEdit(state) || index < 0 || index >= state.queue.length) return state;
  return withEditedQueue(state, state.queue.filter((_, queueIndex) => queueIndex !== index), "已移除一条指令。");
}

export function clearRobotProgram(state: RobotCodeState): RobotCodeState {
  if (!canEdit(state) || state.queue.length === 0) return state;
  return withEditedQueue(state, [], "程序已清空，可以重新搭建。");
}

export function prepareRobotRun(state: RobotCodeState, mission: RobotCodeMission, activationDetail = 1): RobotCodeState {
  if (!canEdit(state) || activationDetail > 1 || state.queue.length === 0) return state;
  const run = runRobotProgram(mission, state.queue);
  if (run.status === "invalid" || run.trace.length === 0) return { ...state, feedback: run.feedback };
  return { ...state, phase: "tracing", run, traceCursor: -1, feedback: "程序已装入机器人。点击下一步，观察每条指令。" };
}

export function advanceRobotTrace(state: RobotCodeState, activationDetail = 1): RobotCodeState {
  if (state.phase !== "tracing" || !state.run || activationDetail > 1) return state;
  const traceCursor = Math.min(state.traceCursor + 1, state.run.trace.length - 1);
  if (traceCursor < state.run.trace.length - 1) return { ...state, traceCursor, feedback: state.run.trace[traceCursor].event };
  const solved = state.run.status === "success";
  return {
    ...state, traceCursor, phase: solved ? "solved" : "failed", solved: solved ? state.solved + 1 : state.solved,
    feedback: state.run.feedback,
  };
}

export function advanceRobotMission(state: RobotCodeState, activationDetail = 1): RobotCodeState {
  if (state.phase !== "solved" || activationDetail > 1) return state;
  if (state.missionIndex >= state.missionCount - 1) return { ...state, phase: "complete", feedback: "六段程序全部通过！" };
  return {
    ...createRobotCodeState(state.missionCount), missionIndex: state.missionIndex + 1, solved: state.solved,
    feedback: "新地图已接入。先观察起点、能量、障碍和终点。",
  };
}
