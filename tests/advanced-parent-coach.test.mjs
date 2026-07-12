import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { ADVANCED_PARENT_COACH } from "../lib/advanced-foundations/parent-coach.ts";

test("gives occasional parent help for every advanced domain", () => {
  assert.equal(ADVANCED_PARENT_COACH.length, 4);
  for (const card of ADVANCED_PARENT_COACH) {
    assert.equal(card.questions.length, 2);
    assert.ok(card.misconception.length >= 12);
    assert.ok(card.offlineActivity.length >= 12);
  }
  assert.doesNotMatch(JSON.stringify(ADVANCED_PARENT_COACH), /填写姓名|上传|真实密码/);
});

test("keeps the advanced coaching guide inside the protected parent area", async () => {
  const [coach, parent] = await Promise.all([
    readFile(new URL("../components/AdvancedParentCoach.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/ParentPanel.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(coach, /家长偶尔怎么帮/);
  assert.match(coach, /常见误解/);
  assert.match(coach, /离屏小游戏/);
  assert.match(parent, /<AdvancedParentCoach/);
});
