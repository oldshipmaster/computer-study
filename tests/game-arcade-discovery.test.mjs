import test from "node:test";
import assert from "node:assert/strict";
import { COURSES } from "../lib/course-data.ts";
import { GAME_ARCADE_DEFINITIONS, buildClosestGameUnlocks, buildGameArcadeEntries, buildGameArcadeRecommendations, filterGameArcadeEntries, gameArcadePlaylistBreaks, gameArcadePlaylistLimit } from "../lib/game-arcade.ts";

test("assigns every game to one child-readable discovery category", () => {
  const expected = new Set(["quest", "code", "systems", "life"]);
  assert.equal(GAME_ARCADE_DEFINITIONS.length, 20);
  for (const game of GAME_ARCADE_DEFINITIONS) assert.ok(expected.has(game.category), `${game.id}: ${game.category}`);
  for (const category of expected) assert.ok(GAME_ARCADE_DEFINITIONS.some((game) => game.category === category), category);
});

test("assigns every game to a progressive play level", () => {
  const expected = new Set(["starter", "adventure", "mastery"]);
  for (const game of GAME_ARCADE_DEFINITIONS) assert.ok(expected.has(game.level), `${game.id}: ${game.level}`);
  for (const level of expected) assert.ok(GAME_ARCADE_DEFINITIONS.some((game) => game.level === level), level);
});

test("recommends only unlocked unique games and never pads a short list", () => {
  const newLearner = buildGameArcadeEntries([]);
  assert.deepEqual(buildGameArcadeRecommendations(newLearner, 0).map((game) => game.id), ["missions"]);
  const partial = buildGameArcadeEntries(["bits-and-data", "boolean-logic", "file-home", "name-your-work"]);
  const recommendation = buildGameArcadeRecommendations(partial, 0);
  assert.ok(recommendation.length <= 3);
  assert.equal(new Set(recommendation.map((game) => game.id)).size, recommendation.length);
  assert.ok(recommendation.every((game) => game.unlocked));
});

test("spreads a full recommendation across themes", () => {
  const entries = buildGameArcadeEntries(GAME_ARCADE_DEFINITIONS.flatMap((game) => game.gate.type === "exact" ? game.gate.courseIds : []));
  const recommendation = buildGameArcadeRecommendations(entries, 0);
  assert.equal(recommendation.length, 3);
  assert.equal(new Set(recommendation.map((game) => game.category)).size, 3);
});

test("rotates deterministically and normalizes invalid rotation", () => {
  const entries = buildGameArcadeEntries(GAME_ARCADE_DEFINITIONS.flatMap((game) => game.gate.type === "exact" ? game.gate.courseIds : []));
  const first = buildGameArcadeRecommendations(entries, 0).map((game) => game.id);
  assert.deepEqual(buildGameArcadeRecommendations(entries, Number.NaN).map((game) => game.id), first);
  assert.deepEqual(buildGameArcadeRecommendations(entries, -5).map((game) => game.id), first);
  assert.notDeepEqual(buildGameArcadeRecommendations(entries, 1).map((game) => game.id), first);
  assert.deepEqual(buildGameArcadeRecommendations(entries, 1).map((game) => game.id), buildGameArcadeRecommendations(entries, 1).map((game) => game.id));
});

test("bounds recommendation limits", () => {
  const entries = buildGameArcadeEntries(GAME_ARCADE_DEFINITIONS.flatMap((game) => game.gate.type === "exact" ? game.gate.courseIds : []));
  assert.equal(buildGameArcadeRecommendations(entries, 0, 0).length, 0);
  assert.equal(buildGameArcadeRecommendations(entries, 0, 99).length, entries.filter((entry) => entry.unlocked).length);
});

test("searches game titles and mechanics with combinable local filters", () => {
  const entries = buildGameArcadeEntries(GAME_ARCADE_DEFINITIONS.flatMap((game) => game.gate.type === "exact" ? game.gate.courseIds : []));
  assert.ok(filterGameArcadeEntries(entries, { query: "路由" }).some((game) => game.id === "systems-depth"));
  assert.deepEqual(filterGameArcadeEntries(entries, { query: "  cpu  " }).map((game) => game.id), ["cpu", "factory", "os-command"]);
  assert.ok(filterGameArcadeEntries(entries, { category: "systems", level: "starter", unlockedOnly: true }).every((game) => game.category === "systems" && game.level === "starter" && game.unlocked));
  assert.equal(filterGameArcadeEntries(entries, { query: "不存在的玩法词" }).length, 0);
});

test("turns available time into one to three complete game sessions",()=>{assert.equal(gameArcadePlaylistLimit(10),1);assert.equal(gameArcadePlaylistLimit(20),2);assert.equal(gameArcadePlaylistLimit(30),3);assert.equal(gameArcadePlaylistLimit(Number.NaN),1);assert.equal(gameArcadePlaylistLimit(-5),1);assert.equal(gameArcadePlaylistLimit(99),3);});

