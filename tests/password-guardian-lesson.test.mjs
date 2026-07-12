import assert from "node:assert/strict";
import test from "node:test";
import { evaluatePassphrase } from "../lib/password-guardian-lesson.ts";
import { readFileSync } from "node:fs";

test("rewards length and word diversity in fictional samples", () => {
  assert.equal(evaluatePassphrase("blue-river-robot-planet-47").strong, true);
  assert.equal(evaluatePassphrase("cat").strong, false);
});

test("rejects common patterns and personal-looking information", () => {
  assert.match(evaluatePassphrase("12345678").feedback, /常见/);
  assert.match(evaluatePassphrase("myphone-13800138000").feedback, /个人信息/);
});

test("never needs the learner's real password", () => {
  const result = evaluatePassphrase("fictional-only-sample-planet-9");
  assert.equal(result.safeToPractice, true);
  assert.match(result.feedback, /虚构/);
});

test("explains every fictional strength dimension", () => {
  const partial = evaluatePassphrase("blue-river");
  assert.deepEqual(partial.checks, {
    longEnough: false,
    enoughParts: false,
    hasLetters: true,
    hasNumber: false,
    avoidsCommonPattern: true,
    avoidsPersonalInfo: true,
  });
  assert.ok(Object.values(evaluatePassphrase("blue-river-robot-planet-47").checks).every(Boolean));
});

test("builder renders a visible checklist without a password text field", () => {
  const source = readFileSync(new URL("../components/lessons/safety/PassphraseBuilder.tsx", import.meta.url), "utf8");
  assert.match(source, /passphrase-strength-grid/);
  assert.match(source, /至少 20 个字符/);
  assert.match(source, /至少 4 个部分/);
  assert.match(source, /包含字母/);
  assert.match(source, /包含数字/);
  assert.match(source, /删除.*虚构词/);
  assert.doesNotMatch(source, /<input|<textarea/);
});
