import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
const source = (path) => { const file = new URL(`../${path}`, import.meta.url); assert.ok(existsSync(file), `Missing ${path}`); return readFileSync(file, "utf8"); };

test("keeps rescue behind all five file forest courses", () => {
  const component = source("components/FileForestRescue.tsx");
  for (const id of ["file-home", "name-your-work", "move-and-copy", "file-types", "learning-backpack"]) assert.match(component, new RegExp(id));
  assert.match(component, /已完成 \{completedRequired\.length\} \/ \{REQUIRED_COURSE_IDS\.length\}/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
});

test("shows virtual files, actions, feedback, and rescue records", () => {
  const component = source("components/FileForestRescue.tsx");
  assert.match(component, /step\.files\.map/);
  assert.match(component, /virtualFile\.location/);
  assert.match(component, /step\.options\.map/);
  for (const fn of ["chooseFileAction", "advanceFileStep", "advanceFileMission"]) assert.match(component, new RegExp(fn));
  assert.match(component, /文件救援记录/);
  assert.match(component, /role="status"/);
  assert.match(component, /aria-current/);
  assert.match(component, /<progress/);
});

test("supports six rescues, replay rotation, and focus", () => {
  const component = source("components/FileForestRescue.tsx");
  assert.match(component, /接收下一次救援/);
  assert.match(component, /重玩六次救援/);
  assert.match(component, /buildFileRescueDeck\(nextRotation\)/);
  assert.match(component, /headingRef\.current\?\.focus/);
  for (const phrase of ["文件与文件夹路径", "文件命名与扩展名", "移动原件", "复制与数量", "文件类型", "恢复与搜索"]) assert.match(component, new RegExp(phrase));
  assert.doesNotMatch(component, /<input|type="file"|FileSystem/);
});

test("lazy-loads after factory with accessible responsive styles", () => {
  const map = source("components/IslandMap.tsx"); const component = source("components/FileForestRescue.tsx"); const css = source("components/FileForestRescue.css");
  assert.match(map, /const FileForestRescue = lazy\(\(\) => import\("@\/components\/FileForestRescue"\)/);
  assert.match(map, /<VirtualComputerFactory[\s\S]*?<FileForestRescue[\s\S]*?<LearningPlan/);
  assert.match(map, /正在召集文件森林救援队/);
  assert.match(component, /import "\.\/FileForestRescue\.css"/);
  assert.match(css, /\.file-rescue-action[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.file-rescue-layout[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?animation:\s*none/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?aria-current/);
});
