import assert from "node:assert/strict";
import test from "node:test";
import { evaluateSetup, evaluateRoutine } from "../lib/healthy-habits-lesson.ts";

test("recognizes a comfortable supported setup", () => {
  assert.equal(evaluateSetup({ feetSupported: true, shouldersRelaxed: true, screenComfortable: true, lightComfortable: true }).ready, true);
  assert.equal(evaluateSetup({ feetSupported: false, shouldersRelaxed: true, screenComfortable: true, lightComfortable: true }).ready, false);
});

test("requires off-screen breaks between short learning sessions", () => {
  assert.equal(evaluateRoutine(["setup", "learn", "look-far", "move", "learn"]).balanced, true);
  assert.equal(evaluateRoutine(["setup", "learn", "learn", "learn"]).balanced, false);
});

test("prioritizes telling an adult when discomfort appears", () => {
  assert.equal(evaluateRoutine(["setup", "learn", "discomfort", "tell-adult"]).balanced, true);
  assert.equal(evaluateRoutine(["setup", "learn", "discomfort", "keep-going"]).balanced, false);
});
