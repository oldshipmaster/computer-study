import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { safelyRunSpeech, shouldSpeakLesson } from "../lib/lesson-audio.ts";

test("speaks only a visible non-empty lesson message with audio enabled", () => {
  assert.equal(shouldSpeakLesson({ enabled: true, hidden: false, hasApi: true, message: "下一段" }), true);
  assert.equal(shouldSpeakLesson({ enabled: false, hidden: false, hasApi: true, message: "下一段" }), false);
  assert.equal(shouldSpeakLesson({ enabled: true, hidden: true, hasApi: true, message: "下一段" }), false);
  assert.equal(shouldSpeakLesson({ enabled: true, hidden: false, hasApi: false, message: "下一段" }), false);
  assert.equal(shouldSpeakLesson({ enabled: true, hidden: false, hasApi: true, message: "   " }), false);
});

test("keeps optional speech failures from interrupting a lesson", () => {
  let ran = false;
  assert.equal(safelyRunSpeech(() => { ran = true; }), true);
  assert.equal(ran, true);
  assert.equal(safelyRunSpeech(() => { throw new Error("voice unavailable"); }), false);
});

test("cancels shared lesson speech when the page is hidden or the lesson closes", () => {
  const source = readFileSync(
    new URL("../components/lessons/LessonAudio.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /document\.addEventListener\("visibilitychange"/);
  assert.match(source, /document\.removeEventListener\("visibilitychange"/);
  assert.match(source, /document\.visibilityState !== "visible"/);
  assert.match(source, /return \(\) => \{[\s\S]{0,240}window\.speechSynthesis\.cancel\(\)/);
});
