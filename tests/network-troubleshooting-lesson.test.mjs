import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { NETWORK_CASES, diagnoseNetwork } from "../lib/network-troubleshooting-lesson.ts";

test("distinguishes local connection, weak signal, server, and address cases", () => {
  assert.deepEqual(NETWORK_CASES.map((item) => diagnoseNetwork(item).cause), ["device-offline", "weak-signal", "server-unavailable", "wrong-address"]);
});

test("uses the smallest safe check for each observation", () => {
  assert.match(diagnoseNetwork(NETWORK_CASES[0]).nextStep, /网络图标/);
  assert.match(diagnoseNetwork(NETWORK_CASES[2]).nextStep, /稍后/);
});

test("never tells a child to reset routers or alter real settings alone", () => {
  for (const item of NETWORK_CASES) {
    assert.doesNotMatch(diagnoseNetwork(item).nextStep, /重置路由器|恢复出厂|更改密码/);
  }
});

test("the network clinic presents a safe evidence-driven diagnostic chain", () => {
  const source = readFileSync(new URL("../components/lessons/network/NetworkClinic.tsx", import.meta.url), "utf8");
  assert.match(source, /diagnostic-chain/);
  assert.match(source, /diagnostic-node--checked/);
  assert.match(source, /设备连接/);
  assert.match(source, /信号强度/);
  assert.match(source, /服务器/);
  assert.match(source, /地址拼写/);
  assert.match(source, /观察证据/);
});
