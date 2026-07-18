import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
const source = (path) => { const file = new URL(`../${path}`, import.meta.url); assert.ok(existsSync(file), `Missing ${path}`); return readFileSync(file, "utf8"); };

test("keeps the studio behind all five creative workshop courses", () => {
  const component = source("components/CreativeStudioChallenge.tsx");
  for (const id of ["pixel-art", "document-design", "slide-story", "media-copyright", "data-table"]) assert.match(component, new RegExp(id));
  assert.match(component, /已完成 \{completedRequired\.length\} \/ \{REQUIRED_COURSE_IDS\.length\}/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
});

test("renders a visual canvas, design decisions, feedback, and portfolio", () => {
  const component = source("components/CreativeStudioChallenge.tsx");
  assert.match(component, /step\.canvas\.map/);
  assert.match(component, /canvasCard\.detail/);
  assert.match(component, /step\.options\.map/);
  for (const fn of ["chooseCreativeDecision", "advanceCreativeStep", "advanceCreativeProject"]) assert.match(component, new RegExp(fn));
  assert.match(component, /项目作品集/);
  assert.match(component, /role="status"/);
  assert.match(component, /aria-current/);
  assert.match(component, /<progress/);
  assert.match(component, /numberShortcutIndex/);
  assert.match(component, /onKeyDown=\{handleStudioKeyDown\}/);
  assert.match(component, /aria-keyshortcuts=\{String\(index \+ 1\)\}/);
  assert.match(component, /按键盘数字/);
  assert.match(component, /按 <kbd>Enter<\/kbd>/);
});

test("supports six projects, rotated replay, and focus handoff", () => {
  const component = source("components/CreativeStudioChallenge.tsx");
  assert.match(component, /打开下一个项目/);
  assert.match(component, /重做六个项目/);
  assert.match(component, /buildCreativeProjectDeck\(nextRotation\)/);
  assert.match(component, /headingRef\.current\?\.focus/);
  for (const phrase of ["网格与有限色板", "标题、正文与留白", "故事顺序与单页重点", "许可、来源与再创作", "表头、数据类型与合计", "项目检查与观众视角"]) assert.match(component, new RegExp(phrase));
  assert.doesNotMatch(component, /<input|type="file"|FileReader/);
});

test("lazy-loads after file rescue with accessible responsive styles", () => {
  const map = source("components/IslandMap.tsx"); const component = source("components/CreativeStudioChallenge.tsx"); const css = source("components/CreativeStudioChallenge.css");
  assert.match(map, /const CreativeStudioChallenge = lazy\(\(\) => import\("@\/components\/CreativeStudioChallenge"\)/);
  assert.match(map, /<FileForestRescue[\s\S]*?<CreativeStudioChallenge[\s\S]*?<LearningPlan/);
  assert.match(map, /正在布置创作工坊项目赛/);
  assert.match(component, /import "\.\/CreativeStudioChallenge\.css"/);
  assert.match(css, /\.creative-studio-action[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.creative-studio-layout[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?animation:\s*none/);
  assert.match(css, /\.creative-studio-keyboard-hint/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?aria-current/);
});
