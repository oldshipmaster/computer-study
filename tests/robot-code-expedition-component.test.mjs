import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("keeps code expedition behind four robot-workshop prerequisites", () => {
  const component = source("components/RobotCodeExpedition.tsx");
  for (const courseId of ["instruction-order", "grid-city-navigation", "repeat-power", "rainy-condition"]) {
    assert.match(component, new RegExp(courseId));
  }
  assert.match(component, /已完成 \{completedRequired\.length\} \/ \{REQUIRED_COURSE_IDS\.length\}/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
});

test("offers a visible editable program and step-by-step map trace", () => {
  const component = source("components/RobotCodeExpedition.tsx");
  assert.match(component, /role="grid"/);
  assert.match(component, /className="robot-code-row"[\s\S]*?role="row"/);
  assert.match(component, /role="gridcell"/);
  assert.match(component, /指令库/);
  assert.match(component, /程序队列/);
  assert.match(component, /运行程序/);
  assert.match(component, /执行下一步/);
  assert.match(component, /moveRobotCommand/);
  assert.match(component, /removeRobotCommand/);
  assert.match(component, /clearRobotProgram/);
  assert.match(component, /traceCursor/);
  assert.match(component, /aria-current/);
  assert.match(component, /role="status"/);
});

test("supports retry, six-map completion, replay rotation, and focus handoff", () => {
  const component = source("components/RobotCodeExpedition.tsx");
  assert.match(component, /保留程序继续修改/);
  assert.match(component, /接入下一张地图/);
  assert.match(component, /重玩六张代码地图/);
  assert.match(component, /buildRobotMissionDeck\(nextRotation\)/);
  assert.match(component, /headingRef\.current\?\.focus/);
});

test("lazy-loads code expedition after the circuit lab and before learning plan", () => {
  const map = source("components/IslandMap.tsx");
  const arcade = source("lib/game-arcade.ts");
  assert.match(map, /const RobotCodeExpedition = lazy\(\(\) => import\("@\/components\/RobotCodeExpedition"\)/);
  assert.match(map, /<LogicCircuitLab[\s\S]*?<RobotCodeExpedition[\s\S]*?<LearningPlan/);
  assert.match(arcade, /targetId: "robot-code-expedition"/);
  assert.match(map, /正在装载机器人代码远征/);
});

test("ships a separate responsive and accessible expedition stylesheet", () => {
  const component = source("components/RobotCodeExpedition.tsx");
  const css = source("components/RobotCodeExpedition.css");
  assert.match(component, /import "\.\/RobotCodeExpedition\.css"/);
  assert.match(css, /\.robot-command-button[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.robot-expedition-layout[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?animation:\s*none/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?aria-current/);
});
