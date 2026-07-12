import assert from "node:assert/strict";
import test from "node:test";
import { buildKnowledgeAtlas } from "../lib/knowledge-atlas.ts";

test("builds one ordered knowledge chapter for each island", () => {
  const atlas = buildKnowledgeAtlas([]);

  assert.equal(atlas.length, 9);
  assert.deepEqual(atlas.map((chapter) => chapter.courseCount), [5, 5, 5, 5, 5, 5, 5, 5, 5]);
  assert.equal(atlas[0].entries[0].order, 1);
  assert.equal(atlas.at(-1).entries.at(-1).order, 45);
});

test("reveals objectives only after the matching course is complete", () => {
  const atlas = buildKnowledgeAtlas(["keyboard-flight", "file-home", "unknown"]);
  const keyboard = atlas[0].entries[0];
  const mouse = atlas[0].entries[1];
  const fileHome = atlas[1].entries[0];

  assert.equal(keyboard.unlocked, true);
  assert.deepEqual(keyboard.concepts, ["认识方向键与空格键", "按顺序执行指令", "预测程序运行结果"]);
  assert.equal(mouse.unlocked, false);
  assert.deepEqual(mouse.concepts, []);
  assert.equal(fileHome.unlocked, true);
  assert.equal(atlas[0].unlockedCount, 1);
  assert.equal(atlas[1].unlockedCount, 1);
});

test("ignores duplicate and unknown completion ids", () => {
  const atlas = buildKnowledgeAtlas(["keyboard-flight", "keyboard-flight", "missing"]);
  assert.equal(atlas.reduce((total, chapter) => total + chapter.unlockedCount, 0), 1);
});
