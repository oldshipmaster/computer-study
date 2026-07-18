import { COURSES, ISLANDS } from "./course-data.ts";

type GameGate =
  | { type: "always" }
  | { type: "course-count"; count: number }
  | { type: "island-complete" }
  | { type: "exact"; courseIds: string[] };

export type GameArcadeCategory = "quest" | "code" | "systems" | "life";
export type GameArcadeLevel = "starter" | "adventure" | "mastery";

export interface GameArcadeDefinition {
  id: string;
  targetId: string;
  title: string;
  icon: string;
  mechanic: string;
  duration: string;
  category: GameArcadeCategory;
  level: GameArcadeLevel;
  gate: GameGate;
}

export interface GameArcadeEntry extends GameArcadeDefinition {
  unlocked: boolean;
  progress: { value: number; maximum: number };
  nextCourseId: string | null;
}

export const GAME_ARCADE_DEFINITIONS: GameArcadeDefinition[] = [
  { id: "missions", targetId: "adventure-missions", title: "探险任务牌", icon: "🧭", mechanic: "选新课、重玩或修复薄弱点", duration: "随时选择", category: "quest", level: "starter", gate: { type: "always" } },
  { id: "sprint", targetId: "knowledge-sprint", title: "比特知识闪击赛", icon: "⚡", mechanic: "五题连击、护盾与错题回课", duration: "2–4 分钟", category: "quest", level: "starter", gate: { type: "course-count", count: 3 } },
  { id: "boss", targetId: "island-boss-arena", title: "十三岛 Boss 战", icon: "🐙", mechanic: "找证据、排行动、讲清原理", duration: "6–8 分钟", category: "quest", level: "adventure", gate: { type: "island-complete" } },
  { id: "circuit", targetId: "logic-circuit-lab", title: "逻辑电路实验台", icon: "💡", mechanic: "搭逻辑门并跑完整真值表", duration: "8–10 分钟", category: "code", level: "adventure", gate: { type: "exact", courseIds: ["bits-and-data", "boolean-logic"] } },
  { id: "robot", targetId: "robot-code-expedition", title: "机器人代码远征", icon: "🤖", mechanic: "编排指令并逐步调试地图", duration: "8–10 分钟", category: "code", level: "adventure", gate: { type: "exact", courseIds: ["instruction-order", "grid-city-navigation", "repeat-power", "rainy-condition", "bug-catcher"] } },
  { id: "packet", targetId: "packet-escort", title: "网络数据包护航", icon: "📦", mechanic: "打包、选路、重传、排序、拆层", duration: "8–10 分钟", category: "systems", level: "mastery", gate: { type: "exact", courseIds: ["network-layers", "routing-maze", "reliable-transfer"] } },
  { id: "cpu", targetId: "cpu-scheduler-game", title: "CPU 时间片调度台", icon: "⚙️", mechanic: "装入内存并轮转执行进程", duration: "8–10 分钟", category: "systems", level: "mastery", gate: { type: "exact", courseIds: ["program-process", "cpu-scheduling", "memory-allocation"] } },
  { id: "algorithm", targetId: "algorithm-arena-game", title: "算法竞技场", icon: "🏁", mechanic: "搜索、排序、依赖与效率六关接力", duration: "8–10 分钟", category: "code", level: "mastery", gate: { type: "exact", courseIds: ["linear-search", "binary-search", "bubble-sort", "task-decomposition", "algorithm-efficiency"] } },
  { id: "structures", targetId: "data-structure-harbor", title: "数据结构装卸港", icon: "⚓", mechanic: "数组、链表、栈队列、树与图调度", duration: "8–10 分钟", category: "systems", level: "mastery", gate: { type: "exact", courseIds: ["array-lockers", "linked-treasure", "stack-queue-dock", "tree-library", "graph-routes"] } },
  { id: "safety", targetId: "safety-detective-game", title: "数字安全侦探局", icon: "🔎", mechanic: "看虚构线索，保护信息并安全求助", duration: "8–10 分钟", category: "life", level: "starter", gate: { type: "exact", courseIds: ["password-guardian", "private-information", "popup-fog", "healthy-computer-habits", "light-bit-island"] } },
  { id: "factory", targetId: "virtual-computer-factory", title: "虚拟电脑装配厂", icon: "🦾", mechanic: "连接输入、CPU、内存、存储与输出", duration: "8–10 分钟", category: "systems", level: "starter", gate: { type: "exact", courseIds: ["input-process-output", "cpu-memory-storage", "bits-and-data", "hardware-software", "troubleshoot-machine"] } },
  { id: "files", targetId: "file-forest-rescue", title: "文件森林救援队", icon: "📁", mechanic: "路径、命名、移动、复制、分类与恢复", duration: "8–10 分钟", category: "life", level: "starter", gate: { type: "exact", courseIds: ["file-home", "name-your-work", "move-and-copy", "file-types", "learning-backpack"] } },
  { id: "creative", targetId: "creative-studio-challenge", title: "创作工坊项目赛", icon: "🎨", mechanic: "像素画、文档、幻灯片、版权与表格", duration: "8–10 分钟", category: "life", level: "adventure", gate: { type: "exact", courseIds: ["pixel-art", "document-design", "slide-story", "media-copyright", "data-table"] } },
  { id: "ai-lab", targetId: "ai-verification-lab", title: "AI 核验研究站", icon: "🔬", mechanic: "邮件、协作、AI 提问、核验与项目交付", duration: "8–10 分钟", category: "life", level: "adventure", gate: { type: "exact", courseIds: ["email-message", "online-collaboration", "ai-helper", "verify-ai", "digital-project"] } },
  { id: "game-maker", targetId: "game-maker-relay", title: "迷你游戏导演", icon: "🎮", mechanic: "事件、变量、函数、逻辑、调试与平衡", duration: "8–10 分钟", category: "code", level: "adventure", gate: { type: "exact", courseIds: ["events-handlers", "variables-score", "functions-tools", "boolean-logic", "game-design"] } },
  { id: "pilot", targetId: "computer-pilot-relay", title: "电脑驾驶执照", icon: "🧑‍✈️", mechanic: "键盘、鼠标、输入、窗口与程序综合操作", duration: "8–10 分钟", category: "life", level: "starter", gate: { type: "exact", courseIds: ["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing"] } },
  { id: "voyage", targetId: "network-voyage-relay", title: "网络航海训练营", icon: "⛵", mechanic: "地址、搜索、云端传送与逐步排障", duration: "8–10 分钟", category: "systems", level: "starter", gate: { type: "exact", courseIds: ["network-journey", "web-address", "search-and-links", "downloads-and-cloud", "network-troubleshooting"] } },
  { id: "os-command", targetId: "os-command-relay", title: "操作系统任务指挥部", icon: "🛰", mechanic: "进程、CPU、内存、文件与设备协同", duration: "8–10 分钟", category: "systems", level: "mastery", gate: { type: "exact", courseIds: ["program-process", "cpu-scheduling", "memory-allocation", "file-system-tree", "device-coordination"] } },
  { id: "systems-depth", targetId: "systems-depth-relay", title: "系统深海总控台", icon: "🔱", mechanic: "指令、缓存、分层、路由与可靠传输", duration: "8–10 分钟", category: "systems", level: "mastery", gate: { type: "exact", courseIds: ["instruction-cycle", "cache-station", "network-layers", "routing-maze", "reliable-transfer"] } },
  { id: "championship", targetId: "island-championship-relay", title: "十三岛冠军联赛", icon: "🏆", mechanic: "十三回合跨岛证据决策终局赛", duration: "8–10 分钟", category: "quest", level: "mastery", gate: { type: "exact", courseIds: COURSES.map((course) => course.id) } },
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

const DISCOVERY_CATEGORY_ORDER: GameArcadeCategory[] = ["quest", "code", "systems", "life"];

export function buildGameArcadeRecommendations(entries: readonly GameArcadeEntry[], rotation: number, limit = 3): GameArcadeEntry[] {
  const safeRotation = Number.isFinite(rotation) ? Math.max(0, Math.floor(rotation)) : 0;
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;
  const unlocked = entries.filter((entry) => entry.unlocked);
  const target = Math.min(safeLimit, unlocked.length);
  if (target === 0) return [];
  const categoryOffset = safeRotation % DISCOVERY_CATEGORY_ORDER.length;
  const categoryOrder = [...DISCOVERY_CATEGORY_ORDER.slice(categoryOffset), ...DISCOVERY_CATEGORY_ORDER.slice(0, categoryOffset)];
  const buckets = new Map(categoryOrder.map((category) => {
    const games = unlocked.filter((entry) => entry.category === category);
    const offset = games.length ? safeRotation % games.length : 0;
    return [category, [...games.slice(offset), ...games.slice(0, offset)]] as const;
  }));
  const recommendations: GameArcadeEntry[] = [];
  for (let round = 0; recommendations.length < target; round += 1) {
    let added = false;
    for (const category of categoryOrder) {
      const candidate = buckets.get(category)?.[round];
      if (!candidate) continue;
      recommendations.push(candidate);
      added = true;
      if (recommendations.length === target) break;
    }
    if (!added) break;
  }
  return recommendations;
}

export function filterGameArcadeEntries(entries: readonly GameArcadeEntry[], filters: { query?: string; category?: GameArcadeCategory | "all"; level?: GameArcadeLevel | "all"; unlockedOnly?: boolean }): GameArcadeEntry[] {
  const query = filters.query?.trim().toLocaleLowerCase() ?? "";
  return entries.filter((entry) => {
    if (filters.category && filters.category !== "all" && entry.category !== filters.category) return false;
    if (filters.level && filters.level !== "all" && entry.level !== filters.level) return false;
    if (filters.unlockedOnly && !entry.unlocked) return false;
    if (query && !`${entry.title} ${entry.mechanic}`.toLocaleLowerCase().includes(query)) return false;
    return true;
  });
}
