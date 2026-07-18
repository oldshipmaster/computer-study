export type LogicGate = "AND" | "OR" | "XOR" | "NOT";
export type LogicInput = "A" | "B" | "C";
export type LogicSource = LogicInput | string;

export interface CircuitSlot {
  id: string;
  left: LogicSource;
  right?: LogicSource;
  allowedGates: LogicGate[];
}

export interface LogicCircuitPuzzle {
  id: string;
  title: string;
  story: string;
  inputs: LogicInput[];
  slots: CircuitSlot[];
  outputSource: LogicSource;
  correctGates: Record<string, LogicGate>;
  rule: string;
}

export interface LogicCircuitRow {
  inputs: Partial<Record<LogicInput, boolean>>;
  actual: boolean | null;
  expected: boolean;
  matches: boolean;
}

export interface LogicLabState {
  index: number;
  puzzleCount: number;
  solved: number;
  phase: "building" | "tested" | "solved" | "complete";
  selections: Record<string, LogicGate>;
  rows: LogicCircuitRow[];
  feedback: string;
}

const ALL_GATES: LogicGate[] = ["AND", "OR", "XOR", "NOT"];

export const LOGIC_CIRCUIT_PUZZLES: LogicCircuitPuzzle[] = [
  {
    id: "double-key", title: "双钥匙保险门", story: "只有 A 和 B 两把钥匙都打开时，出口灯才应该亮。",
    inputs: ["A", "B"], slots: [{ id: "G1", left: "A", right: "B", allowedGates: ALL_GATES }], outputSource: "G1", correctGates: { G1: "AND" }, rule: "AND（并且）只有两边都为真时输出真。",
  },
  {
    id: "either-sensor", title: "任一传感器报警", story: "A 或 B 只要有一个发现障碍，提醒灯就应该亮。",
    inputs: ["A", "B"], slots: [{ id: "G1", left: "A", right: "B", allowedGates: ALL_GATES }], outputSource: "G1", correctGates: { G1: "OR" }, rule: "OR（或者）至少一边为真时输出真。",
  },
  {
    id: "night-light", title: "反向夜灯", story: "白天信号 A 为真时灯要关，A 为假时灯才要亮。",
    inputs: ["A"], slots: [{ id: "G1", left: "A", allowedGates: ALL_GATES }], outputSource: "G1", correctGates: { G1: "NOT" }, rule: "NOT（不是）把真变假，也把假变真。",
  },
  {
    id: "different-flags", title: "不同才通行", story: "A 与 B 状态不同时通行灯亮，相同时保持关闭。",
    inputs: ["A", "B"], slots: [{ id: "G1", left: "A", right: "B", allowedGates: ALL_GATES }], outputSource: "G1", correctGates: { G1: "XOR" }, rule: "XOR（不同）在两边真假不同时输出真。",
  },
  {
    id: "rescue-launch", title: "两层救援发射器", story: "A 与 B 同时确认，或者紧急按钮 C 打开，都可以发射救援信号。",
    inputs: ["A", "B", "C"], slots: [
      { id: "G1", left: "A", right: "B", allowedGates: ALL_GATES },
      { id: "G2", left: "G1", right: "C", allowedGates: ALL_GATES },
    ], outputSource: "G2", correctGates: { G1: "AND", G2: "OR" }, rule: "先算括号里的 A AND B，再把结果与 C 送进 OR。",
  },
  {
    id: "quiet-zone", title: "两层安静区", story: "只要 A 或 B 任一噪声传感器启动，安静许可灯就要关闭。",
    inputs: ["A", "B"], slots: [
      { id: "G1", left: "A", right: "B", allowedGates: ALL_GATES },
      { id: "G2", left: "G1", allowedGates: ALL_GATES },
    ], outputSource: "G2", correctGates: { G1: "OR", G2: "NOT" }, rule: "先用 OR 找到任一噪声，再用 NOT 翻转成安静许可。",
  },
];

export function logicCircuitShortcutSelection(puzzle: LogicCircuitPuzzle, key: string): { slotId: string; gate: LogicGate } | null {
  if (!/^[1-8]$/.test(key)) return null;
  const index = Number(key) - 1;
  const selections = puzzle.slots.flatMap((slot) => slot.allowedGates.map((gate) => ({ slotId: slot.id, gate })));
  return selections[index] ?? null;
}

export function evaluateLogicGate(gate: LogicGate, left: boolean, right?: boolean): boolean | null {
  if (gate === "NOT") return !left;
  if (typeof right !== "boolean") return null;
  if (gate === "AND") return left && right;
  if (gate === "OR") return left || right;
  if (gate === "XOR") return left !== right;
  return null;
}

