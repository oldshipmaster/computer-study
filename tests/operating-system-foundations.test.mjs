import assert from "node:assert/strict";
import test from "node:test";
import {
  allocateMemory,
  releaseMemory,
  resolveVirtualPath,
  runRoundRobinTick,
  serviceDeviceRequest,
  transitionProcess,
} from "../lib/advanced-foundations/operating-system.ts";

test("process transitions allow only meaningful lifecycle changes", () => {
  assert.deepEqual(transitionProcess("ready", "run"), { state: "running", changed: true });
  assert.deepEqual(transitionProcess("running", "wait"), { state: "waiting", changed: true });
  assert.deepEqual(transitionProcess("waiting", "wake"), { state: "ready", changed: true });
  assert.deepEqual(transitionProcess("terminated", "run"), { state: "terminated", changed: false });
});

test("round robin gives one time unit to the next unfinished task", () => {
  const tasks = [{ id: "paint", remaining: 2 }, { id: "music", remaining: 1 }];
  const first = runRoundRobinTick(tasks, 0);
  const second = runRoundRobinTick(first.tasks, first.nextCursor);

  assert.equal(first.runningId, "paint");
  assert.deepEqual(first.tasks, [{ id: "paint", remaining: 1 }, { id: "music", remaining: 1 }]);
  assert.equal(second.runningId, "music");
  assert.deepEqual(second.tasks, [{ id: "paint", remaining: 1 }, { id: "music", remaining: 0 }]);
  assert.deepEqual(tasks, [{ id: "paint", remaining: 2 }, { id: "music", remaining: 1 }]);
});

test("memory allocation never exceeds capacity and release restores space", () => {
  const memory = { capacity: 8, allocations: { notes: 2 } };
  const accepted = allocateMemory(memory, "paint", 4);
  const rejected = allocateMemory(accepted.state, "game", 4);

  assert.equal(accepted.ok, true);
  assert.deepEqual(accepted.state.allocations, { notes: 2, paint: 4 });
  assert.equal(rejected.ok, false);
  assert.equal(rejected.free, 2);
  assert.deepEqual(releaseMemory(accepted.state, "notes"), { capacity: 8, allocations: { paint: 4 } });
  assert.deepEqual(memory, { capacity: 8, allocations: { notes: 2 } });
});

test("virtual paths resolve directories and files without touching real files", () => {
  const entries = {
    "/": { kind: "directory", children: ["学习资料"] },
    "/学习资料": { kind: "directory", children: ["科学"] },
    "/学习资料/科学": { kind: "directory", children: ["星空.txt"] },
    "/学习资料/科学/星空.txt": { kind: "file", content: "虚构星空笔记" },
  };
  assert.equal(resolveVirtualPath(entries, "/学习资料/科学/星空.txt")?.kind, "file");
  assert.equal(resolveVirtualPath(entries, "/学习资料/../秘密"), null);
  assert.equal(resolveVirtualPath(entries, "/不存在"), null);
});

test("device requests are serviced in queue order", () => {
  const requests = [
    { id: "r1", device: "screen", task: "显示地图" },
    { id: "r2", device: "printer", task: "打印奖状" },
  ];
  assert.deepEqual(serviceDeviceRequest(requests), {
    serviced: requests[0],
    pending: [requests[1]],
  });
  assert.deepEqual(serviceDeviceRequest([]), { serviced: null, pending: [] });
  assert.equal(requests.length, 2);
});
