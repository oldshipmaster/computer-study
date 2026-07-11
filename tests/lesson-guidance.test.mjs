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

test("claims a successful lesson award exactly once before the visual delay", () => {
  assert.equal(typeof lessonModel.claimCompletionAward, "function");

  const completionGate = { current: false };
  const awards = [];
  const award = () => awards.push("keyboard-pilot");

  assert.equal(lessonModel.claimCompletionAward(completionGate, award), true);
  assert.equal(lessonModel.claimCompletionAward(completionGate, award), false);
  assert.deepEqual(awards, ["keyboard-pilot"]);

  const source = readFileSync(
    new URL("../components/keyboard-flight/useFlightProgram.ts", import.meta.url),
    "utf8",
  );
  const lessonHookSource = readFileSync(
    new URL("../components/keyboard-flight/useKeyboardFlightLesson.ts", import.meta.url),
    "utf8",
  );
  const appSource = readFileSync(
    new URL("../components/BitIslandApp.tsx", import.meta.url),
    "utf8",
  );
  const successBranchStart = source.indexOf("if (result.success)");
  const awardCall = source.indexOf("claimCompletionAward", successBranchStart);
  const visualDelay = source.indexOf(
    "await wait(reducedMotion ? 0 : 650)",
    successBranchStart,
  );
  const delayedTransition = source.indexOf("onSuccessTransition()", visualDelay);

  assert.ok(successBranchStart >= 0, "missing successful-program branch");
  assert.ok(
    awardCall > successBranchStart && awardCall < visualDelay,
    "the completion award must be claimed before the cancellable visual delay",
  );
  assert.ok(
    delayedTransition > visualDelay,
    "the completion-screen transition must remain after the visual delay",
  );
  assert.match(lessonHookSource, /onSuccess:\s*awardCompletion/);
  assert.match(lessonHookSource, /onSuccessTransition:\s*completeProgram/);
  assert.match(
    lessonHookSource,
    /if \(nextStage !== "complete"\) \{\s*onStageChange/,
  );

  const awardStart = appSource.indexOf("const awardCourse");
  const awardEnd = appSource.indexOf("\n  }, []);", awardStart);
  const awardSource = appSource.slice(awardStart, awardEnd);
  const transitionStart = appSource.indexOf("const finishCourse");
  const transitionEnd = appSource.indexOf("\n  }, []);", transitionStart);
  const transitionSource = appSource.slice(transitionStart, transitionEnd);

  assert.match(awardSource, /completeCourse/);
  assert.doesNotMatch(awardSource, /setScreen/);
  assert.match(transitionSource, /setScreen\("complete"\)/);
});
