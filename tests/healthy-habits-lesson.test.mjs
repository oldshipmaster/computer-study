import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
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

test("planner visualizes posture and the screen-break rhythm", () => {
  const source = readFileSync(new URL("../components/lessons/safety/HabitPlanner.tsx", import.meta.url), "utf8");
  assert.match(source, /comfort-desk/);
  assert.match(source, /desk-person--relaxed/);
  assert.match(source, /desk-feet--supported/);
  assert.match(source, /desk-screen--comfortable/);
  assert.match(source, /desk-light--comfortable/);
  assert.match(source, /节奏统计/);
  assert.match(source, /屏幕学习.*分钟/s);
  assert.match(source, /离屏休息/);
});
