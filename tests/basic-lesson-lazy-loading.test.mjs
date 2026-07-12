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
  "PopupFogLesson",
  "PasswordGuardianLesson",
  "LightBitIslandLesson",
];

test("defers rich programming and hardware labs until a child opens them", () => {
  for (const lesson of deferredLessons) {
    assert.match(source, new RegExp(`const ${lesson} = advancedLesson\\(\\(\\) => import\\("@/components/lessons/${lesson}"\\)`));
    assert.doesNotMatch(source, new RegExp(`import \\{ ${lesson} \\} from`));
  }
});

test("defers the flagship keyboard mission without losing its named export", () => {
  assert.match(source, /const KeyboardFlightLesson = advancedLesson\(loadKeyboardFlight, "KeyboardFlightLesson"\)/);
  assert.doesNotMatch(source, /import \{ KeyboardFlightLesson \} from/);
});

test("preloads the most common early lessons when a child points at a course card", () => {
  assert.match(source, /export function preloadLesson\(courseId: string\)/);
  for (const courseId of ["keyboard-flight", "mouse-precision", "bilingual-input", "desktop-adventure", "program-landing"]) {
    assert.match(source, new RegExp(`"${courseId}": load`));
  }
  for (const lesson of ["MousePrecisionLesson", "BilingualInputLesson", "DesktopAdventureLesson", "ProgramLandingLesson"]) {
    assert.match(source, new RegExp(`const ${lesson} = advancedLesson\\(load${lesson.replace("Lesson", "")}`));
    assert.doesNotMatch(source, new RegExp(`import \\{ ${lesson} \\} from`));
  }
  const mapSource = readFileSync(new URL("../components/IslandMap.tsx", import.meta.url), "utf8");
  assert.match(mapSource, /onPointerEnter=\{available \? \(\) => preloadLesson\(course\.id\)/);
  assert.match(mapSource, /onFocus=\{available \? \(\) => preloadLesson\(course\.id\)/);
});

test("defers the shared advanced coding mission bundle", () => {
  assert.match(source, /const loadCoding = \(\) => import\("@\/components\/lessons\/CodingLessons"\)/);
  for (const lesson of ["EventsHandlersLesson", "VariablesScoreLesson", "FunctionsToolsLesson", "BooleanLogicLesson", "GameDesignLesson"]) {
    assert.match(source, new RegExp(`const ${lesson} = advancedLesson\\(loadCoding`));
  }
  assert.doesNotMatch(source, /import \{ BooleanLogicLesson, EventsHandlersLesson/);
});

test("defers the shared future-literacy mission bundle", () => {
  assert.match(source, /const loadFuture = \(\) => import\("@\/components\/lessons\/FutureLessons"\)/);
  for (const lesson of ["EmailMessageLesson", "OnlineCollaborationLesson", "AiHelperLesson", "VerifyAiLesson", "DigitalProjectLesson"]) {
    assert.match(source, new RegExp(`const ${lesson} = advancedLesson\\(loadFuture`));
  }
  assert.doesNotMatch(source, /import \{ AiHelperLesson, DigitalProjectLesson/);
});

test("defers the shared creative-tools mission bundle", () => {
  assert.match(source, /const loadCreative = \(\) => import\("@\/components\/lessons\/CreativeLessons"\)/);
  for (const lesson of ["PixelArtLesson", "SlideStoryLesson", "DocumentDesignLesson", "DataTableLesson", "MediaCopyrightLesson"]) {
    assert.match(source, new RegExp(`const ${lesson} = advancedLesson\\(loadCreative`));
  }
  assert.doesNotMatch(source, /import \{ DataTableLesson, DocumentDesignLesson/);
});
