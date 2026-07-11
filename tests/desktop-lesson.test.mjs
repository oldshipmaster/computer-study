import assert from "node:assert/strict";
import test from "node:test";
import { INITIAL_DESKTOP_STATE, updateDesktop } from "../lib/desktop-lesson.ts";

test("selects an icon before opening one window", () => {
  const selected = updateDesktop(INITIAL_DESKTOP_STATE, { type: "selectIcon", appId: "notes" });
  assert.equal(selected.selectedIcon, "notes");
  assert.deepEqual(selected.openWindows, []);
  const opened = updateDesktop(selected, { type: "openWindow", appId: "notes" });
  assert.deepEqual(opened.openWindows, ["notes"]);
  assert.equal(opened.focusedWindow, "notes");
});

test("keeps one focused window and restores minimized apps from taskbar", () => {
  let state = updateDesktop(INITIAL_DESKTOP_STATE, { type: "openWindow", appId: "notes" });
  state = updateDesktop(state, { type: "openWindow", appId: "paint" });
  assert.equal(state.focusedWindow, "paint");
  state = updateDesktop(state, { type: "focusWindow", appId: "notes" });
  state = updateDesktop(state, { type: "minimizeWindow", appId: "notes" });
  assert.equal(state.focusedWindow, "paint");
  assert.deepEqual(state.minimizedWindows, ["notes"]);
  state = updateDesktop(state, { type: "restoreWindow", appId: "notes" });
  assert.equal(state.focusedWindow, "notes");
});

test("closes cleanly and can replay without duplicate windows", () => {
  let state = updateDesktop(INITIAL_DESKTOP_STATE, { type: "openWindow", appId: "notes" });
  state = updateDesktop(state, { type: "openWindow", appId: "notes" });
  assert.deepEqual(state.openWindows, ["notes"]);
  state = updateDesktop(state, { type: "closeWindow", appId: "notes" });
  assert.deepEqual(state.openWindows, []);
  assert.equal(state.focusedWindow, null);
});
