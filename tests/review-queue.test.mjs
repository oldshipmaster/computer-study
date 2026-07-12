import assert from "node:assert/strict";
import test from "node:test";
import { buildReviewQueue } from "../lib/review-queue.ts";

test("puts help requests before practice while preserving course order", () => {
  const queue = buildReviewQueue({ "file-home": "practice", "keyboard-flight": "practice", "ai-helper": "help", "password-guardian": "help", "loop": "unknown" });
  assert.deepEqual(queue.map((entry) => entry.course.id), ["password-guardian", "ai-helper", "keyboard-flight", "file-home"]);
  assert.deepEqual(queue.map((entry) => entry.confidence), ["help", "help", "practice", "practice"]);
});

test("ignores confident and unknown courses and respects a safe limit", () => {
  assert.deepEqual(buildReviewQueue({ "keyboard-flight": "confident", unknown: "help" }), []);
  assert.equal(buildReviewQueue({ "keyboard-flight": "practice", "file-home": "help" }, 1).length, 1);
  assert.deepEqual(buildReviewQueue({ "keyboard-flight": "practice" }, 0), []);
});