test("places one off-screen break between each pair of planned games", () => {
  assert.equal(gameArcadePlaylistBreaks(10), 0);
  assert.equal(gameArcadePlaylistBreaks(20), 1);
  assert.equal(gameArcadePlaylistBreaks(30), 2);
  assert.equal(gameArcadePlaylistBreaks(Number.NaN), 0);
});

test("ranks the nearest locked games by remaining lessons without mutating entries", () => {
  const entries = buildGameArcadeEntries(["bits-and-data"]);
  const snapshot = entries.map((entry) => entry.id);
  const closest = buildClosestGameUnlocks(entries, 3);
  assert.equal(closest.length, 3);
  assert.deepEqual(closest.map((entry) => entry.progress.maximum - entry.progress.value), [1, 2, 3]);
  assert.equal(closest[0].id, "circuit");
  assert.equal(closest[0].nextCourseId, "boolean-logic");
  assert.deepEqual(entries.map((entry) => entry.id), snapshot);
  assert.ok(closest.every((entry) => !entry.unlocked && entry.nextCourseId));
});

test("nearest unlocks clamp invalid limits and disappear when every game is open", () => {
  const entries = buildGameArcadeEntries([]);
  assert.deepEqual(buildClosestGameUnlocks(entries, Number.NaN), []);
  assert.deepEqual(buildClosestGameUnlocks(entries, -2), []);
  const allCourses = COURSES.map((course) => course.id);
  assert.deepEqual(buildClosestGameUnlocks(buildGameArcadeEntries(allCourses), 3), []);
});

test("filters session favorites together with the existing discovery controls", () => {
  const entries = buildGameArcadeEntries(COURSES.map((course) => course.id));
  assert.deepEqual(filterGameArcadeEntries(entries, { favoritesOnly: true, favoriteIds: ["circuit", "pilot", "unknown", "pilot"] }).map((game) => game.id), ["circuit", "pilot"]);
  assert.deepEqual(filterGameArcadeEntries(entries, { favoritesOnly: true, favoriteIds: ["circuit", "pilot"], category: "life" }).map((game) => game.id), ["pilot"]);
  assert.deepEqual(filterGameArcadeEntries(entries, { favoritesOnly: true }).map((game) => game.id), []);
});

test("puts unlocked favorites first in a time-boxed recommendation without duplicates", () => {
  const entries = buildGameArcadeEntries(COURSES.map((course) => course.id));
  const picks = buildGameArcadeRecommendations(entries, 0, 3, ["pilot", "circuit", "unknown", "pilot"]);
  assert.deepEqual(picks.slice(0, 2).map((game) => game.id), ["circuit", "pilot"]);
  assert.equal(new Set(picks.map((game) => game.id)).size, 3);
  assert.ok(picks.every((game) => game.unlocked));
  const rotated = buildGameArcadeRecommendations(entries, 1, 2, ["pilot", "circuit"]);
  assert.deepEqual(rotated.map((game) => game.id), ["pilot", "circuit"]);
});

test("ignores locked favorite ids when building recommendations", () => {
  const entries = buildGameArcadeEntries([]);
  assert.deepEqual(buildGameArcadeRecommendations(entries, 0, 3, ["circuit", "missions"]).map((game) => game.id), ["missions"]);
});

test("builds the time-boxed playlist from the selected theme and level", () => {
  const entries = buildGameArcadeEntries(COURSES.map((course) => course.id));
  const systemsStarter = buildGameArcadeRecommendations(entries, 0, 3, [], { category: "systems", level: "starter" });
  assert.ok(systemsStarter.length > 0);
  assert.ok(systemsStarter.every((game) => game.category === "systems" && game.level === "starter"));
  const lifeAdventure = buildGameArcadeRecommendations(entries, 0, 3, ["pilot", "creative"], { category: "life", level: "adventure" });
  assert.ok(lifeAdventure.length > 0);
  assert.ok(lifeAdventure.every((game) => game.category === "life" && game.level === "adventure"));
  assert.equal(lifeAdventure[0].id, "creative");
});

test("returns an honest empty playlist when no unlocked game matches", () => {
  const entries = buildGameArcadeEntries([]);
  assert.deepEqual(buildGameArcadeRecommendations(entries, 0, 3, [], { category: "systems", level: "mastery" }), []);
});

test("uses search and favorite-only filters for the time-boxed playlist", () => {
  const entries = buildGameArcadeEntries(COURSES.map((course) => course.id));
  const routePicks = buildGameArcadeRecommendations(entries, 0, 3, [], { query: " 路由 " });
  assert.ok(routePicks.length > 0);
  assert.ok(routePicks.every((game) => `${game.title} ${game.mechanic}`.includes("路由")));
  const favoritePicks = buildGameArcadeRecommendations(entries, 0, 3, ["pilot", "circuit"], { favoritesOnly: true });
  assert.deepEqual(favoritePicks.map((game) => game.id), ["circuit", "pilot"]);
  assert.deepEqual(buildGameArcadeRecommendations(entries, 0, 3, [], { favoritesOnly: true }), []);
});
