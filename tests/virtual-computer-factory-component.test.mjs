import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("keeps the factory behind all five hardware lab courses", () => {
  const component = source("components/VirtualComputerFactory.tsx");
  for (const id of ["input-process-output", "cpu-memory-storage", "bits-and-data", "hardware-software", "troubleshoot-machine"]) assert.match(component, new RegExp(id));
  assert.match(component, /已完成 \{completedRequired\.length\} \/ \{REQUIRED_COURSE_IDS\.length\}/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
});

test("shows virtual parts, actions, feedback, and a machine inspection sheet", () => {
  const component = source("components/VirtualComputerFactory.tsx");
  assert.match(component, /step\.parts\.map/);
  assert.match(component, /machinePart\.role/);
  assert.match(component, /step\.options\.map/);
  assert.match(component, /chooseFactoryAction/);
  assert.match(component, /advanceFactoryStep/);
  assert.match(component, /advanceFactoryStation/);
  assert.match(component, /工位检测单/);
  assert.match(component, /role="status"/);
  assert.match(component, /aria-current/);
  assert.match(component, /<progress/);
});

test("supports six stations, replay rotation, and focus handoff", () => {
  const component = source("components/VirtualComputerFactory.tsx");
  assert.match(component, /启动下一工位/);
  assert.match(component, /重装六个工位/);
  assert.match(component, /buildFactoryDeck\(nextRotation\)/);
  assert.match(component, /headingRef\.current\?\.focus/);
  for (const phrase of ["输入—处理—输出", "CPU、内存与存储", "比特与字节", "硬件与软件", "安全排错", "计算机组成综合"]) assert.match(component, new RegExp(phrase));
});

test("lazy-loads after safety detective with responsive accessible styles", () => {
  const map = source("components/IslandMap.tsx");
  const component = source("components/VirtualComputerFactory.tsx");
  const css = source("components/VirtualComputerFactory.css");
  assert.match(map, /const VirtualComputerFactory = lazy\(\(\) => import\("@\/components\/VirtualComputerFactory"\)/);
  assert.match(map, /<SafetyDetectiveGame[\s\S]*?<VirtualComputerFactory[\s\S]*?<LearningPlan/);
  assert.match(map, /正在启动虚拟电脑装配厂/);
  assert.match(component, /import "\.\/VirtualComputerFactory\.css"/);
  assert.match(css, /\.factory-action[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.computer-factory-layout[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?animation:\s*none/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?aria-current/);
});
