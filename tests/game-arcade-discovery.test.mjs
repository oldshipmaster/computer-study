import test from "node:test";
import assert from "node:assert/strict";
import { GAME_ARCADE_DEFINITIONS, buildGameArcadeEntries, buildGameArcadeRecommendations } from "../lib/game-arcade.ts";

test("assigns every game to one child-readable discovery category", () => {
  const expected = new Set(["quest", "code", "systems", "life"]);
  assert.equal(GAME_ARCADE_DEFINITIONS.length, 15);
  for (const game of GAME_ARCADE_DEFINITIONS) assert.ok(expected.has(game.category), `${game.id}: ${game.category}`);
  for (const category of expected) assert.ok(GAME_ARCADE_DEFINITIONS.some((game) => game.category === category), category);
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
