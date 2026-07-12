import assert from "node:assert/strict";
import test from "node:test";
import { TERM_MATCH_QUESTIONS, answerTermMatch, createTermMatchState, getUnlockedTermQuestions } from "../lib/term-match.ts";
import { COURSES, ISLANDS } from "../lib/course-data.ts";

test("builds one deterministic three-option concept question per course", () => {
  assert.equal(TERM_MATCH_QUESTIONS.length, COURSES.length);
  assert.deepEqual(new Set(TERM_MATCH_QUESTIONS.map((question) => question.courseId)), new Set(COURSES.map((course) => course.id)));
  for (const question of TERM_MATCH_QUESTIONS) {
    assert.equal(question.options.length, 3);
    assert.equal(new Set(question.options).size, 3);
    assert.ok(question.options.includes(question.answer));
    assert.ok(ISLANDS.find((island) => island.id === question.islandId)?.courseIds.includes(question.courseId));
  }
});

test("unlocks only questions backed by completed courses", () => {
  assert.deepEqual(getUnlockedTermQuestions([]), []);
  assert.deepEqual(getUnlockedTermQuestions(["keyboard-flight", "file-home", "unknown"]).map((question) => question.courseId), ["keyboard-flight", "file-home"]);
});

test("keeps progress on a wrong choice and completes after every correct choice", () => {
  const questions = getUnlockedTermQuestions(["keyboard-flight", "mouse-precision"]);
  let state = createTermMatchState();
  const wrongIndex = questions[0].options.findIndex((option) => option !== questions[0].answer);
  state = answerTermMatch(state, wrongIndex, questions);
  assert.equal(state.index, 0);
  assert.match(state.feedback, /线索例子/);
  for (const question of questions) state = answerTermMatch(state, question.options.indexOf(question.answer), questions);
  assert.equal(state.completed, true);
  assert.equal(state.correct, 2);
  assert.equal(answerTermMatch(state, 0, questions), state);
});
