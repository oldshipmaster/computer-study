import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { FOUNDATION_ROADMAP } from "../lib/advanced-foundations/roadmap.ts";
import { ADVANCED_COURSE_IDS, ADVANCED_ISLAND_IDS } from "../lib/advanced-foundations/course-ids.ts";

test("connects all twenty advanced courses into four child-readable learning threads", () => {
  assert.equal(FOUNDATION_ROADMAP.length, 4);
  assert.deepEqual(FOUNDATION_ROADMAP.map((thread) => thread.islandId), ADVANCED_ISLAND_IDS);
  assert.deepEqual(FOUNDATION_ROADMAP.flatMap((thread) => thread.steps.map((step) => step.courseId)), ADVANCED_COURSE_IDS);
  for (const thread of FOUNDATION_ROADMAP) {
    assert.equal(thread.steps.length, 5);
    assert.ok(thread.bigQuestion.length >= 10);
    assert.ok(thread.steps.every((step) => step.connection.length >= 8));
  }
});

test("renders roadmap progress with replayable course controls", async () => {
  const [component, map] = await Promise.all([
    readFile(new URL("../components/FoundationRoadmap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/IslandMap.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(component, /FOUNDATION_ROADMAP/);
  assert.match(component, /foundation-roadmap-step--complete/);
  assert.match(component, /onStartCourse\(step\.courseId\)/);
  assert.match(component, /为什么要学这条线/);
  assert.match(map, /<FoundationRoadmap/);
});
