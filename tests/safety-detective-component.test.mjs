import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("keeps the detective office behind all five safety lighthouse courses", () => {
  const component = source("components/SafetyDetectiveGame.tsx");
  for (const id of ["password-guardian", "private-information", "popup-fog", "healthy-computer-habits", "light-bit-island"]) assert.match(component, new RegExp(id));
  assert.match(component, /已完成 \{completedRequired\.length\} \/ \{REQUIRED_COURSE_IDS\.length\}/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
});

test("renders clues, safe actions, feedback, and a detective evidence board", () => {
  const component = source("components/SafetyDetectiveGame.tsx");
  assert.match(component, /step\.clues\.map/);
  assert.match(component, /clue\.detail/);
  assert.match(component, /step\.options\.map/);
  assert.match(component, /chooseSafetyAction/);
  assert.match(component, /advanceSafetyStep/);
  assert.match(component, /advanceSafetyCase/);
  assert.match(component, /侦探证据板/);
  assert.match(component, /role="status"/);
  assert.match(component, /aria-current/);
  assert.match(component, /<progress/);
  assert.match(component, /numberShortcutIndex/);
  assert.match(component, /onKeyDown=\{handleDetectiveKeyDown\}/);
  assert.match(component, /aria-keyshortcuts=\{String\(index \+ 1\)\}/);
  assert.match(component, /按键盘数字/);
  assert.match(component, /按 <kbd>Enter<\/kbd>/);
});

test("supports six cases, replay rotation, and focus handoff", () => {
  const component = source("components/SafetyDetectiveGame.tsx");
  assert.match(component, /打开下一件案件/);
  assert.match(component, /重查六件案件/);
  assert.match(component, /buildSafetyCaseDeck\(nextRotation\)/);
  assert.match(component, /headingRef\.current\?\.focus/);
  for (const phrase of ["保护个人信息", "长且独特的口令", "识别可疑弹窗", "健康使用电脑", "共享设备收尾", "停止并求助"]) assert.match(component, new RegExp(phrase));
  assert.doesNotMatch(component, /<input|<textarea|href=/);
});

test("lazy-loads after data structure harbor with responsive accessible styles", () => {
  const map = source("components/IslandMap.tsx");
  const component = source("components/SafetyDetectiveGame.tsx");
  const css = source("components/SafetyDetectiveGame.css");
  assert.match(map, /const SafetyDetectiveGame = lazy\(\(\) => import\("@\/components\/SafetyDetectiveGame"\)/);
  assert.match(map, /<DataStructureHarbor[\s\S]*?<SafetyDetectiveGame[\s\S]*?<LearningPlan/);
  assert.match(map, /正在整理数字安全案件/);
  assert.match(component, /import "\.\/SafetyDetectiveGame\.css"/);
  assert.match(css, /\.safety-action[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.safety-detective-layout[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?animation:\s*none/);
  assert.match(css, /\.safety-keyboard-hint/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?aria-current/);
});
