import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = readFileSync(new URL("components/lessons/advanced/AlgorithmLessons.tsx", root), "utf8");
const registry = readFileSync(new URL("components/lessons/lesson-registry.ts", root), "utf8");

const lessons = [
  ["linear-search", "LinearSearchLesson"],
  ["binary-search", "BinarySearchLesson"],
  ["bubble-sort", "BubbleSortLesson"],
  ["task-decomposition", "TaskDecompositionLesson"],
  ["algorithm-efficiency", "AlgorithmEfficiencyLesson"],
];

for (const [id, exportName] of lessons) {
  test(`${id} exports and registers a six-stage algorithm lesson`, () => {
    assert.match(source, new RegExp(`export function ${exportName}`));
    assert.match(registry, new RegExp(`"${id}"\\s*:`));
    assert.match(registry, new RegExp(`Component:\\s*${exportName}`));
  });
}

test("algorithm lessons preserve stage focus and one-time completion", () => {
  assert.match(source, /Math\.max\(0, Math\.min\(5/);
  assert.match(source, /headingRef\.current\?\.focus\(\)/);
  assert.match(source, /onStageChange\(stage\)/);
  assert.match(source, /awardedRef\.current/);
});

test("algorithm labs expose visible status and button controls", () => {
  for (const file of ["SearchLab", "SortLab", "TaskDecompositionLab", "EfficiencyRaceLab"]) {
    const lab = readFileSync(new URL(`components/lessons/advanced/algorithms/${file}.tsx`, root), "utf8");
    assert.match(lab, /role="status"/);
    assert.match(lab, /type="button"/);
    assert.doesNotMatch(lab, /onDrag|onDrop|draggable/);
  }
});
