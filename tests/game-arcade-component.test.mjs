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

test("keeps one sticky return route available throughout the complete game gallery", () => {
  const map = source("components/IslandMap.tsx");
  const css = source("app/globals.css");
  const gallery = map.match(/<div className="game-playground"[\s\S]*?<\/div>\s*<LearningPlan/)?.[0] ?? "";
  assert.match(gallery, /className="game-return-dock"/);
  assert.match(gallery, /href="#game-arcade"/);
  assert.match(gallery, /<AdventureMissionBoard[\s\S]*?<IslandChampionshipRelay/);
  assert.match(css, /\.game-return-dock[^{]*\{[^}]*position:\s*sticky/);
  assert.match(css, /\.game-return-dock a[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /\.game-playground\s*>\s*\[id\][^{]*\{[^}]*scroll-margin-top:\s*84px/);
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

test("offers rotating recommendations and reversible discovery filters", () => {
  const component = source("components/GameArcade.tsx");
  assert.match(component, /buildGameArcadeRecommendations/);
  assert.match(component, /换一组推荐/);
  assert.match(component, /今天想玩这几局/);
  assert.match(component, /\(\[10, 20, 30\] as const\)/);
  assert.match(component, /我有 \{minutes\} 分钟/);
  assert.match(component, /gameArcadePlaylistLimit/);
  assert.match(component, /gameArcadePlaylistBreaks/);
  assert.match(component, /中间安排 \{playlistBreaks\} 次离屏休息/);
  assert.match(component, /aria-pressed=\{category === option\.id\}/);
  assert.match(component, /aria-pressed=\{unlockedOnly\}/);
  assert.match(component, /只看已解锁/);
  assert.match(component, /清除筛选/);
  assert.match(component, /placeholder="搜索游戏名称或玩法"/);
  assert.match(component, /aria-label="搜索游戏"/);
  assert.match(component, /filterGameArcadeEntries/);
  assert.match(component, /favoriteIds, \{ category, level \}/);
  assert.match(component, /今日推荐会跟随主题和阶段筛选/);
  assert.match(component, /当前主题和阶段还没有已解锁玩法/);
  assert.match(component, /查看更新后的今日推荐/);
  assert.match(component, /href="#game-arcade-picks-heading"/);
  assert.match(component, /role="status"/);
  for (const label of ["全部玩法", "综合挑战", "编程与逻辑", "电脑与网络", "安全与文件"]) assert.match(component, new RegExp(label));
  assert.match(component, /aria-pressed=\{level === option\.id\}/);
  for (const label of ["全部阶段", "入门探险", "进阶挑战", "大师联赛"]) assert.match(component, new RegExp(label));
});

test("keeps recommendation and filter controls touch-sized and responsive", () => {
  const css = source("components/GameArcade.css");
  assert.match(css, /\.game-arcade-filter[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /\.game-arcade-recommendation[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*?\.game-arcade-recommendations[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?aria-pressed="true"/);
});

test("shows a short nearest-unlock learning route", () => {
  const component = source("components/GameArcade.tsx");
  const css = source("components/GameArcade.css");
  assert.match(component, /buildClosestGameUnlocks/);
  assert.match(component, /再学几课就能玩/);
  assert.match(component, /还差 \{remaining\} 课/);
  assert.match(component, /onStartCourse\(entry\.nextCourseId!\)/);
  assert.match(css, /\.game-arcade-unlock-route/);
  assert.match(css, /\.game-arcade-unlock-card/);
});

test("lets a child collect and filter favorite games for the current visit", () => {
  const component = source("components/GameArcade.tsx");
  const css = source("components/GameArcade.css");
  assert.match(component, /favoriteIds/);
  assert.match(component, /toggleFavorite/);
  assert.match(component, /aria-label=\{`\$\{favoriteIds\.includes\(entry\.id\) \? "取消收藏" : "收藏"\}\$\{entry\.title\}`\}/);
  assert.match(component, /★ 只看收藏/);
  assert.match(component, /本次打开页面内保留/);
  assert.match(component, /收藏玩法会优先进入今日推荐/);
  assert.match(component, /gameArcadePlaylistLimit\(sessionMinutes\), favoriteIds/);
  assert.match(css, /\.game-arcade-favorite/);
});

test("remembers the last opened game and offers a one-click session resume", () => {
  const component = source("components/GameArcade.tsx");
  const css = source("components/GameArcade.css");
  assert.match(component, /lastGameId/);
  assert.match(component, /setLastGameId\(entry\.id\)/);
  assert.match(component, /继续刚才玩的/);
  assert.match(component, /href=\{`#\$\{lastGame\.targetId\}`\}/);
  assert.match(component, /只在本次打开页面内记住/);
  assert.match(css, /\.game-arcade-resume/);
  assert.match(css, /\.game-arcade-resume[^{]*\{[^}]*min-height:\s*44px/);
});
