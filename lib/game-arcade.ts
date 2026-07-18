import { COURSES, ISLANDS } from "./course-data.ts";

type GameGate =
  | { type: "always" }
  | { type: "course-count"; count: number }
  | { type: "island-complete" }
  | { type: "exact"; courseIds: string[] };

export interface GameArcadeDefinition {
  id: string;
  targetId: string;
  title: string;
  icon: string;
  mechanic: string;
  duration: string;
  gate: GameGate;
}

export interface GameArcadeEntry extends GameArcadeDefinition {
  unlocked: boolean;
  progress: { value: number; maximum: number };
  nextCourseId: string | null;
}

export const GAME_ARCADE_DEFINITIONS: GameArcadeDefinition[] = [
  { id: "missions", targetId: "adventure-missions", title: "探险任务牌", icon: "🧭", mechanic: "选新课、重玩或修复薄弱点", duration: "随时选择", gate: { type: "always" } },
  { id: "sprint", targetId: "knowledge-sprint", title: "比特知识闪击赛", icon: "⚡", mechanic: "五题连击、护盾与错题回课", duration: "2–4 分钟", gate: { type: "course-count", count: 3 } },
  { id: "boss", targetId: "island-boss-arena", title: "十三岛 Boss 战", icon: "🐙", mechanic: "找证据、排行动、讲清原理", duration: "6–8 分钟", gate: { type: "island-complete" } },
  { id: "circuit", targetId: "logic-circuit-lab", title: "逻辑电路实验台", icon: "💡", mechanic: "搭逻辑门并跑完整真值表", duration: "8–10 分钟", gate: { type: "exact", courseIds: ["bits-and-data", "boolean-logic"] } },
  { id: "robot", targetId: "robot-code-expedition", title: "机器人代码远征", icon: "🤖", mechanic: "编排指令并逐步调试地图", duration: "8–10 分钟", gate: { type: "exact", courseIds: ["instruction-order", "grid-city-navigation", "repeat-power", "rainy-condition"] } },
  { id: "packet", targetId: "packet-escort", title: "网络数据包护航", icon: "📦", mechanic: "打包、选路、重传、排序、拆层", duration: "8–10 分钟", gate: { type: "exact", courseIds: ["network-layers", "routing-maze", "reliable-transfer"] } },
  { id: "cpu", targetId: "cpu-scheduler-game", title: "CPU 时间片调度台", icon: "⚙️", mechanic: "装入内存并轮转执行进程", duration: "8–10 分钟", gate: { type: "exact", courseIds: ["program-process", "cpu-scheduling", "memory-allocation"] } },
  { id: "algorithm", targetId: "algorithm-arena-game", title: "算法竞技场", icon: "🏁", mechanic: "搜索、排序、依赖与效率六关接力", duration: "8–10 分钟", gate: { type: "exact", courseIds: ["linear-search", "binary-search", "bubble-sort", "task-decomposition", "algorithm-efficiency"] } },
];

export function buildGameArcadeEntries(completedCourseIds: readonly string[]): GameArcadeEntry[] {
  const knownIds = new Set(COURSES.map((course) => course.id));
  const completed = new Set(completedCourseIds.filter((id) => knownIds.has(id)));
  return GAME_ARCADE_DEFINITIONS.map((definition) => {
    if (definition.gate.type === "always") return { ...definition, unlocked: true, progress: { value: 1, maximum: 1 }, nextCourseId: null };
    if (definition.gate.type === "course-count") {
      const maximum = definition.gate.count;
      const value = Math.min(completed.size, maximum);
      const unlocked = value >= maximum;
      const nextCourseId = unlocked ? null : (COURSES.find((course) => !completed.has(course.id))?.id ?? null);
      return { ...definition, unlocked, progress: { value, maximum }, nextCourseId };
    }
    if (definition.gate.type === "island-complete") {
      const islandProgress = ISLANDS.map((island) => ({ island, value: island.courseIds.filter((id) => completed.has(id)).length }));
      const best = islandProgress.reduce((current, candidate) => candidate.value > current.value ? candidate : current, islandProgress[0]);
      const maximum = best.island.courseIds.length;
      const unlocked = best.value >= maximum;
      const nextCourseId = unlocked ? null : (best.island.courseIds.find((id) => !completed.has(id)) ?? null);
      return { ...definition, unlocked, progress: { value: best.value, maximum }, nextCourseId };
    }
    const maximum = definition.gate.courseIds.length;
    const value = definition.gate.courseIds.filter((id) => completed.has(id)).length;
    const unlocked = value >= maximum;
    const nextCourseId = unlocked ? null : (definition.gate.courseIds.find((id) => !completed.has(id)) ?? null);
    return { ...definition, unlocked, progress: { value, maximum }, nextCourseId };
  });
}
