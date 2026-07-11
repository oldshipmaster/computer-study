export type GridDirection = "up" | "down" | "left" | "right";
export interface GridPosition { row: number; col: number; }
export interface GridState { position: GridPosition; visitedTargets: string[]; feedback: string; }
export const GRID_SIZE = 6;
export const GRID_TARGETS = ["2-3", "4-4", "6-5"];
export const GRID_OBSTACLES = ["2-2", "3-4", "5-5"];
export const INITIAL_GRID_STATE: GridState = { position: { row: 1, col: 1 }, visitedTargets: [], feedback: "机器人在第1行，第1列。" };
export const coordinateKey = (position: GridPosition) => `${position.row}-${position.col}`;
export const coordinateLabel = (position: GridPosition) => `第${position.row}行，第${position.col}列`;
export function moveRobot(state: GridState, direction: GridDirection): GridState {
  const delta = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] }[direction];
  const next = { row: state.position.row + delta[0], col: state.position.col + delta[1] };
  if (next.row < 1 || next.row > GRID_SIZE || next.col < 1 || next.col > GRID_SIZE) return { ...state, feedback: "这里是方格城边界，机器人留在原地。" };
  const key = coordinateKey(next); if (GRID_OBSTACLES.includes(key)) return { ...state, feedback: "前面有障碍，请换一条路线。" };
  const visitedTargets = GRID_TARGETS.includes(key) && !state.visitedTargets.includes(key) ? [...state.visitedTargets, key] : state.visitedTargets;
  return { position: next, visitedTargets, feedback: `${coordinateLabel(next)}${GRID_TARGETS.includes(key) ? "，收集到坐标信标！" : "。"}` };
}
