import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function lessonSource() {
  return readFileSync(
    new URL("../components/KeyboardFlightLesson.tsx", import.meta.url),
    "utf8",
  );
}

function sourceFile(relativePath) {
  const fileUrl = new URL(`../${relativePath}`, import.meta.url);
  assert.ok(existsSync(fileUrl), `Missing source file ${relativePath}`);
  return readFileSync(fileUrl, "utf8");
}

function cssBlocks(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...globalCss.matchAll(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "g"))];

  assert.ok(matches.length > 0, `Missing CSS block for ${selector}`);
  return matches.map((match) => match[1]);
}

function cssProperty(selector, property) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const propertyPattern = new RegExp(`${escapedProperty}\\s*:\\s*([^;]+);`);
  const match = cssBlocks(selector)
    .map((block) => block.match(propertyPattern))
    .find(Boolean);

  assert.ok(match, `Missing ${property} in ${selector}`);
  return match[1].trim();
}

function pixelsAtMobileRoot(value) {
  if (value.endsWith("rem")) {
    return Number.parseFloat(value) * 16;
  }

  if (value.endsWith("px")) {
    return Number.parseFloat(value);
  }

  assert.fail(`Unsupported font-size unit: ${value}`);
}

function relativeLuminance(hex) {
  const channels = hex
    .match(/[a-f\d]{2}/gi)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const luminances = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (left, right) => right - left,
  );

  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

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

test("server-renders the complete curriculum map", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, />继续冒险</);
  assert.match(html, /启航港/);
  assert.match(html, /文件森林/);
  assert.match(html, /机器人工坊/);
  assert.match(html, /安全灯塔/);
  assert.match(html, /硬件实验岛/);
  assert.match(html, /网络海湾/);
  assert.match(html, /创作工坊/);
  assert.match(html, /未来协作站/);
  assert.match(html, /代码星港/);
  assert.equal((html.match(/data-course-card=/g) ?? []).length, 45);
  assert.equal((html.match(/course-card--available/g) ?? []).length, 45);
  assert.equal((html.match(/course-card--locked/g) ?? []).length, 0);
  assert.equal((html.match(/disabled=""/g) ?? []).length, 27, "dictionary audio waits for browser speech support");
  assert.match(html, /data-course-id="keyboard-flight"/);
  assert.doesNotMatch(html, /即将开放/);
  assert.equal((html.match(/开始任务/g) ?? []).length, 45);
  assert.equal((html.match(/route-curve route-curve--/g) ?? []).length, 8);
  assert.match(html, /五次探险计划/);
  assert.equal((html.match(/class="session-number"/g) ?? []).length, 5);
  assert.match(html, /岛屿印章册/);
  assert.equal((html.match(/还差 5 课/g) ?? []).length, 9);
  assert.match(html, /儿童隐私与安全说明/);
  assert.match(html, /aria-label="学习区域快捷航线"/);
  for (const target of ["learning-plan", "adventure-map", "knowledge-atlas", "computer-dictionary", "review-station"]) {
    assert.match(html, new RegExp(`href="#${target}"`));
    assert.match(html, new RegExp(`id="${target}"`));
  }
  assert.match(html, /不需要注册账号或填写姓名/);
  assert.match(html, /均为虚构模拟/);
  assert.match(html, /你的知识图鉴/);
  assert.equal((html.match(/class="knowledge-chapter"/g) ?? []).length, 9);
  assert.equal((html.match(/神秘知识卡/g) ?? []).length, 45);
  assert.match(html, /岛屿问答站/);
  assert.match(html, /先完成任意一座岛的第一课/);
  assert.equal((html.match(/review-progress/g) ?? []).length, 1);
});

test("supports alternating route curves for all nine islands", () => {
  const css = sourceFile("app/globals.css");
  assert.match(css, /\.route-curve--2,\s*\.route-curve--4,\s*\.route-curve--6,\s*\.route-curve--8/);
  assert.match(css, /\.route-curve--2 span,\s*\.route-curve--4 span,\s*\.route-curve--6 span,\s*\.route-curve--8 span/);
});

test("gives course search a visible recoverable empty state", () => {
  const source = sourceFile("components/IslandMap.tsx");
  assert.match(source, /visibleCourseIds\.size === 0/);
  assert.match(source, /罗盘暂时没找到这门课/);
  assert.match(source, /function clearCourseFilters/);
  assert.match(source, /setCourseQuery\(""\)/);
  assert.match(source, /setSelectedIslandId\("all"\)/);
  assert.match(source, /setSelectedDifficulty\("all"\)/);
  assert.match(source, /setSelectedCompletion\("all"\)/);
  assert.match(source, /aria-label="按难度筛选"/);
  assert.match(source, /aria-label="按完成状态筛选"/);
  assert.match(source, /清除全部筛选/);
  assert.match(source, /清除筛选，显示 \{CURRICULUM_FACTS\.courseCount\} 课/);
});

