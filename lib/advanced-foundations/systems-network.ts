export type InstructionPhase = "fetch" | "decode" | "execute" | "writeback";
const INSTRUCTION_PHASES: InstructionPhase[] = ["fetch", "decode", "execute", "writeback"];

export function advanceInstructionCycle(step: number) {
  const safeStep = Number.isFinite(step) ? Math.max(0, Math.floor(step)) : 0;
  return {
    phase: INSTRUCTION_PHASES[safeStep % INSTRUCTION_PHASES.length],
    nextStep: safeStep + 1,
  };
}

export interface ToyCpuState {
  phase: InstructionPhase;
  programCounter: number;
  instruction: "ADD A B" | null;
  registers: { A: number; B: number; OUT: number };
  pendingResult: number | null;
}

export function createToyCpu(): ToyCpuState {
  return { phase: "fetch", programCounter: 0, instruction: null, registers: { A: 3, B: 4, OUT: 0 }, pendingResult: null };
}

export function advanceToyCpu(state: ToyCpuState): ToyCpuState {
  const registers = { ...state.registers };
  if (state.phase === "fetch") return { ...state, phase: "decode", instruction: "ADD A B", registers };
  if (state.phase === "decode") return { ...state, phase: "execute", registers };
  if (state.phase === "execute") return { ...state, phase: "writeback", registers, pendingResult: registers.A + registers.B };
  if (state.pendingResult !== null) registers.OUT = state.pendingResult;
  return { phase: "fetch", programCounter: state.programCounter + 1, instruction: null, registers, pendingResult: null };
}

export function accessMemoryHierarchy(
  cache: readonly string[],
  memory: readonly string[],
  storage: readonly string[],
  key: string,
) {
  if (cache.includes(key)) return { level: "cache" as const, wait: 1 };
  if (memory.includes(key)) return { level: "memory" as const, wait: 4 };
  if (storage.includes(key)) return { level: "storage" as const, wait: 12 };
  return { level: "missing" as const, wait: 0 };
}

export interface LayerEnvelope {
  name: "application" | "transport" | "network" | "link";
  header: string;
}

export interface EncapsulatedMessage {
  message: string;
  layers: LayerEnvelope[];
}

export function encapsulateMessage(message: string): EncapsulatedMessage {
  return {
    message,
    layers: [
      { name: "application", header: "内容类型：学习消息" },
      { name: "transport", header: "编号与确认" },
      { name: "network", header: "源地址与目的地址" },
      { name: "link", header: "下一站设备" },
    ],
  };
}

export function decapsulateMessage(packet: EncapsulatedMessage) {
  return {
    message: packet.message,
    removedLayers: [...packet.layers].reverse().map((layer) => layer.name),
  };
}

export interface WeightedEdge {
  to: string;
  cost: number;
}

export type WeightedGraph = Readonly<Record<string, readonly WeightedEdge[]>>;

export function shortestRoute(
  graph: WeightedGraph,
  startId: string,
  targetId: string,
) {
  if (!graph[startId] || !graph[targetId]) return { path: [], cost: Infinity };
  const distances = new Map<string, number>([[startId, 0]]);
  const paths = new Map<string, string[]>([[startId, [startId]]]);
  const visited = new Set<string>();

  while (visited.size < Object.keys(graph).length) {
    const currentId = [...distances.keys()]
      .filter((id) => !visited.has(id))
      .sort((left, right) => (distances.get(left)! - distances.get(right)!) || left.localeCompare(right))[0];
    if (!currentId) break;
    if (currentId === targetId) {
      return { path: paths.get(currentId)!, cost: distances.get(currentId)! };
    }
    visited.add(currentId);

    for (const edge of [...(graph[currentId] ?? [])].sort((left, right) => left.to.localeCompare(right.to))) {
      if (!graph[edge.to] || edge.cost < 0 || !Number.isFinite(edge.cost)) continue;
      const nextDistance = distances.get(currentId)! + edge.cost;
      if (nextDistance < (distances.get(edge.to) ?? Infinity)) {
        distances.set(edge.to, nextDistance);
        paths.set(edge.to, [...paths.get(currentId)!, edge.to]);
      }
    }
  }

  return { path: [], cost: Infinity };
}

export interface TransferChunk {
  sequence: number;
  payload: string;
}

export interface ReliableTransferState {
  chunks: TransferChunk[];
  droppedSequence: number | null;
  lossTriggered: boolean;
  receivedSequences: number[];
  acknowledgements: number[];
  feedback: string;
}

export type TransferAction =
  | { type: "send"; sequence: number }
  | { type: "timeout"; sequence: number };

export function createReliableTransfer(
  payloads: readonly string[],
  droppedSequence: number | null,
): ReliableTransferState {
  return {
    chunks: payloads.map((payload, sequence) => ({ sequence, payload })),
    droppedSequence,
    lossTriggered: false,
    receivedSequences: [],
    acknowledgements: [],
    feedback: "等待发送第一个数据块。",
  };
}

export function advanceReliableTransfer(
  state: ReliableTransferState,
  action: TransferAction,
): ReliableTransferState {
  const next = copyTransfer(state);
  const chunk = next.chunks.find((item) => item.sequence === action.sequence);
  if (!chunk) return { ...next, feedback: "没有这个编号的数据块。" };

  if (action.type === "send" && action.sequence === next.droppedSequence && !next.lossTriggered) {
    next.lossTriggered = true;
    next.feedback = `数据块 ${action.sequence} 丢失，等待超时重传。`;
    return next;
  }

  if (next.receivedSequences.includes(action.sequence)) {
    next.feedback = `数据块 ${action.sequence} 已收到，重复块被忽略。`;
    return next;
  }

  next.receivedSequences.push(action.sequence);
  next.receivedSequences.sort((left, right) => left - right);
  next.acknowledgements.push(action.sequence);
  next.feedback = action.type === "timeout"
    ? `超时后重传数据块 ${action.sequence}，接收成功。`
    : `数据块 ${action.sequence} 接收成功并返回确认。`;
  return next;
}

export function assembleTransfer(state: ReliableTransferState): string | null {
  if (state.receivedSequences.length !== state.chunks.length) return null;
  return [...state.chunks]
    .sort((left, right) => left.sequence - right.sequence)
    .map((chunk) => chunk.payload)
    .join("");
}

function copyTransfer(state: ReliableTransferState): ReliableTransferState {
  return {
    ...state,
    chunks: state.chunks.map((chunk) => ({ ...chunk })),
    receivedSequences: [...state.receivedSequences],
    acknowledgements: [...state.acknowledgements],
  };
}
