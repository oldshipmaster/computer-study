import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../components/lessons/lesson-registry.ts", import.meta.url), "utf8");
const deferredLessons = [
  "InstructionOrderLesson",
  "GridCityNavigationLesson",
  "RepeatPowerLesson",
  "RainyConditionLesson",
  "BugCatcherLesson",
  "InputProcessOutputLesson",
  "CpuMemoryStorageLesson",
  "BitsAndDataLesson",
  "HardwareSoftwareLesson",
  "TroubleshootMachineLesson",
  "FileHomeLesson",
  "NameYourWorkLesson",
  "MoveAndCopyLesson",
  "FileTypesLesson",
  "LearningBackpackLesson",
  "NetworkJourneyLesson",
  "WebAddressLesson",
  "SearchAndLinksLesson",
  "DownloadsCloudLesson",
  "NetworkTroubleshootingLesson",
];

test("defers rich programming and hardware labs until a child opens them", () => {
  for (const lesson of deferredLessons) {
    assert.match(source, new RegExp(`const ${lesson} = advancedLesson\\(\\(\\) => import\\("@/components/lessons/${lesson}"\\)`));
    assert.doesNotMatch(source, new RegExp(`import \\{ ${lesson} \\} from`));
  }
});
