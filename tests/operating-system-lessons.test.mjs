import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = readFileSync(new URL("components/lessons/advanced/OperatingSystemLessons.tsx", root), "utf8");
const registry = readFileSync(new URL("components/lessons/lesson-registry.ts", root), "utf8");
const lessons = [
  ["program-process", "ProgramProcessLesson", "ProcessLab"],
  ["cpu-scheduling", "CpuSchedulingLesson", "SchedulingLab"],
  ["memory-allocation", "MemoryAllocationLesson", "MemoryRoomsLab"],
  ["file-system-tree", "FileSystemTreeLesson", "FileSystemLab"],
  ["device-coordination", "DeviceCoordinationLesson", "DeviceCoordinationLab"],
];

for (const [id, exportName, labName] of lessons) {
  test(`${id} exports and registers a dedicated operating-system lesson`, () => {
    assert.match(source, new RegExp(`export function ${exportName}`));
    assert.match(source, new RegExp(`Lab:\\s*${labName}`));
    assert.match(registry, new RegExp(`"${id}"\\s*:`));
    assert.match(registry, new RegExp(`Component:\\s*${exportName}`));
  });
}

test("operating-system lessons are resumable, focusable, and award once", () => {
  assert.match(source, /Math\.max\(0, Math\.min\(5/);
  assert.match(source, /headingRef\.current\?\.focus\(\)/);
  assert.match(source, /onStageChange\(stage\)/);
  assert.match(source, /awardedRef\.current/);
});

test("operating-system labs are visible simulations without browser system APIs", () => {
  for (const [, , file] of lessons) {
    const lab = readFileSync(new URL(`components/lessons/advanced/os/${file}.tsx`, root), "utf8");
    assert.match(lab, /role="status"/);
    assert.match(lab, /type="button"/);
    assert.doesNotMatch(lab, /navigator\.|showOpenFilePicker|showSaveFilePicker|indexedDB|Worker\(/);
  }
});
