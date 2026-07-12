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

test("memory lab visualizes occupied and free rooms", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/os/MemoryRoomsLab.tsx", root), "utf8");
  assert.match(lab, /occupiedRooms/);
  assert.match(lab, /memory-room--occupied/);
  assert.match(lab, /空闲/);
  assert.match(lab, /已使用.*\/.*8/);
});

test("process lab shows the lifecycle as a visible state machine", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/os/ProcessLab.tsx", root), "utf8");
  assert.match(lab, /process-state-machine/);
  assert.match(lab, /PROCESS_LABELS/);
  assert.match(lab, /process-node--current/);
  assert.match(lab, /aria-label="进程生命周期状态图"/);
});

test("file system lab shows a persistent directory tree and path breadcrumbs", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/os/FileSystemLab.tsx", root), "utf8");
  assert.match(lab, /file-tree/);
  assert.match(lab, /path-breadcrumbs/);
  assert.match(lab, /aria-current/);
  assert.match(lab, /根目录/);
});

test("device lab shows requests crossing the OS and driver boundary", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/os/DeviceCoordinationLab.tsx", root), "utf8");
  assert.match(lab, /device-request-flow/);
  assert.match(lab, /应用程序/);
  assert.match(lab, /操作系统队列/);
  assert.match(lab, /驱动程序/);
  assert.match(lab, /硬件设备/);
  assert.match(lab, /队首/);
});

test("scheduler visualizes the round-robin pointer, time slices, and history", () => {
  const lab = readFileSync(new URL("components/lessons/advanced/os/SchedulingLab.tsx", root), "utf8");
  assert.match(lab, /schedule-turntable/);
  assert.match(lab, /schedule-task--next/);
  assert.match(lab, /time-slice/);
  assert.match(lab, /schedule-history/);
  assert.match(lab, /调度指针/);
});
