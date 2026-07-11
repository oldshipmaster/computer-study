# Launch Harbor Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn all five Launch Harbor courses into complete, persistent, keyboard-accessible interactive lessons and establish a reusable multi-course runtime for the remaining three islands.

**Architecture:** Keep the existing single-page application and local progress schema. Replace the hard-coded keyboard-flight route with a typed lesson registry and generic completion model; each course remains a focused component with a pure lesson model and focused tests. Shared chrome owns captions, stage progress, exit, reduced-motion behavior, and completion handoff, while individual lessons own only their game mechanics.

**Tech Stack:** React 19, TypeScript 5.9, Vite/vinext, Node test runner, CSS animations, localStorage progress, GitHub Actions/GitHub Pages.

## Global Constraints

- Core learner: 7-year-old second grader using a desktop or laptop with mouse and keyboard.
- Each lesson follows the approved 8–10 minute rhythm: story, demonstration, guided practice, independent challenge, recap/reward.
- Wrong actions never remove rewards, show a red cross, or play punitive audio.
- Every essential action has a keyboard path; every audio cue has a visible caption.
- Resume values must never grant a reward without completing the lesson.
- Course completion is persisted immediately and exactly once before any transition delay.
- No account, cloud sync, analytics, ads, external navigation, or child personal-data collection.
- Preserve the existing Sites build and the independent `/computer-study/` GitHub Pages build.
- Every new lesson gets pure behavior tests plus a rendered/source contract.

---

### Task 1: Multi-Course Runtime and Shared Lesson Chrome

**Files:**
- Create: `components/lessons/types.ts`
- Create: `components/lessons/LessonChrome.tsx`
- Create: `components/lessons/LessonCompletion.tsx`
- Create: `components/lessons/lesson-registry.ts`
- Modify: `components/BitIslandApp.tsx`
- Modify: `components/IslandMap.tsx`
- Modify: `lib/course-data.ts`
- Modify: `tests/course-data.test.mjs`
- Create: `tests/multi-course-runtime.test.mjs`

**Interfaces:**
- `LessonProps`: `{ initialStage, sound, reducedMotion, onStageChange, onAward, onComplete, onExit }`.
- `LessonDefinition`: `{ courseId, badgeId, badgeName, completionTitle, completionSummary, Component }`.
- `getLessonDefinition(courseId: string): LessonDefinition | undefined`.
- `getNextPlayableCourse(completedIds: readonly string[]): Course | undefined`.

- [x] **Step 1: Write failing runtime tests**

Add tests asserting that every currently playable course has a registry entry, the next incomplete playable course is selected in catalog order, a completed course stays clickable for replay, and unknown course IDs never enter the lesson screen. Each later course task adds its registry entry and only then flips its `playable` flag, so the registry can never point at an unfinished placeholder lesson.

