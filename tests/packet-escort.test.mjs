import test from "node:test";
import assert from "node:assert/strict";
import {
  PACKET_ESCORT_MISSIONS,
  PACK_LAYER_ORDER,
  UNPACK_LAYER_ORDER,
  advancePacketEscortMission,
  buildPacketEscortDeck,
  chooseEscortRoute,
  confirmPacketOrder,
  createPacketEscortState,
  launchPacketTransfer,
  moveReceivedPacket,
  packPacketLayer,
  packetEscortShortcutIndex,
  retransmitPacket,
  unpackPacketLayer,
} from "../lib/packet-escort.ts";

test("maps only visible numeric packet choices", () => {
  assert.equal(packetEscortShortcutIndex("1", 4), 0);
  assert.equal(packetEscortShortcutIndex("4", 4), 3);
  assert.equal(packetEscortShortcutIndex("5", 4), null);
  assert.equal(packetEscortShortcutIndex("0", 5), null);
  assert.equal(packetEscortShortcutIndex("x", 5), null);
});

function packAll(state, mission) {
  for (const layer of PACK_LAYER_ORDER) state = packPacketLayer(state, mission, layer, 1);
  return state;
}

function cheapestRoute(mission) {
  return [...mission.routes].sort((left, right) => left.cost - right.cost || left.id.localeCompare(right.id))[0];
}

test("defines six safe packet missions with complete route and loss evidence", () => {
  assert.equal(PACKET_ESCORT_MISSIONS.length, 6);
  assert.equal(new Set(PACKET_ESCORT_MISSIONS.map((mission) => mission.id)).size, 6);
  for (const mission of PACKET_ESCORT_MISSIONS) {
    assert.ok(mission.fragments.length >= 3 && mission.fragments.length <= 5);
    assert.equal(mission.routes.length, 3);
    assert.equal(new Set(mission.routes.map((route) => route.cost)).size, 3);
    assert.ok(mission.lostSequence >= 0 && mission.lostSequence < mission.fragments.length);
    const expectedArrival = mission.fragments.map((_, index) => index).filter((index) => index !== mission.lostSequence).sort();
    assert.deepEqual([...mission.arrivalOrder].sort((a, b) => a - b), expectedArrival);
    assert.equal(mission.message, mission.fragments.join(""));
  }
});

test("packs inner to outer and keeps evidence after a wrong layer", () => {
  const mission = PACKET_ESCORT_MISSIONS[0];
  let state = createPacketEscortState(6);
  const wrong = packPacketLayer(state, mission, "link", 1);
  assert.deepEqual(wrong.packedLayers, []);
  assert.match(wrong.feedback, /应用层/);
  state = packAll(state, mission);
  assert.deepEqual(state.packedLayers, PACK_LAYER_ORDER);
  assert.equal(state.phase, "route");
});

test("accepts only the lowest total route cost", () => {
  const mission = PACKET_ESCORT_MISSIONS[1];
  let state = packAll(createPacketEscortState(6), mission);
  const expensive = [...mission.routes].sort((a, b) => b.cost - a.cost)[0];
  state = chooseEscortRoute(state, mission, expensive.id, 1);
  assert.equal(state.phase, "route");
  assert.match(state.feedback, /代价/);
  const cheapest = cheapestRoute(mission);
  state = chooseEscortRoute(state, mission, cheapest.id, 1);
  assert.equal(state.phase, "send");
  assert.equal(state.selectedRouteId, cheapest.id);
});

test("launches numbered packets and preserves the missing-sequence evidence", () => {
  const mission = PACKET_ESCORT_MISSIONS[2];
  let state = packAll(createPacketEscortState(6), mission);
  state = chooseEscortRoute(state, mission, cheapestRoute(mission).id, 1);
  state = launchPacketTransfer(state, mission, 1);
  assert.equal(state.phase, "retransmit");
  assert.deepEqual(state.receivedOrder, mission.arrivalOrder);
  assert.ok(!state.receivedOrder.includes(mission.lostSequence));
  assert.match(state.feedback, new RegExp(String(mission.lostSequence + 1)));
});

