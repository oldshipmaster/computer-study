import test from "node:test";
import assert from "node:assert/strict";
import { AI_LAB_MISSIONS, advanceAiLabMission, advanceAiLabStep, buildAiLabDeck, chooseAiLabAction, createAiLabState } from "../lib/ai-verification-lab.ts";

test("defines six missions across future collaboration and verification", () => {
  assert.equal(AI_LAB_MISSIONS.length, 6);
  assert.equal(new Set(AI_LAB_MISSIONS.map((mission) => mission.id)).size, 6);
  assert.deepEqual(new Set(AI_LAB_MISSIONS.map((mission) => mission.mode)), new Set(["email", "collab", "prompt", "verify", "project", "report"]));
  for (const mission of AI_LAB_MISSIONS) { assert.equal(mission.steps.length, 2); for (const step of mission.steps) { assert.ok(step.signals.length >= 2); assert.equal(step.options.length, 3); assert.ok(step.options.some((option) => option.id === step.answerId)); } }
});

test("keeps all messages and AI outputs fictional and fixed", () => {
  const value = JSON.stringify(AI_LAB_MISSIONS);
  assert.match(value, /虚构|示例/);
  assert.match(value, /真实姓名/);
  assert.doesNotMatch(value, /https?:\/\/|\b\w+@\w+\.[a-z]+\b|1[3-9]\d{9}/i);
});

test("preserves evidence on a wrong action and ignores unknown actions", () => {
  const state = createAiLabState(6); const mission = AI_LAB_MISSIONS[0]; const wrong = mission.steps[0].options.find((option) => option.id !== mission.steps[0].answerId).id;
  const result = chooseAiLabAction(state, mission, wrong);
  assert.equal(result.phase, "investigating"); assert.equal(result.stepIndex, 0); assert.deepEqual(result.evidence, []);
  assert.strictEqual(chooseAiLabAction(state, mission, "unknown"), state);
});

test("records verification evidence before advancing", () => {
  const state = createAiLabState(6); const mission = AI_LAB_MISSIONS[0]; const solved = chooseAiLabAction(state, mission, mission.steps[0].answerId);
  assert.equal(solved.phase, "step-solved"); assert.deepEqual(solved.evidence, [mission.steps[0].evidence]);
  const next = advanceAiLabStep(solved, mission); assert.equal(next.stepIndex, 1); assert.equal(next.phase, "investigating");
});

test("blocks double activation and premature continuation", () => {
  const state = createAiLabState(6); const mission = AI_LAB_MISSIONS[0];
  assert.strictEqual(chooseAiLabAction(state, mission, mission.steps[0].answerId, 2), state);
  assert.strictEqual(advanceAiLabStep(state, mission), state); assert.strictEqual(advanceAiLabMission(state), state);
});

test("completes and rotates all six missions", () => {
  const deck = buildAiLabDeck(0); let state = createAiLabState(deck.length);
  for (const mission of deck) { for (let i = 0; i < mission.steps.length; i += 1) { state = chooseAiLabAction(state, mission, mission.steps[i].answerId); if (state.phase === "step-solved") state = advanceAiLabStep(state, mission); } state = advanceAiLabMission(state); }
  assert.equal(state.phase, "complete"); assert.equal(state.solved, 6);
  assert.equal(buildAiLabDeck(1)[0].id, deck[1].id);
});
