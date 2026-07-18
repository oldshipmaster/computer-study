import assert from "node:assert/strict";
import test from "node:test";
import { COURSES } from "../lib/course-data.ts";
import {
  advanceKnowledgeSprint,
  answerKnowledgeSprint,
  buildKnowledgeSprintDeck,
  createKnowledgeSprintState,
} from "../lib/knowledge-sprint.ts";

const MIXED_COMPLETIONS = [
  "keyboard-flight",
  "program-landing",
  "file-home",
  "learning-backpack",
  "instruction-order",
];

test("builds an alternating deterministic deck without repeats", () => {
  const first = buildKnowledgeSprintDeck(MIXED_COMPLETIONS, 0);

  assert.equal(first.length, 5);
  assert.equal(new Set(first.map((question) => question.id)).size, 5);
  assert.deepEqual(first.map((question) => question.kind), ["concept", "scenario", "concept", "scenario", "concept"]);
  assert.deepEqual(buildKnowledgeSprintDeck(MIXED_COMPLETIONS, 0), first);
  assert.notDeepEqual(buildKnowledgeSprintDeck(MIXED_COMPLETIONS, 1), first);
  for (const question of first) {
    assert.equal(question.options.length, 3);
    assert.ok(question.options.includes(question.answer));
    assert.ok(question.explanation.length > 0);
  }
});

test("returns only unlocked unique questions without padding a short deck", () => {
  assert.deepEqual(buildKnowledgeSprintDeck([], 0), []);

  const oneCourse = buildKnowledgeSprintDeck(["mouse-precision"], 0);
  assert.equal(oneCourse.length, 1);
  assert.equal(oneCourse[0].courseId, "mouse-precision");

  const allCompleted = COURSES.map((course) => course.id);
  const full = buildKnowledgeSprintDeck(allCompleted, 0);
  assert.equal(full.length, 5);
  assert.equal(new Set(full.map((question) => question.id)).size, 5);
});

test("normalizes invalid rotation and deck limits", () => {
  assert.deepEqual(
    buildKnowledgeSprintDeck(MIXED_COMPLETIONS, Number.NaN),
    buildKnowledgeSprintDeck(MIXED_COMPLETIONS, 0),
  );
  assert.equal(buildKnowledgeSprintDeck(MIXED_COMPLETIONS, 0, 3).length, 3);
  assert.equal(buildKnowledgeSprintDeck(MIXED_COMPLETIONS, 0, 99).length, 5);
  assert.deepEqual(buildKnowledgeSprintDeck(MIXED_COMPLETIONS, 0, 0), []);
});

test("scores a growing combo and reaches the 750 point perfect maximum", () => {
  const deck = buildKnowledgeSprintDeck(MIXED_COMPLETIONS, 0);
  let state = createKnowledgeSprintState(deck.length);

  for (let index = 0; index < deck.length; index += 1) {
    const question = deck[index];
    state = answerKnowledgeSprint(state, question.options.indexOf(question.answer), deck);
    assert.equal(state.phase, "feedback");
    if (index < deck.length - 1) state = advanceKnowledgeSprint(state, deck);
  }
  state = advanceKnowledgeSprint(state, deck);

  assert.equal(state.phase, "complete");
  assert.equal(state.score, 750);
  assert.equal(state.correct, 5);
  assert.equal(state.bestStreak, 5);
  assert.equal(state.shields, 3);
});

test("uses a shield, resets combo, and records the missed course without elimination", () => {
  const deck = buildKnowledgeSprintDeck(MIXED_COMPLETIONS, 0, 3);
  let state = createKnowledgeSprintState(deck.length);

  state = answerKnowledgeSprint(state, deck[0].options.indexOf(deck[0].answer), deck);
  assert.equal(state.score, 100);
  state = advanceKnowledgeSprint(state, deck);
  state = answerKnowledgeSprint(state, deck[1].options.findIndex((option) => option !== deck[1].answer), deck);
  assert.equal(state.score, 100);
  assert.equal(state.streak, 0);
  assert.equal(state.shields, 2);
  assert.deepEqual(state.missedCourseIds, [deck[1].courseId]);
  assert.match(state.feedback.message, /这一题没有答对/);
  state = advanceKnowledgeSprint(state, deck);
  state = answerKnowledgeSprint(state, deck[2].options.findIndex((option) => option !== deck[2].answer), deck);
  state = advanceKnowledgeSprint(state, deck);

  assert.equal(state.phase, "complete");
  assert.equal(state.correct, 1);
});

test("clamps shields and ignores duplicate, invalid, or out-of-phase actions", () => {
  const deck = buildKnowledgeSprintDeck(COURSES.map((course) => course.id), 0);
  let state = createKnowledgeSprintState(deck.length);
  const correctIndex = deck[0].options.indexOf(deck[0].answer);

  assert.equal(answerKnowledgeSprint(state, correctIndex, deck, 2), state);
  assert.equal(answerKnowledgeSprint(state, -1, deck), state);
  state = answerKnowledgeSprint(state, correctIndex, deck);
  assert.equal(answerKnowledgeSprint(state, correctIndex, deck), state);
  assert.equal(advanceKnowledgeSprint(state, deck, 2), state);

  for (let index = 0; index < deck.length; index += 1) {
    if (state.phase === "answering") {
      const question = deck[state.index];
      state = answerKnowledgeSprint(state, question.options.findIndex((option) => option !== question.answer), deck);
    }
    state = advanceKnowledgeSprint(state, deck);
  }

  assert.equal(state.phase, "complete");
  assert.equal(state.shields, 0);
  assert.equal(answerKnowledgeSprint(state, 0, deck), state);
  assert.equal(advanceKnowledgeSprint(state, deck), state);
});
