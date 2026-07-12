# Advanced Computer Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Bit Island Adventure from 9 islands and 45 lessons to 13 islands and 65 fully playable lessons covering data structures and algorithms, computer architecture, computer networks, and operating systems.

**Architecture:** Keep domain behavior in deterministic TypeScript modules under `lib/advanced-foundations/`, and render it through four domain-specific React lesson families under `components/lessons/advanced/`. Extend the existing catalog, registry, guidance, dictionary, review, progress, offline, and GitHub Pages pipelines without changing any existing course ID or stored progress shape.

**Tech Stack:** TypeScript 5.9, React 19, Next/vinext, Vite, Node test runner, CSS, GitHub Actions, GitHub Pages.

## Global Constraints

- Learner: seven-year-old elementary school second grader.
- Every lesson lasts 8–10 minutes and uses the existing six-stage lesson shell.
- Every lesson has exactly three objectives and one parent discussion prompt.
- No real network, file, process, account, or operating-system access.
- No outbound network APIs in child product code.
- Existing 45 course IDs, progress, confidence choices, badges, and backups remain valid.
- Every interaction works with mouse, touch, and keyboard; drag is never the only path.
- Touch targets are at least 44px; core mobile lesson copy is at least 16px.
- 390px and 320px viewports have no horizontal overflow.
- Production code follows test-first red-green-refactor cycles.

---

### Task 1: Stable advanced-course identity contract

**Files:**
- Create: `lib/advanced-foundations/course-ids.ts`
- Create: `tests/advanced-course-ids.test.mjs`

**Interfaces:**
- Consumes: existing `COURSES` and `ISLANDS` only to prove IDs do not collide.
- Produces: `ADVANCED_ISLAND_COURSE_IDS`, `ADVANCED_COURSE_IDS`, and `ADVANCED_ISLAND_IDS` for Tasks 3–7.

- [ ] **Step 1: Write the failing identity tests**

```js
test("defines four islands with five unique advanced courses each", () => {
  assert.deepEqual(Object.values(ADVANCED_ISLAND_COURSE_IDS).map((ids) => ids.length), [5, 5, 5, 5]);
  assert.equal(ADVANCED_COURSE_IDS.length, 20);
  assert.equal(new Set(ADVANCED_COURSE_IDS).size, 20);
  assert.ok(ADVANCED_COURSE_IDS.every((id) => !COURSES.some((course) => course.id === id)));
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --experimental-strip-types --test tests/advanced-course-ids.test.mjs`
Expected: module-not-found failure.

- [ ] **Step 3: Add the four islands and 20 stable IDs**

Use these exact IDs:

```ts
export const ADVANCED_ISLAND_COURSE_IDS = {
  "data-structures": ["array-lockers", "linked-treasure", "stack-queue-dock", "tree-library", "graph-routes"],
  "algorithm-arena": ["linear-search", "binary-search", "bubble-sort", "task-decomposition", "algorithm-efficiency"],
  "os-control-tower": ["program-process", "cpu-scheduling", "memory-allocation", "file-system-tree", "device-coordination"],
  "systems-network-depths": ["instruction-cycle", "cache-station", "network-layers", "routing-maze", "reliable-transfer"],
} as const;

export const ADVANCED_ISLAND_IDS = Object.keys(ADVANCED_ISLAND_COURSE_IDS);
export const ADVANCED_COURSE_IDS = Object.values(ADVANCED_ISLAND_COURSE_IDS).flat();
```

These constants are not added to `COURSES` yet, so every intermediate commit remains green while Tasks 2–6 build and register the lesson implementations.

- [ ] **Step 4: Run GREEN checks**

Run: `node --experimental-strip-types --test tests/advanced-course-ids.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/advanced-foundations/course-ids.ts tests/advanced-course-ids.test.mjs
git commit -m "feat: define advanced curriculum identities"
```

### Task 2: Data-structure state models

**Files:**
- Create: `lib/advanced-foundations/data-structures.ts`
- Create: `tests/data-structures-foundations.test.mjs`

**Interfaces:**
- Produces: `readArraySlot`, `updateArraySlot`, `walkLinkedNodes`, `insertLinkedNode`, `removeLinkedNode`, `applyStackAction`, `applyQueueAction`, `findTreePath`, `findGraphPath`.

