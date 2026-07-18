import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function sourceFile(relativePath) {
  const fileUrl = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(fileUrl), `Missing source file ${relativePath}`);
  return readFileSync(fileUrl, "utf8");
}

test("renders an accessible mission board powered by the pure mission engine", () => {
  const source = sourceFile("components/AdventureMissionBoard.tsx");

  for (const helper of [
    "buildAdventureMissions",
    "getAdventureEnergy",
    "getExplorerRank",
    "getRankProgress",
  ]) {
    assert.match(source, new RegExp(helper));
  }
  assert.match(source, /id="adventure-missions"/);
  assert.match(source, /比比的探险任务牌/);
  assert.match(source, /<progress/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /换一批任务/);
  assert.match(source, /missions\.map/);
  assert.match(source, /onStartCourse\(mission\.course\.id\)/);
});

test("places the mission board before the five-session plan and passes play counts", () => {
  const mapSource = sourceFile("components/IslandMap.tsx");
  const appSource = sourceFile("components/BitIslandApp.tsx");
  const missionBoardPosition = mapSource.indexOf("<AdventureMissionBoard");
  const learningPlanPosition = mapSource.indexOf("<LearningPlan");

  assert.match(mapSource, /import \{ AdventureMissionBoard \}/);
  assert.ok(missionBoardPosition >= 0, "missing mission board in the map");
  assert.ok(learningPlanPosition > missionBoardPosition, "mission board must appear before the learning plan");
  assert.match(mapSource, /coursePlayCounts: Record<string, number>/);
  assert.match(mapSource, /coursePlayCounts=\{coursePlayCounts\}/);
  assert.match(appSource, /coursePlayCounts=\{progress\.coursePlayCounts\}/);
});

test("keeps mission cards touch-sized, responsive, and calm in reduced motion", () => {
  const css = sourceFile("app/globals.css");
  const cardBlock = css.match(/\.adventure-mission-card\s*\{([^}]*)\}/s)?.[1] ?? "";
  const minimumHeight = Number.parseFloat(cardBlock.match(/min-height:\s*([\d.]+)px;/)?.[1] ?? "0");

  assert.ok(minimumHeight >= 44, `mission cards need at least 44px of height, received ${minimumHeight}px`);
  assert.match(css, /@media \(max-width:\s*680px\)[\s\S]*?\.adventure-mission-grid\s*\{[^}]*grid-template-columns:\s*1fr;/s);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?\.adventure-mission-card[^}]*transition:\s*none;/s);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?\.explorer-equipment[^}]*animation:\s*none;/s);
});

test("celebrates the exact earned energy without calling every replay a new badge", () => {
  const appSource = sourceFile("components/BitIslandApp.tsx");
  const completionSource = sourceFile("components/lessons/LessonCompletion.tsx");

  assert.match(appSource, /getCourseCompletionReward/);
  assert.match(appSource, /setLastAdventureReward/);
  assert.match(appSource, /adventureReward=\{lastAdventureReward/);
  assert.match(completionSource, /adventureReward\.points/);
  assert.match(completionSource, /探险能量/);
  assert.match(completionSource, /本课能量已收集满/);
  assert.match(completionSource, /重玩完成/);
});
