import assert from "node:assert/strict";
import test from "node:test";
import {
  INITIAL_MOUSE_STATE,
  advanceMouseSequence,
  isUsefulMouseAction,
  normalizeMouseResumeStage,
} from "../lib/mouse-lesson.ts";

test("advances only through the ordered mouse skills", () => {
  let state = INITIAL_MOUSE_STATE;
  state = advanceMouseSequence(state, { type: "continue" });
  assert.equal(state.stage, "move");
  state = advanceMouseSequence(state, { type: "moveTarget", targetId: "light-1" });
  state = advanceMouseSequence(state, { type: "moveTarget", targetId: "light-2" });
  state = advanceMouseSequence(state, { type: "moveTarget", targetId: "light-3" });
  assert.equal(state.stage, "click");
});

test("wrong targets preserve progress and a single click cannot satisfy double click", () => {
  const clickState = { ...INITIAL_MOUSE_STATE, stage: "click" };
  assert.deepEqual(
    advanceMouseSequence(clickState, { type: "clickTarget", targetId: "wrong" }),
    { ...clickState, wrongAttempts: 1 },
  );
  const doubleState = { ...INITIAL_MOUSE_STATE, stage: "doubleClick" };
  assert.equal(
    advanceMouseSequence(doubleState, { type: "clickTarget", targetId: "blue-hatch" }).stage,
    "doubleClick",
  );
});

test("dragging requires the matching bay and challenge completes exactly once", () => {
  let state = { ...INITIAL_MOUSE_STATE, stage: "drag" };
  state = advanceMouseSequence(state, { type: "dropCrate", crateId: "red", bayId: "blue" });
  assert.deepEqual(state.draggedCrates, []);
  for (const id of ["red", "blue", "green"]) {
    state = advanceMouseSequence(state, { type: "dropCrate", crateId: id, bayId: id });
  }
  assert.equal(state.stage, "challenge");

  for (const skill of ["move", "click", "doubleClick", "drag"]) {
    state = advanceMouseSequence(state, { type: "challengeSkill", skill });
  }
  assert.equal(state.complete, true);
  assert.equal(advanceMouseSequence(state, { type: "challengeSkill", skill: "drag" }), state);
});

test("classifies measurable progress and clamps resume before rewards", () => {
  const moved = advanceMouseSequence(INITIAL_MOUSE_STATE, { type: "continue" });
  assert.equal(isUsefulMouseAction(INITIAL_MOUSE_STATE, moved), true);
  assert.equal(isUsefulMouseAction(moved, { ...moved, wrongAttempts: 2 }), false);
  assert.equal(normalizeMouseResumeStage(0), "intro");
  assert.equal(normalizeMouseResumeStage(99), "challenge");
});
