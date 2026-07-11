import assert from "node:assert/strict";
import test from "node:test";
import { classifyComputerPart, runInformationPipeline } from "../lib/input-process-output-lesson.ts";

test("classifies familiar input, processing, and output parts", () => {
  assert.equal(classifyComputerPart("keyboard"), "input");
  assert.equal(classifyComputerPart("cpu"), "process");
  assert.equal(classifyComputerPart("screen"), "output");
});

test("traces information through all three stages in order", () => {
  assert.deepEqual(runInformationPipeline("press-A"), [
    "键盘把按键 A 变成输入信号",
    "处理器判断这个信号代表字母 A",
    "屏幕显示字母 A",
  ]);
});

test("an output device cannot replace the processing step", () => {
  assert.equal(classifyComputerPart("speaker"), "output");
  assert.equal(runInformationPipeline("unknown").length, 0);
});
