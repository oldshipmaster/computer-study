import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { expandRepeat, runSquareLoop } from "../lib/repeat-power-lesson.ts";

test("expands a fixed-count loop without mutating its body", () => {
  const body = ["forward", "turnRight"];
  assert.deepEqual(expandRepeat(body, 3), ["forward", "turnRight", "forward", "turnRight", "forward", "turnRight"]);
  assert.deepEqual(body, ["forward", "turnRight"]);
});

test("four repeats draw a square and return to the start", () => {
  const result = runSquareLoop(4);
  assert.equal(result.success, true);
  assert.deepEqual(result.position, { x: 0, y: 0 });
  assert.equal(result.batteries, 4);
  assert.equal(result.expandedInstructions, 8);
});

test("wrong repeat counts produce observable partial paths", () => {
  assert.equal(runSquareLoop(3).success, false);
  assert.notDeepEqual(runSquareLoop(3).position, { x: 0, y: 0 });
  assert.equal(runSquareLoop(0).expandedInstructions, 0);
});

test("the loop lab draws only the path produced by the selected repeat count", () => {
  const source = readFileSync(new URL("../components/lessons/programming/LoopLab.tsx", import.meta.url), "utf8");
  assert.match(source, /loop-path-board/);
  assert.match(source, /path-edge--drawn/);
  assert.match(source, /battery--collected/);
  assert.match(source, /Math\.min\(count, 4\)/);
  assert.match(source, /result\.position/);
});
