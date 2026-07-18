import assert from "node:assert/strict";
import test from "node:test";
import { createProgressBackup, parseProgressBackup } from "../lib/progress-backup.ts";
import { DEFAULT_PROGRESS } from "../lib/progress.mjs";

test("exports a versioned backup without personal fields", () => {
  const text = createProgressBackup({ ...DEFAULT_PROGRESS, completedCourseIds: ["keyboard-flight"], badgeIds: ["keyboard-pilot"], coursePlayCounts: { "keyboard-flight": 2 }, knowledgeSprint: { bestScore: 625, runsPlayed: 9 }, resume: { courseId: "data-table", stage: 4 }, name: "不应导出", email: "child@example.test", answers: ["不应导出"] }, "2026-07-12T00:00:00.000Z");
  const data = JSON.parse(text);
  assert.equal(data.kind, "bit-island-progress-backup");
  assert.equal(data.exportedAt, "2026-07-12T00:00:00.000Z");
  assert.equal(data.progress.completedCourseIds[0], "keyboard-flight");
  assert.deepEqual(data.progress.resume, { courseId: "data-table", stage: 4 });
  assert.deepEqual(data.progress.confidenceByCourse, {});
  assert.deepEqual(data.progress.coursePlayCounts, { "keyboard-flight": 2 });
  assert.deepEqual(data.progress.knowledgeSprint, { bestScore: 625, runsPlayed: 9 });
  assert.equal("name" in data, false);
  assert.equal("name" in data.progress, false);
  assert.equal("email" in data.progress, false);
  assert.equal("answers" in data.progress, false);
  assert.equal(text.includes("不应导出"), false);
});

test("restores only bounded knowledge sprint summary numbers", () => {
  const valid = parseProgressBackup(JSON.stringify({
    kind: "bit-island-progress-backup",
    version: 1,
    progress: { ...DEFAULT_PROGRESS, knowledgeSprint: { bestScore: 750, runsPlayed: 10_000, answers: ["不应保留"] } },
  }));
  assert.equal(valid.ok, true);
  assert.deepEqual(valid.progress.knowledgeSprint, { bestScore: 750, runsPlayed: 10_000 });

  const invalid = parseProgressBackup(JSON.stringify({
    kind: "bit-island-progress-backup",
    version: 1,
    progress: { ...DEFAULT_PROGRESS, knowledgeSprint: { bestScore: 999, runsPlayed: -3 } },
  }));
  assert.equal(invalid.ok, true);
  assert.deepEqual(invalid.progress.knowledgeSprint, { bestScore: 0, runsPlayed: 0 });
});

test("restores play counts only for completed known courses", () => {
  const result = parseProgressBackup(JSON.stringify({
    kind: "bit-island-progress-backup",
    version: 1,
    progress: {
      ...DEFAULT_PROGRESS,
      completedCourseIds: ["keyboard-flight", "file-home", "unknown"],
      coursePlayCounts: {
        "keyboard-flight": 3,
        "file-home": 4,
        "instruction-order": 2,
        unknown: 2,
      },
    },
  }));

  assert.equal(result.ok, true);
  assert.deepEqual(result.progress.coursePlayCounts, {
    "keyboard-flight": 3,
    "file-home": 1,
  });
});

test("restores confidence only for completed known courses and allowed choices", () => {
  const result = parseProgressBackup(JSON.stringify({ kind: "bit-island-progress-backup", version: 1, progress: { ...DEFAULT_PROGRESS, completedCourseIds: ["keyboard-flight"], confidenceByCourse: { "keyboard-flight": "help", unknown: "practice", "file-home": "practice", "data-table": "free text" } } }));
  assert.equal(result.ok, true);
  assert.deepEqual(result.progress.confidenceByCourse, { "keyboard-flight": "help" });
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

test("drops a stale resume for an already completed course", () => {
  const result = parseProgressBackup(JSON.stringify({ kind: "bit-island-progress-backup", version: 1, progress: { ...DEFAULT_PROGRESS, completedCourseIds: ["keyboard-flight"], resume: { courseId: "keyboard-flight", stage: 2 } } }));
  assert.equal(result.ok, true);
  assert.equal(result.progress.resume, null);
});
