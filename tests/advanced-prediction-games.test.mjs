import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("search, instruction-cycle, routing, and network layers require prediction", async () => {
  const [search, cycle, routing, layers] = await Promise.all([
    readFile(new URL("../components/lessons/advanced/algorithms/SearchLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/systems/InstructionCycleLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/network/RoutingMazeLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/network/LayerEnvelopeLab.tsx", import.meta.url), "utf8"),
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
});
