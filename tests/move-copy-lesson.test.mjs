import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { INITIAL_MOVE_COPY_STATE, updateMoveCopy } from "../lib/move-copy-lesson.ts";

test("copy and paste creates a second item while preserving the original", () => {
  let state = updateMoveCopy(INITIAL_MOVE_COPY_STATE, { type: "copy", fileId: "worksheet" });
  state = updateMoveCopy(state, { type: "paste", folder: "今日作业" });
  const worksheets = state.files.filter((file) => file.name === "数学练习.txt");
  assert.equal(worksheets.length, 2);
  assert.deepEqual(worksheets.map((file) => file.folder).sort(), ["今日作业", "收件箱"]);
});

test("cut and paste moves one item without creating a copy", () => {
  let state = updateMoveCopy(INITIAL_MOVE_COPY_STATE, { type: "cut", fileId: "photo" });
  state = updateMoveCopy(state, { type: "paste", folder: "图片" });
  assert.equal(state.files.filter((file) => file.name === "春游照片.png").length, 1);
  assert.equal(state.files.find((file) => file.id === "photo")?.folder, "图片");
});

test("undo restores the previous file locations", () => {
  const moved = updateMoveCopy(INITIAL_MOVE_COPY_STATE, { type: "move", fileId: "note", folder: "图片" });
  assert.equal(moved.files.find((file) => file.id === "note")?.folder, "图片");
  const restored = updateMoveCopy(moved, { type: "undo" });
  assert.equal(restored.files.find((file) => file.id === "note")?.folder, "收件箱");
});

test("the workspace teaches undo without stealing text editing shortcuts", () => {
  const source = readFileSync(new URL("../components/lessons/files/MoveCopyWorkspace.tsx", import.meta.url), "utf8");
  assert.match(source, /event\.key\.toLowerCase\(\) !== "z"/);
  assert.match(source, /input, textarea, \[contenteditable/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /Ctrl\/⌘/);
  assert.match(source, /撤销上一步/);
});
