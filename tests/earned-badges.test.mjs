import assert from "node:assert/strict";
import test from "node:test";
import { buildEarnedBadges } from "../lib/earned-badges.ts";

const definitions = {
  first: { badgeId: "first-badge", badgeName: "第一枚徽章" },
  second: { badgeId: "second-badge", badgeName: "第二枚徽章" },
};

test("derives badges only from completed registered courses", () => {
  assert.deepEqual(
    buildEarnedBadges(["first", "unknown", "first"], definitions),
    [{ id: "first-badge", name: "第一枚徽章" }],
  );
});

test("keeps completed-course order while removing duplicate badge ids", () => {
  const sharedDefinitions = {
    ...definitions,
    third: { badgeId: "first-badge", badgeName: "旧名称不应重复显示" },
  };

  assert.deepEqual(
    buildEarnedBadges(["second", "first", "third"], sharedDefinitions),
    [
      { id: "second-badge", name: "第二枚徽章" },
      { id: "first-badge", name: "第一枚徽章" },
    ],
  );
});
