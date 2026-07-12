import assert from "node:assert/strict";
import test from "node:test";
import {
  accessMemoryHierarchy,
  advanceInstructionCycle,
  advanceToyCpu,
  advanceReliableTransfer,
  assembleTransfer,
  createReliableTransfer,
  createToyCpu,
  decapsulateMessage,
  encapsulateMessage,
  shortestRoute,
} from "../lib/advanced-foundations/systems-network.ts";

test("toy CPU fetches, decodes, executes, and writes a visible register result", () => {
  let cpu = createToyCpu();
  assert.equal(cpu.phase, "fetch");
  assert.equal(cpu.instruction, null);
  cpu = advanceToyCpu(cpu);
  assert.equal(cpu.phase, "decode");
  assert.equal(cpu.instruction, "ADD A B");
  cpu = advanceToyCpu(cpu);
  assert.equal(cpu.phase, "execute");
  assert.equal(cpu.pendingResult, null);
  cpu = advanceToyCpu(cpu);
  assert.equal(cpu.phase, "writeback");
  assert.equal(cpu.pendingResult, 7);
  cpu = advanceToyCpu(cpu);
  assert.equal(cpu.phase, "fetch");
  assert.equal(cpu.registers.OUT, 7);
  assert.equal(cpu.programCounter, 1);
});

test("instruction cycle repeats fetch decode execute and writeback", () => {
  assert.deepEqual([0, 1, 2, 3, 4].map((step) => advanceInstructionCycle(step).phase), [
    "fetch", "decode", "execute", "writeback", "fetch",
  ]);
  assert.equal(advanceInstructionCycle(-1).phase, "fetch");
});

test("memory hierarchy reports the nearest level and wait cost", () => {
  assert.deepEqual(accessMemoryHierarchy(["map"], ["map", "music"], ["map", "music", "book"], "map"), { level: "cache", wait: 1 });
  assert.deepEqual(accessMemoryHierarchy([], ["music"], ["music"], "music"), { level: "memory", wait: 4 });
  assert.deepEqual(accessMemoryHierarchy([], [], ["book"], "book"), { level: "storage", wait: 12 });
  assert.deepEqual(accessMemoryHierarchy([], [], [], "missing"), { level: "missing", wait: 0 });
});

test("network encapsulation adds and removes four layer envelopes", () => {
  const packet = encapsulateMessage("HELLO");
  assert.deepEqual(packet.layers.map((layer) => layer.name), ["application", "transport", "network", "link"]);
  assert.deepEqual(decapsulateMessage(packet), { message: "HELLO", removedLayers: ["link", "network", "transport", "application"] });
});

test("weighted routing chooses the lowest-cost path with stable ties", () => {
  const graph = {
    device: [{ to: "router-b", cost: 1 }, { to: "router-a", cost: 1 }],
    "router-a": [{ to: "server", cost: 2 }],
    "router-b": [{ to: "server", cost: 5 }],
    server: [],
    moon: [],
  };
  assert.deepEqual(shortestRoute(graph, "device", "server"), { path: ["device", "router-a", "server"], cost: 3 });
  assert.deepEqual(shortestRoute(graph, "device", "moon"), { path: [], cost: Infinity });
});

test("reliable transfer detects loss, retransmits, suppresses duplicates, and assembles in order", () => {
  let state = createReliableTransfer(["比", "特", "岛"], 1);
  state = advanceReliableTransfer(state, { type: "send", sequence: 0 });
  state = advanceReliableTransfer(state, { type: "send", sequence: 1 });
  assert.deepEqual(state.receivedSequences, [0]);
  assert.equal(state.feedback, "数据块 1 丢失，等待超时重传。" );
  state = advanceReliableTransfer(state, { type: "timeout", sequence: 1 });
  state = advanceReliableTransfer(state, { type: "send", sequence: 2 });
  state = advanceReliableTransfer(state, { type: "send", sequence: 0 });
  assert.deepEqual(state.receivedSequences, [0, 1, 2]);
  assert.equal(assembleTransfer(state), "比特岛");
  assert.equal(state.acknowledgements.filter((sequence) => sequence === 0).length, 1);
});
