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

test("reliable transfer visualizes every packet state and its route", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/network/ReliableTransferLab.tsx", root), "utf8");
  assert.match(lab, /transfer-route/);
  assert.match(lab, /packet--\$\{status\}/);
  assert.match(lab, /"received"\s*:\s*lost\s*\?\s*"lost"\s*:\s*"waiting"/);
  assert.match(lab, /发送站/);
  assert.match(lab, /接收站/);
});

test("cache station visualizes distance, capacity, and wait across the hierarchy", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/systems/CacheStationLab.tsx", root), "utf8");
  assert.match(lab, /memory-hierarchy/);
  assert.match(lab, /离 CPU 最近/);
  assert.match(lab, /容量/);
  assert.match(lab, /等待.*单位/);
  assert.match(lab, /aria-current/);
});

test("network layers remain visible as nested envelopes during packing and opening", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/network/LayerEnvelopeLab.tsx", root), "utf8");
  assert.match(lab, /nested-envelopes/);
  assert.match(lab, /envelope--wrapped/);
  assert.match(lab, /envelope--current/);
  assert.match(lab, /envelope--opened/);
  assert.match(lab, /消息核心/);
  assert.match(lab, /发送端.*接收端/);
});

test("instruction cycle traces data through all four CPU stages", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/systems/InstructionCycleLab.tsx", root), "utf8");
  assert.match(lab, /instruction-data-flow/);
  assert.match(lab, /phase-node--current/);
  assert.match(lab, /读取.*PC/);
  assert.match(lab, /指令寄存器/);
  assert.match(lab, /运算单元/);
  assert.match(lab, /写入.*OUT/);
});
