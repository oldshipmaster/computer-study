export type PacketLayer = "application" | "transport" | "network" | "link";
export interface EscortRoute { id: string; label: string; nodes: string[]; cost: number; }
export interface PacketEscortMission {
  id: string;
  title: string;
  story: string;
  message: string;
  fragments: string[];
  routes: EscortRoute[];
  lostSequence: number;
  arrivalOrder: number[];
}

export interface PacketEscortState {
  missionIndex: number;
  missionCount: number;
  phase: "pack" | "route" | "send" | "retransmit" | "order" | "unpack" | "solved" | "complete";
  packedLayers: PacketLayer[];
  selectedRouteId: string | null;
  receivedOrder: number[];
  assembledMessage: string | null;
  unpackedLayers: PacketLayer[];
  solved: number;
  feedback: string;
}

export const PACK_LAYER_ORDER: PacketLayer[] = ["application", "transport", "network", "link"];
export const UNPACK_LAYER_ORDER: PacketLayer[] = [...PACK_LAYER_ORDER].reverse();

export function packetEscortShortcutIndex(key: string, choiceCount: number): number | null {
  if (!/^[1-5]$/.test(key)) return null;
  const index = Number(key) - 1;
  return index < Math.max(0, Math.floor(choiceCount)) ? index : null;
}
const LAYER_LABELS: Record<PacketLayer, string> = {
  application: "应用层", transport: "传输层", network: "网络层", link: "链路层",
};

const routes = (prefix: string, costs: [number, number, number]): EscortRoute[] => [
  { id: `${prefix}-reef`, label: "珊瑚中继线", nodes: ["设备", "珊瑚路由器", "服务器"], cost: costs[0] },
  { id: `${prefix}-cloud`, label: "云桥中继线", nodes: ["设备", "云桥", "深海路由器", "服务器"], cost: costs[1] },
  { id: `${prefix}-star`, label: "星光直达线", nodes: ["设备", "星光路由器", "服务器"], cost: costs[2] },
];

export const PACKET_ESCORT_MISSIONS: PacketEscortMission[] = [
  {
    id: "launch-message", title: "启航消息", story: "把比比的出发消息完整送到学习服务器。",
    fragments: ["比比", "准备", "出发"], message: "比比准备出发", routes: routes("launch", [5, 8, 11]),
    lostSequence: 1, arrivalOrder: [2, 0],
  },
  {
    id: "circuit-report", title: "电路实验报告", story: "护送一份逻辑电路测试结果穿过三条候选路线。",
    fragments: ["逻辑", "电路", "测试", "通过"], message: "逻辑电路测试通过", routes: routes("circuit", [10, 4, 7]),
    lostSequence: 1, arrivalOrder: [3, 0, 2],
  },
  {
    id: "route-note", title: "路由观察记录", story: "分组可能乱序抵达，编号能帮助接收端恢复消息。",
    fragments: ["数据", "沿路", "前进"], message: "数据沿路前进", routes: routes("route", [9, 6, 3]),
    lostSequence: 0, arrivalOrder: [1, 2],
  },
  {
    id: "rescue-chunks", title: "五分组救援", story: "较长消息被拆成五组，只重传真正丢失的那一组。",
    fragments: ["重传", "找回", "丢失", "的", "分组"], message: "重传找回丢失的分组", routes: routes("rescue", [12, 5, 8]),
    lostSequence: 2, arrivalOrder: [4, 1, 3, 0],
  },
  {
    id: "ordered-story", title: "乱序故事桥", story: "所有分组都到了，但必须按编号排好才能读懂。",
    fragments: ["顺序", "让", "消息", "完整"], message: "顺序让消息完整", routes: routes("order", [6, 9, 4]),
    lostSequence: 1, arrivalOrder: [2, 0, 3],
  },
  {
    id: "network-finale", title: "网络护航总任务", story: "独立完成打包、选路、重传、排序和拆包的全部步骤。",
    fragments: ["网络", "护航", "任务", "全部", "完成"], message: "网络护航任务全部完成", routes: routes("finale", [7, 3, 10]),
    lostSequence: 2, arrivalOrder: [3, 1, 4, 0],
  },
];

function normalizeRotation(rotation: number, length: number) {
  if (!Number.isFinite(rotation) || length === 0) return 0;
  return ((Math.floor(rotation) % length) + length) % length;
}

export function buildPacketEscortDeck(rotation: number): PacketEscortMission[] {
  const offset = normalizeRotation(rotation, PACKET_ESCORT_MISSIONS.length);
  return [...PACKET_ESCORT_MISSIONS.slice(offset), ...PACKET_ESCORT_MISSIONS.slice(0, offset)];
}

export function createPacketEscortState(missionCount: number): PacketEscortState {
  return {
    missionIndex: 0, missionCount: Math.max(0, Math.floor(missionCount)), phase: "pack", packedLayers: [],
    selectedRouteId: null, receivedOrder: [], assembledMessage: null, unpackedLayers: [], solved: 0,
    feedback: "先从消息内容开始，逐层加入网络信封。",
  };
}

