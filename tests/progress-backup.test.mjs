import assert from "node:assert/strict";
import test from "node:test";
import { createProgressBackup, parseProgressBackup } from "../lib/progress-backup.ts";
import { DEFAULT_PROGRESS } from "../lib/progress.mjs";

test("exports a versioned backup without personal fields", () => {
  const text = createProgressBackup({ ...DEFAULT_PROGRESS, completedCourseIds: ["keyboard-flight"], badgeIds: ["keyboard-pilot"] }, "2026-07-12T00:00:00.000Z");
  const data = JSON.parse(text);
  assert.equal(data.kind, "bit-island-progress-backup");
  assert.equal(data.exportedAt, "2026-07-12T00:00:00.000Z");
  assert.equal(data.progress.completedCourseIds[0], "keyboard-flight");
  assert.equal("name" in data, false);
});

test("restores known progress while removing unknown course ids and unsafe resume", () => {
  const result = parseProgressBackup(JSON.stringify({ kind: "bit-island-progress-backup", version: 1, progress: { ...DEFAULT_PROGRESS, completedCourseIds: ["keyboard-flight", "unknown", "keyboard-flight"], badgeIds: ["keyboard-pilot", 3], resume: { courseId: "unknown", stage: 999 } } }));
  assert.equal(result.ok, true);
  assert.deepEqual(result.progress.completedCourseIds, ["keyboard-flight"]);
  assert.deepEqual(result.progress.badgeIds, ["keyboard-pilot"]);
  assert.equal(result.progress.resume, null);
});

test("rejects malformed, unrelated, and future backup files", () => {
  for (const input of ["not json", "{}", JSON.stringify({ kind: "other", version: 1, progress: DEFAULT_PROGRESS }), JSON.stringify({ kind: "bit-island-progress-backup", version: 2, progress: DEFAULT_PROGRESS })]) {
    assert.equal(parseProgressBackup(input).ok, false);
  }
});
