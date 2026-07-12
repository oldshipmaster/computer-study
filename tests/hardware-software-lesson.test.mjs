import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { classifySystemItem, canCompleteTask, getSystemSignalRoute } from "../lib/hardware-software-lesson.ts";

test("distinguishes physical hardware from software instructions", () => {
  assert.equal(classifySystemItem("mouse"), "hardware");
  assert.equal(classifySystemItem("paint-app"), "software");
  assert.equal(classifySystemItem("operating-system"), "software");
});

test("requires both hardware and software for a drawing task", () => {
  assert.equal(canCompleteTask("draw", ["mouse", "screen", "paint-app"]), true);
  assert.equal(canCompleteTask("draw", ["mouse", "screen"]), false);
  assert.equal(canCompleteTask("draw", ["paint-app"]), false);
});

test("unknown items do not silently count as a working system", () => {
  assert.equal(classifySystemItem("magic-box"), "unknown");
  assert.equal(canCompleteTask("print", ["printer", "magic-box"]), false);
});

test("the pairing lab shows hardware and software as one working system", () => {
  const source = readFileSync(new URL("../components/lessons/hardware/SystemPairingLab.tsx", import.meta.url), "utf8");
  assert.match(source, /system-blueprint/);
  assert.match(source, /hardware-slot/);
  assert.match(source, /software-slot/);
  assert.match(source, /系统输出/);
  assert.match(source, /硬件.*软件.*一起/);
  assert.match(source, /system-signal-route/);
  assert.match(source, /传给操作系统/);
  assert.match(source, /执行下一站/);
});

test("routes an application request through the operating system and hardware", () => {
  assert.deepEqual(getSystemSignalRoute("print"), [
    { kind: "app", label: "打印程序发出请求" },
    { kind: "os", label: "操作系统协调资源" },
    { kind: "hardware", label: "打印机执行动作" },
    { kind: "output", label: "纸上出现作品" },
  ]);
  assert.equal(getSystemSignalRoute("unknown").length, 0);
});
