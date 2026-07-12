import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { FUTURE_MISSIONS, answerFutureCard, createFutureState } from "../lib/future-missions.ts";

test("defines five future-literacy courses with complete six-stage missions", () => {
  assert.equal(Object.keys(FUTURE_MISSIONS).length, 5);
  for (const mission of Object.values(FUTURE_MISSIONS)) {
    assert.equal(mission.stages.length, 6);
    assert.equal(mission.messages.length, 6);
    assert.equal(mission.cards.length, 4);
    assert.ok(mission.cards.every((card) => card.options.includes(card.answer)));
  }
});

test("future mission preserves progress on a wrong decision", () => {
  const mission = FUTURE_MISSIONS["email-message"];
  const state = createFutureState();
  const first = mission.cards[0];
  const wrong = first.options.findIndex((option) => option !== first.answer);
  const next = answerFutureCard(mission, state, wrong);
  assert.equal(next.index, 0);
  assert.equal(next.solved, 0);
  assert.equal(next.feedback.kind, "retry");
});

test("future mission completes once after four correct decisions", () => {
  const mission = FUTURE_MISSIONS["digital-project"];
  let state = createFutureState();
  for (const item of mission.cards) state = answerFutureCard(mission, state, item.options.indexOf(item.answer));
  assert.equal(state.completed, true);
  assert.equal(state.solved, 4);
  assert.deepEqual(answerFutureCard(mission, state, 0), state);
});

test("future challenge ignores a repeated pointer activation", () => {
  const mission = FUTURE_MISSIONS["email-message"];
  const state = createFutureState();
  const answer = mission.cards[0].options.indexOf(mission.cards[0].answer);
  assert.equal(answerFutureCard(mission, state, answer, 2), state);
});

test("future mission keeps each decision's evidence before advancing", () => {
  const source = readFileSync(new URL("../components/lessons/future/FutureMissionLesson.tsx", import.meta.url), "utf8");
  assert.match(source, /decision-evidence-card/);
  assert.match(source, /目标/);
  assert.match(source, /我的选择/);
  assert.match(source, /避开的风险/);
  assert.match(source, /判断证据/);
  assert.match(source, /确认记录，下一项/);
  assert.match(source, /未来素养决策总结/);
});
