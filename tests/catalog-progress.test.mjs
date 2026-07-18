import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeCatalogProgress } from "../lib/catalog-progress.ts";
import { DEFAULT_PROGRESS } from "../lib/progress.mjs";

test("removes unknown and duplicate completed course ids", () => {
  const result = sanitizeCatalogProgress({ ...DEFAULT_PROGRESS, completedCourseIds: ["keyboard-flight", "unknown", "keyboard-flight"] });
  assert.deepEqual(result.completedCourseIds, ["keyboard-flight"]);
});

test("keeps a valid resume and drops unknown or out-of-range stages", () => {
  assert.deepEqual(sanitizeCatalogProgress({ ...DEFAULT_PROGRESS, resume: { courseId: "file-home", stage: 5 } }).resume, { courseId: "file-home", stage: 5 });
  assert.equal(sanitizeCatalogProgress({ ...DEFAULT_PROGRESS, resume: { courseId: "unknown", stage: 2 } }).resume, null);
  assert.equal(sanitizeCatalogProgress({ ...DEFAULT_PROGRESS, resume: { courseId: "file-home", stage: 6 } }).resume, null);
  assert.equal(sanitizeCatalogProgress({ ...DEFAULT_PROGRESS, completedCourseIds: ["file-home"], resume: { courseId: "file-home", stage: 2 } }).resume, null);
});

test("does not mutate settings, badges, or the original record", () => {
  const source = { ...DEFAULT_PROGRESS, badgeIds: ["badge"], settings: { sound: false, reducedMotion: true }, completedCourseIds: ["keyboard-flight"] };
  const result = sanitizeCatalogProgress(source);
  assert.notEqual(result, source);
  assert.deepEqual(result.badgeIds, ["badge"]);
  assert.deepEqual(result.settings, source.settings);
  assert.deepEqual(source.completedCourseIds, ["keyboard-flight"]);
});

test("keeps confidence only for completed catalog courses", () => {
  const progress = {
    ...DEFAULT_PROGRESS,
    completedCourseIds: ["keyboard-flight"],
    confidenceByCourse: { "keyboard-flight": "confident", "file-home": "practice", unknown: "help" },
  };
  const sanitized = sanitizeCatalogProgress(progress);
  assert.deepEqual(sanitized.confidenceByCourse, { "keyboard-flight": "confident" });
});

test("keeps bounded play counts only for completed catalog courses", () => {
  const progress = {
    ...DEFAULT_PROGRESS,
    completedCourseIds: ["keyboard-flight", "file-home", "unknown"],
    coursePlayCounts: {
      "keyboard-flight": 3,
      "file-home": 4,
      "instruction-order": 2,
      unknown: 2,
    },
  };

  const sanitized = sanitizeCatalogProgress(progress);
  assert.deepEqual(sanitized.coursePlayCounts, {
    "keyboard-flight": 3,
    "file-home": 1,
  });
});

test("copies only bounded knowledge sprint summary numbers", () => {
  const valid = sanitizeCatalogProgress({
    ...DEFAULT_PROGRESS,
    knowledgeSprint: { bestScore: 700, runsPlayed: 42, answers: ["不应保留"] },
  });
  assert.deepEqual(valid.knowledgeSprint, { bestScore: 700, runsPlayed: 42 });

  const invalid = sanitizeCatalogProgress({
    ...DEFAULT_PROGRESS,
    knowledgeSprint: { bestScore: 751, runsPlayed: -1 },
  });
  assert.deepEqual(invalid.knowledgeSprint, { bestScore: 0, runsPlayed: 0 });
});
