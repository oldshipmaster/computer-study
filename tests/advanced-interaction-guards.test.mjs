import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const statefulControls = [
  "components/FoundationPractice.tsx",
  "components/FoundationCapstone.tsx",
  "components/lessons/advanced/algorithms/SearchLab.tsx",
  "components/lessons/advanced/algorithms/SortLab.tsx",
  "components/lessons/advanced/data-structures/LinkedTreasureLab.tsx",
  "components/lessons/advanced/data-structures/TreeLibraryLab.tsx",
  "components/lessons/advanced/data-structures/GraphRoutesLab.tsx",
  "components/lessons/advanced/os/ProcessLab.tsx",
  "components/lessons/advanced/os/SchedulingLab.tsx",
  "components/lessons/advanced/os/DeviceCoordinationLab.tsx",
  "components/lessons/advanced/network/LayerEnvelopeLab.tsx",
  "components/lessons/advanced/systems/CacheStationLab.tsx",
];

test("advanced stateful controls ignore the second click in a double activation", async () => {
  for (const path of statefulControls) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
    assert.match(source, /isRepeatedPointerActivation/, path);
    assert.match(source, /event\.detail/, path);
  }
});
