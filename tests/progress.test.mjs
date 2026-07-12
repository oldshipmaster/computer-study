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
