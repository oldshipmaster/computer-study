import assert from "node:assert/strict";
import test from "node:test";
import { evaluatePassphrase } from "../lib/password-guardian-lesson.ts";

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
