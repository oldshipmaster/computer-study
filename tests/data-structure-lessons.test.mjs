import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const lessonSource = readFileSync(new URL("components/lessons/advanced/DataStructureLessons.tsx", root), "utf8");
const registrySource = readFileSync(new URL("components/lessons/lesson-registry.ts", root), "utf8");

const lessons = [
  ["array-lockers", "ArrayLockersLesson", "ArrayLockerLab"],
  ["linked-treasure", "LinkedTreasureLesson", "LinkedTreasureLab"],
  ["stack-queue-dock", "StackQueueDockLesson", "StackQueueLab"],
  ["tree-library", "TreeLibraryLesson", "TreeLibraryLab"],
  ["graph-routes", "GraphRoutesLesson", "GraphRoutesLab"],
];

for (const [courseId, exportName, labName] of lessons) {
  test(`${courseId} exports a dedicated six-stage lesson`, () => {
    assert.match(lessonSource, new RegExp(`export function ${exportName}`));
    assert.match(lessonSource, new RegExp(`Lab:\\s*${labName}`));
    assert.match(registrySource, new RegExp(`"${courseId}"\\s*:`));
    assert.match(registrySource, new RegExp(`Component:\\s*${exportName}`));
  });
}

test("data-structure lessons retain focus, resume, and one-time award contracts", () => {
  assert.match(lessonSource, /Math\.max\(0, Math\.min\(5/);
  assert.match(lessonSource, /headingRef\.current\?\.focus\(\)/);
  assert.match(lessonSource, /onStageChange\(stage\)/);
  assert.match(lessonSource, /awardedRef\.current/);
  assert.match(lessonSource, /role="status"/);
});

test("each data-structure lab exposes a visible keyboard-operable challenge", () => {
  for (const [, , labName] of lessons) {
    const fileName = labName.replace(/Lab$/, "Lab.tsx");
    const source = readFileSync(
      new URL(`components/lessons/advanced/data-structures/${fileName}`, root),
      "utf8",
    );
    assert.match(source, /type="button"/);
    assert.match(source, /role="status"/);
    assert.doesNotMatch(source, /draggable|onDrag|onDrop/);
  }
});

test("tree and graph labs keep their complete structures visible while exploring", () => {
  const tree = readFileSync(new URL("components/lessons/advanced/data-structures/TreeLibraryLab.tsx", root), "utf8");
  const graph = readFileSync(new URL("components/lessons/advanced/data-structures/GraphRoutesLab.tsx", root), "utf8");
  assert.match(tree, /tree-structure/);
  assert.match(tree, /tree-node--current/);
  assert.match(tree, /根节点/);
  assert.match(tree, /叶节点/);
  assert.match(graph, /graph-edge-map/);
  assert.match(graph, /graph-node--current/);
  assert.match(graph, /graph-node--reachable/);
  assert.match(graph, /港口—森林/);
});

test("array lab aligns each index with one consecutive memory address", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/data-structures/ArrayLockerLab.tsx", root), "utf8");
  assert.match(lab, /array-memory-table/);
  assert.match(lab, /内存地址/);
  assert.match(lab, /1000 \+ index \* 4/);
  assert.match(lab, /array-cell--selected/);
  assert.match(lab, /只定位一个位置/);
});

test("linked list lab shows nonconsecutive addresses connected by next pointers", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/data-structures/LinkedTreasureLab.tsx", root), "utf8");
  assert.match(lab, /linked-memory-map/);
  assert.match(lab, /节点地址/);
  assert.match(lab, /next 指针/);
  assert.match(lab, /2048/);
  assert.match(lab, /8192/);
  assert.match(lab, /不需要连续/);
});