- [x] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/course-data.test.mjs tests/multi-course-runtime.test.mjs`

Expected: FAIL because the registry and next-course helper do not exist.

- [x] **Step 3: Define shared lesson contracts**

Create the exact `LessonProps` and `LessonDefinition` interfaces. `LessonChrome` renders one heading, visible caption, stage progress, exit button, and child-safe status region. `LessonCompletion` accepts the active definition rather than hard-coded keyboard-flight copy.

- [x] **Step 4: Replace hard-coded course state**

In `BitIslandApp`, add `activeCourseId: string | null`; resolve the component from the registry; resume only when `progress.resume.courseId === activeCourseId`; save the active course ID with every stage; award the definition’s course/badge pair; render generic completion copy; return focus to the active course card when exiting.

- [x] **Step 5: Make map progression data-driven**

Export `getNextPlayableCourse`. Use it for the hero’s current mission and “继续冒险” button. Keep completed playable cards enabled for replay. Make `CourseCard` expose a stable `data-course-id` focus target.

- [x] **Step 6: Verify GREEN**

Run:

```bash
node --experimental-strip-types --test tests/course-data.test.mjs tests/multi-course-runtime.test.mjs
npm test
npm run test:pages
npm run lint
```

Expected: all runtime and existing tests PASS; both deployment builds succeed.

- [ ] **Step 7: Commit**

```bash
git add components lib tests app
git commit -m "feat: add reusable multi-course lesson runtime"
```

---

### Task 2: Complete “鼠标精准训练”

**Files:**
- Create: `lib/mouse-lesson.ts`
- Create: `components/lessons/MousePrecisionLesson.tsx`
- Create: `components/lessons/mouse/MouseTargetField.tsx`
- Create: `components/lessons/mouse/DragWorkshop.tsx`
- Modify: `components/lessons/lesson-registry.ts`
- Modify: `lib/course-data.ts`
- Modify: `app/globals.css`
- Create: `tests/mouse-lesson.test.mjs`

**Interfaces:**
- `MouseLessonStage`: `intro | move | click | doubleClick | drag | challenge`.
- `advanceMouseSequence(state, action)`: pure state transition.
- `isUsefulMouseAction(previous, next)`: resets hints only for measurable progress.

- [x] **Step 1: Write failing mouse-lesson tests**

Cover ordered stage progression, single-click not satisfying double-click, wrong-target clicks preserving progress, drag drop requiring the correct destination, useful-input classification, resume normalization, and exact challenge completion.

- [x] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/mouse-lesson.test.mjs`

Expected: FAIL with missing `lib/mouse-lesson.ts`.

- [x] **Step 3: Implement the pure model**

Use stable target IDs and semantic actions rather than pointer coordinates in the model. Keep browser coordinates in the visual layer. Export a safe resume normalizer that never maps directly to completion.

- [x] **Step 4: Build the six-stage lesson**

Story: repair the harbor’s navigation console. Practice: follow three moving light targets, single-click the yellow beacon, double-click the blue hatch, drag three supply crates to matching bays. Challenge: independently move, click, double-click, and drag in one sequence. Provide buttons/arrow-key alternatives for moving focus and moving crates.

- [x] **Step 5: Add hints and accessibility**

After 8 seconds without useful progress, highlight the next relevant target. After two wrong attempts, demonstrate only the next action. Pointer targets are at least 48px; keyboard focus is never moved unexpectedly; reduced motion keeps targets stationary but changes their highlight.

- [x] **Step 6: Register and enable the course**

Add the lesson definition with badge ID `mouse-navigator` and badge name `鼠标导航员`; set `mouse-precision.playable = true` only after the component and tests exist.

- [x] **Step 7: Verify and commit**

Run all pure tests, `npm test`, `npm run test:pages`, and lint. Commit as `feat: add mouse precision adventure`.

---

### Task 3: Complete “中英文输入站”

**Files:**
- Create: `lib/typing-lesson.ts`
- Create: `components/lessons/BilingualInputLesson.tsx`
- Create: `components/lessons/typing/TypingConsole.tsx`
- Modify: `components/lessons/lesson-registry.ts`
- Modify: `lib/course-data.ts`
- Modify: `app/globals.css`
- Create: `tests/typing-lesson.test.mjs`

**Interfaces:**
- `evaluateTypingTask(task, value, compositionState)` returns `{ complete, feedback, useful }`.
- Tasks cover exact lowercase letters, digits, backspace correction, and one Chinese word entered through IME composition.

- [x] **Step 1: Write failing typing-model tests**

Cover case-sensitive English input, number matching, backspace correction, composition-start/update/end safety, wrong text preserving prior completed tasks, and no completion during active IME composition.

- [x] **Step 2: Implement model and lesson**

Stages: identify home row, type `bit`, enter `2026`, correct `BIBI` to `BIBI` after an inserted error using Backspace, compose `比比`, then complete a mixed call-sign challenge. Never record the learner’s text outside component state or local stage progress.

- [x] **Step 3: Add child-safe input behavior**

Use a real labeled text input, visible target text, caps-lock-neutral instructions, and composition event handling. Do not intercept browser/system shortcuts. Add an onscreen key guide that mirrors but does not replace the physical keyboard.

