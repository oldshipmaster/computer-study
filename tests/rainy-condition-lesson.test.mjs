import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { evaluateCondition, runSafetyProgram } from "../lib/rainy-condition-lesson.ts";

test("chooses exactly one branch from a boolean condition", () => {
  assert.equal(evaluateCondition(true, "撑伞", "戴帽子"), "撑伞");
  assert.equal(evaluateCondition(false, "撑伞", "戴帽子"), "戴帽子");
});

test("reacts to weather and bridge signal at run time", () => {
  assert.deepEqual(runSafetyProgram({ raining: true, bridgeOpen: false }), { equipment: "umbrella", bridgeAction: "wait" });
  assert.deepEqual(runSafetyProgram({ raining: false, bridgeOpen: true }), { equipment: "sunhat", bridgeAction: "cross" });
});

test("the same program produces different safe outcomes for changing input", () => {
  const rain = runSafetyProgram({ raining: true, bridgeOpen: true });
  const sun = runSafetyProgram({ raining: false, bridgeOpen: true });
  assert.notEqual(rain.equipment, sun.equipment);
  assert.equal(rain.bridgeAction, sun.bridgeAction);
});

test("the condition lab exposes both decision trees and selected paths", () => {
  const source = readFileSync(new URL("../components/lessons/programming/ConditionLab.tsx", import.meta.url), "utf8");
  assert.match(source, /decision-tree/);
  assert.match(source, /decision-branch--selected/);
  assert.match(source, /条件为真/);
  assert.match(source, /条件为假/);
  assert.match(source, /program-output/);
});
