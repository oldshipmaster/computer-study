import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BUG_CASES, diagnoseBug, applyFix } from "../lib/bug-catcher-lesson.ts";

test("diagnoses order, repeat-count, and condition bugs", () => {
  assert.equal(diagnoseBug(BUG_CASES[0]).bugType, "order");
  assert.equal(diagnoseBug(BUG_CASES[1]).bugType, "count");
  assert.equal(diagnoseBug(BUG_CASES[2]).bugType, "branch");
});

test("the proposed fix must match the observed evidence", () => {
  assert.equal(applyFix(BUG_CASES[0], "swap-first-two").fixed, true);
  assert.equal(applyFix(BUG_CASES[0], "repeat-four").fixed, false);
  assert.match(applyFix(BUG_CASES[0], "repeat-four").feedback, /证据/);
});

test("fixing does not mutate the original case", () => {
  const original = structuredClone(BUG_CASES[1]);
  applyFix(BUG_CASES[1], "repeat-four");
  assert.deepEqual(BUG_CASES[1], original);
});

test("the debug lab compares expected and actual output before fixing", () => {
  const source = readFileSync(new URL("../components/lessons/programming/DebugLab.tsx", import.meta.url), "utf8");
  assert.match(source, /debug-evidence-board/);
  assert.match(source, /期望结果/);
  assert.match(source, /实际结果/);
  assert.match(source, /firstDifference/);
  assert.match(source, /第一个不同点/);
  assert.match(source, /debug-method/);
});
