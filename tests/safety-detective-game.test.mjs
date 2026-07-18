import assert from "node:assert/strict";
import test from "node:test";

import {
  SAFETY_DETECTIVE_CASES,
  advanceSafetyCase,
  advanceSafetyStep,
  buildSafetyCaseDeck,
  chooseSafetyAction,
  createSafetyDetectiveState,
} from "../lib/safety-detective-game.ts";

test("defines six fictional safety cases with visible clues", () => {
  assert.equal(SAFETY_DETECTIVE_CASES.length, 6);
  assert.deepEqual(new Set(SAFETY_DETECTIVE_CASES.map((caseFile) => caseFile.mode)), new Set(["privacy", "password", "popup", "health", "shared", "response"]));
  assert.equal(new Set(SAFETY_DETECTIVE_CASES.map((caseFile) => caseFile.id)).size, 6);
  for (const caseFile of SAFETY_DETECTIVE_CASES) {
    assert.ok(caseFile.steps.length >= 2);
    assert.ok(caseFile.steps.every((step) => step.clues.length >= 2));
    assert.ok(caseFile.steps.every((step) => step.options.some((candidate) => candidate.id === step.answerId)));
  }
  const serialized = JSON.stringify(SAFETY_DETECTIVE_CASES);
  assert.doesNotMatch(serialized, /https?:\/\//i);
  assert.doesNotMatch(serialized, /请输入|填写你的|真实账号/);
});

test("keeps the case and evidence after a risky choice", () => {
  const caseFile = SAFETY_DETECTIVE_CASES[2];
  const state = createSafetyDetectiveState(6);
  const wrong = caseFile.steps[0].options.find((candidate) => candidate.id !== caseFile.steps[0].answerId).id;
  const result = chooseSafetyAction(state, caseFile, wrong, 1);
  assert.equal(result.stepIndex, 0);
  assert.equal(result.phase, "investigating");
  assert.deepEqual(result.evidence, []);
  assert.match(result.feedback, /停|观察|风险|大人|不能/);
});

test("records a safe reason before advancing", () => {
  const caseFile = SAFETY_DETECTIVE_CASES[0];
  const state = createSafetyDetectiveState(6);
  const result = chooseSafetyAction(state, caseFile, caseFile.steps[0].answerId, 1);
  assert.equal(result.phase, "step-solved");
  assert.deepEqual(result.evidence, [caseFile.steps[0].evidence]);
  const advanced = advanceSafetyStep(result, caseFile, 1);
  assert.equal(advanced.stepIndex, 1);
  assert.equal(advanced.phase, "investigating");
});

test("ignores double activation, unknown choices, and premature continue", () => {
  const caseFile = SAFETY_DETECTIVE_CASES[0];
  const state = createSafetyDetectiveState(6);
  assert.deepEqual(chooseSafetyAction(state, caseFile, caseFile.steps[0].answerId, 2), state);
  assert.deepEqual(chooseSafetyAction(state, caseFile, "unknown", 1), state);
  assert.deepEqual(advanceSafetyStep(state, caseFile, 1), state);
  assert.deepEqual(advanceSafetyCase(state, 1), state);
});

test("solves all cases and remains complete", () => {
  const deck = buildSafetyCaseDeck(0);
  let state = createSafetyDetectiveState(deck.length);
  for (const caseFile of deck) {
    for (const step of caseFile.steps) {
      state = chooseSafetyAction(state, caseFile, step.answerId, 1);
      if (state.phase === "step-solved") state = advanceSafetyStep(state, caseFile, 1);
    }
    assert.equal(state.phase, "case-solved");
    state = advanceSafetyCase(state, 1);
  }
  assert.equal(state.phase, "complete");
  assert.equal(state.solved, 6);
  assert.deepEqual(advanceSafetyCase(state, 1), state);
});

test("rotates replay cases without duplicates", () => {
  const first = buildSafetyCaseDeck(0);
  const rotated = buildSafetyCaseDeck(3);
  assert.notEqual(first[0].id, rotated[0].id);
  assert.deepEqual(new Set(rotated.map((caseFile) => caseFile.id)), new Set(first.map((caseFile) => caseFile.id)));
  assert.deepEqual(buildSafetyCaseDeck(-2).map((caseFile) => caseFile.id), first.map((caseFile) => caseFile.id));
  assert.deepEqual(buildSafetyCaseDeck(Number.NaN).map((caseFile) => caseFile.id), first.map((caseFile) => caseFile.id));
});
