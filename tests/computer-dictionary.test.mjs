import assert from "node:assert/strict";
import test from "node:test";
import { DICTIONARY_ENTRIES, searchDictionary } from "../lib/computer-dictionary.ts";
import { COURSES, ISLANDS } from "../lib/course-data.ts";

test("teaches five child-readable terms for every island", () => {
  assert.equal(DICTIONARY_ENTRIES.length, 65);
  assert.equal(new Set(DICTIONARY_ENTRIES.map((entry) => entry.id)).size, 65);
  for (const island of ISLANDS) {
    const entries = DICTIONARY_ENTRIES.filter((entry) => entry.islandId === island.id);
    assert.equal(entries.length, 5, island.name);
    assert.ok(entries.every((entry) => entry.term && entry.english && entry.explanation && entry.example));
    assert.ok(entries.every((entry) => COURSES.some((course) => course.id === entry.courseId && course.islandId === entry.islandId)));
  }
});

test("maps exactly one core term to every course", () => {
  assert.equal(new Set(DICTIONARY_ENTRIES.map((entry) => entry.courseId)).size, COURSES.length);
  assert.deepEqual(
    new Set(DICTIONARY_ENTRIES.map((entry) => entry.courseId)),
    new Set(COURSES.map((course) => course.id)),
  );
});

test("keeps every explanation short and free of personal-data prompts", () => {
  const unsafePrompt = /(?:输入|填写|告诉我|发来).{0,8}(?:真实密码|电话|住址|学校|姓名)/;
  for (const entry of DICTIONARY_ENTRIES) {
    assert.ok(entry.explanation.length >= 12 && entry.explanation.length <= 36, entry.id);
    assert.ok(entry.example.length >= 10 && entry.example.length <= 40, entry.id);
    assert.doesNotMatch(`${entry.explanation}${entry.example}`, /https?:\/\//i);
    assert.doesNotMatch(`${entry.explanation}${entry.example}`, unsafePrompt);
  }
});

test("searches Chinese, English, explanations, and examples", () => {
  assert.deepEqual(searchDictionary("循环").map((entry) => entry.id), ["loop"]);
  assert.deepEqual(searchDictionary("cpu").map((entry) => entry.id), ["cpu-memory-storage", "instruction-cycle"]);
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
