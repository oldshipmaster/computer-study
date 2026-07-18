import test from "node:test";
import assert from "node:assert/strict";
import { COURSES, ISLANDS } from "../lib/course-data.ts";
import { GAME_ARCADE_DEFINITIONS, buildGameArcadeEntries } from "../lib/game-arcade.ts";

test("defines twenty unique game destinations with child-readable metadata", () => {
  assert.equal(GAME_ARCADE_DEFINITIONS.length, 20);
  assert.equal(new Set(GAME_ARCADE_DEFINITIONS.map((game) => game.id)).size, 20);
  assert.equal(new Set(GAME_ARCADE_DEFINITIONS.map((game) => game.targetId)).size, 20);
  for (const game of GAME_ARCADE_DEFINITIONS) {
    assert.ok(game.title.length >= 4);
    assert.ok(game.mechanic.length >= 4);
    assert.match(game.duration, /分钟|随时/);
  }
});

test("opens only the always-available mission board for a new learner", () => {
  const entries = buildGameArcadeEntries([]);
  assert.deepEqual(entries.filter((entry) => entry.unlocked).map((entry) => entry.id), ["missions"]);
  assert.equal(entries.find((entry) => entry.id === "sprint").progress.maximum, 3);
  assert.equal(entries.find((entry) => entry.id === "boss").progress.maximum, 5);
});

test("unlocks exact-course games only after every required course", () => {
  const partial = buildGameArcadeEntries(["bits-and-data", "instruction-order", "grid-city-navigation", "repeat-power"]);
  assert.equal(partial.find((entry) => entry.id === "circuit").unlocked, false);
  assert.equal(partial.find((entry) => entry.id === "robot").unlocked, false);
  const complete = buildGameArcadeEntries([
    "bits-and-data", "boolean-logic",
    "instruction-order", "grid-city-navigation", "repeat-power", "rainy-condition", "bug-catcher",
    "network-layers", "routing-maze", "reliable-transfer",
    "program-process", "cpu-scheduling", "memory-allocation",
    "linear-search", "binary-search", "bubble-sort", "task-decomposition", "algorithm-efficiency",
    "array-lockers", "linked-treasure", "stack-queue-dock", "tree-library", "graph-routes",
    "password-guardian", "private-information", "popup-fog", "healthy-computer-habits", "light-bit-island",
    "input-process-output", "cpu-memory-storage", "hardware-software", "troubleshoot-machine",
    "file-home", "name-your-work", "move-and-copy", "file-types", "learning-backpack",
    "pixel-art", "document-design", "slide-story", "media-copyright", "data-table",
    "email-message", "online-collaboration", "ai-helper", "verify-ai", "digital-project",
    "events-handlers", "variables-score", "functions-tools", "game-design",
    "keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing",
    "network-journey", "web-address", "search-and-links", "downloads-and-cloud", "network-troubleshooting",
    "file-system-tree", "device-coordination",
    "instruction-cycle", "cache-station",
  ]);
  for (const id of ["circuit", "robot", "packet", "cpu", "algorithm", "structures", "safety", "factory", "files", "creative", "ai-lab", "game-maker", "pilot", "voyage", "os-command", "systems-depth", "championship"]) assert.equal(complete.find((entry) => entry.id === id).unlocked, true, id);
});

test("unlocks sprint from three known unique courses", () => {
  const two = buildGameArcadeEntries([COURSES[0].id, COURSES[1].id, COURSES[1].id, "unknown"]);
  assert.equal(two.find((entry) => entry.id === "sprint").progress.value, 2);
  assert.equal(two.find((entry) => entry.id === "sprint").unlocked, false);
  const three = buildGameArcadeEntries(COURSES.slice(0, 3).map((course) => course.id));
  assert.equal(three.find((entry) => entry.id === "sprint").unlocked, true);
});

test("reports the most-complete island for boss progress and its next course", () => {
  const firstIsland = ISLANDS[0];
  const secondIsland = ISLANDS[1];
  const completed = [...firstIsland.courseIds.slice(0, 2), ...secondIsland.courseIds.slice(0, 4)];
  const boss = buildGameArcadeEntries(completed).find((entry) => entry.id === "boss");
  assert.deepEqual(boss.progress, { value: 4, maximum: 5 });
  assert.equal(boss.nextCourseId, secondIsland.courseIds[4]);
  assert.equal(boss.unlocked, false);
  const unlocked = buildGameArcadeEntries(secondIsland.courseIds).find((entry) => entry.id === "boss");
  assert.equal(unlocked.unlocked, true);
  assert.equal(unlocked.nextCourseId, null);
});

test("keeps progress bounded and recommends a known next prerequisite", () => {
  const entries = buildGameArcadeEntries(["unknown", "unknown", "bits-and-data"]);
  for (const entry of entries) {
    assert.ok(entry.progress.value >= 0 && entry.progress.value <= entry.progress.maximum);
    if (entry.nextCourseId) assert.ok(COURSES.some((course) => course.id === entry.nextCourseId));
  }
  assert.equal(entries.find((entry) => entry.id === "circuit").nextCourseId, "boolean-logic");
});
