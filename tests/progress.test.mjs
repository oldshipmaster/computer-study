import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_PROGRESS,
  completeCourse,
  parseProgress,
  serializeProgress,
} from "../lib/progress.mjs";

test("falls back safely for empty or malformed storage", () => {
  assert.deepEqual(parseProgress(null), DEFAULT_PROGRESS);
  assert.deepEqual(parseProgress("not json"), DEFAULT_PROGRESS);
  assert.deepEqual(parseProgress('{"version":99}'), DEFAULT_PROGRESS);
});

test("deduplicates completion and badge rewards", () => {
  const once = completeCourse(DEFAULT_PROGRESS, "keyboard-flight", "keyboard-pilot");
  const twice = completeCourse(once, "keyboard-flight", "keyboard-pilot");
  assert.deepEqual(twice.completedCourseIds, ["keyboard-flight"]);
  assert.deepEqual(twice.badgeIds, ["keyboard-pilot"]);
  assert.equal(twice.resume, null);
  assert.deepEqual(parseProgress(serializeProgress(twice)), twice);
});
