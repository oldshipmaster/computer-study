import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { COURSES, getNextPlayableCourse } from "../lib/course-data.ts";

const sourceFile = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("selects the next incomplete playable course in catalog order", () => {
  assert.equal(getNextPlayableCourse([])?.id, "keyboard-flight");
  assert.equal(getNextPlayableCourse(["keyboard-flight"])?.id, "mouse-precision");
  assert.equal(
    getNextPlayableCourse(["keyboard-flight", "mouse-precision"])?.id,
    "bilingual-input",
  );
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input"])?.id, "desktop-adventure");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure"])?.id, "program-landing");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing"])?.id, "file-home");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing", "file-home"])?.id, "name-your-work");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing", "file-home", "name-your-work"])?.id, "move-and-copy");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing", "file-home", "name-your-work", "move-and-copy"])?.id, "file-types");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing", "file-home", "name-your-work", "move-and-copy", "file-types"])?.id, "learning-backpack");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing", "file-home", "name-your-work", "move-and-copy", "file-types", "learning-backpack"])?.id, "instruction-order");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing", "file-home", "name-your-work", "move-and-copy", "file-types", "learning-backpack", "instruction-order"])?.id, "grid-city-navigation");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing", "file-home", "name-your-work", "move-and-copy", "file-types", "learning-backpack", "instruction-order", "grid-city-navigation"])?.id, "repeat-power");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing", "file-home", "name-your-work", "move-and-copy", "file-types", "learning-backpack", "instruction-order", "grid-city-navigation", "repeat-power"]), undefined);
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
