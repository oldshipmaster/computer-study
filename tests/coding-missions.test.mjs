import assert from "node:assert/strict";
import test from "node:test";
import { CODING_MISSIONS, answerCodingCard, createCodingState } from "../lib/coding-missions.ts";

test("defines five advanced-foundation coding missions", () => {
  assert.equal(Object.keys(CODING_MISSIONS).length, 5);
  for (const mission of Object.values(CODING_MISSIONS)) {
    assert.equal(mission.stages.length, 6);
    assert.equal(mission.messages.length, 6);
    assert.equal(mission.cards.length, 4);
    assert.ok(mission.cards.every((item) => item.options.includes(item.answer)));
  }
});

test("coding cards require a correct trace before advancing", () => {
  const mission = CODING_MISSIONS["events-handlers"];
  const state = createCodingState();
  const first = mission.cards[0];
  const wrong = first.options.findIndex((option) => option !== first.answer);
  assert.equal(answerCodingCard(mission, state, wrong).index, 0);
  const correct = answerCodingCard(mission, state, first.options.indexOf(first.answer));
  assert.equal(correct.index, 1);
  assert.equal(correct.solved, 1);
});

test("coding mission completes and then remains stable", () => {
  const mission = CODING_MISSIONS["game-design"];
  let state = createCodingState();
  for (const item of mission.cards) state = answerCodingCard(mission, state, item.options.indexOf(item.answer));
  assert.equal(state.completed, true);
  assert.equal(state.solved, 4);
  assert.deepEqual(answerCodingCard(mission, state, 2), state);
});
