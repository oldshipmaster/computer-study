import test from "node:test";
import assert from "node:assert/strict";
import {
  CREATIVE_STUDIO_PROJECTS,
  advanceCreativeProject,
  advanceCreativeStep,
  buildCreativeProjectDeck,
  chooseCreativeDecision,
  createCreativeStudioState,
} from "../lib/creative-studio-challenge.ts";

test("defines six complete projects across all creative workshop abilities", () => {
  assert.equal(CREATIVE_STUDIO_PROJECTS.length, 6);
  assert.equal(new Set(CREATIVE_STUDIO_PROJECTS.map((project) => project.id)).size, 6);
  assert.deepEqual(new Set(CREATIVE_STUDIO_PROJECTS.map((project) => project.mode)), new Set(["pixel", "document", "slides", "copyright", "table", "showcase"]));
  for (const project of CREATIVE_STUDIO_PROJECTS) {
    assert.equal(project.steps.length, 2);
    for (const step of project.steps) {
      assert.ok(step.canvas.length >= 2);
      assert.equal(step.options.length, 3);
      assert.ok(step.options.some((option) => option.id === step.answerId));
    }
  }
});

test("uses only fixed fictional artifacts without uploads or personal fields", () => {
  const serialized = JSON.stringify(CREATIVE_STUDIO_PROJECTS);
  assert.doesNotMatch(serialized, /真实姓名|手机号|家庭地址|上传/);
  for (const project of CREATIVE_STUDIO_PROJECTS) assert.match(project.story, /虚构|班级|比特岛/);
});

test("keeps the current canvas after a wrong or unknown decision", () => {
  const state = createCreativeStudioState(6);
  const project = CREATIVE_STUDIO_PROJECTS[0];
  const wrong = project.steps[0].options.find((option) => option.id !== project.steps[0].answerId).id;
  const result = chooseCreativeDecision(state, project, wrong);
  assert.equal(result.phase, "drafting");
  assert.equal(result.stepIndex, 0);
  assert.deepEqual(result.portfolio, []);
  assert.strictEqual(chooseCreativeDecision(state, project, "unknown"), state);
});

test("records a design reason before allowing the next step", () => {
  const state = createCreativeStudioState(6);
  const project = CREATIVE_STUDIO_PROJECTS[0];
  const solved = chooseCreativeDecision(state, project, project.steps[0].answerId);
  assert.equal(solved.phase, "step-solved");
  assert.deepEqual(solved.portfolio, [project.steps[0].evidence]);
  const next = advanceCreativeStep(solved, project);
  assert.equal(next.phase, "drafting");
  assert.equal(next.stepIndex, 1);
});

test("ignores duplicate activation and premature continue", () => {
  const state = createCreativeStudioState(6);
  const project = CREATIVE_STUDIO_PROJECTS[0];
  assert.strictEqual(chooseCreativeDecision(state, project, project.steps[0].answerId, 2), state);
  assert.strictEqual(advanceCreativeStep(state, project), state);
  assert.strictEqual(advanceCreativeProject(state), state);
});

test("finishes and rotates all six projects", () => {
  const deck = buildCreativeProjectDeck(0);
  let state = createCreativeStudioState(deck.length);
  for (const project of deck) {
    for (let stepIndex = 0; stepIndex < project.steps.length; stepIndex += 1) {
      state = chooseCreativeDecision(state, project, project.steps[stepIndex].answerId);
      if (state.phase === "step-solved") state = advanceCreativeStep(state, project);
    }
    state = advanceCreativeProject(state);
  }
  assert.equal(state.phase, "complete");
  assert.equal(state.solved, 6);
  const rotated = buildCreativeProjectDeck(1);
  assert.equal(rotated[0].id, deck[1].id);
  assert.deepEqual(new Set(rotated.map((project) => project.id)), new Set(deck.map((project) => project.id)));
});
