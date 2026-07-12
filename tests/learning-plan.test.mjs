import assert from "node:assert/strict";
import test from "node:test";
import { buildLearningPlan } from "../lib/learning-plan.ts";
import { COURSES } from "../lib/course-data.ts";

test("builds five interleaved sessions without mutating progress", () => {
  const completed = ["keyboard-flight"];
  const snapshot = [...completed];
  const plan = buildLearningPlan(completed);
  assert.deepEqual(completed, snapshot);
  assert.deepEqual(plan.sessions.map((session) => session.course.id), ["file-home", "instruction-order", "password-guardian", "input-process-output", "network-journey"]);
  assert.deepEqual(plan.sessions.map((session) => session.sessionNumber), [1, 2, 3, 4, 5]);
  assert.equal(plan.totalMinutes, 45);
});

test("shortens the plan near completion and reports celebration", () => {
  const remaining = ["verify-ai", "digital-project"];
  const completed = COURSES.filter((course) => !remaining.includes(course.id)).map((course) => course.id);
  const plan = buildLearningPlan(completed);
  assert.deepEqual(plan.sessions.map((session) => session.course.id), remaining);
  assert.equal(plan.complete, false);
  assert.equal(plan.totalMinutes, 19);
  assert.equal(buildLearningPlan(COURSES.map((course) => course.id)).complete, true);
});

test("ignores duplicate and unknown completion ids", () => {
  const plan = buildLearningPlan(["keyboard-flight", "keyboard-flight", "unknown"]);
  assert.equal(plan.sessions[0].course.id, "file-home");
});

test("puts a valid free-choice resume first without duplicating it", () => {
  const plan = buildLearningPlan([], 5, { courseId: "data-table", stage: 4 });
  assert.equal(plan.sessions[0].course.id, "data-table");
  assert.equal(plan.sessions.filter((item) => item.course.id === "data-table").length, 1);
  assert.equal(plan.sessions[1].course.id, "keyboard-flight");
  assert.equal(buildLearningPlan(["data-table"], 5, { courseId: "data-table", stage: 4 }).sessions[0].course.id, "keyboard-flight");
  assert.equal(buildLearningPlan([], 5, { courseId: "unknown", stage: 2 }).sessions[0].course.id, "keyboard-flight");
});
