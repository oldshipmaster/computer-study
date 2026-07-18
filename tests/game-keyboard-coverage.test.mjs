import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const KEYBOARD_GAME_COMPONENTS = [
  "KnowledgeSprint",
  "IslandBossArena",
  "LogicCircuitLab",
  "RobotCodeExpedition",
  "PacketEscort",
  "CpuSchedulerGame",
  "AlgorithmArenaGame",
  "DataStructureHarbor",
  "SafetyDetectiveGame",
  "VirtualComputerFactory",
  "FileForestRescue",
  "CreativeStudioChallenge",
  "AiVerificationLab",
  "DecisionRelay",
];

function componentSource(name) {
  const file = new URL(`../components/${name}.tsx`, import.meta.url);
  assert.ok(existsSync(file), `Missing keyboard game component ${name}`);
  return readFileSync(file, "utf8");
}

test("every keyboard-first game keeps visible and accessible shortcut controls", () => {
  for (const name of KEYBOARD_GAME_COMPONENTS) {
    const source = componentSource(name);
    assert.match(source, /onKeyDown/, `${name} lost its keyboard event boundary`);
    assert.match(source, /aria-keyshortcuts/, `${name} lost its accessible shortcut mapping`);
    assert.match(source, /<kbd>/, `${name} lost its visible key hint`);
  }
});

test("keyboard coverage spans every bespoke challenge family and shared relays", () => {
  assert.equal(KEYBOARD_GAME_COMPONENTS.length, 14);
  assert.ok(KEYBOARD_GAME_COMPONENTS.includes("DecisionRelay"));
  assert.ok(KEYBOARD_GAME_COMPONENTS.includes("AiVerificationLab"));
  assert.ok(KEYBOARD_GAME_COMPONENTS.includes("KnowledgeSprint"));
});
