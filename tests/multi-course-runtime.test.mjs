import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { COURSES, getNextPlayableCourse } from "../lib/course-data.ts";

const sourceFile = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("selects the next incomplete playable course in the interleaved route", () => {
  const completed = [];
  const expectedFirstRound = ["keyboard-flight", "file-home", "instruction-order", "password-guardian", "input-process-output", "network-journey", "pixel-art", "email-message", "events-handlers"];
  for (const expectedId of expectedFirstRound) {
    assert.equal(getNextPlayableCourse(completed)?.id, expectedId);
    completed.push(expectedId);
  }
  assert.equal(getNextPlayableCourse(completed)?.id, "mouse-precision");
  assert.equal(getNextPlayableCourse(COURSES.map((course) => course.id)), undefined);
});

test("keeps every playable course backed by a lesson definition", async () => {
  const registrySource = await sourceFile("components/lessons/lesson-registry.ts");

  for (const course of COURSES.filter((candidate) => candidate.playable)) {
    assert.match(registrySource, new RegExp(`["']${course.id}["']`));
  }

  assert.match(registrySource, /getLessonDefinition/);
});

test("uses active course state and rejects unknown or unregistered lessons", async () => {
  const appSource = await sourceFile("components/BitIslandApp.tsx");

  assert.match(appSource, /activeCourseId/);
  assert.match(appSource, /getLessonDefinition/);
  assert.match(appSource, /course\?\.playable\s*&&\s*lessonDefinition/);
  assert.doesNotMatch(appSource, /PLAYABLE_COURSE_ID/);
});

test("completed playable course cards remain enabled for replay", async () => {
  const mapSource = await sourceFile("components/IslandMap.tsx");

  assert.match(mapSource, /const available = course\.playable/);
  assert.match(mapSource, /data-course-id=\{course\.id\}/);
  assert.match(mapSource, /disabled=\{!available\}/);
});
