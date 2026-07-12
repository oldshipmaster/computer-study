import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { INITIAL_GRID_STATE, moveRobot, coordinateLabel } from "../lib/grid-city-lesson.ts";

test("labels row and column coordinates for children", () => {
  assert.equal(coordinateLabel({ row: 2, col: 3 }), "第2行，第3列");
});

test("moves within a 6 by 6 grid and blocks walls", () => {
  let state = moveRobot(INITIAL_GRID_STATE, "right");
  assert.deepEqual(state.position, { row: 1, col: 2 });
  state = moveRobot(state, "up");
  assert.deepEqual(state.position, { row: 1, col: 2 });
  assert.match(state.feedback, /边界/);
});

test("does not enter an obstacle and collects targets once", () => {
  const atObstacleEdge = { ...INITIAL_GRID_STATE, position: { row: 2, col: 1 } };
  const blocked = moveRobot(atObstacleEdge, "right");
  assert.deepEqual(blocked.position, { row: 2, col: 1 });
  const nearTarget = { ...INITIAL_GRID_STATE, position: { row: 1, col: 3 } };
  const collected = moveRobot(nearTarget, "down");
  assert.deepEqual(collected.visitedTargets, ["2-3"]);
  assert.deepEqual(moveRobot(collected, "up").visitedTargets, ["2-3"]);
});

test("groups accessible grid cells into six semantic rows", () => {
  const source = readFileSync(new URL("../components/lessons/programming/GridCityGame.tsx", import.meta.url), "utf8");
  assert.match(source, /role="row"/);
  assert.match(source, /Array\.from\(\{ length: GRID_SIZE \}, \(_, rowIndex\)/);
});
