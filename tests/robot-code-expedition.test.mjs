import test from "node:test";
import assert from "node:assert/strict";
import {
  ROBOT_CODE_MISSIONS,
  addRobotCommand,
  advanceRobotMission,
  advanceRobotTrace,
  buildRobotMissionDeck,
  createRobotCodeState,
  moveRobotCommand,
  prepareRobotRun,
  removeRobotCommand,
  runRobotProgram,
} from "../lib/robot-code-expedition.ts";

const solutions = [
  ["forward", "forward", "forward"],
  ["forward", "forward", "turnRight", "forward", "forward"],
  ["repeatForward2", "turnRight", "repeatForward2"],
  ["ifBlockedTurnRight", "repeatForward2"],
  ["forward", "ifBlockedTurnRight", "repeatForward2"],
  ["forward", "ifBlockedTurnRight", "repeatForward2", "turnLeft", "repeatForward2", "turnRight", "forward"],
];

test("defines six bounded five-by-five missions with progressive commands", () => {
  assert.equal(ROBOT_CODE_MISSIONS.length, 6);
  assert.equal(new Set(ROBOT_CODE_MISSIONS.map((mission) => mission.id)).size, 6);
  for (const mission of ROBOT_CODE_MISSIONS) {
    assert.ok(mission.maxCommands >= 2 && mission.maxCommands <= 7);
    for (const point of [mission.start, mission.goal, ...mission.energy, ...mission.obstacles]) {
      assert.ok(point.row >= 0 && point.row < 5 && point.col >= 0 && point.col < 5);
    }
  }
  assert.deepEqual(ROBOT_CODE_MISSIONS[0].allowedCommands, ["forward"]);
  assert.ok(ROBOT_CODE_MISSIONS[2].allowedCommands.includes("repeatForward2"));
  assert.ok(ROBOT_CODE_MISSIONS[3].allowedCommands.includes("ifBlockedTurnRight"));
});

test("solves every mission with its intended bounded program", () => {
  ROBOT_CODE_MISSIONS.forEach((mission, index) => {
    const result = runRobotProgram(mission, solutions[index]);
    assert.equal(result.status, "success", `${mission.id}: ${result.feedback}`);
    assert.deepEqual(result.finalPosition, mission.goal);
    assert.equal(result.collectedEnergy.length, mission.energy.length);
  });
});

test("expands repeat into two visible forward steps", () => {
  const result = runRobotProgram(ROBOT_CODE_MISSIONS[2], solutions[2]);
  assert.equal(result.trace.length, 5);
  assert.deepEqual(result.trace.map((step) => step.command), ["forward", "forward", "turnRight", "forward", "forward"]);
  assert.deepEqual(result.trace.map((step) => step.sourceIndex), [0, 0, 1, 2, 2]);
});

test("evaluates the obstacle condition at runtime", () => {
  const mission = ROBOT_CODE_MISSIONS[3];
  const success = runRobotProgram(mission, solutions[3]);
  assert.equal(success.trace[0].command, "turnRight");
  assert.match(success.trace[0].event, /挡住/);
  const noObstacle = runRobotProgram({ ...mission, obstacles: [] }, solutions[3]);
  assert.equal(noObstacle.trace[0].command, "conditionNoop");
  assert.match(noObstacle.trace[0].event, /不用转向/);
});

test("reports collision and incomplete evidence without mutating the program", () => {
  const program = ["forward"];
  const snapshot = [...program];
  const collision = runRobotProgram(ROBOT_CODE_MISSIONS[3], program);
  assert.equal(collision.status, "collision");
  assert.match(collision.feedback, /第 1 条指令/);
  const incomplete = runRobotProgram(ROBOT_CODE_MISSIONS[0], ["forward"]);
  assert.equal(incomplete.status, "incomplete");
  assert.match(incomplete.feedback, /终点|能量/);
  assert.deepEqual(program, snapshot);
});

test("edits a bounded queue and ignores invalid or double activations", () => {
  const mission = ROBOT_CODE_MISSIONS[1];
  let state = createRobotCodeState(6);
  state = addRobotCommand(state, mission, "forward", 1);
  state = addRobotCommand(state, mission, "turnRight", 2);
  state = addRobotCommand(state, mission, "not-a-command", 1);
  assert.deepEqual(state.queue, ["forward"]);
  state = addRobotCommand(state, mission, "turnRight", 1);
  state = moveRobotCommand(state, 1, 0);
  assert.deepEqual(state.queue, ["turnRight", "forward"]);
  state = removeRobotCommand(state, 0);
  assert.deepEqual(state.queue, ["forward"]);
  for (let index = 0; index < 10; index += 1) state = addRobotCommand(state, mission, "forward", 1);
  assert.equal(state.queue.length, mission.maxCommands);
});

test("reveals one trace step at a time, preserves a failed queue, and advances after success", () => {
  const mission = ROBOT_CODE_MISSIONS[0];
  let failed = createRobotCodeState(6);
  failed = addRobotCommand(failed, mission, "forward", 1);
  failed = prepareRobotRun(failed, mission, 1);
  assert.equal(failed.phase, "tracing");
  failed = advanceRobotTrace(failed, 1);
  assert.equal(failed.phase, "failed");
  assert.deepEqual(failed.queue, ["forward"]);

  let solved = createRobotCodeState(6);
  for (const command of solutions[0]) solved = addRobotCommand(solved, mission, command, 1);
  solved = prepareRobotRun(solved, mission, 1);
  while (solved.phase === "tracing") solved = advanceRobotTrace(solved, 1);
  assert.equal(solved.phase, "solved");
  assert.equal(solved.solved, 1);
  solved = advanceRobotMission(solved, 1);
  assert.equal(solved.missionIndex, 1);
  assert.equal(solved.phase, "building");
  assert.deepEqual(solved.queue, []);
});

test("rotates replay missions without duplicates", () => {
  assert.deepEqual(buildRobotMissionDeck(0).map((mission) => mission.id), ROBOT_CODE_MISSIONS.map((mission) => mission.id));
  assert.deepEqual(buildRobotMissionDeck(7).map((mission) => mission.id), buildRobotMissionDeck(1).map((mission) => mission.id));
  assert.equal(new Set(buildRobotMissionDeck(-1).map((mission) => mission.id)).size, 6);
});
