import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("keeps the lab behind its two-course learning prerequisite", () => {
  const component = source("components/LogicCircuitLab.tsx");
  assert.match(component, /REQUIRED_COURSE_IDS/);
  assert.match(component, /bits-and-data/);
  assert.match(component, /boolean-logic/);
  assert.match(component, /已完成 \{completedRequired\.length\} \/ \{REQUIRED_COURSE_IDS\.length\}/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
});

test("offers complete truth-table challenge and free sandbox flows", () => {
  const component = source("components/LogicCircuitLab.tsx");
  assert.match(component, /运行全部输入/);
  assert.match(component, /<table/);
  assert.match(component, /需调整/);
  assert.match(component, /aria-pressed/);
  assert.match(component, /role="status"/);
  assert.match(component, /自由实验/);
  assert.match(component, /sandboxInputs/);
  assert.match(component, /evaluateLogicGate/);
  assert.match(component, /重玩六块电路板/);
  assert.match(component, /headingRef\.current\?\.focus/);
});

test("lazy-loads the lab between boss arena and learning plan", () => {
  const map = source("components/IslandMap.tsx");
  const arcade = source("lib/game-arcade.ts");
  assert.match(map, /const LogicCircuitLab = lazy\(\(\) => import\("@\/components\/LogicCircuitLab"\)/);
  assert.match(map, /<IslandBossArena[\s\S]*?<Suspense[\s\S]*?<LogicCircuitLab[\s\S]*?<LearningPlan/);
  assert.match(arcade, /targetId: "logic-circuit-lab"/);
  assert.match(map, /正在接通逻辑电路实验台/);
});

test("ships the lab styles as a separate accessible resource", () => {
  const component = source("components/LogicCircuitLab.tsx");
  const css = source("components/LogicCircuitLab.css");
  assert.match(component, /import "\.\/LogicCircuitLab\.css"/);
  assert.match(css, /\.circuit-gate-choice[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.circuit-workbench[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?\.circuit-output-light[\s\S]*?animation:\s*none/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?\.circuit-row--fail[\s\S]*?\.circuit-gate-choice\[aria-pressed="true"\]/);
});
