import assert from "node:assert/strict";
import test from "node:test";

import {
  ALGORITHM_ARENA_MISSIONS,
  advanceAlgorithmMission,
  advanceAlgorithmStep,
  buildAlgorithmArenaDeck,
  chooseAlgorithmAction,
  createAlgorithmArenaState,
} from "../lib/algorithm-arena-game.ts";

test("defines six visual missions spanning the five algorithm abilities", () => {
  assert.equal(ALGORITHM_ARENA_MISSIONS.length, 6);
  assert.equal(new Set(ALGORITHM_ARENA_MISSIONS.map((mission) => mission.id)).size, 6);
  assert.deepEqual(
    new Set(ALGORITHM_ARENA_MISSIONS.map((mission) => mission.mode)),
    new Set(["linear", "binary", "sort", "dependency", "efficiency", "relay"]),
  );
  for (const mission of ALGORITHM_ARENA_MISSIONS) {
    assert.ok(mission.steps.length >= 2);
    assert.ok(mission.steps.every((step) => step.options.length >= 2));
    assert.ok(mission.steps.every((step) => step.options.some((option) => option.id === step.answerId)));
    assert.ok(mission.steps.every((step) => step.visual.items.length > 0));
  }
});

test("keeps the current step and evidence after a wrong action", () => {
  const mission = ALGORITHM_ARENA_MISSIONS[0];
  const state = createAlgorithmArenaState(6);
  const wrong = mission.steps[0].options.find((option) => option.id !== mission.steps[0].answerId).id;
  const next = chooseAlgorithmAction(state, mission, wrong, 1);
  assert.equal(next.stepIndex, 0);
  assert.equal(next.phase, "playing");
  assert.deepEqual(next.evidence, []);
  assert.match(next.feedback, /观察|还不能|顺序/);
});

test("records correct evidence and waits before showing the next step", () => {
  const mission = ALGORITHM_ARENA_MISSIONS[0];
  const state = createAlgorithmArenaState(6);
  const solved = chooseAlgorithmAction(state, mission, mission.steps[0].answerId, 1);
  assert.equal(solved.phase, "step-solved");
  assert.equal(solved.stepIndex, 0);
  assert.deepEqual(solved.evidence, [mission.steps[0].evidence]);
  const advanced = advanceAlgorithmStep(solved, mission, 1);
  assert.equal(advanced.phase, "playing");
  assert.equal(advanced.stepIndex, 1);
});

test("ignores double activations, unknown actions, and out-of-phase input", () => {
  const mission = ALGORITHM_ARENA_MISSIONS[0];
  const state = createAlgorithmArenaState(6);
  assert.deepEqual(chooseAlgorithmAction(state, mission, mission.steps[0].answerId, 2), state);
  assert.deepEqual(chooseAlgorithmAction(state, mission, "unknown-action", 1), state);
  assert.deepEqual(advanceAlgorithmStep(state, mission, 1), state);
});

test("finishes every mission and then remains stable", () => {
  const deck = buildAlgorithmArenaDeck(0);
  let state = createAlgorithmArenaState(deck.length);
  for (const mission of deck) {
    for (const step of mission.steps) {
      state = chooseAlgorithmAction(state, mission, step.answerId, 1);
      if (state.phase === "step-solved") state = advanceAlgorithmStep(state, mission, 1);
    }
    assert.equal(state.phase, "mission-solved");
    state = advanceAlgorithmMission(state, 1);
  }
  assert.equal(state.phase, "complete");
  assert.equal(state.solved, 6);
  assert.deepEqual(advanceAlgorithmMission(state, 1), state);
  assert.deepEqual(chooseAlgorithmAction(state, deck[5], deck[5].steps[0].answerId, 1), state);
});

test("rotates replay order without losing or duplicating missions", () => {
  const first = buildAlgorithmArenaDeck(0);
  const rotated = buildAlgorithmArenaDeck(1);
  assert.notEqual(first[0].id, rotated[0].id);
  assert.deepEqual(new Set(rotated.map((mission) => mission.id)), new Set(first.map((mission) => mission.id)));
  assert.deepEqual(buildAlgorithmArenaDeck(Number.NaN).map((mission) => mission.id), first.map((mission) => mission.id));
});
