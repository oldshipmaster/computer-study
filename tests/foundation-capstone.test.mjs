import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { FOUNDATION_CAPSTONE } from "../lib/advanced-foundations/capstone.ts";

test("capstone combines at least two domains in every systems scenario", () => {
  assert.equal(FOUNDATION_CAPSTONE.length, 5);
  assert.deepEqual(FOUNDATION_CAPSTONE.map((mission) => mission.id), ["organize-find", "process-input", "cpu-data", "route-loss", "design-system"]);
  for (const mission of FOUNDATION_CAPSTONE) {
    assert.ok(mission.domains.length >= 2);
    assert.equal(mission.options.length, 3);
    assert.ok(mission.options.includes(mission.answer));
    assert.ok(mission.explanation.length >= 18);
  }
});

test("capstone reports preparation, evidence, and a replayable finish", async () => {
  const [component, map] = await Promise.all([
    readFile(new URL("../components/FoundationCapstone.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/IslandMap.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(component, /比特岛系统总控台/);
  assert.match(component, /ADVANCED_COURSE_IDS/);
  assert.match(component, /建议先完成/);
  assert.match(component, /mission\.explanation/);
  assert.match(component, /重新挑战/);
  assert.match(map, /<FoundationCapstone/);
});
