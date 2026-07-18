import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("renders all catalog games with unlock status, mechanic, duration, and progress", () => {
  const component = source("components/GameArcade.tsx");
  assert.match(component, /buildGameArcadeEntries/);
  assert.match(component, /entry\.mechanic/);
  assert.match(component, /entry\.duration/);
  assert.match(component, /entry\.unlocked/);
  assert.match(component, /entry\.progress\.value/);
  assert.match(component, /entry\.progress\.maximum/);
  assert.match(component, /已解锁/);
  assert.match(component, /学习中/);
});

test("links unlocked games and sends locked games to the next prerequisite", () => {
  const component = source("components/GameArcade.tsx");
  assert.match(component, /href=\{`#\$\{entry\.targetId\}`\}/);
  assert.match(component, /onStartCourse\(entry\.nextCourseId!?\)/);
  assert.match(component, /下一课：\{nextCourse\?\.title/);
  assert.match(component, /aria-label=\{`前往\$\{entry\.title\}`\}/);
});

test("lazy-loads the arcade before individual games and keeps one header entry", () => {
  const map = source("components/IslandMap.tsx");
  assert.match(map, /const GameArcade = lazy\(\(\) => import\("@\/components\/GameArcade"\)/);
  assert.match(map, /<GameArcade[\s\S]*?<AdventureMissionBoard/);
  assert.match(map, /href="#game-arcade">游戏中心/);
  assert.match(map, /正在整理比特岛游戏中心/);
  const nav = map.match(/<nav className="section-jump-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
  for (const oldTarget of ["adventure-missions", "knowledge-sprint", "island-boss-arena", "logic-circuit-lab", "robot-code-expedition", "packet-escort", "cpu-scheduler-game"]) assert.doesNotMatch(nav, new RegExp(`href="#${oldTarget}"`));
});

test("ships game cards in a separate responsive accessible stylesheet", () => {
  const component = source("components/GameArcade.tsx");
  const css = source("components/GameArcade.css");
  assert.match(component, /import "\.\/GameArcade\.css"/);
  assert.match(css, /\.game-arcade-action[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*?\.game-arcade-grid[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?animation:\s*none/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?\.game-arcade-card\.is-unlocked/);
});
