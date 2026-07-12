import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("search, instruction-cycle, routing, and network layers require prediction", async () => {
  const [search, cycle, routing, layers, scheduling, devices, sort, stackQueue, linked, array] = await Promise.all([
    readFile(new URL("../components/lessons/advanced/algorithms/SearchLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/systems/InstructionCycleLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/network/RoutingMazeLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/network/LayerEnvelopeLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/os/SchedulingLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/os/DeviceCoordinationLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/algorithms/SortLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/data-structures/StackQueueLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/data-structures/LinkedTreasureLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/data-structures/ArrayLockerLab.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(search, /预测下一次检查哪个索引/);
  assert.match(search, /expectedIndex/);
  assert.match(search, /这个位置还不是算法的下一步/);
  assert.match(cycle, /预测下一个阶段/);
  assert.match(cycle, /expectedPhase/);
  assert.match(cycle, /顺序不对/);
  assert.match(cycle, /cpu-registers/);
  assert.match(cycle, /寄存器 OUT/);
  assert.match(cycle, /ADD A B/);
  assert.match(routing, /选择总代价最低的可达路线/);
  assert.match(routing, /route-choice--selected/);
  assert.match(routing, /这条路线现在不可达/);
  assert.match(layers, /选择下一层/);
  assert.match(layers, /顺序不对/);
  assert.match(layers, /layer-envelope--opened/);
  assert.match(scheduling, /预测下一个获得 CPU 的任务/);
  assert.match(scheduling, /还没轮到这个任务/);
  assert.match(scheduling, /expectedTaskId/);
  assert.match(devices, /选择设备队首请求/);
  assert.match(devices, /队列要按顺序服务/);
  assert.match(devices, /request\.id !== pending\[0\]\.id/);
  assert.match(sort, /预测这一轮结束后的顺序/);
  assert.match(sort, /只比较相邻数字/);
  assert.match(sort, /expected\.join/);
  assert.match(stackQueue, /从栈底取/);
  assert.match(stackQueue, /从队尾出发/);
  assert.match(stackQueue, /后进先出/);
  assert.match(stackQueue, /先进先出/);
  assert.match(linked, /插在灯塔和山洞之间/);
  assert.match(linked, /灯塔重新指向山洞/);
  assert.match(linked, /这会让路线位置不对/);
  assert.match(array, /选择要更新的索引/);
  assert.match(array, /index !== 1/);
  assert.match(array, /只会改变指定索引/);
});
