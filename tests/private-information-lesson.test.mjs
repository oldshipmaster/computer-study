import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { recommendPrivacyAction, sortPrivacyCard, INITIAL_PRIVACY_STATE } from "../lib/private-information-lesson.ts";

test("never shares passwords, phone numbers, or home addresses", () => {
  for (const type of ["password", "phone", "address"]) {
    assert.equal(recommendPrivacyAction(type, "online-friend"), "stop");
  }
});

test("uses context for low-risk interests and uncertain requests", () => {
  assert.equal(recommendPrivacyAction("favorite-color", "teacher"), "share");
  assert.equal(recommendPrivacyAction("school-name", "website"), "ask");
  assert.equal(recommendPrivacyAction("photo", "app"), "ask");
});

test("wrong sorting keeps completed cards and gives a safe next action", () => {
  const right = sortPrivacyCard(INITIAL_PRIVACY_STATE, "phone", "stop");
  const wrong = sortPrivacyCard(right, "address", "share");
  assert.equal(wrong.sorted.phone, "stop");
  assert.match(wrong.feedback, /先停下来/);
});

test("sorter explains transferable privacy risk dimensions", () => {
  const source = readFileSync(new URL("../components/lessons/safety/PrivacySorter.tsx", import.meta.url), "utf8");
  assert.match(source, /privacy-risk-lenses/);
  assert.match(source, /识别我/);
  assert.match(source, /联系我/);
  assert.match(source, /找到我/);
  assert.match(source, /登录账号/);
  assert.match(source, /分类总结/);
  assert.match(source, /完成隐私判断/);
  assert.doesNotMatch(source, /if \(Object\.keys\(next\.sorted\)\.length === CARDS\.length\) onComplete\(\)/);
});
