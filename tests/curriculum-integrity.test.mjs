import assert from "node:assert/strict";
import test from "node:test";
import { COURSES, ISLANDS, RECOMMENDED_ROUTE_IDS } from "../lib/course-data.ts";
import { CURRICULUM_GUIDE } from "../lib/curriculum-guide.ts";

test("keeps every complete lesson inside the promised 8 to 10 minute session", () => {
  for (const course of COURSES) {
    assert.ok(course.minutes >= 8 && course.minutes <= 10, `${course.id} has ${course.minutes} minutes`);
    assert.ok(course.title.trim().length >= 4);
    assert.ok(course.summary.trim().length >= 6);
    assert.ok(course.skill.trim().length >= 2);
    assert.equal(course.playable, true);
  }
});

test("owns every unique course exactly once across nine five-course islands", () => {
  assert.equal(new Set(COURSES.map((course) => course.id)).size, 45);
  const islandCourseIds = ISLANDS.flatMap((island) => {
    assert.equal(island.courseIds.length, 5);
    assert.equal(new Set(island.courseIds).size, 5);
    return island.courseIds;
  });
  assert.deepEqual(new Set(islandCourseIds), new Set(COURSES.map((course) => course.id)));
  for (const course of COURSES) assert.equal(ISLANDS.find((island) => island.id === course.islandId)?.courseIds.includes(course.id), true);
});

test("alternates domains throughout all five recommended learning rounds", () => {
  assert.equal(RECOMMENDED_ROUTE_IDS.length, 45);
  const route = RECOMMENDED_ROUTE_IDS.map((id) => COURSES.find((course) => course.id === id));
  assert.ok(route.every(Boolean));
  for (let index = 1; index < route.length; index += 1) assert.notEqual(route[index].islandId, route[index - 1].islandId);
  for (let round = 0; round < 5; round += 1) assert.equal(new Set(route.slice(round * 9, round * 9 + 9).map((course) => course.islandId)).size, 9);
});

test("gives every lesson three objectives and one parent conversation prompt", () => {
  assert.deepEqual(new Set(Object.keys(CURRICULUM_GUIDE)), new Set(COURSES.map((course) => course.id)));
  for (const course of COURSES) {
    const guide = CURRICULUM_GUIDE[course.id];
    assert.equal(guide.objectives.length, 3);
    assert.ok(guide.objectives.every((objective) => objective.length >= 6));
    assert.ok(guide.parentPrompt.length >= 10);
  }
});
