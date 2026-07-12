import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createFoundationPractice } from "../lib/advanced-foundations/practice.ts";

test("builds a deterministic four-domain practice set without personal data", () => {
  const first = createFoundationPractice(20260712);
  assert.deepEqual(first, createFoundationPractice(20260712));
  assert.equal(first.length, 4);
  assert.equal(new Set(first.map((question) => question.domain)).size, 4);
  assert.ok(first.every((question) => question.options.length === 3 && question.options.includes(question.answer)));
  assert.doesNotMatch(JSON.stringify(first), /姓名|电话|住址|真实密码/);
  assert.notDeepEqual(first, createFoundationPractice(20260713));
});

test("practice console gives evidence and links back to its lesson", async () => {
  const [component, map] = await Promise.all([
    readFile(new URL("../components/FoundationPractice.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/IslandMap.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(component, /今日底层脑力加练/);
  assert.match(component, /question\.explanation/);
  assert.match(component, /onStartCourse\(question\.courseId\)/);
  assert.match(component, /再来一组/);
  assert.match(map, /<FoundationPractice/);
});
