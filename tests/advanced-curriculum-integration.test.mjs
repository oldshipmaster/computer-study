import assert from "node:assert/strict";
import test from "node:test";
import { ADVANCED_COURSE_IDS, ADVANCED_ISLAND_IDS } from "../lib/advanced-foundations/course-ids.ts";
import { COURSES, ISLANDS, RECOMMENDED_ROUTE_IDS } from "../lib/course-data.ts";
import { DICTIONARY_ENTRIES } from "../lib/computer-dictionary.ts";
import { CURRICULUM_GUIDE } from "../lib/curriculum-guide.ts";
import { REVIEW_QUESTIONS, REVIEW_REQUIREMENTS } from "../lib/review-challenge.ts";

test("integrates all four advanced islands into a sixty-five course catalog", () => {
  assert.equal(ISLANDS.length, 13);
  assert.equal(COURSES.length, 65);
  assert.equal(COURSES.filter((course) => course.playable).length, 65);
  assert.equal(new Set(COURSES.map((course) => course.id)).size, 65);
  assert.equal(RECOMMENDED_ROUTE_IDS.length, 65);
  assert.equal(new Set(RECOMMENDED_ROUTE_IDS).size, 65);
  assert.deepEqual(ISLANDS.slice(-4).map((island) => island.id), ADVANCED_ISLAND_IDS);
  assert.ok(ADVANCED_COURSE_IDS.every((id) => COURSES.some((course) => course.id === id)));
});

test("gives all sixty-five courses guidance and one dictionary term", () => {
  assert.deepEqual(new Set(Object.keys(CURRICULUM_GUIDE)), new Set(COURSES.map((course) => course.id)));
  assert.equal(DICTIONARY_ENTRIES.length, 65);
  assert.equal(new Set(DICTIONARY_ENTRIES.map((entry) => entry.courseId)).size, 65);
  for (const id of ADVANCED_COURSE_IDS) {
    assert.equal(CURRICULUM_GUIDE[id].objectives.length, 3);
    assert.ok(DICTIONARY_ENTRIES.some((entry) => entry.courseId === id));
  }
});

test("adds two scenario questions for every advanced island", () => {
  assert.equal(REVIEW_QUESTIONS.length, 26);
  for (const islandId of ADVANCED_ISLAND_IDS) {
    assert.equal(REVIEW_QUESTIONS.filter((question) => question.islandId === islandId).length, 2);
  }
  assert.deepEqual(new Set(Object.keys(REVIEW_REQUIREMENTS)), new Set(REVIEW_QUESTIONS.map((question) => question.id)));
});
