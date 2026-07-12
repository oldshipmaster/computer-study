import assert from "node:assert/strict";
import test from "node:test";
import {
  binarySearchTrace,
  bubbleSortPass,
  compareSearchCosts,
  linearSearchTrace,
  validateTaskOrder,
} from "../lib/advanced-foundations/algorithms.ts";

test("linear search checks items from the beginning until it finds the target", () => {
  assert.deepEqual(linearSearchTrace([2, 4, 6, 8], 6), {
    checkedIndexes: [0, 1, 2],
    foundIndex: 2,
  });
  assert.deepEqual(linearSearchTrace([2, 4], 9), {
    checkedIndexes: [0, 1],
    foundIndex: -1,
  });
});

test("binary search removes half of a sorted search range each step", () => {
  assert.deepEqual(binarySearchTrace([1, 3, 5, 7, 9], 7), {
    checkedIndexes: [2, 3],
    ranges: [[0, 4], [3, 4]],
    foundIndex: 3,
    valid: true,
  });
  assert.equal(binarySearchTrace([3, 1, 2], 1).valid, false);
});

test("one bubble pass compares neighbors and moves larger values right", () => {
  const original = [3, 1, 2];
  assert.deepEqual(bubbleSortPass(original), {
    values: [1, 2, 3],
    comparisons: [[0, 1], [1, 2]],
    swaps: [[0, 1], [1, 2]],
  });
  assert.deepEqual(original, [3, 1, 2]);
});

test("task order accepts work only after its dependencies", () => {
  const tasks = [
    { id: "pack", dependsOn: [] },
    { id: "check", dependsOn: ["pack"] },
    { id: "launch", dependsOn: ["check"] },
  ];
  assert.deepEqual(validateTaskOrder(tasks, ["pack", "check", "launch"]), { valid: true, blockedTaskId: null });
  assert.deepEqual(validateTaskOrder(tasks, ["launch", "pack", "check"]), { valid: false, blockedTaskId: "launch" });
});

test("efficiency comparison shows binary search growing more slowly", () => {
  assert.deepEqual(compareSearchCosts(8), { itemCount: 8, linear: 8, binary: 4 });
  assert.deepEqual(compareSearchCosts(64), { itemCount: 64, linear: 64, binary: 7 });
  assert.deepEqual(compareSearchCosts(0), { itemCount: 0, linear: 0, binary: 0 });
});
