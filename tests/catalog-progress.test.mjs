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