- [ ] **Step 1: Write failing model tests**

```js
test("array reads and updates only valid indexes", () => {
  assert.equal(readArraySlot(["贝壳", "星星"], 1), "星星");
  assert.equal(readArraySlot(["贝壳"], 4), null);
  assert.deepEqual(updateArraySlot(["贝壳"], 0, "地图"), ["地图"]);
});

test("linked traversal follows next pointers without looping forever", () => {
  const nodes = { a: { value: "A", next: "b" }, b: { value: "B", next: null } };
  assert.deepEqual(walkLinkedNodes(nodes, "a"), ["a", "b"]);
});

test("stack and queue use opposite removal rules", () => {
  assert.equal(applyStackAction(["A", "B"], { type: "pop" }).removed, "B");
  assert.equal(applyQueueAction(["A", "B"], { type: "dequeue" }).removed, "A");
});
```

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/data-structures-foundations.test.mjs`
Expected: module-not-found failure.

- [ ] **Step 3: Implement immutable deterministic models**

```ts
export function readArraySlot<T>(items: readonly T[], index: number): T | null {
  return Number.isInteger(index) && index >= 0 && index < items.length ? items[index] : null;
}

export function applyStackAction<T>(items: readonly T[], action: { type: "push"; value: T } | { type: "pop" }) {
  if (action.type === "push") return { items: [...items, action.value], removed: null };
  return { items: items.slice(0, -1), removed: items.at(-1) ?? null };
}
```

`updateArraySlot` copies the array before replacing one valid slot. `walkLinkedNodes` records visited IDs and stops on a missing or repeated ID. `insertLinkedNode` and `removeLinkedNode` return copied node maps. `applyQueueAction` appends on enqueue and removes index zero on dequeue. `findTreePath` and `findGraphPath` use breadth-first search with a visited set and return an empty path when unreachable.

- [ ] **Step 4: Add boundary and invariance assertions**

Cover empty stack/queue, missing linked node, linked cycle, missing tree target, unreachable graph target, and ensure original collections remain unchanged.

- [ ] **Step 5: Run GREEN and commit**

Run: `node --experimental-strip-types --test tests/data-structures-foundations.test.mjs`
Expected: PASS.

```bash
git add lib/advanced-foundations/data-structures.ts tests/data-structures-foundations.test.mjs
git commit -m "feat: add child-safe data structure models"
```

### Task 3: Five playable data-structure lessons

**Files:**
- Create: `components/lessons/advanced/DataStructureLessons.tsx`
- Create: `components/lessons/advanced/data-structures/ArrayLockerLab.tsx`
- Create: `components/lessons/advanced/data-structures/LinkedTreasureLab.tsx`
- Create: `components/lessons/advanced/data-structures/StackQueueLab.tsx`
- Create: `components/lessons/advanced/data-structures/TreeLibraryLab.tsx`
- Create: `components/lessons/advanced/data-structures/GraphRoutesLab.tsx`
- Modify: `components/lessons/lesson-registry.ts`
- Create: `tests/data-structure-lessons.test.mjs`

**Interfaces:**
- Consumes: Task 2 model functions and existing `LessonProps`, `LessonChrome`, `isRepeatedPointerActivation`.
- Produces: five registered lesson definitions with IDs from Task 1.

- [ ] **Step 1: Write failing registry and source tests**

```js
for (const id of ["array-lockers", "linked-treasure", "stack-queue-dock", "tree-library", "graph-routes"]) {
  test(`${id} has a complete six-stage lesson`, () => {
    const definition = getLessonDefinition(id);
    assert.ok(definition);
    assert.equal(definition.stageCount, 6);
  });
}
```

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/data-structure-lessons.test.mjs`
Expected: FAIL because the definitions do not exist.

- [ ] **Step 3: Implement five six-stage lesson wrappers**

Each wrapper clamps `initialStage` to 0–5, focuses its stage heading, calls `onStageChange`, awards exactly once, and renders its dedicated lab at stage 5. Example contract:

```tsx
<LessonChrome courseName="数组储物柜" currentStage={stage} heading={STAGES[stage]}
  headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}>
  {stage < 5 ? <ConceptDemo onContinue={() => setStage(stage + 1)} /> : <ArrayLockerLab onComplete={finish} />}
</LessonChrome>
```

