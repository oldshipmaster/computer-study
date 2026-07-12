import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { INITIAL_DOCUMENT_STATE, updateDocument } from "../lib/program-landing-lesson.ts";

test("opens, edits, saves, and closes a clean document", () => {
  let state = updateDocument(INITIAL_DOCUMENT_STATE, { type: "open" });
  state = updateDocument(state, { type: "edit", content: "BIBI-7" });
  assert.equal(state.dirty, true);
  state = updateDocument(state, { type: "save", location: "任务文件夹" });
  assert.equal(state.dirty, false);
  assert.equal(state.savedContent, "BIBI-7");
  assert.equal(state.saveLocation, "任务文件夹");
  state = updateDocument(state, { type: "requestClose" });
  assert.equal(state.open, false);
});

test("prompts on unsaved changes and cancel preserves work", () => {
  let state = updateDocument(INITIAL_DOCUMENT_STATE, { type: "open" });
  state = updateDocument(state, { type: "edit", content: "还没保存" });
  state = updateDocument(state, { type: "requestClose" });
  assert.equal(state.closePrompt, true);
  const cancelled = updateDocument(state, { type: "cancelClose" });
  assert.equal(cancelled.open, true);
  assert.equal(cancelled.content, "还没保存");
});

test("save-and-close persists while discard is explicit", () => {
  let state = updateDocument(INITIAL_DOCUMENT_STATE, { type: "open" });
  state = updateDocument(state, { type: "edit", content: "呼号" });
  state = updateDocument(state, { type: "requestClose" });
  const saved = updateDocument(state, { type: "saveAndClose", location: "任务文件夹" });
  assert.equal(saved.open, false);
  assert.equal(saved.savedContent, "呼号");
  const discarded = updateDocument(state, { type: "discardAndClose" });
  assert.equal(discarded.open, false);
});

test("the virtual document teaches a safe save shortcut", () => {
  const source = readFileSync(new URL("../components/lessons/program-landing/DocumentSimulator.tsx", import.meta.url), "utf8");
  assert.match(source, /event\.key\.toLowerCase\(\) !== "s"/);
  assert.match(source, /event\.ctrlKey \|\| event\.metaKey/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /Ctrl\/⌘/);
  assert.match(source, /快捷保存/);
});
