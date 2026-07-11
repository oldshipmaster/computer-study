import assert from "node:assert/strict";
import test from "node:test";
import { CHALLENGE, DIRECTIONS, moveShip, runProgram } from "../lib/flight-engine.mjs";

test("moves inside the grid and blocks an asteroid", () => {
  assert.deepEqual(moveShip({ x: 0, y: 2 }, "east", CHALLENGE),
    { position: { x: 1, y: 2 }, crashed: false });
  assert.deepEqual(moveShip({ x: 2, y: 2 }, "east", CHALLENGE),
    { position: { x: 2, y: 2 }, crashed: true });
});

test("runs instructions in order and collects the energy star", () => {
  const result = runProgram(["forward", "forward", "left", "forward", "collect"], CHALLENGE);
  assert.equal(result.success, true);
  assert.equal(result.collected, true);
  assert.equal(result.crashed, false);
  assert.equal(result.steps.length, 5);
});

test("returns safely to a failed result without mutating the challenge", () => {
  const before = JSON.stringify(CHALLENGE);
  const result = runProgram(["forward", "left", "forward"], CHALLENGE);
  assert.equal(result.success, false);
  assert.equal(JSON.stringify(CHALLENGE), before);
});

test("external direction mutation cannot alter program results", () => {
  const program = ["forward", "forward", "left", "forward", "collect"];
  const before = runProgram(program, CHALLENGE);

  try {
    DIRECTIONS.reverse();
  } catch (error) {
    assert.ok(error instanceof TypeError);
  }

  const after = runProgram(program, CHALLENGE);
  assert.deepEqual(after, before);
  assert.equal(after.success, true);
});
