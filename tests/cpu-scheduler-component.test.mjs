import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("keeps scheduler behind process, CPU, and memory prerequisites", () => {
  const component = source("components/CpuSchedulerGame.tsx");
  for (const id of ["program-process", "cpu-scheduling", "memory-allocation"]) assert.match(component, new RegExp(id));
  assert.match(component, /已完成 \{completedRequired\.length\} \/ \{REQUIRED_COURSE_IDS\.length\}/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
});

test("shows waiting tasks, bounded memory, ready queue, CPU, and time history", () => {
  const component = source("components/CpuSchedulerGame.tsx");
  for (const phrase of ["任务等待区", "内存占用", "就绪队列", "CPU 核心", "时间片历史", "运行一个时间片"]) assert.match(component, new RegExp(phrase));
  assert.match(component, /Array\.from\(\{ length: mission\.capacity \}/);
  assert.match(component, /getUsedMemory/);
  assert.match(component, /loadCpuTask/);
  assert.match(component, /runCpuTimeSlice/);
  assert.match(component, /role="status"/);
  assert.match(component, /cpuTaskShortcutIndex/);
  assert.match(component, /onKeyDown=\{handleSchedulerKeyDown\}/);
  assert.match(component, /按数字键/);
  assert.match(component, /按 <kbd>Enter<\/kbd>/);
  assert.match(component, /aria-keyshortcuts/);
});

test("labels queue front, tail, work, and released memory without color dependence", () => {
  const component = source("components/CpuSchedulerGame.tsx");
  assert.match(component, /队首/);
  assert.match(component, /队尾/);
  assert.match(component, /剩余 \{process\.remainingWork\} 片/);
  assert.match(component, /已完成 · 内存已释放/);
  assert.match(component, /aria-label=\{`内存第 \$\{index \+ 1\} 格/);
  assert.match(component, /aria-current/);
});

test("supports six-shift completion, rotation, and focus handoff", () => {
  const component = source("components/CpuSchedulerGame.tsx");
  assert.match(component, /接入下一班任务/);
  assert.match(component, /重玩六个调度班次/);
  assert.match(component, /buildCpuSchedulerDeck\(nextRotation\)/);
  assert.match(component, /headingRef\.current\?\.focus/);
});

test("lazy-loads scheduler after packet escort with responsive accessible styles", () => {
  const map = source("components/IslandMap.tsx");
  const component = source("components/CpuSchedulerGame.tsx");
  const css = source("components/CpuSchedulerGame.css");
  const arcade = source("lib/game-arcade.ts");
  assert.match(map, /const CpuSchedulerGame = lazy\(\(\) => import\("@\/components\/CpuSchedulerGame"\)/);
  assert.match(map, /<PacketEscort[\s\S]*?<CpuSchedulerGame[\s\S]*?<LearningPlan/);
  assert.match(arcade, /targetId: "cpu-scheduler-game"/);
  assert.match(map, /正在启动 CPU 时间片调度台/);
  assert.match(component, /import "\.\/CpuSchedulerGame\.css"/);
  assert.match(css, /\.cpu-scheduler-action[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.cpu-scheduler-layout[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?animation:\s*none/);
  assert.match(css, /\.cpu-keyboard-hint/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?aria-current/);
});
