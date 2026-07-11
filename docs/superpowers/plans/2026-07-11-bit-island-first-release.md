# Bit Island First Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish the first release of “比特岛大冒险” with a four-island course map, 20-course curriculum, persistent local progress, a parent area, and a fully playable “键盘驾驶飞船” lesson.

**Architecture:** Use the Sites vinext starter as a single-route React application. Keep static curriculum data, pure flight-game rules, browser persistence, and visual components in separate focused modules; a client-side `BitIslandApp` owns navigation between map, lesson, completion, and parent states. Store only versioned local progress and settings in `localStorage`; all course content remains static and deploys with the site.

**Tech Stack:** TypeScript 5.9, React 19, Next-compatible vinext, CSS animations and responsive layout, Node test runner for pure modules and rendered HTML, Cloudflare-compatible Sites hosting.

## Global Constraints

- Core learner: a 7-year-old child in second grade using a desktop or laptop with mouse and keyboard.
- Each lesson is presented as an 8–10 minute experience with short instructions and one primary action per stage.
- First release exposes all 20 lesson names and goals, but only “键盘驾驶飞船” is presented as playable.
- No sign-in, cloud sync, ads, external links, chat, rankings, payments, or child personal-data collection.
- Progress and settings stay on the current device; storage failure must never prevent lesson play.
- Wrong actions never remove rewards, show a red cross, or play punitive audio.
- All audio guidance has visible captions; all essential interactions work with a keyboard.
- Support `prefers-reduced-motion`, clear keyboard focus, high contrast, and smaller desktop windows.
- Do not ship model-authored SVG illustrations; use CSS shapes, typography, and accessible interface elements.

## File Map

- `app/layout.tsx`: Chinese document metadata, fonts, icons, Open Graph and X metadata.
- `app/page.tsx`: server entry that renders the client application.
- `app/globals.css`: complete visual system, island scenery, responsive rules, reduced-motion rules.
- `components/BitIslandApp.tsx`: top-level screen and modal state.
- `components/IslandMap.tsx`: four-island curriculum map and lesson cards.
- `components/KeyboardFlightLesson.tsx`: lesson stage orchestration and child-facing controls.
- `components/ParentPanel.tsx`: guarded parent settings and progress summary.
- `components/Bibi.tsx`: reusable robot guide and caption bubble.
- `lib/course-data.ts`: course and island types plus the 20-entry catalog.
- `lib/flight-engine.mjs`: pure grid movement, instruction execution, and challenge definitions.
- `lib/progress.mjs`: versioned local-state parsing, merging, and serialization.
- `tests/course-data.test.mjs`: curriculum completeness and playable-course assertions.
- `tests/flight-engine.test.mjs`: deterministic lesson-engine tests.
- `tests/progress.test.mjs`: invalid, old, and valid stored-state tests.
- `tests/rendered-html.test.mjs`: production-render metadata and first-view assertions.
- `public/favicon.svg`: simple static brand mark from the starter, rewritten as a safe favicon asset.
- `public/og.png`: generated social preview matching the finished site.

---

### Task 1: Sites Foundation and Production Shell

**Files:**
- Create from Sites starter: `.openai/hosting.json`, `package.json`, `package-lock.json`, `vite.config.ts`, `next.config.ts`, `tsconfig.json`, `build/sites-vite-plugin.ts`, `worker/index.ts`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`
- Delete after replacement: `app/_sites-preview/SkeletonPreview.tsx`, `app/_sites-preview/preview.css`

**Interfaces:**
- Consumes: the approved design in `docs/superpowers/specs/2026-07-11-bit-island-computer-course-design.md`.
- Produces: a healthy vinext build and a `Home` route ready to mount `BitIslandApp`.

- [ ] **Step 1: Preserve the design files and initialize the Sites starter**

Stop the visual-companion session, temporarily move `.gitignore` and `docs` outside the repository, run the bundled initializer with the project root as its target, and restore the preserved files. Merge `.gitignore` so it contains both starter entries and `.superpowers/`.

Run:

```bash
bash /Users/xingsui/.codex/plugins/cache/openai-curated-remote/superpowers/6.1.1/skills/brainstorming/scripts/stop-server.sh /Users/xingsui/projects/computer-study/.superpowers/brainstorm/17572-1783734564
mkdir -p /tmp/bit-island-preinit
mv .gitignore docs .superpowers /tmp/bit-island-preinit/
bash /Users/xingsui/.codex/plugins/cache/openai-bundled/sites/0.1.27/scripts/init-site.sh "$PWD"
mv /tmp/bit-island-preinit/docs ./docs
mv /tmp/bit-island-preinit/.superpowers ./.superpowers
```

Use `apply_patch` to merge the preserved ignore rules into the starter `.gitignore`, including `.superpowers/`, `.vinext/`, `dist/`, `.env*`, and `!.env.example`. Expected: dependency installation succeeds and `.openai/hosting.json`, `app/page.tsx`, and `package.json` exist.

- [ ] **Step 2: Start the retained development preview**

Run `npm run dev` in a retained session, capture the exact local URL printed by vinext, and open that URL once in Codex. Keep this process alive through build and hosting.

Expected: the starter loading screen responds successfully.

- [ ] **Step 3: Replace the starter render test with product assertions**

Replace the starter-specific first test in `tests/rendered-html.test.mjs` with:

```js
test("server-renders the Bit Island product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN"/i);
  assert.match(html, /<title>比特岛大冒险/);
  assert.match(html, /跟比比一起，学会真正的电脑本领/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});
