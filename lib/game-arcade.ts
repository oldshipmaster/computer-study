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
  keyboardFriendly: boolean;
  gate: GameGate;
}

export interface GameArcadeEntry extends GameArcadeDefinition {
  unlocked: boolean;
  progress: { value: number; maximum: number };
  nextCourseId: string | null;
}

const GAME_ARCADE_BLUEPRINTS: Array<Omit<GameArcadeDefinition, "keyboardFriendly">> = [
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

export const GAME_ARCADE_DEFINITIONS: GameArcadeDefinition[] = GAME_ARCADE_BLUEPRINTS.map((definition) => ({
  ...definition,
  keyboardFriendly: definition.id !== "missions",
}));

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
const DISCOVERY_CATEGORY_LABELS: Record<GameArcadeCategory, string> = { quest: "综合挑战", code: "编程与逻辑", systems: "电脑与网络", life: "安全与文件" };
const DISCOVERY_LEVEL_LABELS: Record<GameArcadeLevel, string> = { starter: "入门探险", adventure: "进阶挑战", mastery: "大师联赛" };

export function buildGameArcadeFilterSummary(filters: { category?: GameArcadeCategory | "all"; level?: GameArcadeLevel | "all"; query?: string; favoritesOnly?: boolean; keyboardOnly?: boolean }): string[] {
  const summary: string[] = [];
  if (filters.category && filters.category !== "all") summary.push(DISCOVERY_CATEGORY_LABELS[filters.category]);
  if (filters.level && filters.level !== "all") summary.push(DISCOVERY_LEVEL_LABELS[filters.level]);
  const query = filters.query?.trim();
  if (query) summary.push(`搜索：${query}`);
  if (filters.favoritesOnly) summary.push("只看收藏");
  if (filters.keyboardOnly) summary.push("只看键盘玩法");
  return summary.length ? summary : ["全部已解锁玩法"];
}

export function buildGameArcadeRecommendations(entries: readonly GameArcadeEntry[], rotation: number, limit = 3, preferredIds: readonly string[] = [], filters: { category?: GameArcadeCategory | "all"; level?: GameArcadeLevel | "all"; query?: string; favoritesOnly?: boolean; keyboardOnly?: boolean; visitedIds?: readonly string[] } = {}): GameArcadeEntry[] {
  const safeRotation = Number.isFinite(rotation) ? Math.max(0, Math.floor(rotation)) : 0;
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;
  const preferredSet = new Set(preferredIds);
  const query = filters.query?.trim().toLocaleLowerCase() ?? "";
  const unlocked = entries.filter((entry) => entry.unlocked && (!filters.category || filters.category === "all" || entry.category === filters.category) && (!filters.level || filters.level === "all" || entry.level === filters.level) && (!query || `${entry.title} ${entry.mechanic}`.toLocaleLowerCase().includes(query)) && (!filters.favoritesOnly || preferredSet.has(entry.id)) && (!filters.keyboardOnly || entry.keyboardFriendly));
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
  const preferred = unlocked.filter((entry) => preferredSet.has(entry.id));
  const preferredOffset = safeRotation % preferred.length;
  const rotatedPreferred = [...preferred.slice(preferredOffset), ...preferred.slice(0, preferredOffset)];
  const visitedSet = new Set(filters.visitedIds ?? []);
  const prioritized: GameArcadeEntry[] = [];
  const fresh = (candidates: readonly GameArcadeEntry[]) => candidates.filter((entry) => !visitedSet.has(entry.id));
  const visited = (candidates: readonly GameArcadeEntry[]) => candidates.filter((entry) => visitedSet.has(entry.id));
  for (const candidate of [...fresh(rotatedPreferred), ...fresh(recommendations), ...fresh(unlocked), ...visited(rotatedPreferred), ...visited(recommendations), ...visited(unlocked)]) {
    if (prioritized.some((entry) => entry.id === candidate.id)) continue;
    prioritized.push(candidate);
    if (prioritized.length === target) break;
  }
  return prioritized;
}

export function filterGameArcadeEntries(entries: readonly GameArcadeEntry[], filters: { query?: string; category?: GameArcadeCategory | "all"; level?: GameArcadeLevel | "all"; unlockedOnly?: boolean; favoritesOnly?: boolean; favoriteIds?: readonly string[]; unvisitedOnly?: boolean; visitedIds?: readonly string[]; keyboardOnly?: boolean }): GameArcadeEntry[] {
  const query = filters.query?.trim().toLocaleLowerCase() ?? "";
  const favorites = new Set(filters.favoriteIds ?? []);
  const visited = new Set(filters.visitedIds ?? []);
  return entries.filter((entry) => {
    if (filters.category && filters.category !== "all" && entry.category !== filters.category) return false;
    if (filters.level && filters.level !== "all" && entry.level !== filters.level) return false;
    if (filters.unlockedOnly && !entry.unlocked) return false;
    if (filters.favoritesOnly && !favorites.has(entry.id)) return false;
    if (filters.unvisitedOnly && visited.has(entry.id)) return false;
    if (filters.keyboardOnly && !entry.keyboardFriendly) return false;
    if (query && !`${entry.title} ${entry.mechanic}`.toLocaleLowerCase().includes(query)) return false;
    return true;
  });
}

type GameArcadeFilters = Parameters<typeof filterGameArcadeEntries>[1];

export function buildGameArcadeFacetCounts(entries: readonly GameArcadeEntry[], filters: GameArcadeFilters): {
  categories: Record<GameArcadeCategory | "all", number>;
  levels: Record<GameArcadeLevel | "all", number>;
} {
  const sharedFilters: GameArcadeFilters = {
    query: filters.query,
    unlockedOnly: filters.unlockedOnly,
    favoritesOnly: filters.favoritesOnly,
    favoriteIds: filters.favoriteIds,
    unvisitedOnly: filters.unvisitedOnly,
    visitedIds: filters.visitedIds,
    keyboardOnly: filters.keyboardOnly,
  };
  const categories = Object.fromEntries(
    (["all", "quest", "code", "systems", "life"] as const).map((candidate) => [
      candidate,
      filterGameArcadeEntries(entries, { ...sharedFilters, level: filters.level, category: candidate }).length,
    ]),
  ) as Record<GameArcadeCategory | "all", number>;
  const levels = Object.fromEntries(
    (["all", "starter", "adventure", "mastery"] as const).map((candidate) => [
      candidate,
      filterGameArcadeEntries(entries, { ...sharedFilters, category: filters.category, level: candidate }).length,
    ]),
  ) as Record<GameArcadeLevel | "all", number>;
  return { categories, levels };
}

export function buildClosestGameUnlocks(entries: readonly GameArcadeEntry[], limit = 3): GameArcadeEntry[] {
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;
  return entries
    .map((entry, index) => ({ entry, index, remaining: entry.progress.maximum - entry.progress.value }))
    .filter(({ entry }) => !entry.unlocked && entry.nextCourseId !== null)
    .sort((left, right) => left.remaining - right.remaining || left.entry.progress.maximum - right.entry.progress.maximum || left.index - right.index)
    .slice(0, safeLimit)
    .map(({ entry }) => entry);
}

export function gameArcadePlaylistLimit(minutes: number): number { if (!Number.isFinite(minutes) || minutes < 15) return 1; if (minutes < 25) return 2; return 3; }
export function gameArcadePlaylistBreaks(minutes: number): number { return Math.max(0, gameArcadePlaylistLimit(minutes) - 1); }
export function gameArcadeSessionRemaining(minutes: number, openedGames: number): number {
  const safeOpenedGames = Number.isFinite(openedGames) ? Math.max(0, Math.floor(openedGames)) : 0;
  return Math.max(0, gameArcadePlaylistLimit(minutes) - safeOpenedGames);
}

export function recordGameArcadeVisit(currentIds: readonly string[], gameId: string): string[] {
  const known = new Set(GAME_ARCADE_DEFINITIONS.map((game) => game.id));
  const visits = [...new Set(currentIds.filter((id) => known.has(id)))];
  if (known.has(gameId) && !visits.includes(gameId)) visits.push(gameId);
  return visits;
}
