import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { CAPSTONE_TASKS, INITIAL_CAPSTONE_STATE, answerCapstoneTask } from "../lib/light-bit-island-lesson.ts";

test("covers all core curriculum domains", () => {
  assert.deepEqual(CAPSTONE_TASKS.map((task) => task.domain), ["files", "keyboard", "input", "sequence", "loop", "condition", "debug", "safety"]);
});

test("wrong answers preserve prior completed missions", () => {
  let state = answerCapstoneTask(INITIAL_CAPSTONE_STATE, CAPSTONE_TASKS[0].id, CAPSTONE_TASKS[0].correctOption);
  state = answerCapstoneTask(state, CAPSTONE_TASKS[1].id, "wrong");
  assert.deepEqual(state.completedTaskIds, [CAPSTONE_TASKS[0].id]);
  assert.equal(state.wrongAttempts, 1);
});

test("completes only after every mission is solved", () => {
  let state = INITIAL_CAPSTONE_STATE;
  for (const task of CAPSTONE_TASKS) state = answerCapstoneTask(state, task.id, task.correctOption);
  assert.equal(state.complete, true);
  assert.equal(state.completedTaskIds.length, CAPSTONE_TASKS.length);
});

test("capstone keeps the final evidence visible until the learner confirms", () => {
  const source = readFileSync(new URL("../components/lessons/capstone/IslandRescueMission.tsx", import.meta.url), "utf8");
  assert.match(source, /DOMAIN_LABELS/);
  assert.match(source, /能力总结/);
  assert.match(source, /capstone-skill-summary/);
  assert.match(source, /答对 8\/8/);
  assert.match(source, /完成综合救援/);
  assert.doesNotMatch(source, /if \(next\.complete\) onComplete\(\)/);
});