```

Delete the starter-scoping test because the disposable preview directory will be removed.

- [ ] **Step 4: Run the product render test and verify it fails**

Run: `npm test`

Expected: FAIL because the title, Chinese language, and product headline are not yet present.

- [ ] **Step 5: Create the minimum production shell**

Set `app/layout.tsx` to `lang="zh-CN"`, title `比特岛大冒险｜儿童计算机启蒙课`, and description `适合小学二年级孩子的电脑基础与编程思维互动课程。`. In `app/page.tsx`, render a temporary semantic main region with the heading `跟比比一起，学会真正的电脑本领`. Remove `app/_sites-preview`, remove `react-loading-skeleton` from `package.json`, and refresh the lockfile with `npm install --package-lock-only --ignore-scripts`.

- [ ] **Step 6: Run the build-backed test**

Run: `npm test`

Expected: PASS for the Bit Island product-shell assertion.

- [ ] **Step 7: Commit the foundation**

```bash
git add .
git commit -m "feat: establish Bit Island site foundation"
```

---

### Task 2: Curriculum Catalog and Island Map

**Files:**
- Create: `lib/course-data.ts`
- Create: `components/Bibi.tsx`
- Create: `components/IslandMap.tsx`
- Create: `components/BitIslandApp.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Create: `tests/course-data.test.mjs`

**Interfaces:**
- Produces: `Course`, `Island`, `COURSES`, `ISLANDS`, `getCourse(id)`, and `IslandMap({ completedCourseIds, onStartCourse })`.
- `Course` fields: `id`, `islandId`, `order`, `title`, `summary`, `skill`, `minutes`, `difficulty`, `playable`.
- `Island` fields: `id`, `name`, `subtitle`, `accent`, `icon`, `courseIds`.

- [ ] **Step 1: Write the curriculum data test**

Create `tests/course-data.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { COURSES, ISLANDS, getCourse } from "../lib/course-data.ts";

test("publishes four islands and twenty ordered lessons", () => {
  assert.equal(ISLANDS.length, 4);
  assert.equal(COURSES.length, 20);
  assert.deepEqual(COURSES.map((course) => course.order),
    Array.from({ length: 20 }, (_, index) => index + 1));
  assert.ok(ISLANDS.every((island) => island.courseIds.length === 5));
});

test("only the keyboard flight lesson is playable in release one", () => {
  assert.deepEqual(COURSES.filter((course) => course.playable).map((course) => course.id),
    ["keyboard-flight"]);
  assert.equal(getCourse("keyboard-flight")?.title, "键盘驾驶飞船");
});
```

- [ ] **Step 2: Run the curriculum test and verify it fails**

Run: `node --experimental-strip-types --test tests/course-data.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/course-data.ts`.

- [ ] **Step 3: Create the typed 20-course catalog**

Define the exact `Course` and `Island` interfaces above. Add the 20 titles from the approved design in the same order. Set `minutes` to `9` for every first-release card, difficulty to `1`, `2`, or `3`, and `playable: true` only for `keyboard-flight`. Export `getCourse(id: string): Course | undefined`.

- [ ] **Step 4: Run the curriculum test**

Run: `node --experimental-strip-types --test tests/course-data.test.mjs`

Expected: 2 tests PASS.

- [ ] **Step 5: Build the island map and guide**

Create `Bibi({ mood, message })` with moods `happy | thinking | celebrating`. Create `IslandMap` that shows the hero headline, a “继续冒险” button, four island sections, and 20 lesson cards. The first card is available, later cards say `即将开放`, completed cards say `已完成`, and no unavailable card invokes `onStartCourse`.

