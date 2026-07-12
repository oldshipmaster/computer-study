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

test("efficiency race plots comparable semantic work meters", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/algorithms/EfficiencyRaceLab.tsx", root), "utf8");
  assert.match(lab, /<meter/);
  assert.match(lab, /value=\{costs\.linear\}/);
  assert.match(lab, /value=\{costs\.binary\}/);
  assert.match(lab, /最多需要的比较次数/);
});

test("task decomposition visualizes dependencies and the next unblocked step", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/algorithms/TaskDecompositionLab.tsx", root), "utf8");
  assert.match(lab, /dependency-map/);
  assert.match(lab, /dependency-node--ready/);
  assert.match(lab, /dependency-node--done/);
  assert.match(lab, /依赖/);
  assert.match(lab, /下一步/);
});

test("bubble sort lab reveals each adjacent comparison and swap after prediction", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/algorithms/SortLab.tsx", root), "utf8");
  assert.match(lab, /bubble-pass-trace/);
  assert.match(lab, /comparison--swapped/);
  assert.match(lab, /相邻比较/);
  assert.match(lab, /冒到最右边/);
  assert.match(lab, /lastTrace/);
});

test("binary search shows its shrinking candidate range without revealing the next answer", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/algorithms/SearchLab.tsx", root), "utf8");
  assert.match(lab, /binary-range/);
  assert.match(lab, /search-item--excluded/);
  assert.match(lab, /search-item--midpoint/);
  assert.match(lab, /候选区间/);
  assert.match(lab, /排除/);
  assert.match(lab, /lastChecked/);
});
