import assert from "node:assert/strict";
import test from "node:test";
import * as progressModule from "../lib/progress.mjs";

const {
  DEFAULT_PROGRESS,
  completeCourse,
  parseProgress,
  resetProgress,
  setCourseConfidence,
  serializeProgress,
  storeProgress,
} = progressModule;

test("falls back safely for empty or malformed storage", () => {
  assert.deepEqual(parseProgress(null), DEFAULT_PROGRESS);
  assert.deepEqual(parseProgress("not json"), DEFAULT_PROGRESS);
  assert.deepEqual(parseProgress('{"version":99}'), DEFAULT_PROGRESS);
});

test("bounds malformed local collections before rendering them", () => {
  const manyIds = Array.from({ length: 150 }, (_, index) => `course-${index}`);
  const manyConfidence = Object.fromEntries(manyIds.map((id) => [id, "practice"]));
  const parsed = parseProgress(JSON.stringify({ ...DEFAULT_PROGRESS, completedCourseIds: [...manyIds, "x".repeat(65)], badgeIds: manyIds, confidenceByCourse: manyConfidence }));
  assert.equal(parsed.completedCourseIds.length, 100);
  assert.equal(parsed.badgeIds.length, 100);
  assert.equal(Object.keys(parsed.confidenceByCourse).length, 100);
  assert.equal(parsed.completedCourseIds.includes("x".repeat(65)), false);
});

test("stores one changeable confidence signal without free text", () => {
  const completed = completeCourse(DEFAULT_PROGRESS, "keyboard-flight", "keyboard-pilot");
  const first = setCourseConfidence(completed, "keyboard-flight", "practice");
  const changed = setCourseConfidence(first, "keyboard-flight", "confident");
  assert.deepEqual(changed.confidenceByCourse, { "keyboard-flight": "confident" });
  assert.equal(setCourseConfidence(changed, "keyboard-flight", "anything-else"), changed);
  assert.equal(setCourseConfidence(changed, "file-home", "practice"), changed);
  assert.deepEqual(parseProgress(serializeProgress(changed)), changed);
});

test("deduplicates completion and badge rewards", () => {
  const once = completeCourse(DEFAULT_PROGRESS, "keyboard-flight", "keyboard-pilot");
  const twice = completeCourse(once, "keyboard-flight", "keyboard-pilot");
  assert.deepEqual(twice.completedCourseIds, ["keyboard-flight"]);
  assert.deepEqual(twice.badgeIds, ["keyboard-pilot"]);
  assert.equal(twice.resume, null);
  assert.deepEqual(parseProgress(serializeProgress(twice)), twice);
});

test("migrates legacy completions and caps rewarded course play counts", () => {
  const legacy = parseProgress(JSON.stringify({
    ...DEFAULT_PROGRESS,
    completedCourseIds: ["keyboard-flight"],
  }));
  assert.deepEqual(legacy.coursePlayCounts, { "keyboard-flight": 1 });

  const once = completeCourse(DEFAULT_PROGRESS, "keyboard-flight", "keyboard-pilot");
  const twice = completeCourse(once, "keyboard-flight", "keyboard-pilot");
  const threeTimes = completeCourse(twice, "keyboard-flight", "keyboard-pilot");
  const fourTimes = completeCourse(threeTimes, "keyboard-flight", "keyboard-pilot");

  assert.equal(once.coursePlayCounts["keyboard-flight"], 1);
  assert.equal(twice.coursePlayCounts["keyboard-flight"], 2);
  assert.equal(threeTimes.coursePlayCounts["keyboard-flight"], 3);
  assert.equal(fourTimes.coursePlayCounts["keyboard-flight"], 3);
  assert.deepEqual(resetProgress(fourTimes).coursePlayCounts, {});
});

test("drops malformed play counts and keeps only completed courses", () => {
  const parsed = parseProgress(JSON.stringify({
    ...DEFAULT_PROGRESS,
    completedCourseIds: ["keyboard-flight", "file-home"],
    coursePlayCounts: {
      "keyboard-flight": 2,
      "file-home": 4,
      "instruction-order": 1,
      fractional: 1.5,
      text: "3",
      ["x".repeat(65)]: 1,
    },
  }));

  assert.deepEqual(parsed.coursePlayCounts, {
    "keyboard-flight": 2,
    "file-home": 1,
  });
});

test("reset keeps settings and can retry storage after an earlier write failure", () => {
  assert.equal(typeof resetProgress, "function");
  assert.equal(typeof storeProgress, "function");

  const completed = {
    ...completeCourse(DEFAULT_PROGRESS, "keyboard-flight", "keyboard-pilot"),
    settings: {
      sound: false,
      reducedMotion: true,
    },
    resume: {
      courseId: "keyboard-flight",
      stage: 3,
    },
  };
  const reset = resetProgress(completed);

  assert.deepEqual(reset, {
    ...DEFAULT_PROGRESS,
    settings: completed.settings,
  });

  let attempts = 0;
  let storedValue = null;
  const recoveringStorage = {
    setItem(key, value) {
      attempts += 1;
      assert.equal(key, "bit-island-progress-v1");
      if (attempts === 1) {
        throw new Error("storage is temporarily unavailable");
      }
      storedValue = value;
    },
  };

  assert.throws(
    () => storeProgress(recoveringStorage, "bit-island-progress-v1", completed),
    /temporarily unavailable/,
  );
  assert.doesNotThrow(() =>
    storeProgress(recoveringStorage, "bit-island-progress-v1", reset),
  );
  assert.equal(attempts, 2);
  assert.deepEqual(parseProgress(storedValue), reset);
});
