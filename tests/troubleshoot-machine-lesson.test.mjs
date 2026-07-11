import assert from "node:assert/strict";
import test from "node:test";
import { DEVICE_CASES, tryDeviceCheck } from "../lib/troubleshoot-machine-lesson.ts";

test("starts with simple reversible checks", () => {
  assert.equal(tryDeviceCheck(DEVICE_CASES[0], "check-power").solved, true);
  assert.equal(tryDeviceCheck(DEVICE_CASES[1], "check-volume").solved, true);
});

test("changes one thing and uses the observed result", () => {
  const wrong = tryDeviceCheck(DEVICE_CASES[2], "check-power");
  assert.equal(wrong.solved, false);
  assert.match(wrong.feedback, /现象/);
});

test("never recommends opening hardware or handling unsafe power", () => {
  for (const deviceCase of DEVICE_CASES) {
    assert.doesNotMatch(deviceCase.safeCheck, /拆|打开机箱|电源内部/);
  }
});
