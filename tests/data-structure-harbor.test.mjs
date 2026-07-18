import assert from "node:assert/strict";
import test from "node:test";

import {
  DATA_STRUCTURE_HARBOR_MISSIONS,
  advanceHarborMission,
  advanceHarborStep,
  buildHarborDeck,
  chooseHarborAction,
  createHarborState,
} from "../lib/data-structure-harbor.ts";

test("defines six unique playable structure missions", () => {
  assert.equal(DATA_STRUCTURE_HARBOR_MISSIONS.length, 6);
  assert.deepEqual(new Set(DATA_STRUCTURE_HARBOR_MISSIONS.map((mission) => mission.mode)), new Set(["array", "linked", "stack", "queue", "tree", "graph"]));
  assert.equal(new Set(DATA_STRUCTURE_HARBOR_MISSIONS.map((mission) => mission.id)).size, 6);
  for (const mission of DATA_STRUCTURE_HARBOR_MISSIONS) {
    assert.ok(mission.steps.length >= 2);
    assert.ok(mission.steps.every((step) => step.options.length >= 2));
    assert.ok(mission.steps.every((step) => step.options.some((candidate) => candidate.id === step.answerId)));
    assert.ok(mission.steps.every((step) => step.visual.items.length > 0));
  }
});

test("preserves the structure and current evidence after a wrong action", () => {
  const mission = DATA_STRUCTURE_HARBOR_MISSIONS[2];
  const state = createHarborState(6);
  const wrong = mission.steps[0].options.find((candidate) => candidate.id !== mission.steps[0].answerId).id;
  const result = chooseHarborAction(state, mission, wrong, 1);
  assert.equal(result.stepIndex, 0);
  assert.equal(result.phase, "playing");
  assert.deepEqual(result.evidence, []);
  assert.match(result.feedback, /观察|只能|顺序|关系/);
});

test("records exact structure evidence before advancing", () => {
  const mission = DATA_STRUCTURE_HARBOR_MISSIONS[1];
  const state = createHarborState(6);
  const result = chooseHarborAction(state, mission, mission.steps[0].answerId, 1);
  assert.equal(result.phase, "step-solved");
  assert.deepEqual(result.evidence, [mission.steps[0].evidence]);
  const advanced = advanceHarborStep(result, mission, 1);
  assert.equal(advanced.stepIndex, 1);
  assert.equal(advanced.phase, "playing");
});

test("ignores duplicate activation, unknown actions, and premature continue", () => {
  const mission = DATA_STRUCTURE_HARBOR_MISSIONS[0];
  const state = createHarborState(6);
  assert.deepEqual(chooseHarborAction(state, mission, mission.steps[0].answerId, 2), state);
  assert.deepEqual(chooseHarborAction(state, mission, "missing", 1), state);
  assert.deepEqual(advanceHarborStep(state, mission, 1), state);
  assert.deepEqual(advanceHarborMission(state, 1), state);
});

test("completes all six structures and stays complete", () => {
  const deck = buildHarborDeck(0);
  let state = createHarborState(deck.length);
  for (const mission of deck) {
    for (const step of mission.steps) {
      state = chooseHarborAction(state, mission, step.answerId, 1);
      if (state.phase === "step-solved") state = advanceHarborStep(state, mission, 1);
    }
    assert.equal(state.phase, "mission-solved");
    state = advanceHarborMission(state, 1);
  }
  assert.equal(state.phase, "complete");
  assert.equal(state.solved, 6);
  assert.deepEqual(advanceHarborMission(state, 1), state);
});

test("rotates replay docks without duplicates and normalizes invalid rotation", () => {
  const first = buildHarborDeck(0);
  const rotated = buildHarborDeck(2);
  assert.notEqual(first[0].id, rotated[0].id);
  assert.deepEqual(new Set(rotated.map((mission) => mission.id)), new Set(first.map((mission) => mission.id)));
  assert.deepEqual(buildHarborDeck(-4).map((mission) => mission.id), first.map((mission) => mission.id));
  assert.deepEqual(buildHarborDeck(Number.NaN).map((mission) => mission.id), first.map((mission) => mission.id));
});
