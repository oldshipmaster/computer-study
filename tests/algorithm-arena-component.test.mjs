import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("keeps the arena behind all five algorithm courses", () => {
  const component = source("components/AlgorithmArenaGame.tsx");
  for (const courseId of ["linear-search", "binary-search", "bubble-sort", "task-decomposition", "algorithm-efficiency"]) assert.match(component, new RegExp(courseId));
  assert.match(component, /已完成 \{completedRequired\.length\} \/ \{REQUIRED_COURSE_IDS\.length\}/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
});

test("renders visual evidence, choices, progress, feedback, and evidence trail", () => {
  const component = source("components/AlgorithmArenaGame.tsx");
  assert.match(component, /step\.visual\.items\.map/);
  assert.match(component, /step\.options\.map/);
  assert.match(component, /chooseAlgorithmAction/);
  assert.match(component, /advanceAlgorithmStep/);
  assert.match(component, /advanceAlgorithmMission/);
  assert.match(component, /算法证据轨迹/);
  assert.match(component, /role="status"/);
  assert.match(component, /<progress/);
  assert.match(component, /aria-current/);
});

test("supports six-mission completion, replay rotation, and focus handoff", () => {
  const component = source("components/AlgorithmArenaGame.tsx");
  assert.match(component, /接入下一场算法赛/);
  assert.match(component, /重玩六场算法赛/);
  assert.match(component, /buildAlgorithmArenaDeck\(nextRotation\)/);
  assert.match(component, /headingRef\.current\?\.focus/);
  for (const phrase of ["线性搜索", "二分搜索", "冒泡排序", "任务分解", "算法效率"]) assert.match(component, new RegExp(phrase));
});

test("lazy-loads the arena after CPU scheduler and ships accessible responsive styles", () => {
  const map = source("components/IslandMap.tsx");
  const component = source("components/AlgorithmArenaGame.tsx");
  const css = source("components/AlgorithmArenaGame.css");
  assert.match(map, /const AlgorithmArenaGame = lazy\(\(\) => import\("@\/components\/AlgorithmArenaGame"\)/);
  assert.match(map, /<CpuSchedulerGame[\s\S]*?<AlgorithmArenaGame[\s\S]*?<LearningPlan/);
  assert.match(map, /正在开启算法竞技场/);
  assert.match(component, /import "\.\/AlgorithmArenaGame\.css"/);
  assert.match(css, /\.algorithm-arena-action[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.algorithm-arena-layout[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?animation:\s*none/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?aria-current/);
});
