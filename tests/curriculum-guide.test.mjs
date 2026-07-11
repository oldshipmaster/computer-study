import assert from "node:assert/strict";
import test from "node:test";
import { COURSES } from "../lib/course-data.ts";
import { CURRICULUM_GUIDE, getNextCourseGuide } from "../lib/curriculum-guide.ts";

test("provides parent guidance for every course", () => {
  assert.deepEqual(Object.keys(CURRICULUM_GUIDE).sort(), COURSES.map((course) => course.id).sort());
  for (const course of COURSES) {
    const guide = CURRICULUM_GUIDE[course.id];
    assert.equal(guide.objectives.length, 3);
    assert.ok(guide.parentPrompt.length >= 8);
  }
});

test("selects guidance for the next unfinished course", () => {
  assert.equal(getNextCourseGuide([])?.course.id, "keyboard-flight");
  assert.equal(getNextCourseGuide(["keyboard-flight"])?.course.id, "mouse-precision");
  assert.equal(getNextCourseGuide(COURSES.map((course) => course.id)), undefined);
});