export function buildTruthInputs(inputs: readonly LogicInput[]): Array<Partial<Record<LogicInput, boolean>>> {
  const rowCount = 2 ** inputs.length;
  return Array.from({ length: rowCount }, (_, rowIndex) => Object.fromEntries(inputs.map((input, inputIndex) => [
    input,
    Boolean(rowIndex & (1 << (inputs.length - inputIndex - 1))),
  ])));
}

function evaluateSelections(
  puzzle: LogicCircuitPuzzle,
  selections: Readonly<Record<string, LogicGate>>,
  inputs: Partial<Record<LogicInput, boolean>>,
): boolean | null {
  const values: Record<string, boolean | null> = { ...inputs } as Record<string, boolean>;
  for (const slot of puzzle.slots) {
    const gate = selections[slot.id];
    const left = values[slot.left];
    const right = slot.right ? values[slot.right] : undefined;
    if (!gate || typeof left !== "boolean" || (slot.right && typeof right !== "boolean")) {
      values[slot.id] = null;
      continue;
    }
    values[slot.id] = evaluateLogicGate(gate, left, right ?? undefined);
  }
  const output = values[puzzle.outputSource];
  return typeof output === "boolean" ? output : null;
}

export function runLogicCircuit(
  puzzle: LogicCircuitPuzzle,
  selections: Readonly<Record<string, LogicGate>>,
): LogicCircuitRow[] {
  return buildTruthInputs(puzzle.inputs).map((inputs) => {
    const actual = evaluateSelections(puzzle, selections, inputs);
    const expected = evaluateSelections(puzzle, puzzle.correctGates, inputs);
    if (typeof expected !== "boolean") throw new Error(`Invalid target circuit ${puzzle.id}`);
    return { inputs, actual, expected, matches: actual === expected };
  });
}

export function buildLogicPuzzleDeck(rotation = 0): LogicCircuitPuzzle[] {
  if (!Number.isFinite(rotation)) return [...LOGIC_CIRCUIT_PUZZLES];
  const offset = ((Math.trunc(rotation) % LOGIC_CIRCUIT_PUZZLES.length) + LOGIC_CIRCUIT_PUZZLES.length) % LOGIC_CIRCUIT_PUZZLES.length;
  return [...LOGIC_CIRCUIT_PUZZLES.slice(offset), ...LOGIC_CIRCUIT_PUZZLES.slice(0, offset)];
}

export function createLogicLabState(puzzleCount: number): LogicLabState {
  const safeCount = Number.isFinite(puzzleCount) ? Math.min(LOGIC_CIRCUIT_PUZZLES.length, Math.max(0, Math.trunc(puzzleCount))) : 0;
  return {
    index: 0,
    puzzleCount: safeCount,
    solved: 0,
    phase: safeCount > 0 ? "building" : "complete",
    selections: {},
    rows: [],
    feedback: "为每个空槽选择一种逻辑门，再运行全部输入。",
  };
}

export function selectCircuitGate(
  state: LogicLabState,
  puzzle: LogicCircuitPuzzle,
  slotId: string,
  gate: string,
): LogicLabState {
  if (state.phase === "solved" || state.phase === "complete") return state;
  const slot = puzzle.slots.find((item) => item.id === slotId);
  if (!slot || !slot.allowedGates.includes(gate as LogicGate)) return state;
  return {
    ...state,
    phase: "building",
    selections: { ...state.selections, [slotId]: gate as LogicGate },
    rows: [],
    feedback: "门槽已经调整。运行全部输入，看看每一行是否都正确。",
  };
}

export function testLogicCircuit(
  state: LogicLabState,
  puzzle: LogicCircuitPuzzle,
  activationDetail = 1,
): LogicLabState {
  if (activationDetail > 1 || state.phase === "solved" || state.phase === "complete" || puzzle.slots.some((slot) => !state.selections[slot.id])) return state;
  const rows = runLogicCircuit(puzzle, state.selections);
  const correct = rows.every((row) => row.matches);
  return correct
    ? { ...state, phase: "solved", solved: state.solved + 1, rows, feedback: `全部输入都通过！${puzzle.rule}` }
    : { ...state, phase: "tested", rows, feedback: "还有输入行没有通过。观察失败行，保留证据并调整门槽。" };
}

export function advanceLogicPuzzle(state: LogicLabState, activationDetail = 1): LogicLabState {
  if (activationDetail > 1 || state.phase !== "solved") return state;
  if (state.index >= state.puzzleCount - 1) return { ...state, phase: "complete" };
  return {
    ...state,
    index: state.index + 1,
    phase: "building",
    selections: {},
    rows: [],
    feedback: "新电路板已经接入。先观察目标，再选择逻辑门。",
  };
}
