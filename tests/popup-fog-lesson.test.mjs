import assert from "node:assert/strict";
import test from "node:test";
import { inspectPrompt } from "../lib/popup-fog-lesson.ts";

test("closes prompts that request secrets or surprise downloads", () => {
  assert.equal(inspectPrompt({ trustedSource: false, urgent: true, asksSecret: true, download: false, expected: false }).action, "close");
  assert.equal(inspectPrompt({ trustedSource: false, urgent: false, asksSecret: false, download: true, expected: false }).action, "close");
});

test("asks an adult when a necessary action is uncertain", () => {
  assert.equal(inspectPrompt({ trustedSource: true, urgent: false, asksSecret: false, download: true, expected: true }).action, "ask");
});

test("continues only for expected low-risk prompts from a trusted source", () => {
  const result = inspectPrompt({ trustedSource: true, urgent: false, asksSecret: false, download: false, expected: true });
  assert.equal(result.action, "continue");
  assert.deepEqual(result.warningFlags, []);
});
