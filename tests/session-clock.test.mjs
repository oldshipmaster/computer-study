import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getSessionClockState } from "../lib/session-clock.ts";

test("reports exploration, ready, and break phases at exact boundaries", () => {
  assert.deepEqual(getSessionClockState(0), { minutes: 0, phase: "explore", label: "探索中 · 不到 1 分钟" });
  assert.deepEqual(getSessionClockState(479), { minutes: 7, phase: "explore", label: "探索中 · 7 分钟" });
  assert.deepEqual(getSessionClockState(480), { minutes: 8, phase: "ready", label: "已学习 8 分钟，可以完成本课" });
  assert.deepEqual(getSessionClockState(599), { minutes: 9, phase: "ready", label: "已学习 9 分钟，可以完成本课" });
  assert.deepEqual(getSessionClockState(600), { minutes: 10, phase: "break", label: "已到 10 分钟，完成后离屏休息" });
});

test("clamps invalid elapsed values safely", () => {
  assert.equal(getSessionClockState(-5).minutes, 0);
  assert.equal(getSessionClockState(Number.NaN).minutes, 0);
});

test("offers a calm non-blocking break checklist at ten minutes", () => {
  const source = readFileSync(new URL("../components/lessons/LessonSessionClock.tsx", import.meta.url), "utf8");
  assert.match(source, /clock\.phase === "break"/);
  assert.match(source, /lesson-break-checklist/);
  assert.match(source, /保存当前进度/);
  assert.match(source, /看看远处/);
  assert.match(source, /站起来活动/);
  assert.match(source, /我知道了，完成后休息/);
});
