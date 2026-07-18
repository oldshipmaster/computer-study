import assert from "node:assert/strict";
import test from "node:test";
import { COMPUTER_PILOT_MISSIONS } from "../lib/computer-pilot-relay.ts";
import { GAME_MAKER_MISSIONS } from "../lib/game-maker-relay.ts";
import { ISLAND_CHAMPIONSHIP_MISSIONS } from "../lib/island-championship-relay.ts";
import { NETWORK_VOYAGE_MISSIONS } from "../lib/network-voyage-relay.ts";
import { OS_COMMAND_MISSIONS } from "../lib/os-command-relay.ts";
import { SYSTEMS_DEPTH_MISSIONS } from "../lib/systems-depth-relay.ts";

const catalogs = [
  ["game maker", GAME_MAKER_MISSIONS],
  ["computer pilot", COMPUTER_PILOT_MISSIONS],
  ["network voyage", NETWORK_VOYAGE_MISSIONS],
  ["os command", OS_COMMAND_MISSIONS],
  ["systems depth", SYSTEMS_DEPTH_MISSIONS],
  ["championship", ISLAND_CHAMPIONSHIP_MISSIONS],
];

test("every shared relay step supports the visible one two three controls", () => {
  for (const [catalogName, missions] of catalogs) {
    assert.ok(missions.length >= 6, catalogName);
    for (const mission of missions) {
      for (const step of mission.steps) {
        assert.equal(step.options.length, 3, `${catalogName}/${mission.id}`);
        assert.equal(new Set(step.options.map((option) => option.id)).size, 3, `${catalogName}/${mission.id}`);
        assert.ok(step.options.some((option) => option.id === step.answerId), `${catalogName}/${mission.id}`);
      }
    }
  }
});

test("shared relay copy stays scannable for a primary-school learner", () => {
  for (const [catalogName, missions] of catalogs) {
    for (const mission of missions) {
      assert.ok(mission.story.length <= 30, `${catalogName}/${mission.id}/story`);
      for (const step of mission.steps) {
        assert.ok(step.prompt.length <= 40, `${catalogName}/${mission.id}/prompt`);
        assert.ok(step.wrongFeedback.length <= 30, `${catalogName}/${mission.id}/wrongFeedback`);
        assert.ok(step.options.every((option) => option.label.length <= 30), `${catalogName}/${mission.id}/options`);
      }
    }
  }
});
