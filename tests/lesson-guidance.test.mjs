import assert from "node:assert/strict";
import test from "node:test";
import {
  getPracticeAction,
  getProgramHintTarget,
  isNewTutorialKey,
  nextPracticeKey,
  shouldCaptureLessonKey,
} from "../components/keyboard-flight/lesson-model.ts";

test("preserves native Space activation on focused controls", () => {
  assert.equal(shouldCaptureLessonKey(" ", true), false);
  assert.equal(shouldCaptureLessonKey(" ", false), true);
  assert.equal(shouldCaptureLessonKey("ArrowRight", true), true);
});

test("counts only lesson input that makes progress as useful", () => {
  assert.equal(isNewTutorialKey(new Set(["ArrowUp"]), "ArrowUp"), false);
  assert.equal(isNewTutorialKey(new Set(["ArrowUp"]), "ArrowLeft"), true);
  assert.equal(getPracticeAction({ x: 0, y: 2 }, " ").progressed, false);
  assert.equal(getPracticeAction({ x: 2, y: 1 }, " ").progressed, true);
  assert.equal(getPracticeAction({ x: 2, y: 2 }, "ArrowRight").progressed, false);
});

test("routes practice hints around the asteroid", () => {
  assert.equal(nextPracticeKey({ x: 3, y: 3 }), "ArrowLeft");
});

test("points program hints at the control that can correct the queue", () => {
  assert.deepEqual(getProgramHintTarget([], true), {
    instruction: "forward",
    queueIndex: null,
    run: false,
  });
  assert.deepEqual(getProgramHintTarget(["right"], true), {
    instruction: null,
    queueIndex: 0,
    run: false,
  });
  assert.deepEqual(
    getProgramHintTarget(["forward", "forward", "left", "forward", "collect"], true),
    { instruction: null, queueIndex: null, run: true },
  );
  assert.deepEqual(
    getProgramHintTarget(
      ["forward", "forward", "left", "forward", "collect", "right"],
      true,
    ),
    { instruction: null, queueIndex: 5, run: false },
  );
});