test("stacks dense hardware and network labs on child-sized screens", () => {
  const css = sourceFile("app/globals.css");

  assert.match(css, /@media \(max-width: 38rem\)[\s\S]*?\.pipeline-roles[\s\S]*?grid-template-columns: 1fr/);
  assert.match(css, /@media \(max-width: 38rem\)[\s\S]*?\.bit-switches[\s\S]*?grid-template-columns: repeat\(2, 1fr\)/);
  assert.match(css, /@media \(max-width: 38rem\)[\s\S]*?\.search-lab li[\s\S]*?flex-direction: column/);
  assert.match(css, /@media \(max-width: 38rem\)[\s\S]*?\.copy-map[\s\S]*?grid-template-columns: 1fr/);
});

test("offers a privacy-preserving printable certificate after full completion", () => {
  const mapSource = sourceFile("components/IslandMap.tsx");
  const certificateSource = sourceFile("components/CompletionCertificate.tsx");
  const css = sourceFile("app/globals.css");
  assert.match(mapSource, /mission\.complete\s*\?\s*<CompletionCertificate/);
  assert.match(certificateSource, /CURRICULUM_FACTS\.courseCount/);
  assert.match(certificateSource, /不会上传任何学习记录/);
  assert.match(certificateSource, /window\.print\(\)/);
  assert.match(css, /@media print[\s\S]*?\.completion-certificate/);
});

test("collects a private structured confidence check for parent review", () => {
  const completionSource = sourceFile("components/lessons/LessonCompletion.tsx");
  const parentSource = sourceFile("components/ParentPanel.tsx");
  assert.match(completionSource, /我会讲了/);
  assert.match(completionSource, /我想再练/);
  assert.match(completionSource, /请大人帮忙/);
  assert.match(parentSource, /孩子标记的复习课/);
  assert.match(parentSource, /confidenceByCourse/);
  assert.match(parentSource, /打开这课/);
});

test("offers child-led review from structured confidence choices", () => {
  const mapSource = sourceFile("components/IslandMap.tsx");
  const queueSource = sourceFile("components/ChildReviewQueue.tsx");
  assert.match(mapSource, /ChildReviewQueue/);
  assert.match(queueSource, /我的加练清单/);
  assert.match(queueSource, /不是错题榜/);
  assert.match(queueSource, /开始加练/);
});

test("reads dictionary explanations locally while respecting sound settings", () => {
  const source = sourceFile("components/ComputerDictionary.tsx");
  assert.match(source, /SpeechSynthesisUtterance/);
  assert.match(source, /document\.visibilityState !== "visible"/);
  assert.match(source, /soundEnabled/);
  assert.match(source, /window\.speechSynthesis\.cancel/);
  assert.match(source, /🔊 听解释/);
  assert.match(source, /去学这节课/);
  assert.match(source, /onStartCourse\(entry\.courseId\)/);
});

