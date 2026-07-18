import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("offers a bounded child-friendly sprint flow", () => {
  const component = source("components/KnowledgeSprint.tsx");
  assert.match(component, /deck\.length < 3/);
  assert.match(component, /<progress/);
  assert.match(component, /护盾/);
  assert.match(component, /sprint-answer/);
  assert.match(component, /role="status"/);
  assert.match(component, /下一题|查看战报/);
  assert.match(component, /本机最佳/);
  assert.match(component, /reportedRunRef/);
  assert.match(component, /onRecordSprint\(state\.score\)/);
  assert.match(component, /回到对应课程加练/);
  assert.match(component, /onStartCourse\(state\.missedCourseIds\[0\]\)/);
  assert.match(component, /onKeyDown=\{handleSprintKeyboard\}/);
  assert.match(component, /event\.repeat/);
  assert.match(component, /event\.(?:metaKey|ctrlKey|altKey)/);
  assert.match(component, /event\.nativeEvent\.isComposing/);
  assert.match(component, /按\s*<kbd>A<\/kbd>、<kbd>B<\/kbd>、<kbd>C<\/kbd>\s*也能作答/);
  assert.match(component, /aria-keyshortcuts=/);
  assert.match(component, /event\.key === "Enter"/);
  assert.match(component, /event\.target instanceof HTMLButtonElement/);
  assert.match(component, /advanceKnowledgeSprint\(current, deck, 0\)/);
  assert.match(component, /按 <kbd>Enter<\/kbd> 进入/);
  assert.match(component, /sprint-answer--correct/);
  assert.match(component, /sprint-answer--miss/);
  assert.match(component, /正确答案/);
  assert.match(component, /你的选择/);
  assert.match(component, /sprint-points-pop/);
  assert.match(component, /\+\{state\.lastAward\}/);
});

test("integrates the sprint between missions and the learning plan", () => {
  const map = source("components/IslandMap.tsx");
  const app = source("components/BitIslandApp.tsx");
  const arcade = source("lib/game-arcade.ts");
  assert.match(map, /<AdventureMissionBoard[\s\S]*?<KnowledgeSprint[\s\S]*?<LearningPlan/);
  assert.match(arcade, /targetId: "knowledge-sprint"/);
  assert.match(map, /knowledgeSprint:\s*\{\s*bestScore: number;\s*runsPlayed: number/);
  assert.match(app, /recordKnowledgeSprint/);
  assert.match(app, /onRecordSprint=\{recordSprintScore\}/);
  assert.match(app, /knowledgeSprint=\{progress\.knowledgeSprint\}/);
});

test("keeps sprint controls touch-sized and accessible in alternate modes", () => {
  const css = source("app/globals.css");
  assert.match(css, /\.sprint-answer[^{]*\{[^}]*min-height:\s*(?:44px|2\.75rem)/);
  assert.match(css, /\.sprint-next[^{]*\{[^}]*min-height:\s*(?:44px|2\.75rem)/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.sprint-answers[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?\.sprint-combo[\s\S]*?animation:\s*none/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?\.sprint-answer--selected[\s\S]*?\.sprint-shield/);
  assert.match(css, /\.sprint-answer\s*>\s*kbd/);
  assert.match(css, /\.sprint-keyboard-hint/);
  assert.match(css, /\.sprint-answer--correct/);
  assert.match(css, /\.sprint-answer--miss/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?\.sprint-answer--correct/);
  assert.match(css, /\.sprint-points-pop/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?\.sprint-points-pop[\s\S]*?animation:\s*none/);
});
