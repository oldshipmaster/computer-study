import assert from "node:assert/strict";
import test from "node:test";
import { COURSES } from "../lib/course-data.ts";
import {
  buildAdventureMissions,
  getAdventureEnergy,
  getCourseCompletionReward,
  getExplorerRank,
  getRankProgress,
} from "../lib/adventure-missions.ts";

test("gives a new explorer one clear frontier mission", () => {
  const missions = buildAdventureMissions({
    courses: COURSES,
    completedCourseIds: [],
    coursePlayCounts: {},
    confidenceByCourse: {},
    rotation: 0,
  });

  assert.equal(missions.length, 1);
  assert.equal(missions[0].kind, "frontier");
  assert.equal(missions[0].course.id, "keyboard-flight");
  assert.match(missions[0].rewardLabel, /10/);
});

test("builds three distinct missions and reserves a help course for repair", () => {
  const input = {
    courses: COURSES,
    completedCourseIds: ["keyboard-flight", "file-home", "instruction-order"],
    coursePlayCounts: { "keyboard-flight": 2, "file-home": 1, "instruction-order": 1 },
    confidenceByCourse: { "file-home": "help" },
    rotation: 0,
  };
  const missions = buildAdventureMissions(input);

  assert.deepEqual(missions.map((mission) => mission.kind), ["frontier", "replay", "repair"]);
  assert.equal(new Set(missions.map((mission) => mission.course.id)).size, 3);
  assert.equal(missions[2].course.id, "file-home");
  assert.deepEqual(buildAdventureMissions(input), missions);
});

test("prefers help over practice and rotates low-frequency replay choices", () => {
  const base = {
    courses: COURSES,
    completedCourseIds: ["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure"],
    coursePlayCounts: {
      "keyboard-flight": 1,
      "mouse-precision": 1,
      "bilingual-input": 1,
      "desktop-adventure": 1,
    },
    confidenceByCourse: {
      "keyboard-flight": "practice",
      "mouse-precision": "help",
    },
  };
  const first = buildAdventureMissions({ ...base, rotation: 0 });
  const second = buildAdventureMissions({ ...base, rotation: 1 });

  assert.equal(first.find((mission) => mission.kind === "repair")?.course.id, "mouse-precision");
  assert.notEqual(
    first.find((mission) => mission.kind === "replay")?.course.id,
    second.find((mission) => mission.kind === "replay")?.course.id,
  );
});

test("keeps three distinct replay missions after all courses are complete", () => {
  const completedCourseIds = COURSES.map((course) => course.id);
  const missions = buildAdventureMissions({
    courses: COURSES,
    completedCourseIds,
    coursePlayCounts: Object.fromEntries(completedCourseIds.map((id) => [id, 1])),
    confidenceByCourse: {},
    rotation: 7,
  });

  assert.equal(missions.length, 3);
  assert.equal(new Set(missions.map((mission) => mission.course.id)).size, 3);
  assert.equal(missions[0].kind, "expedition");
});

test("awards ten energy once and three energy for two capped replays", () => {
  assert.equal(getAdventureEnergy({ a: 1, b: 2, c: 3 }), 39);
  assert.equal(getAdventureEnergy({ a: 4, b: -1, c: 1.5 }), 16);
  assert.equal(getAdventureEnergy({}), 0);
});

test("explains the immediate reward for first completion, replays, and free practice", () => {
  assert.deepEqual(getCourseCompletionReward(0), { points: 10, playNumber: 1, rewarded: true });
  assert.deepEqual(getCourseCompletionReward(1), { points: 3, playNumber: 2, rewarded: true });
  assert.deepEqual(getCourseCompletionReward(2), { points: 3, playNumber: 3, rewarded: true });
  assert.deepEqual(getCourseCompletionReward(3), { points: 0, playNumber: 4, rewarded: false });
  assert.deepEqual(getCourseCompletionReward(99), { points: 0, playNumber: 100, rewarded: false });
});

test("switches explorer equipment exactly at every energy threshold", () => {
  assert.equal(getExplorerRank(0).name, "启航护目镜");
  assert.equal(getExplorerRank(59).name, "启航护目镜");
  assert.equal(getExplorerRank(60).name, "星图天线");
  assert.equal(getExplorerRank(180).name, "数据披风");
  assert.equal(getExplorerRank(360).name, "量子背包");
  assert.equal(getExplorerRank(650).name, "群岛探险冠");

  assert.deepEqual(getRankProgress(59), {
    value: 59,
    max: 60,
    nextRank: getExplorerRank(60),
    remaining: 1,
  });
  assert.deepEqual(getRankProgress(650), {
    value: 650,
    max: 650,
    nextRank: null,
    remaining: 0,
  });
});
