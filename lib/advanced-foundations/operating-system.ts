export type ProcessState = "ready" | "running" | "waiting" | "paused" | "terminated";
export type ProcessAction = "run" | "wait" | "wake" | "pause" | "resume" | "terminate";

const PROCESS_TRANSITIONS: Partial<Record<ProcessState, Partial<Record<ProcessAction, ProcessState>>>> = {
  ready: { run: "running", terminate: "terminated" },
  running: { wait: "waiting", pause: "paused", terminate: "terminated" },
  waiting: { wake: "ready", terminate: "terminated" },
  paused: { resume: "ready", terminate: "terminated" },
};

export function transitionProcess(state: ProcessState, action: ProcessAction) {
  const nextState = PROCESS_TRANSITIONS[state]?.[action];
  return nextState
    ? { state: nextState, changed: true }
    : { state, changed: false };
}

export interface ScheduledTask {
  id: string;
  remaining: number;
}

export function runRoundRobinTick(
  tasks: readonly ScheduledTask[],
  cursor: number,
) {
  const copiedTasks = tasks.map((task) => ({ ...task }));
  if (!copiedTasks.length || copiedTasks.every((task) => task.remaining <= 0)) {
    return { tasks: copiedTasks, runningId: null, nextCursor: 0 };
  }

  const start = ((Math.floor(cursor) % copiedTasks.length) + copiedTasks.length) % copiedTasks.length;
  let selectedIndex = start;
  while (copiedTasks[selectedIndex].remaining <= 0) {
    selectedIndex = (selectedIndex + 1) % copiedTasks.length;
  }
  copiedTasks[selectedIndex].remaining = Math.max(0, copiedTasks[selectedIndex].remaining - 1);
  return {
    tasks: copiedTasks,
    runningId: copiedTasks[selectedIndex].id,
    nextCursor: (selectedIndex + 1) % copiedTasks.length,
  };
}

export interface MemoryState {
  capacity: number;
  allocations: Readonly<Record<string, number>>;
}

export function allocateMemory(
  memory: MemoryState,
  processId: string,
  size: number,
) {
  const used = Object.values(memory.allocations).reduce((sum, value) => sum + value, 0);
  const free = Math.max(0, memory.capacity - used);
  const safeSize = Number.isFinite(size) ? Math.floor(size) : 0;
  if (!processId || safeSize <= 0 || memory.allocations[processId] !== undefined || safeSize > free) {
    return { state: copyMemory(memory), ok: false, free };
  }
  return {
    state: {
      capacity: memory.capacity,
      allocations: { ...memory.allocations, [processId]: safeSize },
    },
    ok: true,
    free: free - safeSize,
  };
}

export function releaseMemory(memory: MemoryState, processId: string): MemoryState {
  const allocations = { ...memory.allocations };
  delete allocations[processId];
  return { capacity: memory.capacity, allocations };
}

export type VirtualEntry =
  | { kind: "directory"; children: readonly string[] }
  | { kind: "file"; content: string };

export function resolveVirtualPath(
  entries: Readonly<Record<string, VirtualEntry>>,
  path: string,
): VirtualEntry | null {
  if (!path.startsWith("/") || path.split("/").some((part) => part === ".." || part === ".")) return null;
  return entries[path] ?? null;
}

export interface DeviceRequest {
  id: string;
  device: string;
  task: string;
}

export function serviceDeviceRequest(requests: readonly DeviceRequest[]) {
  return {
    serviced: requests[0] ? { ...requests[0] } : null,
    pending: requests.slice(1).map((request) => ({ ...request })),
  };
}

function copyMemory(memory: MemoryState): MemoryState {
  return { capacity: memory.capacity, allocations: { ...memory.allocations } };
}
