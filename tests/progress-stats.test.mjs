import assert from "node:assert/strict";
import test from "node:test";
import { buildProgressStats } from "../lib/progress-stats.ts";
import { COURSES } from "../lib/course-data.ts";

test("reports a zero-state and the full curriculum totals", () => {
  const empty = buildProgressStats([]);
  assert.equal(empty.completedCourses, 0);
  assert.equal(empty.percent, 0);
  assert.equal(empty.completedMinutes, 0);
  assert.equal(empty.completedIslands, 0);
  assert.equal(empty.remainingRounds, 13);
  const full = buildProgressStats(COURSES.map((course) => course.id));
  assert.equal(full.completedCourses, 65);
  assert.equal(full.percent, 100);
  assert.equal(full.remainingMinutes, 0);
  assert.equal(full.completedIslands, 13);
  assert.equal(full.remainingRounds, 0);
});

test("counts valid unique courses and exact minutes only", () => {
  const stats = buildProgressStats(["keyboard-flight", "digital-project", "keyboard-flight", "unknown"]);
  assert.equal(stats.completedCourses, 2);
  assert.equal(stats.completedMinutes, 19);
  assert.equal(stats.remainingCourses, 63);
  assert.equal(stats.remainingRounds, 13);
});