test("keeps the playable keyboard-flight lesson contract in source", () => {
  const source = lessonSource();
  const childFacingLabels = [
    "方向键热身",
    "飞船训练场",
    "指令积木",
    "运行飞船",
    "再试一次",
    "键盘领航员",
  ];

  for (const label of childFacingLabels) {
    assert.match(source, new RegExp(label));
  }

  assert.match(source, /aria-live="polite"/);
  assert.match(source, /addEventListener\(["']keydown["']/);
});

test("keeps the guarded parent-area contract in source", () => {
  const parentSource = sourceFile("components/ParentPanel.tsx");
  const appSource = sourceFile("components/BitIslandApp.tsx");
  const combinedSource = `${parentSource}\n${appSource}`;
  const parentLabels = [
    "家长区",
    "本机学习进度",
    "声音提示",
    "减少动画",
    "重置学习进度",
    "备份学习记录",
    "导出 JSON 备份",
    "恢复以前的备份",
    "ParentCurriculumOutline",
    "长按进入",
    "进入家长区",
    "确认清空这台电脑上的学习记录",
  ];

  for (const label of parentLabels) {
    assert.match(combinedSource, new RegExp(label));
  }

  assert.match(parentSource, /九岛进度/);
  assert.doesNotMatch(parentSource, /四岛进度|八岛进度/);

  assert.match(appSource, /1_500/);
  assert.match(appSource, /onPointerDown/);
  assert.match(appSource, /onPointerUp/);
  assert.match(appSource, /onPointerCancel/);
  assert.match(appSource, /onPointerLeave/);
  assert.match(parentSource, /event\.key === "Escape"/);
  assert.match(parentSource, /event\.key === "Tab"/);
  assert.match(parentSource, /resetActionButtonRef/);
  assert.match(appSource, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(appSource, /document\.documentElement\.classList\.toggle/);
  assert.match(appSource, /inert=/);
  assert.match(appSource, /screen !== "lesson"/);
  assert.match(appSource, /\.focus\(\)/);
});

test("keeps the full parent curriculum outline aligned with catalog data", () => {
  const source = sourceFile("components/ParentCurriculumOutline.tsx");
  assert.match(source, /ISLANDS\.map/);
  assert.match(source, /CURRICULUM_GUIDE/);
  assert.match(source, /查看 \{CURRICULUM_FACTS\.courseCount\} 课完整课程大纲/);
  assert.match(source, /guide\.objectives\.map/);
  assert.match(source, /completed\.has\(courseId\)/);
});

test("builds a private printable five-session family plan", () => {
  const source = sourceFile("components/ParentFamilyPlan.tsx");
  const parentSource = sourceFile("components/ParentPanel.tsx");
  const css = sourceFile("app/globals.css");
  assert.match(parentSource, /ParentFamilyPlan/);
  assert.match(source, /buildLearningPlan\(completedCourseIds, 5, resume\)/);
  assert.match(source, /CURRICULUM_GUIDE/);
  assert.match(source, /打印五次学习卡/);
  assert.match(source, /不含孩子姓名、答题内容或账号信息/);
  assert.match(source, /window\.addEventListener\("afterprint"/);
  assert.match(css, /\.print-family-plan \.family-plan/);
});

test("cancels a pending parent hold when the page loses interaction", () => {
  const appSource = sourceFile("components/BitIslandApp.tsx");

  assert.match(
    appSource,
    /window\.addEventListener\(["']blur["'],\s*cancelParentHold\)/,
  );
  assert.match(appSource, /document\.addEventListener\(["']visibilitychange["']/);
  assert.match(appSource, /document\.visibilityState\s*!==\s*["']visible["']/);
  assert.match(
    appSource,
    /window\.removeEventListener\(["']blur["'],\s*cancelParentHold\)/,
  );
  assert.match(appSource, /document\.removeEventListener\(["']visibilitychange["']/);
});

test("contains forward and backward focus when it starts outside the parent dialog", () => {
  const parentSource = sourceFile("components/ParentPanel.tsx");

  assert.match(parentSource, /useLayoutEffect/);
  assert.match(parentSource, /document\.addEventListener\(["']focusin["']/);
  assert.match(
    parentSource,
    /!panelRef\.current\.contains\(document\.activeElement\)/,
  );
  assert.match(parentSource, /event\.shiftKey\s*\?\s*lastElement\s*:\s*firstElement/);
});

test("focuses the safe action for both held-key confirmation boundaries", () => {
  const appSource = sourceFile("components/BitIslandApp.tsx");
  const parentSource = sourceFile("components/ParentPanel.tsx");

  assert.match(appSource, /keyboardConfirmationCancelButtonRef/);
  assert.match(
    appSource,
    /keyboardConfirmationCancelButtonRef\.current\?\.focus\(\)/,
  );
  assert.match(
    appSource,
    /className="parent-cancel-action"[\s\S]{0,180}ref=\{keyboardConfirmationCancelButtonRef\}/,
  );
  assert.doesNotMatch(
    appSource,
    /className="parent-confirm-action"[\s\S]{0,180}ref=/,
  );

  assert.match(parentSource, /resetKeepButtonRef/);
  assert.match(parentSource, /resetKeepButtonRef\.current\?\.focus\(\)/);
  assert.match(
    parentSource,
    /className="parent-secondary-action"[\s\S]{0,180}ref=\{resetKeepButtonRef\}/,
  );
  assert.doesNotMatch(
    parentSource,
    /className="parent-danger-action"[\s\S]{0,180}ref=/,
  );
});

test("retries a reset write independently from the storage-unavailable latch", () => {
  const appSource = sourceFile("components/BitIslandApp.tsx");
  const resetStart = appSource.indexOf("const resetLearningProgress");
  const resetEnd = appSource.indexOf("\n  },", resetStart);
  const resetSource = appSource.slice(resetStart, resetEnd);

  assert.ok(resetStart >= 0 && resetEnd > resetStart, "missing reset callback");
  assert.match(resetSource, /resetProgress\(progress\)/);
  assert.match(
    resetSource,
    /storeProgress\(window\.localStorage,\s*PROGRESS_STORAGE_KEY,\s*nextProgress\)/,
  );
  assert.match(resetSource, /catch\s*\{[\s\S]*setStorageUnavailable\(true\)/);
  assert.doesNotMatch(resetSource, /if\s*\([^)]*storageUnavailable/);
});

test("hands focus across lesson, stage, completion, and map transitions", () => {
  const appSource = sourceFile("components/BitIslandApp.tsx");
  const islandSource = sourceFile("components/IslandMap.tsx");
  const lessonSourceText = sourceFile("components/KeyboardFlightLesson.tsx");
  const completionSource = sourceFile("components/lessons/LessonCompletion.tsx");
  const stageSource = sourceFile("components/keyboard-flight/LessonStages.tsx");
  const programSource = sourceFile("components/keyboard-flight/ProgramStage.tsx");

  assert.match(appSource, /previousScreenRef/);
  assert.match(appSource, /courseCard \?\? mapHeadingRef\.current/);
  assert.match(appSource, /completeHeadingRef\.current\?\.focus\(\)/);
  assert.match(appSource, /parentPanelOpen/);
  assert.match(
    completionSource,
    /<h1[\s\S]{0,180}ref=\{headingRef\}[\s\S]{0,180}tabIndex=\{-1\}/,
  );
  assert.match(completionSource, /role="status"/);

  assert.match(islandSource, /headingRef/);
  assert.match(
    islandSource,
    /<h1[\s\S]{0,180}ref=\{headingRef\}[\s\S]{0,180}tabIndex=\{-1\}/,
  );
  assert.match(lessonSourceText, /useLayoutEffect/);
  assert.match(lessonSourceText, /stageHeadingRef\.current\?\.focus\(\)/);
  assert.match(stageSource, /headingRef/);
  assert.match(stageSource, /tabIndex=\{-1\}/);
  assert.match(programSource, /headingRef/);
  assert.match(programSource, /tabIndex=\{-1\}/);
});

test("recovers a failed lesson without losing the course map", () => {
  const appSource = sourceFile("components/BitIslandApp.tsx");
  const boundarySource = sourceFile("components/lessons/LessonErrorBoundary.tsx");
  assert.match(appSource, /<LessonErrorBoundary key=\{activeCourseId\} onExit=\{returnToMap\}>/);
  assert.match(boundarySource, /getDerivedStateFromError/);
  assert.match(boundarySource, /任务舱暂停/);
  assert.match(boundarySource, /已完成课程和徽章还在/);
  assert.match(boundarySource, /安全返回课程地图/);
});

test("keeps the final motion, focus, and responsive accessibility rules", () => {
  const lessonHookSource = sourceFile(
    "components/keyboard-flight/useKeyboardFlightLesson.ts",
  );

  assert.match(globalCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(globalCss, /:focus-visible/);
  assert.match(globalCss, /@media\s*\(forced-colors:\s*active\)/);
  assert.match(globalCss, /@media\s*\(max-width:\s*960px\)/);
  assert.match(globalCss, /@media\s*\(max-width:\s*680px\)/);
  assert.doesNotMatch(globalCss, /overflow-x\s*:\s*(?:hidden|clip)/);
  assert.match(lessonHookSource, /reducedMotion\s*\?\s*0\s*:\s*3_600/);

  for (const selector of [".island-app-shell", ".flight-lesson"]) {
    for (const block of cssBlocks(selector)) {
      assert.doesNotMatch(block, /\boverflow\s*:\s*(?:hidden|clip)/);
    }
  }
});

test("keeps essential lesson-card copy readable for young learners", () => {
  const essentialCardSelectors = [
    ".course-number",
    ".course-status",
    ".course-card-copy > span",
    ".course-card-meta",
  ];

  for (const selector of essentialCardSelectors) {
    const fontSize = cssProperty(selector, "font-size");

    assert.ok(
      pixelsAtMobileRoot(fontSize) >= 16,
      `${selector} must remain at least 16px at the 680px mobile root size; received ${fontSize}`,
    );
  }
});

test("keeps the lesson caption at least 16px at every responsive size", () => {
  const captionBlocks = cssBlocks(".bibi--lesson .bibi-message p");

  for (const block of captionBlocks) {
    const match = block.match(/font-size\s*:\s*([^;]+);/);
    assert.ok(match, "every lesson-caption block must declare its font size");
    assert.ok(
      pixelsAtMobileRoot(match[1].trim()) >= 16,
      `lesson captions must remain at least 16px; received ${match[1].trim()}`,
    );
  }
});

test("marks the executing instruction in forced-colors mode", () => {
  const forcedColorsStart = globalCss.indexOf("@media (forced-colors: active)");
  const forcedColorsCss = globalCss.slice(forcedColorsStart);

  assert.ok(forcedColorsStart >= 0, "missing forced-colors media query");
  assert.match(
    forcedColorsCss,
    /\.program-block\.is-current\s*\{[^}]*outline\s*:\s*3px double CanvasText;/,
  );
});

test("composes ambient transforms with responsive and interactive transforms", () => {
  const floatStart = globalCss.indexOf("@keyframes bibi-float");
  const floatEnd = globalCss.indexOf("@keyframes sun-breathe", floatStart);
  const bibiFloat = globalCss.slice(floatStart, floatEnd);

  assert.ok(floatStart >= 0 && floatEnd > floatStart, "missing bibi-float keyframes");
  assert.match(bibiFloat, /translate\s*:/);
  assert.match(bibiFloat, /rotate\s*:/);
  assert.doesNotMatch(bibiFloat, /\btransform\s*:/);

  for (const selector of [
    ".course-card--available:hover",
    ".course-card--available:active",
    ".course-card--available:focus-visible",
  ]) {
    assert.equal(cssProperty(selector, "animation"), "none");
  }
});

test("ships a Bit Island favicon instead of the Sites starter identity", () => {
  const favicon = sourceFile("public/favicon.svg");
  const layoutSource = sourceFile("app/layout.tsx");
  const faviconHash = createHash("sha256").update(favicon).digest("hex");
  const sitesStarterHash = "e6d2e59b7b5bbb0342e0fb496dfc262decbfe4426bbb7b047aec8d467d1dc6f7";

  assert.notEqual(faviconHash, sitesStarterHash);
  assert.match(favicon, /#12324a/i);
  assert.match(favicon, /#(?:ffd85a|ff7d55)/i);
  assert.doesNotMatch(favicon, /#(?:68c4ff|0c79d8|2e9eff)/i);
  assert.doesNotMatch(favicon, /<(?:script|foreignObject|image|text)\b/i);
  assert.doesNotMatch(favicon, /(?:href|xlink:href)\s*=/i);
  assert.match(layoutSource, /icon:\s*["']\/favicon\.svg["']/);
  assert.match(layoutSource, /shortcut:\s*["']\/favicon\.svg["']/);
});

test("registers a scoped offline shell and shows connection status", () => {
  const pagesSource = sourceFile("github-pages/main.tsx");
  const statusSource = sourceFile("components/OfflineStatus.tsx");
  assert.match(pagesSource, /navigator\.serviceWorker\.register/);
  assert.match(pagesSource, /import\.meta\.env\.BASE_URL/);
  assert.match(statusSource, /navigator\.onLine/);
  assert.match(statusSource, /serviceWorker\.ready/);
  assert.match(statusSource, /addEventListener\("offline"/);
  assert.match(statusSource, /当前离线：继续学习已打开过的课程/);
});

test("runs every test file after exactly one production build", () => {
  const packageJson = JSON.parse(sourceFile("package.json"));
  const testCommand = packageJson.scripts?.test ?? "";

  assert.equal((testCommand.match(/npm run build/g) ?? []).length, 1);
  assert.match(
    testCommand,
    /npm run build\s*&&\s*node --experimental-strip-types --test tests\/\*\.test\.mjs/,
  );
});

test("keeps normal deep-palette text at WCAG AA contrast", () => {
  const coralDeep = cssProperty(":root", "--coral-deep");
  const yellowDeep = cssProperty(":root", "--yellow-deep");
  const paper = cssProperty(":root", "--paper");
  const yellowSoft = cssProperty(":root", "--yellow-soft");

  assert.ok(
    contrastRatio(coralDeep, paper) >= 4.5,
    `--coral-deep on --paper must remain at least 4.5:1; received ${contrastRatio(
      coralDeep,
      paper,
    ).toFixed(2)}:1`,
  );
  assert.ok(
    contrastRatio(yellowDeep, yellowSoft) >= 4.5,
    `--yellow-deep on --yellow-soft must remain at least 4.5:1; received ${contrastRatio(
      yellowDeep,
      yellowSoft,
    ).toFixed(2)}:1`,
  );
});
