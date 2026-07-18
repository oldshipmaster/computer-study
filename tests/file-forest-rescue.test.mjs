import assert from "node:assert/strict";
import test from "node:test";
import { FILE_RESCUE_MISSIONS, advanceFileMission, advanceFileStep, buildFileRescueDeck, chooseFileAction, createFileRescueState } from "../lib/file-forest-rescue.ts";

test("defines six virtual file rescue missions", () => {
  assert.equal(FILE_RESCUE_MISSIONS.length, 6);
  assert.deepEqual(new Set(FILE_RESCUE_MISSIONS.map((mission) => mission.mode)), new Set(["path", "name", "move", "copy", "type", "restore"]));
  assert.equal(new Set(FILE_RESCUE_MISSIONS.map((mission) => mission.id)).size, 6);
  for (const mission of FILE_RESCUE_MISSIONS) {
    assert.ok(mission.steps.length >= 2);
    assert.ok(mission.steps.every((step) => step.files.length >= 2));
    assert.ok(mission.steps.every((step) => step.options.some((candidate) => candidate.id === step.answerId)));
  }
});

test("uses only fixed virtual files without upload or local filesystem paths", () => {
  const content = JSON.stringify(FILE_RESCUE_MISSIONS);
  assert.doesNotMatch(content, /\/Users\/|\/Volumes\/|上传|选择本机文件/);
});

test("preserves file state after a wrong action", () => {
  const mission = FILE_RESCUE_MISSIONS[3];
  const state = createFileRescueState(6);
  const wrong = mission.steps[0].options.find((candidate) => candidate.id !== mission.steps[0].answerId).id;
  const result = chooseFileAction(state, mission, wrong, 1);
  assert.equal(result.phase, "rescuing");
  assert.equal(result.stepIndex, 0);
  assert.deepEqual(result.evidence, []);
  assert.match(result.feedback, /观察|路径|数量|扩展名|回收站/);
});

test("records exact path and copy-count evidence before advancing", () => {
  const mission = FILE_RESCUE_MISSIONS[3];
  let state = createFileRescueState(6);
  state = chooseFileAction(state, mission, mission.steps[0].answerId, 1);
  assert.equal(state.phase, "step-solved");
  assert.deepEqual(state.evidence, [mission.steps[0].evidence]);
  state = advanceFileStep(state, mission, 1);
  assert.equal(state.stepIndex, 1);
  assert.equal(state.phase, "rescuing");
});

test("ignores double activation, unknown action, and premature continue", () => {
  const mission = FILE_RESCUE_MISSIONS[0];
  const state = createFileRescueState(6);
  assert.deepEqual(chooseFileAction(state, mission, mission.steps[0].answerId, 2), state);
  assert.deepEqual(chooseFileAction(state, mission, "missing", 1), state);
  assert.deepEqual(advanceFileStep(state, mission, 1), state);
  assert.deepEqual(advanceFileMission(state, 1), state);
});

test("finishes and rotates all six rescues", () => {
  const deck = buildFileRescueDeck(0);
  let state = createFileRescueState(deck.length);
  for (const mission of deck) {
    for (const step of mission.steps) {
      state = chooseFileAction(state, mission, step.answerId, 1);
      if (state.phase === "step-solved") state = advanceFileStep(state, mission, 1);
    }
    state = advanceFileMission(state, 1);
  }
  assert.equal(state.phase, "complete");
  assert.equal(state.solved, 6);
  assert.deepEqual(advanceFileMission(state, 1), state);
  const rotated = buildFileRescueDeck(2);
  assert.notEqual(rotated[0].id, deck[0].id);
  assert.deepEqual(new Set(rotated.map((mission) => mission.id)), new Set(deck.map((mission) => mission.id)));
});
