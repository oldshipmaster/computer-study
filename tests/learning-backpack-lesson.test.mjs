import assert from "node:assert/strict";
import test from "node:test";
import { INITIAL_BACKPACK_STATE, searchItems, sortItems, updateBackpack } from "../lib/learning-backpack-lesson.ts";

test("searches by name and sorts predictably", () => {
  assert.deepEqual(searchItems(INITIAL_BACKPACK_STATE.items, "数学").map((item) => item.id), ["math", "duplicate"]);
  const sorted = sortItems(INITIAL_BACKPACK_STATE.items, "name");
  assert.deepEqual(sorted.map((item) => item.name), [...sorted.map((item) => item.name)].sort((a, b) => a.localeCompare(b, "zh-CN")));
});

test("moves and renames without allowing duplicates", () => {
  let state = updateBackpack(INITIAL_BACKPACK_STATE, { type: "move", itemId: "math", folder: "数学" });
  assert.equal(state.items.find((item) => item.id === "math")?.folder, "数学");
  state = updateBackpack(state, { type: "rename", itemId: "math", name: "周一数学练习.txt" });
  assert.equal(state.items.find((item) => item.id === "math")?.name, "周一数学练习.txt");
  const duplicate = updateBackpack(state, { type: "rename", itemId: "science", name: "周一数学练习.txt" });
  assert.equal(duplicate.feedback, "这个名称已经存在。" );
});

test("restores an item from the virtual trash", () => {
  let state = updateBackpack(INITIAL_BACKPACK_STATE, { type: "trash", itemId: "photo" });
  assert.equal(state.items.find((item) => item.id === "photo")?.trashed, true);
  state = updateBackpack(state, { type: "restore", itemId: "photo" });
  assert.equal(state.items.find((item) => item.id === "photo")?.trashed, false);
});
