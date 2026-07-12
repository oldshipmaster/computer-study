import assert from "node:assert/strict";
import test from "node:test";
import { inspectPrompt } from "../lib/popup-fog-lesson.ts";
import { readFileSync } from "node:fs";

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

test("prompt lab requires scanning five safety signals", () => {
  const source = readFileSync(new URL("../components/lessons/safety/PromptInspector.tsx", import.meta.url), "utf8");
  assert.match(source, /prompt-signal-scanner/);
  assert.match(source, /来源可信/);
  assert.match(source, /催促行动/);
  assert.match(source, /索要秘密/);
  assert.match(source, /包含下载/);
  assert.match(source, /符合当前任务/);
  assert.match(source, /disabled=\{scanned\.length < SIGNALS\.length/);
  assert.match(source, /完成弹窗安全扫描/);
});
