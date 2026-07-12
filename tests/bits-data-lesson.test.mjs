import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

test("represents one byte as exactly eight bits", () => {
  const byte = numberToBits(65, 8);
  assert.equal(byte.length, 8);
  assert.deepEqual(byte, [0, 1, 0, 0, 0, 0, 0, 1]);
  assert.equal(bitsToNumber(byte), 65);
});

test("interprets three channel bits as a color code", () => {
  assert.equal(bitsToColor([1, 0, 1]), "magenta");
  assert.equal(bitsToColor([0, 0, 0]), "black");
});

test("the bit board explains place values and RGB channels visually", () => {
  const source = readFileSync(new URL("../components/lessons/hardware/BitBoard.tsx", import.meta.url), "utf8");
  assert.match(source, /binary-equation/);
  assert.match(source, /bit-weight--active/);
  assert.match(source, /color-channel/);
  assert.match(source, /通道.*打开/);
  assert.match(source, /相加/);
  assert.match(source, /1 字节 = 8 比特/);
  assert.match(source, /target: 65/);
});
