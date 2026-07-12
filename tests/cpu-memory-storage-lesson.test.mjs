import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { INITIAL_MACHINE_STATE, updateMachine } from "../lib/cpu-memory-storage-lesson.ts";

test("loads stored work into memory before the CPU edits it", () => {
  let state = updateMachine(INITIAL_MACHINE_STATE, { type: "load" });
  assert.equal(state.memory, "岛屿草图");
  state = updateMachine(state, { type: "process", value: "岛屿草图 + 灯塔" });
  assert.equal(state.memory, "岛屿草图 + 灯塔");
  assert.equal(state.storage, "岛屿草图");
});

test("saving copies current memory into long-term storage", () => {
  let state = { ...INITIAL_MACHINE_STATE, memory: "新作品" };
  state = updateMachine(state, { type: "save" });
  assert.equal(state.storage, "新作品");
});

test("restart clears working memory but preserves saved storage", () => {
  const state = updateMachine({ ...INITIAL_MACHINE_STATE, memory: "未保存修改", storage: "已保存作品" }, { type: "restart" });
  assert.equal(state.memory, null);
  assert.equal(state.storage, "已保存作品");
});

test("the lesson visualizes data flow and explains volatile memory", () => {
  const source = readFileSync(new URL("../components/lessons/hardware/MemoryLab.tsx", import.meta.url), "utf8");
  assert.match(source, /machine-data-flow/);
  assert.match(source, /data-flow--active/);
  assert.match(source, /lastAction/);
  assert.match(source, /RAM 会清空/);
  assert.match(source, /存储会保留/);
  assert.match(source, /data-flow--load/);
  assert.match(source, /data-flow--save/);
  assert.match(source, /data-pulse/);
  assert.match(source, /machine-history/);
  assert.match(source, /phase !== 0/);
  assert.match(source, /phase !== 4/);
});
