import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { classifyFile, sortFile, INITIAL_SORT_STATE } from "../lib/file-types-lesson.ts";

test("classifies common image, text, audio, and unknown extensions", () => {
  assert.equal(classifyFile("海岛.png"), "image");
  assert.equal(classifyFile("日记.TXT"), "text");
  assert.equal(classifyFile("鸟鸣.mp3"), "audio");
  assert.equal(classifyFile("神秘礼物.exe"), "unknown");
});

test("sorts only into the matching tray and preserves prior progress", () => {
  const wrong = sortFile(INITIAL_SORT_STATE, "海岛.png", "audio");
  assert.deepEqual(wrong.sorted, {});
  assert.equal(wrong.wrongAttempts, 1);
  const right = sortFile(wrong, "海岛.png", "image");
  assert.equal(right.sorted["海岛.png"], "image");
  const laterWrong = sortFile(right, "日记.txt", "image");
  assert.equal(laterWrong.sorted["海岛.png"], "image");
});

test("the sorter separates names from extensions before revealing file types", () => {
  const source = readFileSync(new URL("../components/lessons/files/FileTypeSorter.tsx", import.meta.url), "utf8");
  assert.match(source, /file-inspector/);
  assert.match(source, /文件名称/);
  assert.match(source, /扩展名/);
  assert.match(source, /sorted-file-results/);
  assert.match(source, /推荐打开方式/);
});
