import assert from "node:assert/strict";
import test from "node:test";
import { summarizeIslandProgress } from "../lib/parent-progress-summary.ts";

test("summarizes completed courses for each island", () => {
  const summary = summarizeIslandProgress(["keyboard-flight", "mouse-precision", "file-home"]);
  assert.deepEqual(summary.map((item) => [item.id, item.completed, item.total]), [
    ["launch-harbor", 2, 5],
    ["file-forest", 1, 5],
    ["robot-workshop", 0, 5],
    ["safety-lighthouse", 0, 5],
    ["hardware-lab", 0, 5],
    ["network-bay", 0, 5],
    ["creative-workshop", 0, 5],
  ]);
});

test("deduplicates unknown completion ids safely", () => {
  const summary = summarizeIslandProgress(["keyboard-flight", "keyboard-flight", "unknown"]);
  assert.equal(summary[0].completed, 1);
  assert.equal(summary.reduce((total, item) => total + item.completed, 0), 1);
});
