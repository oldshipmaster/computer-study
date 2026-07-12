import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const helperUrl = new URL("../lib/interaction-guard.ts", import.meta.url);
const stagedComponents = [
  "PromptInspector.tsx",
  "../network/AddressInspector.tsx",
  "../network/NetworkClinic.tsx",
  "../hardware/DeviceClinic.tsx",
  "../hardware/PipelineLab.tsx",
  "../hardware/SystemPairingLab.tsx",
  "../programming/ConditionLab.tsx",
  "../programming/DebugLab.tsx",
];

test("recognizes only repeated pointer clicks as duplicate activations", async () => {
  assert.equal(existsSync(helperUrl), true, "interaction guard must exist");
  const { isRepeatedPointerActivation } = await import(helperUrl.href);
  assert.equal(isRepeatedPointerActivation(0), false, "keyboard activation stays available");
  assert.equal(isRepeatedPointerActivation(1), false);
  assert.equal(isRepeatedPointerActivation(2), true);
  assert.equal(isRepeatedPointerActivation(3), true);
});

test("every staged case lab guards its advancing buttons", () => {
  const safetyRoot = new URL("../components/lessons/safety/", import.meta.url);
  for (const relativePath of stagedComponents) {
    const source = readFileSync(new URL(relativePath, safetyRoot), "utf8");
    assert.match(source, /isRepeatedPointerActivation/);
    assert.match(source, /event\.detail/);
  }
});
