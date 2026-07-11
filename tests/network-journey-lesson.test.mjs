import assert from "node:assert/strict";
import test from "node:test";
import { createPacketJourney, advancePacket } from "../lib/network-journey-lesson.ts";

test("routes a request to a server and a response back to the device", () => {
  const journey = createPacketJourney("weather-request");
  assert.deepEqual(journey.route, ["device", "router", "internet", "server", "internet", "router", "device"]);
  let state = journey;
  while (!state.complete) state = advancePacket(state);
  assert.equal(state.current, "device");
  assert.equal(state.response, "fictional-weather-result");
});

test("advancing past completion is safe and deterministic", () => {
  let state = createPacketJourney("weather-request");
  for (let index = 0; index < 10; index += 1) state = advancePacket(state);
  assert.equal(state.complete, true);
  assert.equal(advancePacket(state), state);
});

test("unknown requests do not create network traffic", () => {
  assert.equal(createPacketJourney("unknown").route.length, 0);
});