- [x] **Step 4: Register, enable, verify, and commit**

Badge: `typing-communicator` / `输入通信员`. Run focused tests, full tests, both builds, and lint. Commit as `feat: add bilingual typing station`.

---

### Task 4: Complete “桌面探险”

**Files:**
- Create: `lib/desktop-lesson.ts`
- Create: `components/lessons/DesktopAdventureLesson.tsx`
- Create: `components/lessons/desktop/SimulatedDesktop.tsx`
- Modify: `components/lessons/lesson-registry.ts`
- Modify: `lib/course-data.ts`
- Modify: `app/globals.css`
- Create: `tests/desktop-lesson.test.mjs`

**Interfaces:**
- Model actions: `selectIcon`, `openWindow`, `focusWindow`, `minimizeWindow`, `restoreWindow`, `closeWindow`.
- State distinguishes desktop icons, open windows, focused window, minimized windows, and taskbar entries.

- [x] **Step 1: Test the simulated desktop model**

Cover single selection vs double-click open, one focused window at a time, minimize/restore through taskbar, close semantics, keyboard activation, and safe replay.

- [x] **Step 2: Build the simulated desktop lesson**

Stages teach icon, window, title bar, taskbar, program switching, minimize/restore, and close. Challenge asks the learner to open Notes and Paint, switch to Notes, minimize it, restore from taskbar, then close both.

- [x] **Step 3: Register and verify**

Badge: `desktop-explorer` / `桌面探险家`. Enable only after tests pass. Run both builds and accessibility source checks.

- [x] **Step 4: Commit**

Commit as `feat: add simulated desktop adventure`.

---

### Task 5: Complete “程序安全起降”

**Files:**
- Create: `lib/program-landing-lesson.ts`
- Create: `components/lessons/ProgramLandingLesson.tsx`
- Create: `components/lessons/program-landing/DocumentSimulator.tsx`
- Modify: `components/lessons/lesson-registry.ts`
- Modify: `lib/course-data.ts`
- Modify: `app/globals.css`
- Create: `tests/program-landing-lesson.test.mjs`

**Interfaces:**
- State: `{ open, content, savedContent, saveLocation, closePrompt }`.
- Actions: `open`, `edit`, `save`, `requestClose`, `cancelClose`, `discardAndClose`, `saveAndClose`.

- [x] **Step 1: Test safe document lifecycle**

Cover opening, dirty state, save clearing dirty state, close without changes, unsaved-change prompt, cancel preserving work, save-and-close persisting the simulated document, and discard never being the primary action.

- [x] **Step 2: Build the lesson and challenge**

Stages teach open, edit, save, close, and unsaved-change decisions. The final challenge requires opening a mission note, typing a short call sign, saving to a named simulated folder, and closing safely.

- [x] **Step 3: Register and verify**

Badge: `program-pilot` / `程序领航员`. Enable the fifth Launch Harbor course. Run all tests and both production builds.

- [x] **Step 4: Commit**

Commit as `feat: add safe program landing lesson`.

---

### Task 6: Launch Harbor Release and Pages Deployment

**Files:**
- Modify: `README.md`
- Modify: `.github/workflows/deploy-pages.yml` only if the release needs additional verification.

- [ ] **Step 1: Update product documentation**

State that all five Launch Harbor courses are playable, while the other 15 remain clearly marked upcoming. Document the lesson registry and local-only progress behavior.

- [ ] **Step 2: Run complete local gates**

```bash
npm test
GITHUB_PAGES_BASE_PATH=/computer-study/ npm run test:pages
npm run lint
git diff --check
```

- [ ] **Step 3: Push and monitor GitHub Pages**

Push `main`, monitor the Pages workflow to success, then verify the live title, base-path assets, and all five playable course IDs in the deployed bundle.

- [ ] **Step 4: Start the next island plan**

Write the File Forest implementation plan using the same registry and quality gates; do not mark the five-hour curriculum goal complete merely because Launch Harbor shipped.
