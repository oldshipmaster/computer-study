import assert from "node:assert/strict";
import test from "node:test";
import { filterCourses } from "../lib/course-filter.ts";
import { COURSES } from "../lib/course-data.ts";

test("returns all courses for an empty compass", () => {
  assert.equal(filterCourses(COURSES, { islandId: "all", query: "" }).length, 45);
});

test("filters by island without changing catalog order", () => {
  const result = filterCourses(COURSES, { islandId: "future-station", query: "" });
  assert.deepEqual(result.map((course) => course.order), [36, 37, 38, 39, 40]);
});

test("matches title summary and skill with normalized whitespace and case", () => {
  assert.deepEqual(filterCourses(COURSES, { islandId: "all", query: "  AI  " }).map((course) => course.id), ["ai-helper", "verify-ai"]);
  assert.deepEqual(filterCourses(COURSES, { islandId: "all", query: "文件管理" }).map((course) => course.id), ["file-home", "name-your-work", "move-and-copy"]);
  assert.ok(filterCourses(COURSES, { islandId: "all", query: "透明背景" }).length === 0);
});

test("finds courses through linked child dictionary terms", () => {
  assert.deepEqual(filterCourses(COURSES, { islandId: "all", query: "光标" }).map((course) => course.id), ["mouse-precision"]);
  assert.deepEqual(filterCourses(COURSES, { islandId: "all", query: "input method" }).map((course) => course.id), ["bilingual-input"]);
  assert.deepEqual(filterCourses(COURSES, { islandId: "all", query: "坐标" }).map((course) => course.id), ["grid-city-navigation"]);
  assert.deepEqual(filterCourses(COURSES, { islandId: "all", query: "AI" }).map((course) => course.id), ["ai-helper", "verify-ai"]);
});

test("combines island and keyword filters", () => {
  assert.deepEqual(filterCourses(COURSES, { islandId: "creative-workshop", query: "数据" }).map((course) => course.id), ["data-table"]);
  assert.deepEqual(filterCourses(COURSES, { islandId: "launch-harbor", query: "AI" }), []);
});

test("combines difficulty with island and keyword filters", () => {
  const challenging = filterCourses(COURSES, { islandId: "all", query: "", difficulty: 3 });
  assert.ok(challenging.length > 0);
  assert.ok(challenging.every((course) => course.difficulty === 3));
  assert.deepEqual(filterCourses(COURSES, { islandId: "code-spaceport", query: "函数", difficulty: 3 }).map((course) => course.id), ["functions-tools"]);
  assert.deepEqual(filterCourses(COURSES, { islandId: "code-spaceport", query: "函数", difficulty: 2 }), []);
});

test("filters completed and unfinished courses without changing order", () => {
  const completedCourseIds = ["keyboard-flight", "file-home", "ai-helper"];
  assert.deepEqual(filterCourses(COURSES, { islandId: "all", query: "", completion: "completed", completedCourseIds }).map((course) => course.id), completedCourseIds);
  const unfinished = filterCourses(COURSES, { islandId: "launch-harbor", query: "", completion: "unfinished", completedCourseIds });
  assert.deepEqual(unfinished.map((course) => course.id), ["mouse-precision", "bilingual-input", "desktop-adventure", "program-landing"]);
  assert.equal(filterCourses(COURSES, { islandId: "all", query: "", completion: "unfinished", completedCourseIds }).length, 42);
});