- [ ] **Step 4: Implement dedicated challenge labs**

Each lab exposes visible progress, `role="status"` feedback, 44px buttons, and keyboard-operable actions. Wrong actions preserve solved steps; repeated pointer activation cannot complete twice.

- [ ] **Step 5: Register all five lessons and verify GREEN**

Run: `node --experimental-strip-types --test tests/data-structures-foundations.test.mjs tests/data-structure-lessons.test.mjs tests/repeated-activation.test.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/lessons/advanced components/lessons/lesson-registry.ts tests/data-structure-lessons.test.mjs
git commit -m "feat: add data structures island lessons"
```

### Task 4: Algorithm models and five playable lessons

**Files:**
- Create: `lib/advanced-foundations/algorithms.ts`
- Create: `tests/algorithm-foundations.test.mjs`
- Create: `components/lessons/advanced/AlgorithmLessons.tsx`
- Create: `components/lessons/advanced/algorithms/SearchLab.tsx`
- Create: `components/lessons/advanced/algorithms/SortLab.tsx`
- Create: `components/lessons/advanced/algorithms/TaskDecompositionLab.tsx`
- Create: `components/lessons/advanced/algorithms/EfficiencyRaceLab.tsx`
- Modify: `components/lessons/lesson-registry.ts`
- Create: `tests/algorithm-lessons.test.mjs`

**Interfaces:**
- Produces: `linearSearchTrace`, `binarySearchTrace`, `bubbleSortPass`, `validateTaskOrder`, `compareSearchCosts` and five registered lessons.

- [ ] **Step 1: Write failing algorithm tests**

```js
assert.deepEqual(linearSearchTrace([2, 4, 6], 6).checkedIndexes, [0, 1, 2]);
assert.deepEqual(binarySearchTrace([1, 3, 5, 7, 9], 7).checkedIndexes, [2, 3]);
assert.deepEqual(bubbleSortPass([3, 1, 2]).values, [1, 2, 3]);
assert.ok(compareSearchCosts(64).binary < compareSearchCosts(64).linear);
```

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/algorithm-foundations.test.mjs`
Expected: module-not-found failure.

- [ ] **Step 3: Implement trace-first pure functions**

Return every comparison, boundary change, swap, and final result so the UI can explain the algorithm rather than only show an answer. Reject binary-search input that is not sorted.

- [ ] **Step 4: Implement the five lesson wrappers and labs**

Linear and binary search reuse `SearchLab` with distinct strategies; sorting shows one comparison at a time; decomposition uses a dependency graph; efficiency compares operation counts at 8, 16, 32, and 64 items.

- [ ] **Step 5: Register, run GREEN, and commit**

Run: `node --experimental-strip-types --test tests/algorithm-foundations.test.mjs tests/algorithm-lessons.test.mjs tests/repeated-activation.test.mjs`
Expected: PASS.

```bash
git add lib/advanced-foundations/algorithms.ts components/lessons/advanced tests/algorithm-foundations.test.mjs tests/algorithm-lessons.test.mjs components/lessons/lesson-registry.ts
git commit -m "feat: add algorithm arena lessons"
```

### Task 5: Operating-system models and five playable lessons

**Files:**
- Create: `lib/advanced-foundations/operating-system.ts`
- Create: `tests/operating-system-foundations.test.mjs`
- Create: `components/lessons/advanced/OperatingSystemLessons.tsx`
- Create: `components/lessons/advanced/os/ProcessLab.tsx`
- Create: `components/lessons/advanced/os/SchedulingLab.tsx`
- Create: `components/lessons/advanced/os/MemoryRoomsLab.tsx`
- Create: `components/lessons/advanced/os/FileSystemLab.tsx`
- Create: `components/lessons/advanced/os/DeviceCoordinationLab.tsx`
- Modify: `components/lessons/lesson-registry.ts`
- Create: `tests/operating-system-lessons.test.mjs`

**Interfaces:**
- Produces: `transitionProcess`, `runRoundRobinTick`, `allocateMemory`, `releaseMemory`, `resolveVirtualPath`, `serviceDeviceRequest` and five registered lessons.

- [ ] **Step 1: Write failing state-machine tests**

```js
assert.equal(transitionProcess("ready", "run"), "running");
assert.equal(transitionProcess("running", "wait"), "waiting");
assert.deepEqual(runRoundRobinTick([{ id: "A", remaining: 2 }, { id: "B", remaining: 1 }]).runningId, "A");
assert.equal(allocateMemory({ capacity: 8, allocations: {} }, "paint", 9).ok, false);
```

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/operating-system-foundations.test.mjs`
Expected: module-not-found failure.

