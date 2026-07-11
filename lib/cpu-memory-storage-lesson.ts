export interface MachineState { memory: string | null; storage: string; cpuSteps: number; }
export type MachineAction = { type: "load" | "save" | "restart" } | { type: "process"; value: string };
export const INITIAL_MACHINE_STATE: MachineState = { memory: null, storage: "岛屿草图", cpuSteps: 0 };
export function updateMachine(state: MachineState, action: MachineAction): MachineState { if (action.type === "load") return { ...state, memory: state.storage }; if (action.type === "process" && state.memory !== null) return { ...state, memory: action.value, cpuSteps: state.cpuSteps + 1 }; if (action.type === "save" && state.memory !== null) return { ...state, storage: state.memory }; if (action.type === "restart") return { ...state, memory: null, cpuSteps: 0 }; return state; }
