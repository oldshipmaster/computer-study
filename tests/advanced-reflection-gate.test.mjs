import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("advanced labs finish with a reasoned explain-back choice", async () => {
  const [gate, data, algorithms, os, systems] = await Promise.all([
    source("components/lessons/advanced/ConceptReflectionGate.tsx"),
    source("components/lessons/advanced/DataStructureLessons.tsx"),
    source("components/lessons/advanced/AlgorithmLessons.tsx"),
    source("components/lessons/advanced/OperatingSystemLessons.tsx"),
    source("components/lessons/advanced/SystemsNetworkLessons.tsx"),
  ]);
  assert.match(gate, /先讲明白，再领取徽章/);
  assert.match(gate, /aria-pressed/);
  assert.match(gate, /答对了/);
  assert.match(gate, /再想一想/);
  for (const wrapper of [data, algorithms, os, systems]) {
    assert.match(wrapper, /labSolved/);
    assert.match(wrapper, /ConceptReflectionGate/);
    assert.match(wrapper, /reflection=\{config\.reflection\}/);
  }
});
