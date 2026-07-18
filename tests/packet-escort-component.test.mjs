import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  const file = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(file), `Missing source file ${relativePath}`);
  return readFileSync(file, "utf8");
}

test("keeps packet escort behind three advanced network prerequisites", () => {
  const component = source("components/PacketEscort.tsx");
  for (const courseId of ["network-layers", "routing-maze", "reliable-transfer"]) assert.match(component, new RegExp(courseId));
  assert.match(component, /已完成 \{completedRequired\.length\} \/ \{REQUIRED_COURSE_IDS\.length\}/);
  assert.match(component, /onStartCourse\(nextCourse\.id\)/);
});

test("renders all six hands-on packet phases with persistent evidence", () => {
  const component = source("components/PacketEscort.tsx");
  for (const phrase of ["逐层打包", "选择路线", "发射分组", "精确重传", "接收排序", "反向拆层"]) assert.match(component, new RegExp(phrase));
  assert.match(component, /packPacketLayer/);
  assert.match(component, /chooseEscortRoute/);
  assert.match(component, /launchPacketTransfer/);
  assert.match(component, /retransmitPacket/);
  assert.match(component, /moveReceivedPacket/);
  assert.match(component, /unpackPacketLayer/);
  assert.match(component, /role="status"/);
});

test("shows named layers, route costs, packet numbers, and recovered message", () => {
  const component = source("components/PacketEscort.tsx");
  for (const phrase of ["应用层", "传输层", "网络层", "链路层", "总代价", "分组编号", "恢复的消息"]) assert.match(component, new RegExp(phrase));
  assert.match(component, /aria-current/);
  assert.match(component, /aria-label=\{`第 \$\{sequence \+ 1\} 组/);
});

test("supports completion, replay rotation, and focus handoff", () => {
  const component = source("components/PacketEscort.tsx");
  assert.match(component, /接入下一次护航/);
  assert.match(component, /重玩六次网络护航/);
  assert.match(component, /buildPacketEscortDeck\(nextRotation\)/);
  assert.match(component, /headingRef\.current\?\.focus/);
});

test("lazy-loads packet escort after code expedition and ships accessible responsive CSS", () => {
  const map = source("components/IslandMap.tsx");
  const component = source("components/PacketEscort.tsx");
  const css = source("components/PacketEscort.css");
  assert.match(map, /const PacketEscort = lazy\(\(\) => import\("@\/components\/PacketEscort"\)/);
  assert.match(map, /<RobotCodeExpedition[\s\S]*?<PacketEscort[\s\S]*?<LearningPlan/);
  assert.match(map, /href="#packet-escort"/);
  assert.match(map, /正在连接网络数据包护航/);
  assert.match(component, /import "\.\/PacketEscort\.css"/);
  assert.match(css, /\.packet-escort-action[^{]*\{[^}]*min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.packet-route-grid[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.bit-island-app--reduced-motion[\s\S]*?animation:\s*none/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?aria-current/);
});
