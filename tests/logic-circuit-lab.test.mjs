import assert from "node:assert/strict";
import test from "node:test";
import {
  LOGIC_CIRCUIT_PUZZLES,
  advanceLogicPuzzle,
  buildLogicPuzzleDeck,
  buildTruthInputs,
  createLogicLabState,
  evaluateLogicGate,
  runLogicCircuit,
  selectCircuitGate,
  testLogicCircuit,
} from "../lib/logic-circuit-lab.ts";

test("evaluates the four child-facing logic gates", () => {
  assert.equal(evaluateLogicGate("AND", false, false), false);
  assert.equal(evaluateLogicGate("AND", true, true), true);
  assert.equal(evaluateLogicGate("OR", false, true), true);
  assert.equal(evaluateLogicGate("OR", false, false), false);
  assert.equal(evaluateLogicGate("XOR", true, false), true);
  assert.equal(evaluateLogicGate("XOR", true, true), false);
  assert.equal(evaluateLogicGate("NOT", true), false);
  assert.equal(evaluateLogicGate("NOT", false), true);
  assert.equal(evaluateLogicGate("AND", true), null);
});

test("builds all truth input combinations in stable order", () => {
  assert.deepEqual(buildTruthInputs(["A"]), [{ A: false }, { A: true }]);
  assert.deepEqual(buildTruthInputs(["A", "B"]), [
    { A: false, B: false }, { A: false, B: true }, { A: true, B: false }, { A: true, B: true },
  ]);
  assert.equal(buildTruthInputs(["A", "B", "C"]).length, 8);
});

test("defines six valid boards including two layered circuits", () => {
  assert.equal(LOGIC_CIRCUIT_PUZZLES.length, 6);
  assert.equal(new Set(LOGIC_CIRCUIT_PUZZLES.map((puzzle) => puzzle.id)).size, 6);
  assert.equal(LOGIC_CIRCUIT_PUZZLES.filter((puzzle) => puzzle.slots.length === 2).length, 2);
  for (const puzzle of LOGIC_CIRCUIT_PUZZLES) {
    assert.ok(puzzle.inputs.length >= 1 && puzzle.inputs.length <= 3, puzzle.id);
    assert.ok(puzzle.slots.length >= 1 && puzzle.slots.length <= 2, puzzle.id);
    const knownSources = new Set(puzzle.inputs);
    for (const slot of puzzle.slots) {
      assert.ok(knownSources.has(slot.left), `${puzzle.id}:${slot.id}:left`);
      if (slot.right) assert.ok(knownSources.has(slot.right), `${puzzle.id}:${slot.id}:right`);
      assert.ok(slot.allowedGates.includes(puzzle.correctGates[slot.id]), `${puzzle.id}:${slot.id}:gate`);
      knownSources.add(slot.id);
    }
    assert.ok(knownSources.has(puzzle.outputSource), puzzle.id);
  }
});

test("runs every input row and verifies a complete circuit", () => {
  for (const puzzle of LOGIC_CIRCUIT_PUZZLES) {
    const rows = runLogicCircuit(puzzle, puzzle.correctGates);
    assert.equal(rows.length, 2 ** puzzle.inputs.length, puzzle.id);
    assert.ok(rows.every((row) => row.actual === row.expected && row.matches), puzzle.id);
  }
});

test("keeps failing evidence, then solves and advances a board", () => {
  const puzzle = LOGIC_CIRCUIT_PUZZLES[0];
  let state = createLogicLabState(2);
  state = selectCircuitGate(state, puzzle, puzzle.slots[0].id, "OR");
  state = testLogicCircuit(state, puzzle);
  assert.equal(state.phase, "tested");
  assert.ok(state.rows.some((row) => !row.matches));
  assert.equal(state.solved, 0);
  state = selectCircuitGate(state, puzzle, puzzle.slots[0].id, puzzle.correctGates[puzzle.slots[0].id]);
  assert.equal(state.phase, "building");
  assert.deepEqual(state.rows, []);
  state = testLogicCircuit(state, puzzle);
  assert.equal(state.phase, "solved");
  assert.equal(state.solved, 1);
  state = advanceLogicPuzzle(state);
  assert.equal(state.index, 1);
  assert.equal(state.phase, "building");
  assert.deepEqual(state.selections, {});
});

test("rotates replay boards and rejects invalid or duplicate activations", () => {
  assert.deepEqual(buildLogicPuzzleDeck(0), LOGIC_CIRCUIT_PUZZLES);
  assert.notDeepEqual(buildLogicPuzzleDeck(1), LOGIC_CIRCUIT_PUZZLES);
  assert.deepEqual(buildLogicPuzzleDeck(Number.NaN), LOGIC_CIRCUIT_PUZZLES);
  const puzzle = LOGIC_CIRCUIT_PUZZLES[0];
  const initial = createLogicLabState(1);
  assert.strictEqual(selectCircuitGate(initial, puzzle, "missing", "AND"), initial);
  assert.strictEqual(selectCircuitGate(initial, puzzle, puzzle.slots[0].id, "BAD"), initial);
  assert.strictEqual(testLogicCircuit(initial, puzzle), initial);
  const selected = selectCircuitGate(initial, puzzle, puzzle.slots[0].id, puzzle.correctGates[puzzle.slots[0].id]);
  assert.strictEqual(testLogicCircuit(selected, puzzle, 2), selected);
  const solved = testLogicCircuit(selected, puzzle);
  const complete = advanceLogicPuzzle(solved);
  assert.equal(complete.phase, "complete");
  assert.strictEqual(selectCircuitGate(complete, puzzle, puzzle.slots[0].id, "OR"), complete);
  assert.strictEqual(testLogicCircuit(complete, puzzle), complete);
  assert.strictEqual(advanceLogicPuzzle(complete), complete);
});
