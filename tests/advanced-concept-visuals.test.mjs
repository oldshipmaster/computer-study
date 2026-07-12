import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("advanced lessons teach each concept with an accessible animated diagram", async () => {
  const [visual, data, algorithms, os, systems] = await Promise.all([
    source("components/lessons/advanced/ConceptJourney.tsx"),
    source("components/lessons/advanced/DataStructureLessons.tsx"),
    source("components/lessons/advanced/AlgorithmLessons.tsx"),
    source("components/lessons/advanced/OperatingSystemLessons.tsx"),
    source("components/lessons/advanced/SystemsNetworkLessons.tsx"),
  ]);
  assert.match(visual, /role="img"/);
  assert.match(visual, /aria-label=\{label\}/);
  assert.match(visual, /concept-journey-node--active/);
  assert.match(visual, /Array\.from\(\{ length: 5 \}/);
  assert.match(visual, /reducedMotion/);
  assert.match(visual, /concept-journey--still/);
  for (const wrapper of [data, algorithms, os, systems]) {
    assert.match(wrapper, /ConceptJourney/);
    assert.match(wrapper, /labels=\{config\.stages\.slice\(0, 5\)\}/);
    assert.match(wrapper, /reducedMotion=\{reducedMotion\}/);
  }
});
