import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import * as lessonModel from "../components/keyboard-flight/lesson-model.ts";

const {
  getPracticeAction,
  getProgramHintTarget,
  isNewTutorialKey,
  nextPracticeKey,
  shouldCaptureLessonKey,
} = lessonModel;

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
    { instruction: null, queueIndex: null, run: true },
  );
  assert.deepEqual(
    getProgramHintTarget(
      ["left", "forward", "right", "forward", "forward", "collect"],
      true,
    ),
    { instruction: null, queueIndex: null, run: true },
  );
});

test("resets program hint timing only for a new high-water progress score", () => {
  assert.equal(typeof lessonModel.getProgramProgressScore, "function");
  assert.equal(typeof lessonModel.hasProgramMadeProgress, "function");

  const emptyScore = lessonModel.getProgramProgressScore([]);
  assert.equal(lessonModel.hasProgramMadeProgress(["left"], emptyScore), false);
  assert.equal(lessonModel.hasProgramMadeProgress(["left", "left"], emptyScore), false);
  assert.equal(lessonModel.hasProgramMadeProgress(["forward"], emptyScore), true);

  const bestScore = lessonModel.getProgramProgressScore(["forward"]);
  assert.equal(lessonModel.hasProgramMadeProgress(["left"], bestScore), false);
  assert.equal(lessonModel.hasProgramMadeProgress(["forward"], bestScore), false);
  assert.equal(
    lessonModel.hasProgramMadeProgress(["forward", "forward"], bestScore),
    true,
  );
});

test("normalizes resume values to playable non-reward stages", () => {
  assert.equal(typeof lessonModel.normalizeInitialLessonStage, "function");
  assert.equal(lessonModel.normalizeInitialLessonStage(-1), 0);
  assert.equal(lessonModel.normalizeInitialLessonStage(1.5), 0);
  assert.equal(lessonModel.normalizeInitialLessonStage(3), 3);
  assert.equal(lessonModel.normalizeInitialLessonStage(4), 3);
  assert.equal(lessonModel.normalizeInitialLessonStage(99), 3);
});

test("preserves queue item identities while reordering", () => {
  assert.equal(typeof lessonModel.moveProgramQueueItem, "function");

  const first = { id: 1, instruction: "forward" };
  const second = { id: 2, instruction: "left" };
  const moved = lessonModel.moveProgramQueueItem([first, second], 0, 1);

  assert.deepEqual(moved.map((item) => item.id), [2, 1]);
  assert.equal(moved[1], first);
  assert.equal(moved[0], second);
});

test("keys rendered program blocks by stable item identity", () => {
  const source = readFileSync(
    new URL("../components/keyboard-flight/ProgramStage.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /key=\{item\.id\}/);
  assert.doesNotMatch(source, /key=\{`\$\{instruction\}-\$\{index\}`\}/);
});
