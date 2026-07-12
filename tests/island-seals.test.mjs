import assert from "node:assert/strict";
import test from "node:test";
import { buildIslandSeals } from "../lib/island-seals.ts";
import { COURSES } from "../lib/course-data.ts";

test("builds one locked seal for every island", () => {
  const seals = buildIslandSeals([]);
  assert.equal(seals.length, 9);
  assert.ok(seals.every((seal) => !seal.unlocked && seal.completedCount === 0 && seal.remainingCount === 5));
});

test("unlocks an island only after all five of its courses", () => {
  const firstIsland = COURSES.filter((course) => course.islandId === "launch-harbor").map((course) => course.id);
  assert.equal(buildIslandSeals(firstIsland.slice(0, 4))[0].unlocked, false);
  const seal = buildIslandSeals(firstIsland)[0];
  assert.equal(seal.unlocked, true);
  assert.equal(seal.completedCount, 5);
  assert.equal(seal.remainingCount, 0);
});

test("ignores duplicates and reports all nine seals complete", () => {
  const seals = buildIslandSeals([...COURSES.map((course) => course.id), "keyboard-flight", "unknown"]);
  assert.ok(seals.every((seal) => seal.unlocked));
});
