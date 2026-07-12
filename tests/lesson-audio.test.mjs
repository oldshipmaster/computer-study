import assert from "node:assert/strict";
import test from "node:test";
import { shouldSpeakLesson } from "../lib/lesson-audio.ts";

test("speaks only a visible non-empty lesson message with audio enabled", () => {
  assert.equal(shouldSpeakLesson({ enabled: true, hidden: false, hasApi: true, message: "下一段" }), true);
  assert.equal(shouldSpeakLesson({ enabled: false, hidden: false, hasApi: true, message: "下一段" }), false);
  assert.equal(shouldSpeakLesson({ enabled: true, hidden: true, hasApi: true, message: "下一段" }), false);
  assert.equal(shouldSpeakLesson({ enabled: true, hidden: false, hasApi: false, message: "下一段" }), false);
  assert.equal(shouldSpeakLesson({ enabled: true, hidden: false, hasApi: true, message: "   " }), false);
});