- [ ] **Step 6: Mount the client application**

Create a client `BitIslandApp` with screen state `"map" | "lesson" | "complete"`, render `IslandMap` initially, and switch to `lesson` only for `keyboard-flight`. Make `app/page.tsx` render `<BitIslandApp />`.

- [ ] **Step 7: Style the approved island-adventure direction**

In `app/globals.css`, define the coral, yellow, mint, sky, and deep-sea tokens; add an asymmetric hero, curved map route, CSS islands, large course cards, visible focus rings, and breakpoint rules at `960px` and `680px`. Do not add decorative SVG markup.

- [ ] **Step 8: Run tests and build**

Run:

```bash
node --experimental-strip-types --test tests/course-data.test.mjs
npm run build
```

Expected: 2 curriculum tests PASS and vinext build exits 0.

- [ ] **Step 9: Commit the curriculum map**

```bash
git add app components lib tests
git commit -m "feat: add Bit Island curriculum map"
```

---

### Task 3: Versioned Local Progress

**Files:**
- Create: `lib/progress.mjs`
- Create: `tests/progress.test.mjs`
- Modify: `components/BitIslandApp.tsx`

**Interfaces:**
- Produces: `DEFAULT_PROGRESS`, `parseProgress(raw)`, `serializeProgress(progress)`, and `completeCourse(progress, courseId, badgeId)`.
- `ProgressState` shape: `{ version: 1, completedCourseIds: string[], badgeIds: string[], settings: { sound: boolean, reducedMotion: boolean }, resume: { courseId: string, stage: number } | null }`.

- [ ] **Step 1: Write progress parsing tests**

Create `tests/progress.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_PROGRESS,
  completeCourse,
  parseProgress,
  serializeProgress,
} from "../lib/progress.mjs";

test("falls back safely for empty or malformed storage", () => {
  assert.deepEqual(parseProgress(null), DEFAULT_PROGRESS);
  assert.deepEqual(parseProgress("not json"), DEFAULT_PROGRESS);
  assert.deepEqual(parseProgress('{"version":99}'), DEFAULT_PROGRESS);
});

test("deduplicates completion and badge rewards", () => {
  const once = completeCourse(DEFAULT_PROGRESS, "keyboard-flight", "keyboard-pilot");
  const twice = completeCourse(once, "keyboard-flight", "keyboard-pilot");
  assert.deepEqual(twice.completedCourseIds, ["keyboard-flight"]);
  assert.deepEqual(twice.badgeIds, ["keyboard-pilot"]);
  assert.equal(twice.resume, null);
  assert.deepEqual(parseProgress(serializeProgress(twice)), twice);
});
```

- [ ] **Step 2: Run the progress tests and verify they fail**

Run: `node --test tests/progress.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Add safe progress helpers**

Implement the exact version-1 state shape. `parseProgress` must catch JSON errors, reject non-object and wrong-version values, sanitize arrays to unique strings, merge missing settings with defaults, and validate resume as a nonnegative integer stage. `completeCourse` must return a new object and deduplicate both arrays.

- [ ] **Step 4: Run progress tests**

Run: `node --test tests/progress.test.mjs`

Expected: 2 tests PASS.

- [ ] **Step 5: Connect persistence to the app**

On the client, load `bit-island-progress-v1` after mount, save after progress changes, and expose a non-blocking `storageUnavailable` flag when either operation throws. Do not gate lesson entry on storage availability.

- [ ] **Step 6: Run all pure-module tests**

Run: `node --experimental-strip-types --test tests/course-data.test.mjs tests/progress.test.mjs`

Expected: 4 tests PASS.

- [ ] **Step 7: Commit progress support**

```bash
git add components/BitIslandApp.tsx lib/progress.mjs tests/progress.test.mjs
git commit -m "feat: persist child progress locally"
```

---

### Task 4: Flight Lesson Engine

**Files:**
- Create: `lib/flight-engine.mjs`
- Create: `tests/flight-engine.test.mjs`

**Interfaces:**
- Produces: `DIRECTIONS`, `KEY_TUTORIAL`, `CHALLENGE`, `moveShip(position, direction, grid)`, and `runProgram(program, challenge)`.
- `position`: `{ x: number, y: number }`.
- instruction values: `"forward" | "left" | "right" | "collect"`.
- `runProgram` result: `{ success, crashed, collected, finalPosition, finalDirection, steps }`.

- [ ] **Step 1: Write deterministic engine tests**

Create `tests/flight-engine.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { CHALLENGE, moveShip, runProgram } from "../lib/flight-engine.mjs";

