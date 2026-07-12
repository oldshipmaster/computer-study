import assert from "node:assert/strict";
import test from "node:test";
import { matchesPrimaryShortcut } from "../lib/keyboard-shortcuts.ts";

test("matches Ctrl on Windows and Command on macOS", () => {
  assert.equal(matchesPrimaryShortcut({ key: "s", ctrlKey: true, metaKey: false }, "s"), true);
  assert.equal(matchesPrimaryShortcut({ key: "S", ctrlKey: false, metaKey: true }, "s"), true);
});

test("rejects plain, Alt-only, and different-key presses", () => {
  assert.equal(matchesPrimaryShortcut({ key: "s", ctrlKey: false, metaKey: false }, "s"), false);
  assert.equal(matchesPrimaryShortcut({ key: "s", ctrlKey: false, metaKey: false, altKey: true }, "s"), false);
  assert.equal(matchesPrimaryShortcut({ key: "z", ctrlKey: true, metaKey: false }, "s"), false);
});

test("rejects invalid shortcut descriptions safely", () => {
  assert.equal(matchesPrimaryShortcut({ key: "", ctrlKey: true, metaKey: false }, ""), false);
  assert.equal(matchesPrimaryShortcut({ key: "s", ctrlKey: true, metaKey: false }, "save"), false);
});
