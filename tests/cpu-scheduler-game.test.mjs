import test from "node:test";
import assert from "node:assert/strict";
import {
  CPU_SCHEDULER_MISSIONS,
  advanceCpuSchedulerMission,
  buildCpuSchedulerDeck,
  createCpuSchedulerState,
  getUsedMemory,
  loadCpuTask,
  runCpuTimeSlice,
} from "../lib/cpu-scheduler-game.ts";

test("defines six bounded scheduler shifts with unique fictional tasks", () => {
  assert.equal(CPU_SCHEDULER_MISSIONS.length, 6);
  assert.equal(new Set(CPU_SCHEDULER_MISSIONS.map((mission) => mission.id)).size, 6);
  for (const mission of CPU_SCHEDULER_MISSIONS) {
    assert.ok(mission.capacity >= 4 && mission.capacity <= 8);
    assert.ok(mission.tasks.length >= 2 && mission.tasks.length <= 5);
    assert.equal(new Set(mission.tasks.map((task) => task.id)).size, mission.tasks.length);
    for (const task of mission.tasks) {
      assert.ok(task.memory >= 1 && task.memory <= mission.capacity);
      assert.ok(task.work >= 1 && task.work <= 4);
    }
  }
});

test("loads a waiting task only when memory capacity allows", () => {
  const mission = CPU_SCHEDULER_MISSIONS[1];
  let state = createCpuSchedulerState(mission, 6);
  state = loadCpuTask(state, mission, mission.tasks[0].id, 1);
  assert.equal(getUsedMemory(state, mission), mission.tasks[0].memory);
  const blockedTask = mission.tasks.find((task) => state.waitingTaskIds.includes(task.id) && task.memory + getUsedMemory(state, mission) > mission.capacity);
  assert.ok(blockedTask);
  const blocked = loadCpuTask(state, mission, blockedTask.id, 1);
  assert.equal(blocked.ready.length, 1);
  assert.ok(blocked.waitingTaskIds.includes(blockedTask.id));
  assert.match(blocked.feedback, /内存/);
});

test("ignores unknown, duplicate, and double-click task loads", () => {
  const mission = CPU_SCHEDULER_MISSIONS[0];
  let state = createCpuSchedulerState(mission, 6);
  assert.equal(loadCpuTask(state, mission, "unknown", 1), state);
  assert.equal(loadCpuTask(state, mission, mission.tasks[0].id, 2), state);
  state = loadCpuTask(state, mission, mission.tasks[0].id, 1);
  assert.equal(loadCpuTask(state, mission, mission.tasks[0].id, 1), state);
});

test("runs exactly one time slice and rotates unfinished work to the queue tail", () => {
  const mission = CPU_SCHEDULER_MISSIONS[0];
  let state = createCpuSchedulerState(mission, 6);
  state = loadCpuTask(state, mission, mission.tasks[0].id, 1);
  state = loadCpuTask(state, mission, mission.tasks[1].id, 1);
  const firstOrder = state.ready.map((process) => process.taskId);
  state = runCpuTimeSlice(state, mission, 1);
  assert.equal(state.timeSlices, 1);
  assert.equal(state.history.length, 1);
  assert.equal(state.history[0].taskId, firstOrder[0]);
  assert.deepEqual(state.ready.map((process) => process.taskId), [firstOrder[1], firstOrder[0]]);
  assert.equal(state.ready[1].remainingWork, mission.tasks[0].work - 1);
});

test("completing a task releases its memory and keeps other processes", () => {
  const mission = CPU_SCHEDULER_MISSIONS[0];
  let state = createCpuSchedulerState(mission, 6);
  for (const task of mission.tasks) state = loadCpuTask(state, mission, task.id, 1);
  const usedBefore = getUsedMemory(state, mission);
  while (!state.completedTaskIds.includes(mission.tasks[1].id)) state = runCpuTimeSlice(state, mission, 1);
  assert.equal(getUsedMemory(state, mission), usedBefore - mission.tasks[1].memory);
  assert.ok(!state.ready.some((process) => process.taskId === mission.tasks[1].id));
  assert.match(state.feedback, /释放/);
});

test("empty CPU waits safely without inventing work", () => {
  const mission = CPU_SCHEDULER_MISSIONS[2];
  const state = createCpuSchedulerState(mission, 6);
  const next = runCpuTimeSlice(state, mission, 1);
  assert.deepEqual(next.ready, []);
  assert.equal(next.timeSlices, 0);
  assert.match(next.feedback, /就绪队列/);
});

test("finishes all six shifts with bounded load-and-run decisions", () => {
  for (const mission of CPU_SCHEDULER_MISSIONS) {
    let state = createCpuSchedulerState(mission, 6);
    let guard = 0;
    while (state.phase === "playing" && guard < 100) {
      const nextTask = mission.tasks.find((task) => state.waitingTaskIds.includes(task.id) && task.memory + getUsedMemory(state, mission) <= mission.capacity);
      state = nextTask ? loadCpuTask(state, mission, nextTask.id, 1) : runCpuTimeSlice(state, mission, 1);
      guard += 1;
    }
    assert.equal(state.phase, "solved", mission.id);
    assert.equal(state.completedTaskIds.length, mission.tasks.length);
    assert.equal(getUsedMemory(state, mission), 0);
  }
});

test("advances and rotates replay shifts without duplicate missions", () => {
  const mission = CPU_SCHEDULER_MISSIONS[0];
  let state = createCpuSchedulerState(mission, 6);
  for (const task of mission.tasks) state = loadCpuTask(state, mission, task.id, 1);
  while (state.phase === "playing") state = runCpuTimeSlice(state, mission, 1);
  state = advanceCpuSchedulerMission(state, CPU_SCHEDULER_MISSIONS[1], 1);
  assert.equal(state.missionIndex, 1);
  assert.equal(state.phase, "playing");
  assert.deepEqual(state.waitingTaskIds, CPU_SCHEDULER_MISSIONS[1].tasks.map((task) => task.id));
  assert.deepEqual(buildCpuSchedulerDeck(7).map((item) => item.id), buildCpuSchedulerDeck(1).map((item) => item.id));
  assert.equal(new Set(buildCpuSchedulerDeck(-1).map((item) => item.id)).size, 6);
});