test("moves inside the grid and blocks an asteroid", () => {
  assert.deepEqual(moveShip({ x: 0, y: 2 }, "east", CHALLENGE),
    { position: { x: 1, y: 2 }, crashed: false });
  assert.deepEqual(moveShip({ x: 2, y: 2 }, "east", CHALLENGE),
    { position: { x: 2, y: 2 }, crashed: true });
});

test("runs instructions in order and collects the energy star", () => {
  const result = runProgram(["forward", "forward", "left", "forward", "collect"], CHALLENGE);
  assert.equal(result.success, true);
  assert.equal(result.collected, true);
  assert.equal(result.crashed, false);
  assert.equal(result.steps.length, 5);
});

test("returns safely to a failed result without mutating the challenge", () => {
  const before = JSON.stringify(CHALLENGE);
  const result = runProgram(["forward", "left", "forward"], CHALLENGE);
  assert.equal(result.success, false);
  assert.equal(JSON.stringify(CHALLENGE), before);
});
```

- [ ] **Step 2: Run engine tests and verify they fail**

Run: `node --test tests/flight-engine.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Create the pure grid engine**

Create a 5×4 challenge with start `{ x: 0, y: 2 }`, start direction `east`, an asteroid at `{ x: 3, y: 2 }`, and a star at `{ x: 2, y: 1 }`. The success route is `forward, forward, left, forward, collect`. Record every instruction in `steps` and never mutate inputs.

- [ ] **Step 4: Run engine tests**

Run: `node --test tests/flight-engine.test.mjs`

Expected: 3 tests PASS.

- [ ] **Step 5: Commit the engine**

```bash
git add lib/flight-engine.mjs tests/flight-engine.test.mjs
git commit -m "feat: add deterministic flight lesson engine"
```

---

### Task 5: Playable “键盘驾驶飞船” Lesson

**Files:**
- Create: `components/KeyboardFlightLesson.tsx`
- Modify: `components/BitIslandApp.tsx`
- Modify: `components/Bibi.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `runProgram`, `CHALLENGE`, and progress callbacks.
- Produces: `KeyboardFlightLesson({ initialStage, reducedMotion, sound, onStageChange, onComplete, onExit })`.

- [ ] **Step 1: Add rendered lesson-contract assertions**

Extend `tests/rendered-html.test.mjs` source-level checks to assert that `KeyboardFlightLesson.tsx` contains the child-facing labels `方向键热身`, `飞船训练场`, `指令积木`, `运行飞船`, `再试一次`, and `键盘领航员`, plus `aria-live="polite"` and a keyboard event listener.

- [ ] **Step 2: Run the render/source test and verify it fails**

Run: `npm test`

Expected: FAIL because `KeyboardFlightLesson.tsx` does not exist.

- [ ] **Step 3: Build five lesson stages**

Create stages `intro`, `keys`, `practice`, `program`, and `complete`. The intro has a skippable short animation. The key stage recognizes all four arrow keys and Space. Practice moves the ship with arrow keys and collects with Space. Program provides four instruction buttons, a reorderable queue with move-left, move-right, and remove controls, plus optional pointer drag-and-drop. Completion calls `onComplete("keyboard-flight", "keyboard-pilot")` exactly once.

- [ ] **Step 4: Add hint timing and gentle retries**

After 8 seconds without useful input, highlight the relevant control. After two failed program runs, show one-step guidance. On failure, keep the program queue intact, return the ship visually to start, use neutral copy `差一点，看看哪一步可以换一换`, and never remove progress or rewards.

- [ ] **Step 5: Add caption-first optional sound**

Every guide message appears as visible text in an `aria-live="polite"` region. Use the browser speech API only after a user gesture and only when sound is enabled; catch unsupported or rejected speech without affecting progression.

- [ ] **Step 6: Style the animated lesson stage**

Add CSS grid space, a CSS-built ship, asteroids, star, active-key keyboard diagram, instruction blocks, current-instruction highlight, completion badge, and reduced-motion fallbacks. Ensure buttons are at least 44px high and the stage remains usable at 680px width.

- [ ] **Step 7: Connect resume and completion**

Update progress after each completed stage. On completion, persist the course and badge, show the completion screen, and make the map’s first course appear completed.

- [ ] **Step 8: Run all tests and build**

Run:

```bash
node --experimental-strip-types --test tests/course-data.test.mjs tests/progress.test.mjs tests/flight-engine.test.mjs
npm test
```

Expected: all pure tests PASS; build-backed product tests PASS.

- [ ] **Step 9: Commit the playable lesson**

```bash
git add app components lib tests
git commit -m "feat: add playable keyboard flight lesson"
```

---

### Task 6: Parent Area, Settings, and Accessibility Finish

**Files:**
- Create: `components/ParentPanel.tsx`
- Modify: `components/BitIslandApp.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Produces: `ParentPanel({ progress, storageUnavailable, onSettingsChange, onReset, onClose })`.
- The parent gate opens after a continuous 1.5-second pointer hold or keyboard activation followed by the visible confirmation `进入家长区`.

