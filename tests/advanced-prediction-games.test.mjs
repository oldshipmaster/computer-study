import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("search and instruction-cycle labs require prediction before advancing", async () => {
  const [search, cycle] = await Promise.all([
    readFile(new URL("../components/lessons/advanced/algorithms/SearchLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/lessons/advanced/systems/InstructionCycleLab.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(search, /预测下一次检查哪个索引/);
  assert.match(search, /expectedIndex/);
  assert.match(search, /这个位置还不是算法的下一步/);
  assert.match(cycle, /预测下一个阶段/);
  assert.match(cycle, /expectedPhase/);
  assert.match(cycle, /顺序不对/);
});
