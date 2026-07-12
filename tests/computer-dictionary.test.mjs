import assert from "node:assert/strict";
import test from "node:test";
import { DICTIONARY_ENTRIES, searchDictionary } from "../lib/computer-dictionary.ts";
import { COURSES, ISLANDS } from "../lib/course-data.ts";

test("teaches five child-readable terms for every island", () => {
  assert.equal(DICTIONARY_ENTRIES.length, 45);
  assert.equal(new Set(DICTIONARY_ENTRIES.map((entry) => entry.id)).size, 45);
  for (const island of ISLANDS) {
    const entries = DICTIONARY_ENTRIES.filter((entry) => entry.islandId === island.id);
    assert.equal(entries.length, 5, island.name);
    assert.ok(entries.every((entry) => entry.term && entry.english && entry.explanation && entry.example));
    assert.ok(entries.every((entry) => COURSES.some((course) => course.id === entry.courseId && course.islandId === entry.islandId)));
  }
});

test("searches Chinese, English, explanations, and examples", () => {
  assert.deepEqual(searchDictionary("循环").map((entry) => entry.id), ["loop"]);
  assert.deepEqual(searchDictionary("cpu").map((entry) => entry.id), ["cpu-memory-storage"]);
  assert.ok(searchDictionary("网络").length >= 3);
  assert.deepEqual(searchDictionary("  Ai  ").map((entry) => entry.id), ["ai"]);
  assert.deepEqual(searchDictionary("it").map((entry) => entry.id), []);
  assert.equal(searchDictionary("不存在的火星词").length, 0);
});

test("returns a copy of the complete dictionary for an empty query", () => {
  const results = searchDictionary("  ");
  assert.deepEqual(results, DICTIONARY_ENTRIES);
  assert.notEqual(results, DICTIONARY_ENTRIES);
});
