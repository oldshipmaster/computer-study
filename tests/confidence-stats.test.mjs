import assert from "node:assert/strict";
import test from "node:test";
import { buildConfidenceStats } from "../lib/confidence-stats.ts";

test("summarizes only completed catalog courses", () => {
  assert.deepEqual(buildConfidenceStats(
    ["keyboard-flight", "mouse-precision", "file-home", "unknown"],
    { "keyboard-flight": "confident", "mouse-precision": "practice", "file-home": "help", unknown: "confident", "data-table": "help" },
  ), { confident: 1, practice: 1, help: 1, unrated: 0, rated: 3 });
});

test("counts completed courses without a choice as unrated", () => {
  assert.deepEqual(buildConfidenceStats(["keyboard-flight", "file-home"], { "keyboard-flight": "confident" }), { confident: 1, practice: 0, help: 0, unrated: 1, rated: 1 });
  assert.deepEqual(buildConfidenceStats([], {}), { confident: 0, practice: 0, help: 0, unrated: 0, rated: 0 });
});