export function packPacketLayer(state: PacketEscortState, _mission: PacketEscortMission, layer: string, activationDetail = 1): PacketEscortState {
  if (state.phase !== "pack" || activationDetail > 1) return state;
  const expected = PACK_LAYER_ORDER[state.packedLayers.length];
  if (layer !== expected) return { ...state, feedback: `现在要加入${LAYER_LABELS[expected]}：先包里面的信息，再包外面的下一站。` };
  const packedLayers = [...state.packedLayers, expected];
  const complete = packedLayers.length === PACK_LAYER_ORDER.length;
  return {
    ...state, packedLayers, phase: complete ? "route" : "pack",
    feedback: complete ? "四层信封打包完成。比较三条路线的总代价。" : `${LAYER_LABELS[expected]}已加入，继续向外包装。`,
  };
}

function cheapestRoute(mission: PacketEscortMission) {
  return [...mission.routes].sort((left, right) => left.cost - right.cost || left.id.localeCompare(right.id))[0];
}

export function chooseEscortRoute(state: PacketEscortState, mission: PacketEscortMission, routeId: string, activationDetail = 1): PacketEscortState {
  if (state.phase !== "route" || activationDetail > 1) return state;
  const route = mission.routes.find((candidate) => candidate.id === routeId);
  if (!route) return state;
  const cheapest = cheapestRoute(mission);
  if (route.id !== cheapest.id) return { ...state, feedback: `这条路线总代价是 ${route.cost}，还有更小的代价。节点少不一定更快。` };
  return { ...state, selectedRouteId: route.id, phase: "send", feedback: `选中总代价 ${route.cost} 的路线。编号分组已经准备发射。` };
}

export function launchPacketTransfer(state: PacketEscortState, mission: PacketEscortMission, activationDetail = 1): PacketEscortState {
  if (state.phase !== "send" || activationDetail > 1 || !state.selectedRouteId) return state;
  return {
    ...state, phase: "retransmit", receivedOrder: [...mission.arrivalOrder],
    feedback: `发送完成：接收端缺少第 ${mission.lostSequence + 1} 组。根据编号只重传这一组。`,
  };
}

export function retransmitPacket(state: PacketEscortState, mission: PacketEscortMission, sequence: number, activationDetail = 1): PacketEscortState {
  if (state.phase !== "retransmit" || activationDetail > 1 || !Number.isInteger(sequence) || sequence < 0 || sequence >= mission.fragments.length) return state;
  if (sequence !== mission.lostSequence) return { ...state, feedback: `第 ${sequence + 1} 组已有到达证据。缺少的是第 ${mission.lostSequence + 1} 组，不用全部重发。` };
  if (state.receivedOrder.includes(sequence)) return state;
  return {
    ...state, phase: "order", receivedOrder: [...state.receivedOrder, sequence],
    feedback: `第 ${sequence + 1} 组重传成功。全部分组已到达，但顺序还需要整理。`,
  };
}

export function moveReceivedPacket(state: PacketEscortState, from: number, to: number): PacketEscortState {
  if (state.phase !== "order" || from < 0 || from >= state.receivedOrder.length || to < 0 || to >= state.receivedOrder.length || from === to) return state;
  const receivedOrder = [...state.receivedOrder];
  const [packet] = receivedOrder.splice(from, 1);
  receivedOrder.splice(to, 0, packet);
  return { ...state, receivedOrder, feedback: "分组顺序已调整。检查编号是否从小到大连续。" };
}

export function confirmPacketOrder(state: PacketEscortState, mission: PacketEscortMission, activationDetail = 1): PacketEscortState {
  if (state.phase !== "order" || activationDetail > 1) return state;
  const ordered = state.receivedOrder.length === mission.fragments.length && state.receivedOrder.every((sequence, index) => sequence === index);
  if (!ordered) return { ...state, feedback: "编号还没有从 1 开始连续排列。保留当前顺序，继续移动分组。" };
  return { ...state, phase: "unpack", assembledMessage: mission.message, feedback: "编号顺序正确，消息已经组装。现在从最外层信封开始拆。" };
}

export function unpackPacketLayer(state: PacketEscortState, _mission: PacketEscortMission, layer: string, activationDetail = 1): PacketEscortState {
  if (state.phase !== "unpack" || activationDetail > 1) return state;
  const expected = UNPACK_LAYER_ORDER[state.unpackedLayers.length];
  if (layer !== expected) return { ...state, feedback: `现在先拆${LAYER_LABELS[expected]}：接收端要从最外层往里面拆。` };
  const unpackedLayers = [...state.unpackedLayers, expected];
  const complete = unpackedLayers.length === UNPACK_LAYER_ORDER.length;
  return {
    ...state, unpackedLayers, phase: complete ? "solved" : "unpack", solved: complete ? state.solved + 1 : state.solved,
    feedback: complete ? "消息完整恢复！分层、路由、重传和排序证据全部通过。" : `${LAYER_LABELS[expected]}已移除，继续向内拆包。`,
  };
}

export function advancePacketEscortMission(state: PacketEscortState, activationDetail = 1): PacketEscortState {
  if (state.phase !== "solved" || activationDetail > 1) return state;
  if (state.missionIndex >= state.missionCount - 1) return { ...state, phase: "complete", feedback: "六次网络数据包护航全部完成！" };
  return {
    ...createPacketEscortState(state.missionCount), missionIndex: state.missionIndex + 1, solved: state.solved,
    feedback: "新的虚构消息已装入。先从应用层开始打包。",
  };
}
