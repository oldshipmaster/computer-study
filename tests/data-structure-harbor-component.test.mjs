import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("keeps the harbor behind all five data structure courses", () => {
  const component = source("components/DataStructureHarbor.tsx");
  for (const id of ["array-lockers", "linked-treasure", "stack-queue-dock", "tree-library", "graph-routes"]) assert.match(component, new RegExp(id));
  assert.match(component, /已完成 \{completedRequired\.length\} \/ \{REQUIRED_COURSE_IDS\.length\}/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
});

test("shows structure snapshots, actions, feedback, and an evidence manifest", () => {
  const component = source("components/DataStructureHarbor.tsx");
  assert.match(component, /step\.visual\.items\.map/);
  assert.match(component, /visualItem\.meta/);
  assert.match(component, /step\.options\.map/);
  assert.match(component, /chooseHarborAction/);
  assert.match(component, /advanceHarborStep/);
  assert.match(component, /advanceHarborMission/);
  assert.match(component, /结构证据单/);
  assert.match(component, /role="status"/);
  assert.match(component, /aria-current/);
  assert.match(component, /<progress/);
});

test("supports six docks, rotation replay, and focus handoff", () => {
  const component = source("components/DataStructureHarbor.tsx");
  assert.match(component, /驶向下一座码头/);
  assert.match(component, /重玩六座码头/);
  assert.match(component, /buildHarborDeck\(nextRotation\)/);
  assert.match(component, /headingRef\.current\?\.focus/);
  for (const phrase of ["直接索引", "指针遍历", "后进先出", "先进先出", "层级路径", "图最短路"]) assert.match(component, new RegExp(phrase));
});

test("lazy-loads after algorithm arena with responsive accessible styles", () => {
  const map = source("components/IslandMap.tsx");
  const component = source("components/DataStructureHarbor.tsx");
  const css = source("components/DataStructureHarbor.css");
  assert.match(map, /const DataStructureHarbor = lazy\(\(\) => import\("@\/components\/DataStructureHarbor"\)/);
  assert.match(map, /<AlgorithmArenaGame[\s\S]*?<DataStructureHarbor[\s\S]*?<LearningPlan/);
  assert.match(map, /正在开放数据结构装卸港/);
  assert.match(component, /import "\.\/DataStructureHarbor\.css"/);
  assert.match(css, /\.harbor-action[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.data-harbor-layout[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?animation:\s*none/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?aria-current/);
});