- [ ] **Step 3: Implement deterministic state transitions**

Illegal process transitions return the unchanged state plus a child-readable reason. Scheduling uses a fixed queue and one-unit time slice. Memory allocation never exceeds capacity and release restores free space.

- [ ] **Step 4: Implement five dedicated lesson labs**

Every lab uses fictional processes and devices. The file-system lab reuses concepts but not state from real files; device coordination never invokes browser device APIs.

- [ ] **Step 5: Register, run GREEN, and commit**

Run: `node --experimental-strip-types --test tests/operating-system-foundations.test.mjs tests/operating-system-lessons.test.mjs tests/lesson-network-safety.test.mjs`
Expected: PASS.

```bash
git add lib/advanced-foundations/operating-system.ts components/lessons/advanced tests/operating-system-foundations.test.mjs tests/operating-system-lessons.test.mjs components/lessons/lesson-registry.ts
git commit -m "feat: add operating system control tower"
```

### Task 6: Computer-architecture and network models with five lessons

**Files:**
- Create: `lib/advanced-foundations/systems-network.ts`
- Create: `tests/systems-network-foundations.test.mjs`
- Create: `components/lessons/advanced/SystemsNetworkLessons.tsx`
- Create: `components/lessons/advanced/systems/InstructionCycleLab.tsx`
- Create: `components/lessons/advanced/systems/CacheStationLab.tsx`
- Create: `components/lessons/advanced/network/LayerEnvelopeLab.tsx`
- Create: `components/lessons/advanced/network/RoutingMazeLab.tsx`
- Create: `components/lessons/advanced/network/ReliableTransferLab.tsx`
- Modify: `components/lessons/lesson-registry.ts`
- Create: `tests/systems-network-lessons.test.mjs`

**Interfaces:**
- Produces: `advanceInstructionCycle`, `accessMemoryHierarchy`, `encapsulateMessage`, `decapsulateMessage`, `shortestRoute`, `advanceReliableTransfer` and five registered lessons.

- [ ] **Step 1: Write failing systems tests**

