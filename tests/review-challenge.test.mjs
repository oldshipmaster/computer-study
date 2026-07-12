import assert from "node:assert/strict";
import test from "node:test";
import {
  REVIEW_QUESTIONS,
  REVIEW_REQUIREMENTS,
  answerReviewQuestion,
  createReviewState,
  getAvailableReviewQuestions,
} from "../lib/review-challenge.ts";
import { COURSES } from "../lib/course-data.ts";

test("covers every island with two scenario questions", () => {
  assert.equal(REVIEW_QUESTIONS.length, 18);
  const counts = REVIEW_QUESTIONS.reduce((result, question) => {
    result[question.islandId] = (result[question.islandId] ?? 0) + 1;
    return result;
  }, {});
  assert.deepEqual(Object.values(counts), [2, 2, 2, 2, 2, 2, 2, 2, 2]);
  assert.equal(new Set(REVIEW_QUESTIONS.map((question) => question.id)).size, 18);
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

test("unlocks only review questions backed by completed lessons", () => {
  assert.deepEqual(getAvailableReviewQuestions([]), []);
  assert.deepEqual(getAvailableReviewQuestions(["keyboard-flight"]).map((question) => question.id), ["launch-1"]);
  assert.deepEqual(getAvailableReviewQuestions(["keyboard-flight", "program-landing"]).map((question) => question.id), ["launch-1", "launch-2"]);
  assert.equal(getAvailableReviewQuestions(COURSES.map((course) => course.id)).length, 18);
  assert.deepEqual(new Set(Object.keys(REVIEW_REQUIREMENTS)), new Set(REVIEW_QUESTIONS.map((question) => question.id)));
  assert.ok(Object.values(REVIEW_REQUIREMENTS).every((id) => COURSES.some((course) => course.id === id)));
});

test("correct answers advance once and complete after the final question", () => {
  let state = createReviewState();
  for (const question of REVIEW_QUESTIONS) {
    state = answerReviewQuestion(state, question.options.indexOf(question.answer));
  }

  assert.equal(state.completed, true);
  assert.equal(state.score, 18);
  assert.equal(state.index, 17);
});

test("labels a carried explanation as belonging to the previous question", () => {
  const first = answerReviewQuestion(createReviewState(), 0, REVIEW_QUESTIONS);
  assert.equal(first.index, 1);
  assert.match(first.feedback.message, /^上一题答对了：/);
  assert.match(first.feedback.message, /继续读下一题。$/);
});

test("answering after completion is safe and deterministic", () => {
  const state = { ...createReviewState(), index: 17, score: 18, completed: true };
  assert.deepEqual(answerReviewQuestion(state, 0), state);
});
