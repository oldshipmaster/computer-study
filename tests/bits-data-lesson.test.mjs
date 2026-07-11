import assert from "node:assert/strict";
import test from "node:test";
import { bitsToNumber, numberToBits, bitsToColor } from "../lib/bits-data-lesson.ts";

test("converts four bits to numbers and back", () => {
  assert.equal(bitsToNumber([1, 0, 1, 0]), 10);
  assert.deepEqual(numberToBits(10, 4), [1, 0, 1, 0]);
});

test("keeps conversion inside the selected bit width", () => {
  assert.deepEqual(numberToBits(99, 4), [1, 1, 1, 1]);
  assert.deepEqual(numberToBits(-3, 4), [0, 0, 0, 0]);
});

test("interprets three channel bits as a color code", () => {
  assert.equal(bitsToColor([1, 0, 1]), "magenta");
  assert.equal(bitsToColor([0, 0, 0]), "black");
});