```js
assert.deepEqual([0, 1, 2, 3].map((n) => advanceInstructionCycle(n).phase), ["fetch", "decode", "execute", "writeback"]);
assert.equal(accessMemoryHierarchy(["map"], ["map"], "map").level, "cache");
assert.deepEqual(decapsulateMessage(encapsulateMessage("HELLO")).message, "HELLO");
assert.deepEqual(shortestRoute(GRAPH, "device", "server").path, ["device", "router", "server"]);
```

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/systems-network-foundations.test.mjs`
Expected: module-not-found failure.

- [ ] **Step 3: Implement deterministic models**

Use weighted Dijkstra routing with stable alphabetical tie-breaking. Reliable transfer tracks numbered chunks, acknowledgements, one deterministic loss scenario, timeout, retransmission, duplicate suppression, and ordered assembly.

- [ ] **Step 4: Implement five dedicated lesson labs**

The instruction lab exposes all four phases; cache shows wait units; network layers visibly add/remove headers; routing handles a broken edge; reliable transfer makes the learner identify and resend the missing numbered chunk.

- [ ] **Step 5: Register, run GREEN, and commit**

Run: `node --experimental-strip-types --test tests/systems-network-foundations.test.mjs tests/systems-network-lessons.test.mjs tests/lesson-network-safety.test.mjs`
Expected: PASS.

```bash
git add lib/advanced-foundations/systems-network.ts components/lessons/advanced tests/systems-network-foundations.test.mjs tests/systems-network-lessons.test.mjs components/lessons/lesson-registry.ts
git commit -m "feat: add systems and network depths lessons"
```

### Task 7: Integrate the 65-course catalog, guidance, dictionary, and reviews

**Files:**
- Modify: `lib/course-data.ts`
- Modify: `lib/curriculum-guide.ts`
- Modify: `lib/computer-dictionary.ts`
- Modify: `lib/review-challenge.ts`
- Modify: `tests/curriculum-guide.test.mjs`
- Modify: `tests/computer-dictionary.test.mjs`
- Modify: `tests/review-challenge.test.mjs`
- Modify: `tests/knowledge-atlas.test.mjs`
- Modify: `tests/course-data.test.mjs`
- Modify: `tests/curriculum-integrity.test.mjs`
- Modify: `tests/progress.test.mjs`
- Modify: `tests/progress-backup.test.mjs`

**Interfaces:**
- Consumes: all 20 registered lessons plus `ADVANCED_ISLAND_COURSE_IDS` from Task 1.
- Produces: 13 islands, 65 playable catalog entries, a 65-course five-round route, 65 guides, 65 dictionary entries, 26 scenario questions, and knowledge-atlas objectives for every course.

- [ ] **Step 1: Write failing alignment tests**

```js
assert.equal(Object.keys(CURRICULUM_GUIDE).length, 65);
assert.equal(DICTIONARY_ENTRIES.length, 65);
assert.equal(new Set(DICTIONARY_ENTRIES.map((entry) => entry.courseId)).size, 65);
assert.equal(SCENARIO_QUESTIONS.length, 26);
for (const island of ISLANDS) assert.equal(SCENARIO_QUESTIONS.filter((q) => q.islandId === island.id).length, 2);
assert.equal(ISLANDS.length, 13);
assert.equal(COURSES.length, 65);
assert.equal(COURSES.filter((course) => course.playable).length, 65);
```

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/course-data.test.mjs tests/curriculum-integrity.test.mjs tests/curriculum-guide.test.mjs tests/computer-dictionary.test.mjs tests/review-challenge.test.mjs`
Expected: FAIL with catalog, guide, dictionary, and scenario counts from the 45-course version.

- [ ] **Step 3: Add four islands and 20 playable course records**

Preserve the original 45 records byte-for-byte. Append courses in the exact Task 1 ID order. Every record uses `minutes: 9` except `algorithm-efficiency`, `cpu-scheduling`, `routing-maze`, and `reliable-transfer`, which use `minutes: 10`. Rebuild the recommended route as five rounds of 13 courses, one course from each island per round.

- [ ] **Step 4: Prove old progress and backups remain valid**

```js
assert.equal(buildInterleavedRoute().length, 65);
assert.deepEqual(sanitizeCatalogProgress(oldProgress).completedCourseIds, oldProgress.completedCourseIds);
assert.equal(importProgressBackup(old45CourseBackup).completedCourseIds.length, 45);
```

- [ ] **Step 5: Add exact per-course learning content**

Every course gets three unique objectives, one concrete parent prompt, one core term with English label, a 12–36 character explanation, a 10–40 character fictional example, and one deterministic concept question. Add two scenarios per new island with three choices, one answer, and explanatory feedback.

- [ ] **Step 6: Run GREEN and commit**

Run: `node --experimental-strip-types --test tests/course-data.test.mjs tests/curriculum-integrity.test.mjs tests/progress.test.mjs tests/progress-backup.test.mjs tests/curriculum-guide.test.mjs tests/computer-dictionary.test.mjs tests/review-challenge.test.mjs tests/knowledge-atlas.test.mjs tests/term-match.test.mjs`
Expected: PASS.

```bash
git add lib/course-data.ts lib/curriculum-guide.ts lib/computer-dictionary.ts lib/review-challenge.ts tests
git commit -m "feat: add advanced curriculum guidance and review"
```

### Task 8: Map, copy, responsive layout, and accessibility

**Files:**
- Modify: `components/IslandMap.tsx`
- Modify: `app/globals.css`
- Modify: `github-pages/index.html`
- Modify: `public/manifest.webmanifest`
- Modify: `README.md`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/github-pages-output.mjs`

**Interfaces:**
- Consumes: dynamic `CURRICULUM_FACTS` and four new islands.
- Produces: a usable 13-island map and accurate 65-course public metadata.

- [ ] **Step 1: Write failing rendered-output assertions**

```js
assert.match(renderedHtml, /十三岛六十五课/);
assert.match(renderedHtml, /数据结构群岛/);
assert.match(renderedHtml, /操作系统控制塔/);
assert.match(manifest.description, /六十五节互动课/);
```

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/rendered-html.test.mjs && GITHUB_PAGES_BASE_PATH=/computer-study/ npm run test:pages`
Expected: FAIL because public copy still says 9 islands and 45 lessons.