test("retransmits only the missing packet and rejects duplicate activation", () => {
  const mission = PACKET_ESCORT_MISSIONS[3];
  let state = packAll(createPacketEscortState(6), mission);
  state = chooseEscortRoute(state, mission, cheapestRoute(mission).id, 1);
  state = launchPacketTransfer(state, mission, 1);
  const wrongSequence = (mission.lostSequence + 1) % mission.fragments.length;
  state = retransmitPacket(state, mission, wrongSequence, 1);
  assert.equal(state.phase, "retransmit");
  assert.ok(!state.receivedOrder.includes(wrongSequence) || mission.arrivalOrder.includes(wrongSequence));
  const ignored = retransmitPacket(state, mission, mission.lostSequence, 2);
  assert.equal(ignored, state);
  state = retransmitPacket(state, mission, mission.lostSequence, 1);
  assert.equal(state.phase, "order");
  assert.ok(state.receivedOrder.includes(mission.lostSequence));
});

test("reorders received packets without mutating prior state and confirms assembly", () => {
  const mission = PACKET_ESCORT_MISSIONS[4];
  let state = packAll(createPacketEscortState(6), mission);
  state = chooseEscortRoute(state, mission, cheapestRoute(mission).id, 1);
  state = launchPacketTransfer(state, mission, 1);
  state = retransmitPacket(state, mission, mission.lostSequence, 1);
  const before = [...state.receivedOrder];
  const wrong = confirmPacketOrder(state, mission, 1);
  assert.equal(wrong.phase, "order");
  assert.deepEqual(state.receivedOrder, before);
  const sorted = [...state.receivedOrder].sort((a, b) => a - b);
  for (let target = 0; target < sorted.length; target += 1) {
    const from = state.receivedOrder.indexOf(sorted[target]);
    state = moveReceivedPacket(state, from, target);
  }
  assert.deepEqual(state.receivedOrder, sorted);
  state = confirmPacketOrder(state, mission, 1);
  assert.equal(state.phase, "unpack");
  assert.equal(state.assembledMessage, mission.message);
});

test("unpacks outer to inner and advances only after message recovery", () => {
  const mission = PACKET_ESCORT_MISSIONS[0];
  let state = packAll(createPacketEscortState(6), mission);
  state = chooseEscortRoute(state, mission, cheapestRoute(mission).id, 1);
  state = launchPacketTransfer(state, mission, 1);
  state = retransmitPacket(state, mission, mission.lostSequence, 1);
  const sorted = [...state.receivedOrder].sort((a, b) => a - b);
  for (let target = 0; target < sorted.length; target += 1) state = moveReceivedPacket(state, state.receivedOrder.indexOf(sorted[target]), target);
  state = confirmPacketOrder(state, mission, 1);
  state = unpackPacketLayer(state, mission, "application", 1);
  assert.deepEqual(state.unpackedLayers, []);
  for (const layer of UNPACK_LAYER_ORDER) state = unpackPacketLayer(state, mission, layer, 1);
  assert.equal(state.phase, "solved");
  assert.equal(state.solved, 1);
  state = advancePacketEscortMission(state, 1);
  assert.equal(state.missionIndex, 1);
  assert.equal(state.phase, "pack");
});

test("rotates replay missions and ignores invalid state actions", () => {
  assert.deepEqual(buildPacketEscortDeck(0).map((mission) => mission.id), PACKET_ESCORT_MISSIONS.map((mission) => mission.id));
  assert.deepEqual(buildPacketEscortDeck(7).map((mission) => mission.id), buildPacketEscortDeck(1).map((mission) => mission.id));
  assert.equal(new Set(buildPacketEscortDeck(-1).map((mission) => mission.id)).size, 6);
  const state = createPacketEscortState(6);
  assert.equal(launchPacketTransfer(state, PACKET_ESCORT_MISSIONS[0], 1), state);
  assert.equal(moveReceivedPacket(state, 0, 1), state);
  assert.equal(advancePacketEscortMission(state, 1), state);
});
