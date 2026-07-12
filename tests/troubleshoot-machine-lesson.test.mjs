import assert from "node:assert/strict";
import test from "node:test";
import { DEVICE_CASES, tryDeviceCheck } from "../lib/troubleshoot-machine-lesson.ts";
import { readFileSync } from "node:fs";

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

test("clinic keeps an evidence chain and makes the learner retest", () => {
  const source = readFileSync(new URL("../components/lessons/hardware/DeviceClinic.tsx", import.meta.url), "utf8");
  assert.match(source, /diagnosis-evidence-chain/);
  assert.match(source, /1 · 现象/);
  assert.match(source, /2 · 线索/);
  assert.match(source, /3 · 单一检查/);
  assert.match(source, /4 · 重新测试/);
  assert.match(source, /检查记录/);
  assert.match(source, /确认恢复，下一案例/);
  assert.match(source, /完成安全排查训练/);
});