- [ ] **Step 3: Update metadata and responsive layout**

Replace numeric marketing copy with `CURRICULUM_FACTS` where rendered by React; update static HTML, manifest, README, and performance expectations to 13 islands, 65 lessons, 65 terms, and 26 scenarios. Extend map curve variations without horizontal clipping.

- [ ] **Step 4: Add accessibility CSS contracts**

New lab buttons use `min-height: 44px`; selected states use `aria-pressed` plus a non-color outline; 320px media rules stack dense grids; reduced motion disables all new transitions; no global horizontal clipping is allowed.

- [ ] **Step 5: Run GREEN and commit**

Run: `node --experimental-strip-types --test tests/rendered-html.test.mjs && GITHUB_PAGES_BASE_PATH=/computer-study/ npm run test:pages`
Expected: PASS.

```bash
git add components/IslandMap.tsx app/globals.css github-pages/index.html public/manifest.webmanifest README.md tests
git commit -m "feat: present thirteen-island curriculum"
```

### Task 9: Full compatibility and runtime verification

**Files:**
- Modify: `tests/multi-course-runtime.test.mjs`
- Modify: `tests/repeated-activation.test.mjs`
- Modify: `tests/lesson-network-safety.test.mjs`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: complete 65-course catalog and registry.
- Produces: automated evidence that all 20 new lessons are playable and safe.

- [ ] **Step 1: Add exhaustive runtime contracts**

```js
for (const course of COURSES) {
  assert.ok(getLessonDefinition(course.id), `${course.id} missing definition`);
  assert.equal(course.playable, true);
}
assert.equal(COURSES.length, 65);
```

Scan every new component for outbound APIs and every staged lab for repeated-activation guards.

- [ ] **Step 2: Run focused verification**

Run: `node --experimental-strip-types --test tests/multi-course-runtime.test.mjs tests/repeated-activation.test.mjs tests/lesson-network-safety.test.mjs tests/rendered-html.test.mjs`
Expected: PASS.

- [ ] **Step 3: Run the complete local gate**

Run: `npm ci && npm test && npm run typecheck && npm run lint && npm audit --audit-level=moderate && GITHUB_PAGES_BASE_PATH=/computer-study/ npm run test:pages && git diff --check`
Expected: every command exits 0, at least 250 existing tests plus all new tests pass, audit reports 0 vulnerabilities.

- [ ] **Step 4: Commit any verification-only changes**

```bash
git add tests
git commit -m "test: verify sixty-five playable lessons"
```

### Task 10: Publish and verify GitHub Pages

**Files:**
- No production files unless verification finds a defect; defects require a failing test before repair.

**Interfaces:**
- Consumes: committed green `main` branch.
- Produces: successful GitHub Actions deployment and checksum-matched live artifact.

- [ ] **Step 1: Push the complete branch**

Run: `git push origin main`
Expected: push succeeds with no uncommitted files.

- [ ] **Step 2: Watch the Pages workflow**

Run: `gh run list --workflow='Deploy GitHub Pages' --limit 1 --json databaseId,status,conclusion,headSha`
Then: `gh run watch <databaseId> --exit-status`
Expected: build and deploy jobs succeed for the current HEAD.

- [ ] **Step 3: Verify live output**

Fetch the cache-busted live HTML, discover its JS/CSS asset paths, download those assets, and compare SHA-256 checksums with `out-pages`. Verify manifest, service worker, icons, sitemap, and robots files also match.

- [ ] **Step 4: Verify runtime acceptance**

On the live site, verify all 13 islands render, representative lessons from each new island enter and advance, 390px and 320px widths have no overflow, keyboard focus enters the stage heading and returns to the course card, and no console errors or outbound requests occur.

- [ ] **Step 5: Record completion evidence**

Run: `git status --short && git rev-parse HEAD && git rev-parse origin/main && npm audit --audit-level=moderate`
Expected: clean worktree, matching revisions, and 0 vulnerabilities.
