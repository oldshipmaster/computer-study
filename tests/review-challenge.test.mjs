import assert from "node:assert/strict";
import test from "node:test";
import {
  REVIEW_QUESTIONS,
  answerReviewQuestion,
  createReviewState,
} from "../lib/review-challenge.ts";

test("covers every island with two scenario questions", () => {
  assert.equal(REVIEW_QUESTIONS.length, 16);
  const counts = REVIEW_QUESTIONS.reduce((result, question) => {
    result[question.islandId] = (result[question.islandId] ?? 0) + 1;
    return result;
  }, {});
  assert.deepEqual(Object.values(counts), [2, 2, 2, 2, 2, 2, 2, 2]);
  assert.equal(new Set(REVIEW_QUESTIONS.map((question) => question.id)).size, 16);
});

test("wrong answers explain the idea without advancing", () => {
  const state = createReviewState();
  const question = REVIEW_QUESTIONS[0];
  const wrongIndex = question.options.findIndex((option) => option !== question.answer);
  const next = answerReviewQuestion(state, wrongIndex);

  assert.equal(next.index, 0);
  assert.equal(next.score, 0);
  assert.equal(next.feedback.kind, "retry");
  assert.match(next.feedback.message, /再想一想/);
});

test("correct answers advance once and complete after the final question", () => {
  let state = createReviewState();
  for (const question of REVIEW_QUESTIONS) {
    state = answerReviewQuestion(state, question.options.indexOf(question.answer));
  }

  assert.equal(state.completed, true);
  assert.equal(state.score, 16);
  assert.equal(state.index, 15);
});

test("answering after completion is safe and deterministic", () => {
  const state = { ...createReviewState(), index: 15, score: 16, completed: true };
  assert.deepEqual(answerReviewQuestion(state, 0), state);
});
