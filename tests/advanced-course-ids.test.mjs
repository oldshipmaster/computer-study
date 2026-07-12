import assert from "node:assert/strict";
import test from "node:test";
import { COURSES, ISLANDS } from "../lib/course-data.ts";
import {
  ADVANCED_COURSE_IDS,
  ADVANCED_ISLAND_COURSE_IDS,
  ADVANCED_ISLAND_IDS,
} from "../lib/advanced-foundations/course-ids.ts";

test("defines four advanced islands with five unique courses each", () => {
  assert.deepEqual(
    Object.values(ADVANCED_ISLAND_COURSE_IDS).map((ids) => ids.length),
    [5, 5, 5, 5],
  );
  assert.equal(ADVANCED_ISLAND_IDS.length, 4);
  assert.equal(ADVANCED_COURSE_IDS.length, 20);
  assert.equal(new Set(ADVANCED_COURSE_IDS).size, 20);
});

test("integrates every advanced identity exactly once in the curriculum", () => {
  assert.ok(ADVANCED_COURSE_IDS.every((id) => COURSES.filter((course) => course.id === id).length === 1));
  assert.ok(ADVANCED_ISLAND_IDS.every((id) => ISLANDS.filter((island) => island.id === id).length === 1));
});

test("keeps the approved stable ids in domain order", () => {
  assert.deepEqual(ADVANCED_ISLAND_COURSE_IDS, {
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
  });
});
