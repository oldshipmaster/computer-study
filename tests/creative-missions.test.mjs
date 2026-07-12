import assert from "node:assert/strict";
import test from "node:test";
import { CREATIVE_MISSIONS, answerCreativeCard, createCreativeState } from "../lib/creative-missions.ts";

test("defines five complete creative courses with four challenge cards each", () => {
  assert.equal(Object.keys(CREATIVE_MISSIONS).length, 5);
  for (const mission of Object.values(CREATIVE_MISSIONS)) {
    assert.equal(mission.stages.length, 6);
    assert.equal(mission.messages.length, 6);
    assert.equal(mission.cards.length, 4);
    assert.equal(new Set(mission.cards.map((card) => card.id)).size, 4);
    assert.ok(mission.cards.every((card) => card.options.includes(card.answer)));
  }
});

test("creative challenge requires the correct reason before advancing", () => {
  const mission = CREATIVE_MISSIONS["pixel-art"];
  const state = createCreativeState();
  const card = mission.cards[0];
  const wrong = card.options.findIndex((option) => option !== card.answer);
  const retry = answerCreativeCard(mission, state, wrong);
  assert.equal(retry.index, 0);
  assert.equal(retry.solved, 0);
  assert.equal(retry.feedback.kind, "retry");

  const correct = answerCreativeCard(mission, retry, card.options.indexOf(card.answer));
  assert.equal(correct.index, 1);
  assert.equal(correct.solved, 1);
});

test("creative challenge completes exactly after all four cards", () => {
  const mission = CREATIVE_MISSIONS["data-table"];
  let state = createCreativeState();
  for (const card of mission.cards) state = answerCreativeCard(mission, state, card.options.indexOf(card.answer));
  assert.equal(state.completed, true);
  assert.equal(state.solved, 4);
  assert.deepEqual(answerCreativeCard(mission, state, 0), state);
});
