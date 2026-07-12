import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = readFileSync(new URL("components/lessons/advanced/SystemsNetworkLessons.tsx", root), "utf8");
const registry = readFileSync(new URL("components/lessons/lesson-registry.ts", root), "utf8");
const lessons = [
  ["instruction-cycle", "InstructionCycleLesson", "InstructionCycleLab", "systems"],
  ["cache-station", "CacheStationLesson", "CacheStationLab", "systems"],
  ["network-layers", "NetworkLayersLesson", "LayerEnvelopeLab", "network"],
  ["routing-maze", "RoutingMazeLesson", "RoutingMazeLab", "network"],
  ["reliable-transfer", "ReliableTransferLesson", "ReliableTransferLab", "network"],
];

for (const [id, exportName, labName] of lessons) {
  test(`${id} exports and registers a dedicated systems lesson`, () => {
    assert.match(source, new RegExp(`export function ${exportName}`));
    assert.match(source, new RegExp(`Lab:\\s*${labName}`));
    assert.match(registry, new RegExp(`"${id}"\\s*:`));
    assert.match(registry, new RegExp(`Component:\\s*${exportName}`));
  });
}

test("systems lessons preserve stage focus, resume, and single award", () => {
  assert.match(source, /Math\.max\(0, Math\.min\(5/);
  assert.match(source, /headingRef\.current\?\.focus\(\)/);
  assert.match(source, /onStageChange\(stage\)/);
  assert.match(source, /awardedRef\.current/);
});

test("systems labs expose visible local-only button interactions", () => {
  for (const [, , file, folder] of lessons) {
    const lab = readFileSync(new URL(`components/lessons/advanced/${folder}/${file}.tsx`, root), "utf8");
    assert.match(lab, /role="status"/);
    assert.match(lab, /type="button"/);
    assert.doesNotMatch(lab, /fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/);
  }
});
