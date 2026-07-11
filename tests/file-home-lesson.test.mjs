import assert from "node:assert/strict";
import test from "node:test";
import { INITIAL_FILE_HOME_STATE, getVisibleEntries, updateFileHome } from "../lib/file-home-lesson.ts";

test("starts at a virtual root and distinguishes folders from files", () => {
  assert.deepEqual(INITIAL_FILE_HOME_STATE.path, []);
  const entries = getVisibleEntries(INITIAL_FILE_HOME_STATE.path);
  assert.ok(entries.some((entry) => entry.kind === "folder"));
  assert.ok(entries.some((entry) => entry.kind === "file"));
});

test("navigates folders and exposes a breadcrumb address", () => {
  let state = updateFileHome(INITIAL_FILE_HOME_STATE, { type: "openFolder", name: "学习资料" });
  state = updateFileHome(state, { type: "openFolder", name: "科学" });
  assert.deepEqual(state.path, ["学习资料", "科学"]);
  assert.equal(state.address, "比特岛/学习资料/科学");
  state = updateFileHome(state, { type: "goBack" });
  assert.deepEqual(state.path, ["学习资料"]);
});

test("opens only a visible file and can return to root", () => {
  let state = updateFileHome(INITIAL_FILE_HOME_STATE, { type: "openFile", name: "太阳系.png" });
  assert.equal(state.openedFile, null);
  state = updateFileHome(state, { type: "openFolder", name: "学习资料" });
  state = updateFileHome(state, { type: "openFolder", name: "科学" });
  state = updateFileHome(state, { type: "openFile", name: "太阳系.png" });
  assert.equal(state.openedFile, "太阳系.png");
  state = updateFileHome(state, { type: "goRoot" });
  assert.deepEqual(state.path, []);
  assert.equal(state.openedFile, null);
});
