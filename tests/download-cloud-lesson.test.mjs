import assert from "node:assert/strict";
import test from "node:test";
import { INITIAL_TRANSFER_STATE, updateTransfer } from "../lib/download-cloud-lesson.ts";

test("download creates a local copy while keeping the server copy", () => {
  const state = updateTransfer(INITIAL_TRANSFER_STATE, { type: "download" });
  assert.equal(state.local.version, 1);
  assert.equal(state.cloud.version, 1);
});

test("upload and sync update the intended copies", () => {
  let state = { ...INITIAL_TRANSFER_STATE, local: { exists: true, version: 2 } };
  state = updateTransfer(state, { type: "upload" });
  assert.equal(state.cloud.version, 2);
  state = { ...state, local: { exists: true, version: 3 } };
  state = updateTransfer(state, { type: "sync" });
  assert.equal(state.cloud.version, 3);
});

test("sharing changes access without moving or deleting copies", () => {
  const state = updateTransfer(INITIAL_TRANSFER_STATE, { type: "share", audience: "family" });
  assert.equal(state.sharedWith, "family");
  assert.equal(state.cloud.exists, true);
  assert.equal(state.local.exists, false);
});
