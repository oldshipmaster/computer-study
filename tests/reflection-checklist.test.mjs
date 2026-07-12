import assert from "node:assert/strict";
import test from "node:test";
import { toggleReflectionItem } from "../lib/reflection-checklist.ts";

test("toggles one valid reflection item without mutating prior state", () => {
  const current = [0];
  const next = toggleReflectionItem(current, 2, 3);
  assert.deepEqual(current, [0]);
  assert.deepEqual(next, [0, 2]);
  assert.deepEqual(toggleReflectionItem(next, 0, 3), [2]);
});

test("ignores invalid indexes and removes duplicates", () => {
  assert.deepEqual(toggleReflectionItem([0, 0, 8], -1, 3), [0]);
  assert.deepEqual(toggleReflectionItem([2, 1], 0, 3), [0, 1, 2]);
});
