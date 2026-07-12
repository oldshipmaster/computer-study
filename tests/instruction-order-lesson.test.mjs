import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { executeSequence, moveInstruction } from "../lib/instruction-order-lesson.ts";

test("executes a complete repair sequence in order", () => {
  const result = executeSequence(["wake", "collect", "repair", "return"]);
  assert.equal(result.success, true);
  assert.deepEqual(result.completed, ["wake", "collect", "repair", "return"]);
});

test("same instructions in the wrong order stop at the first mismatch", () => {
  const result = executeSequence(["collect", "wake", "repair", "return"]);
  assert.equal(result.success, false);
  assert.equal(result.firstMismatch, 0);
  assert.deepEqual(result.completed, []);
});

test("reorders without mutating the original queue", () => {
  const queue = ["collect", "wake", "repair", "return"];
  const reordered = moveInstruction(queue, 1, 0);
  assert.deepEqual(reordered, ["wake", "collect", "repair", "return"]);
  assert.deepEqual(queue, ["collect", "wake", "repair", "return"]);
});

test("the sequence builder visualizes execution until the first blocked step", () => {
  const source = readFileSync(new URL("../components/lessons/programming/SequenceBuilder.tsx", import.meta.url), "utf8");
  assert.match(source, /execution-track/);
  assert.match(source, /execution-step--complete/);
  assert.match(source, /execution-step--blocked/);
  assert.match(source, /前置条件/);
  assert.match(source, /setRan/);
});
