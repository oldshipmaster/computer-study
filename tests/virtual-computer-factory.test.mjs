import assert from "node:assert/strict";
import test from "node:test";

import {
  VIRTUAL_FACTORY_STATIONS,
  advanceFactoryStation,
  advanceFactoryStep,
  buildFactoryDeck,
  chooseFactoryAction,
  createFactoryState,
} from "../lib/virtual-computer-factory.ts";

test("defines six complete virtual computer stations", () => {
  assert.equal(VIRTUAL_FACTORY_STATIONS.length, 6);
  assert.deepEqual(new Set(VIRTUAL_FACTORY_STATIONS.map((station) => station.mode)), new Set(["pipeline", "memory", "bits", "pairing", "diagnosis", "system"]));
  assert.equal(new Set(VIRTUAL_FACTORY_STATIONS.map((station) => station.id)).size, 6);
  for (const station of VIRTUAL_FACTORY_STATIONS) {
    assert.ok(station.steps.length >= 2);
    assert.ok(station.steps.every((step) => step.parts.length >= 2));
    assert.ok(station.steps.every((step) => step.options.some((candidate) => candidate.id === step.answerId)));
  }
});

test("offers no real disassembly or power-handling action", () => {
  const actions = VIRTUAL_FACTORY_STATIONS.flatMap((station) => station.steps.flatMap((step) => step.options.map((candidate) => candidate.label))).join(" ");
  assert.doesNotMatch(actions, /拆开|拆机|打开机箱|插拔电源|触摸电源|内部零件/);
});

test("keeps the virtual machine unchanged after a wrong action", () => {
  const station = VIRTUAL_FACTORY_STATIONS[0];
  const state = createFactoryState(6);
  const wrong = station.steps[0].options.find((candidate) => candidate.id !== station.steps[0].answerId).id;
  const result = chooseFactoryAction(state, station, wrong, 1);
  assert.equal(result.stepIndex, 0);
  assert.equal(result.phase, "building");
  assert.deepEqual(result.evidence, []);
  assert.match(result.feedback, /观察|职责|顺序|安全|数据/);
});

test("records a machine-flow reason before advancing", () => {
  const station = VIRTUAL_FACTORY_STATIONS[1];
  const state = createFactoryState(6);
  const result = chooseFactoryAction(state, station, station.steps[0].answerId, 1);
  assert.equal(result.phase, "step-solved");
  assert.deepEqual(result.evidence, [station.steps[0].evidence]);
  const advanced = advanceFactoryStep(result, station, 1);
  assert.equal(advanced.stepIndex, 1);
  assert.equal(advanced.phase, "building");
});

test("ignores duplicate activation, unknown actions, and premature continue", () => {
  const station = VIRTUAL_FACTORY_STATIONS[0];
  const state = createFactoryState(6);
  assert.deepEqual(chooseFactoryAction(state, station, station.steps[0].answerId, 2), state);
  assert.deepEqual(chooseFactoryAction(state, station, "missing", 1), state);
  assert.deepEqual(advanceFactoryStep(state, station, 1), state);
  assert.deepEqual(advanceFactoryStation(state, 1), state);
});

test("completes all stations and rotates a stable replay deck", () => {
  const deck = buildFactoryDeck(0);
  let state = createFactoryState(deck.length);
  for (const station of deck) {
    for (const step of station.steps) {
      state = chooseFactoryAction(state, station, step.answerId, 1);
      if (state.phase === "step-solved") state = advanceFactoryStep(state, station, 1);
    }
    assert.equal(state.phase, "station-solved");
    state = advanceFactoryStation(state, 1);
  }
  assert.equal(state.phase, "complete");
  assert.equal(state.solved, 6);
  assert.deepEqual(advanceFactoryStation(state, 1), state);
  const rotated = buildFactoryDeck(1);
  assert.notEqual(rotated[0].id, deck[0].id);
  assert.deepEqual(new Set(rotated.map((station) => station.id)), new Set(deck.map((station) => station.id)));
  assert.deepEqual(buildFactoryDeck(-1).map((station) => station.id), deck.map((station) => station.id));
});
