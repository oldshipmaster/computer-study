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
  "HealthyComputerHabitsLesson",
  "PrivateInformationLesson",
];

test("defers rich programming and hardware labs until a child opens them", () => {
  for (const lesson of deferredLessons) {
    assert.match(source, new RegExp(`const ${lesson} = advancedLesson\\(\\(\\) => import\\("@/components/lessons/${lesson}"\\)`));
    assert.doesNotMatch(source, new RegExp(`import \\{ ${lesson} \\} from`));
  }
});

test("defers the shared advanced coding mission bundle", () => {
  assert.match(source, /const loadCoding = \(\) => import\("@\/components\/lessons\/CodingLessons"\)/);
  for (const lesson of ["EventsHandlersLesson", "VariablesScoreLesson", "FunctionsToolsLesson", "BooleanLogicLesson", "GameDesignLesson"]) {
    assert.match(source, new RegExp(`const ${lesson} = advancedLesson\\(loadCoding`));
  }
  assert.doesNotMatch(source, /import \{ BooleanLogicLesson, EventsHandlersLesson/);
});
