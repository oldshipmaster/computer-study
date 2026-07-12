import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { evaluateTypingTask, normalizeTypingResumeStage } from "../lib/typing-lesson.ts";

test("matches English and numbers exactly", () => {
  assert.equal(evaluateTypingTask({ target: "bit", kind: "exact" }, "bit", false).complete, true);
  assert.equal(evaluateTypingTask({ target: "bit", kind: "exact" }, "Bit", false).complete, false);
  assert.equal(evaluateTypingTask({ target: "2026", kind: "exact" }, "2026", false).complete, true);
});

test("requires real Shift evidence for an uppercase task", () => {
  const task = { target: "Bit", kind: "shift" };
  assert.equal(evaluateTypingTask(task, "Bit", false, { shiftUsed: false }).complete, false);
  assert.match(evaluateTypingTask(task, "Bit", false, { shiftUsed: false }).feedback, /Shift/);
  assert.equal(evaluateTypingTask(task, "Bit", false, { shiftUsed: true }).complete, true);
});

test("waits for IME composition to finish before accepting Chinese", () => {
  assert.equal(evaluateTypingTask({ target: "比比", kind: "ime" }, "比比", true).complete, false);
  assert.equal(evaluateTypingTask({ target: "比比", kind: "ime" }, "比比", false).complete, true);
});

test("gives useful, non-punitive correction feedback", () => {
  const partial = evaluateTypingTask({ target: "BIBI", kind: "correction" }, "BIBIX", false);
  assert.equal(partial.complete, false);
  assert.equal(partial.useful, true);
  assert.match(partial.feedback, /退格键/);
  assert.equal(evaluateTypingTask({ target: "bit", kind: "exact" }, "xyz", false).useful, false);
});

test("clamps resume to a playable stage", () => {
  assert.equal(normalizeTypingResumeStage(-1), 0);
  assert.equal(normalizeTypingResumeStage(99), 5);
});

test("disables mobile text transformations for exact typing tasks", () => {
  const source = readFileSync(
    new URL("../components/lessons/typing/TypingConsole.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /autoCapitalize="none"/);
  assert.match(source, /autoCorrect="off"/);
  assert.match(source, /spellCheck=\{false\}/);
});

test("visualizes character progress and IME composition state", () => {
  const source = readFileSync(new URL("../components/lessons/typing/TypingConsole.tsx", import.meta.url), "utf8");
  assert.match(source, /typing-character-progress/);
  assert.match(source, /typing-char--matched/);
  assert.match(source, /typing-char--current/);
  assert.match(source, /ime-status--composing/);
  assert.match(source, /正在选词/);
  assert.match(source, /shift-combination-status/);
  assert.match(source, /event\.shiftKey/);
});
