import assert from "node:assert/strict";
import test from "node:test";
import { ISLANDS } from "../lib/course-data.ts";
import {
  ISLAND_BOSSES,
  advanceBossPhase,
  createIslandBossState,
  getIslandBossUnlock,
  queueBossAction,
  removeBossAction,
  selectBossExplanation,
  submitBossPhase,
  toggleBossEvidence,
} from "../lib/island-boss.ts";

test("defines one complete three-mechanic boss for every island", () => {
  assert.equal(ISLAND_BOSSES.length, 13);
  assert.deepEqual(ISLAND_BOSSES.map((boss) => boss.islandId), ISLANDS.map((island) => island.id));
  assert.equal(new Set(ISLAND_BOSSES.map((boss) => boss.id)).size, 13);
  for (const boss of ISLAND_BOSSES) {
    assert.equal(boss.evidence.length, 4, boss.id);
    assert.equal(boss.correctEvidenceIds.length, 2, boss.id);
    assert.ok(boss.correctEvidenceIds.every((id) => boss.evidence.some((item) => item.id === id)), boss.id);
    assert.equal(boss.actions.length, 4, boss.id);
    assert.equal(boss.correctActionOrder.length, 3, boss.id);
    assert.equal(new Set(boss.correctActionOrder).size, 3, boss.id);
    assert.ok(boss.correctActionOrder.every((id) => boss.actions.some((item) => item.id === id)), boss.id);
    assert.equal(boss.explanations.length, 3, boss.id);
    assert.ok(boss.explanations.some((item) => item.id === boss.correctExplanationId), boss.id);
    assert.ok(boss.briefing.length >= 12 && boss.transferRule.length >= 8, boss.id);
  }
});

test("unlocks only after all five island courses are complete", () => {
  const boss = ISLAND_BOSSES[0];
  const none = getIslandBossUnlock(boss, []);
  assert.deepEqual(none, { completedCount: 0, requiredCount: 5, unlocked: false, nextCourseId: "keyboard-flight" });
  const partial = getIslandBossUnlock(boss, ["keyboard-flight", "keyboard-flight", "unknown", "mouse-precision"]);
  assert.deepEqual(partial, { completedCount: 2, requiredCount: 5, unlocked: false, nextCourseId: "bilingual-input" });
  const complete = getIslandBossUnlock(boss, boss.requiredCourseIds);
  assert.deepEqual(complete, { completedCount: 5, requiredCount: 5, unlocked: true, nextCourseId: null });
});

test("requires two exact evidence signals and preserves a retry", () => {
  const boss = ISLAND_BOSSES[0];
  let state = createIslandBossState();
  state = toggleBossEvidence(state, boss.evidence[0].id);
  state = toggleBossEvidence(state, boss.evidence[2].id);
  const wrong = submitBossPhase(state, boss);
  assert.equal(wrong.phase, "scan");
  assert.equal(wrong.status, "retry");
  assert.deepEqual(wrong.selectedEvidenceIds, [boss.evidence[0].id, boss.evidence[2].id]);
  state = toggleBossEvidence(wrong, boss.evidence[2].id);
  state = toggleBossEvidence(state, boss.correctEvidenceIds.find((id) => id !== boss.evidence[0].id) ?? boss.correctEvidenceIds[0]);
  state = submitBossPhase(state, boss);
  assert.equal(state.status, "success");
  assert.match(state.feedback, /证据/);
  state = advanceBossPhase(state);
  assert.equal(state.phase, "sequence");
  assert.deepEqual(state.selectedEvidenceIds, []);
});

test("builds an ordered action queue with undo and no duplicates", () => {
  const boss = ISLAND_BOSSES[0];
  let state = { ...createIslandBossState(), phase: "sequence" };
  for (const id of [...boss.correctActionOrder].reverse()) state = queueBossAction(state, id);
  assert.equal(state.actionQueue.length, 3);
  assert.strictEqual(queueBossAction(state, boss.correctActionOrder[0]), state);
  const wrong = submitBossPhase(state, boss);
  assert.equal(wrong.status, "retry");
  assert.deepEqual(wrong.actionQueue, [...boss.correctActionOrder].reverse());
  state = removeBossAction(wrong, boss.correctActionOrder[0]);
  assert.ok(!state.actionQueue.includes(boss.correctActionOrder[0]));
  state = { ...state, actionQueue: [] };
  for (const id of boss.correctActionOrder) state = queueBossAction(state, id);
  state = submitBossPhase(state, boss);
  assert.equal(state.status, "success");
  state = advanceBossPhase(state);
  assert.equal(state.phase, "core");
});

test("finishes only after explaining the core principle", () => {
  const boss = ISLAND_BOSSES[0];
  let state = { ...createIslandBossState(), phase: "core" };
  const wrongId = boss.explanations.find((item) => item.id !== boss.correctExplanationId).id;
  state = selectBossExplanation(state, wrongId);
  const retry = submitBossPhase(state, boss);
  assert.equal(retry.status, "retry");
  state = selectBossExplanation(retry, boss.correctExplanationId);
  state = submitBossPhase(state, boss);
  assert.equal(state.status, "success");
  state = advanceBossPhase(state);
  assert.equal(state.phase, "complete");
  assert.equal(state.completedPhases, 3);
});

test("bounds controls and ignores double, invalid, and completed actions", () => {
  const boss = ISLAND_BOSSES[0];
  const initial = createIslandBossState();
  assert.strictEqual(toggleBossEvidence(initial, "unknown"), initial);
  let scan = initial;
  for (const item of boss.evidence.slice(0, 3)) scan = toggleBossEvidence(scan, item.id);
  assert.equal(scan.selectedEvidenceIds.length, 2);
  assert.strictEqual(submitBossPhase(scan, boss, 2), scan);
  const complete = { ...initial, phase: "complete", completedPhases: 3 };
  assert.strictEqual(toggleBossEvidence(complete, boss.evidence[0].id), complete);
  assert.strictEqual(queueBossAction(complete, boss.actions[0].id), complete);
  assert.strictEqual(selectBossExplanation(complete, boss.explanations[0].id), complete);
  assert.strictEqual(submitBossPhase(complete, boss), complete);
  assert.strictEqual(advanceBossPhase(complete), complete);
});
