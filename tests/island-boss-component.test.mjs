import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("renders a thirteen-island radar with honest unlock progress", () => {
  const component = source("components/IslandBossArena.tsx");
  assert.match(component, /ISLAND_BOSSES\.map/);
  assert.match(component, /已完成 \{unlock\.completedCount\} \/ \{unlock\.requiredCount\} 课/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
  assert.match(component, /已点亮|可挑战|未解锁/);
  assert.match(component, /completedBossIds\.includes/);
});

test("offers evidence, ordered actions, core explanation, and replay", () => {
  const component = source("components/IslandBossArena.tsx");
  assert.match(component, /证据扫描/);
  assert.match(component, /行动编队/);
  assert.match(component, /原理核心/);
  assert.match(component, /aria-pressed/);
  assert.match(component, /removeBossAction/);
  assert.match(component, /撤回/);
  assert.match(component, /role="status"/);
  assert.match(component, /reportedBossRef/);
  assert.match(component, /onCompleteBoss\(activeBoss\.id\)/);
  assert.match(component, /重玩这场 Boss 战/);
  assert.match(component, /stageHeadingRef\.current\?\.focus/);
  assert.match(component, /onKeyDown=\{chooseBossByKeyboard\}/);
  assert.match(component, /event\.repeat/);
  assert.match(component, /event\.nativeEvent\.isComposing/);
  assert.match(component, /按数字键/);
  assert.match(component, /aria-keyshortcuts=/);
  assert.match(component, /<kbd aria-hidden="true">/);
  assert.match(component, /removeBossAction\(current, choice\.id\)/);
});

test("integrates the arena after sprint and before the learning plan", () => {
  const map = source("components/IslandMap.tsx");
  const app = source("components/BitIslandApp.tsx");
  const arcade = source("lib/game-arcade.ts");
  assert.match(map, /<KnowledgeSprint[\s\S]*?<IslandBossArena[\s\S]*?<LearningPlan/);
  assert.match(arcade, /targetId: "island-boss-arena"/);
  assert.match(app, /completeIslandBoss/);
  assert.match(app, /completedBossIds=\{progress\.completedBossIds\}/);
  assert.match(app, /onCompleteBoss=\{recordBossVictory\}/);
});

test("keeps boss controls usable on touch, mobile, reduced motion, and forced colors", () => {
  const css = source("app/globals.css");
  assert.match(css, /\.boss-(?:evidence|action|explanation)[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.boss-radar[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?\.boss-core-icon[\s\S]*?animation:\s*none/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?\.boss-evidence\[aria-pressed="true"\][\s\S]*?\.boss-stage--complete/);
  assert.match(css, /\.boss-(?:evidence|action|explanation)\s*>\s*kbd/);
});