- [ ] **Step 1: Add parent and accessibility source assertions**

Add checks for the exact labels `家长区`, `本机学习进度`, `声音提示`, `减少动画`, `重置学习进度`, and `长按进入`. Add CSS checks for `prefers-reduced-motion: reduce` and `:focus-visible`.

- [ ] **Step 2: Run tests and verify they fail**

Run: `npm test`

Expected: FAIL because the parent panel and final accessibility rules are missing.

- [ ] **Step 3: Build the guarded parent panel**

Add the 1.5-second hold gate, completed-course count, earned badge list, storage-unavailable notice, sound toggle, reduced-motion toggle, and reset button. Reset requires a second confirmation action with exact copy `确认清空这台电脑上的学习记录`.

- [ ] **Step 4: Finish keyboard and motion behavior**

Add visible focus styles to every interactive element, Escape-to-close for the panel, focus return to the parent-gate button, and effective reduced motion when either the user setting or system preference is enabled. Decorative elements must be hidden from assistive technology.

- [ ] **Step 5: Verify responsive product behavior from code and build**

Confirm CSS has explicit layout adaptations at 960px and 680px, no fixed-width interaction stage larger than its container, and no horizontal overflow rule masking broken layout.

Run:

```bash
npm run lint
npm test
```

Expected: lint exits 0 and all build-backed tests PASS.

- [ ] **Step 6: Commit the parent and accessibility work**

```bash
git add app components tests
git commit -m "feat: add parent controls and accessible settings"
```

---

### Task 7: Social Preview, Final Validation, and Sites Publishing

**Files:**
- Create: `public/og.png`
- Modify: `app/layout.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: the final palette, headline, robot guide, island map motifs, and production route.
- Produces: a deployable Sites artifact and private hosted URL.

- [ ] **Step 1: Generate one product-specific social card**

Invoke image generation once with this prompt:

```text
Create a complete 1200×630 landscape social sharing card for the Chinese children’s learning website “比特岛大冒险”. Show a friendly small robot guide named 比比 on a bright floating island with a tiny keyboard-controlled spaceship, a coral-orange launch port, mint-green robot workshop, sky-blue ocean, and deep-navy typography. Include exactly these two Chinese text lines, large and legible: “比特岛大冒险” and “电脑基础 × 编程思维”. Warm premium 2D editorial animation style for a 7-year-old, adventurous but not toddlerish, uncluttered, no browser chrome, no watermark, no extra text.
```

Inspect the returned image. If the two required text lines are materially incorrect, omit `og:image`; otherwise save the exact result as `public/og.png`.

- [ ] **Step 2: Add dynamic absolute social metadata**

Use a request-host-derived metadata base and add Open Graph/X title, description, and image entries for `/og.png`. Keep the Chinese title and description consistent with the visible site.

- [ ] **Step 3: Replace starter README content**

Document the product purpose, local commands `npm run dev`, `npm test`, and `npm run lint`, privacy behavior, first-release scope, and the fact that only the first course is playable.

- [ ] **Step 4: Run the complete verification suite**

Run:

```bash
git diff --check
node --experimental-strip-types --test tests/course-data.test.mjs tests/progress.test.mjs tests/flight-engine.test.mjs
npm run lint
npm test
git status --short
```

Expected: no whitespace errors; 7 pure-module tests PASS; lint exits 0; build-backed tests PASS; status contains only intentional final metadata/README changes.

- [ ] **Step 5: Commit the release finish**

```bash
git add app/layout.tsx public/og.png README.md
git commit -m "feat: prepare Bit Island first release"
```

If `public/og.png` was omitted after validation, leave it out of `git add` and omit image metadata.

- [ ] **Step 6: Publish through Sites**

Read and follow the `sites-hosting` skill, package the validated project, create the Sites deployment, and return the private deployed URL. Keep the development server alive until hosting succeeds, then stop it.

- [ ] **Step 7: Record final repository state**

Run:

```bash
git status --short
git log --oneline -7
```

Expected: working tree clean and the release commits visible in order.
