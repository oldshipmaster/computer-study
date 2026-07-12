export const ADVANCED_ISLAND_COURSE_IDS = {
  "data-structures": [
    "array-lockers",
    "linked-treasure",
    "stack-queue-dock",
    "tree-library",
    "graph-routes",
  ],
  "algorithm-arena": [
    "linear-search",
    "binary-search",
    "bubble-sort",
    "task-decomposition",
    "algorithm-efficiency",
  ],
  "os-control-tower": [
    "program-process",
    "cpu-scheduling",
    "memory-allocation",
    "file-system-tree",
    "device-coordination",
  ],
  "systems-network-depths": [
    "instruction-cycle",
    "cache-station",
    "network-layers",
    "routing-maze",
    "reliable-transfer",
  ],
} as const;

export type AdvancedIslandId = keyof typeof ADVANCED_ISLAND_COURSE_IDS;
export type AdvancedCourseId =
  (typeof ADVANCED_ISLAND_COURSE_IDS)[AdvancedIslandId][number];

export const ADVANCED_ISLAND_IDS = Object.keys(
  ADVANCED_ISLAND_COURSE_IDS,
) as AdvancedIslandId[];

export const ADVANCED_COURSE_IDS = Object.values(
  ADVANCED_ISLAND_COURSE_IDS,
).flat() as AdvancedCourseId[];
