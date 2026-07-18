# 比特岛探险任务循环实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为现有 65 课增加可重复游玩的探险任务牌、受控重玩奖励与自动解锁的比比装备等级。

**Architecture:** 由 `progress.mjs` 持久化每课封顶三次的有效完成次数；`adventure-missions.ts` 以纯函数生成互不重复的任务并从次数推导能量与等级；`AdventureMissionBoard.tsx` 只负责展示、轮换和启动课程。地图接收进度数据，备份与目录清洗继续作为不可信本机数据的边界。

**Tech Stack:** React 19、TypeScript 5.9、vinext/Vite、Node test runner、CSS、浏览器 localStorage、GitHub Pages。

## Global Constraints

- 面向 7 岁小学二年级孩子，文字短、按钮直接、反馈具体。
- 单次仍只推荐一节 8–10 分钟课程。
- 不使用日期、签到、连续天数、排行榜、付费、抽奖、概率掉落或无限刷分。
- 所有记录只保存在当前浏览器，并进入现有导出、恢复、重置流程。
- 每课首次完成 10 点，第 2、3 次各 3 点，第 4 次起不再增加能量。
- 旧版 `bit-island-progress-v1` 记录必须无损迁移；未知课程和损坏次数不得进入运行时。
- 不增加运行时依赖，不向网络发送学习记录。

---

### Task 1: 记录受控的课程游玩次数

**Files:**
- Modify: `tests/progress.test.mjs`
- Modify: `lib/progress.mjs`

**Interfaces:**
- Produces: `ProgressState.coursePlayCounts: Record<string, number>`；`completeCourse(progress, courseId, badgeId)` 每次完成递增并封顶为 3。

- [ ] **Step 1: 写迁移、递增、封顶与重置的失败测试**

在 `tests/progress.test.mjs` 增加断言：旧记录中已完成课程迁移为次数 1；新完成后为 1；相同课程完成四次后仍为 3；非法次数、超长键和非整数被移除；`resetProgress` 清空次数。

```js
test("migrates and caps course play counts", () => {
  const legacy = parseProgress(JSON.stringify({ ...DEFAULT_PROGRESS, completedCourseIds: ["keyboard-flight"] }));
  assert.deepEqual(legacy.coursePlayCounts, { "keyboard-flight": 1 });
  const once = completeCourse(DEFAULT_PROGRESS, "keyboard-flight", "keyboard-pilot");
  const twice = completeCourse(once, "keyboard-flight", "keyboard-pilot");
  const three = completeCourse(twice, "keyboard-flight", "keyboard-pilot");
  const four = completeCourse(three, "keyboard-flight", "keyboard-pilot");
  assert.equal(once.coursePlayCounts["keyboard-flight"], 1);
  assert.equal(twice.coursePlayCounts["keyboard-flight"], 2);
  assert.equal(three.coursePlayCounts["keyboard-flight"], 3);
  assert.equal(four.coursePlayCounts["keyboard-flight"], 3);
  assert.deepEqual(resetProgress(four).coursePlayCounts, {});
});
```

- [ ] **Step 2: 运行测试并确认因字段缺失而失败**

Run: `node --experimental-strip-types --test tests/progress.test.mjs`

Expected: FAIL，`coursePlayCounts` 为 `undefined`。

- [ ] **Step 3: 实现安全解析与封顶递增**

在 `DEFAULT_PROGRESS` 增加空对象；增加只接收 1–3 整数和最多 100 个短字符串键的解析器。若存储完全没有该字段，则从 `completedCourseIds` 生成次数 1；若字段存在，则只保留已完成课程的合法次数。`completeCourse` 以 `Math.min(3, current + 1)` 更新。

- [ ] **Step 4: 运行进度测试并确认通过**

Run: `node --experimental-strip-types --test tests/progress.test.mjs`

Expected: 全部 PASS。

- [ ] **Step 5: 提交**

```bash
git add tests/progress.test.mjs lib/progress.mjs
git commit -m "feat: track capped course play counts"
```

### Task 2: 生成任务、能量和装备等级

**Files:**
- Create: `tests/adventure-missions.test.mjs`
- Create: `lib/adventure-missions.ts`

**Interfaces:**
- Consumes: `Course[]`、`completedCourseIds`、`coursePlayCounts`、`confidenceByCourse`、整数 `rotation`。
- Produces: `buildAdventureMissions(input): AdventureMission[]`、`getAdventureEnergy(playCounts): number`、`getExplorerRank(energy): ExplorerRank`、`getRankProgress(energy): RankProgress`。

- [ ] **Step 1: 写任务选择的失败测试**

覆盖新用户只得到一张 `frontier`；混合进度得到 `frontier`、`replay`、`repair` 且课程不重复；`repair` 优先 `help` 再 `practice`；相同输入确定；`rotation + 1` 能换出不同低频课程；全部课程完成时仍生成三张不重复任务。

```js
test("builds three distinct missions from mixed progress", () => {
  const missions = buildAdventureMissions({
    courses: COURSES,
    completedCourseIds: ["keyboard-flight", "file-home", "instruction-order"],
    coursePlayCounts: { "keyboard-flight": 2, "file-home": 1, "instruction-order": 1 },
    confidenceByCourse: { "file-home": "help" },
    rotation: 0,
  });
  assert.deepEqual(missions.map((mission) => mission.kind), ["frontier", "replay", "repair"]);
  assert.equal(new Set(missions.map((mission) => mission.course.id)).size, 3);
  assert.equal(missions[2].course.id, "file-home");
});
```

- [ ] **Step 2: 运行并确认模块不存在的预期失败**

Run: `node --experimental-strip-types --test tests/adventure-missions.test.mjs`

Expected: FAIL，无法导入 `lib/adventure-missions.ts`。

- [ ] **Step 3: 实现确定性任务生成**

以课程 `order` 作为稳定顺序；候选先按游玩次数升序，再按旋转编号循环偏移。任务对象包含 `id`、`kind`、`course`、`eyebrow`、`title`、`description`、`rewardLabel`，且用已选 ID 集合消除重复。无候选时省略该类任务。

- [ ] **Step 4: 写能量与等级边界的失败测试**

断言 `{a:1,b:2,c:3}` 为 `10 + 13 + 16 = 39`；非法或超过 3 的值只按 0–3 计算；0、60、180、360、650 精确切换等级；满级的 `nextRank` 为 `null`，进度值等于最大值。

- [ ] **Step 5: 运行并确认等级函数缺失或边界错误**

Run: `node --experimental-strip-types --test tests/adventure-missions.test.mjs`

Expected: FAIL，等级函数尚未实现。

- [ ] **Step 6: 实现能量与等级纯函数**

定义固定等级表 `[{threshold:0,...}, {threshold:60,...}, {threshold:180,...}, {threshold:360,...}, {threshold:650,...}]`。每课能量为 `count >= 1 ? 10 + Math.min(2, count - 1) * 3 : 0`；返回当前等级、下一等级、区间进度和“还差 N 点”文案。

- [ ] **Step 7: 运行任务引擎测试并确认通过**

Run: `node --experimental-strip-types --test tests/adventure-missions.test.mjs`

Expected: 全部 PASS。

- [ ] **Step 8: 提交**

```bash
git add tests/adventure-missions.test.mjs lib/adventure-missions.ts
git commit -m "feat: generate replayable adventure missions"
```

### Task 3: 把新字段纳入目录清洗和安全备份

**Files:**
- Modify: `tests/progress-backup.test.mjs`
- Modify: `tests/catalog-progress.test.mjs`
- Modify: `lib/progress-backup.ts`
- Modify: `lib/catalog-progress.ts`
- Modify: `components/ParentPanel.tsx`

**Interfaces:**
- Consumes: Task 1 的 `coursePlayCounts`。
- Produces: `BackupProgress.coursePlayCounts: Record<string, number>`，导出、恢复和启动清洗后只含已完成的已知课程。

- [ ] **Step 1: 写备份和目录清洗的失败测试**

导出断言包含合法次数但不包含额外个人字段；恢复断言丢弃未知课程、未完成课程、0、4、小数和字符串；目录清洗执行相同白名单并补齐已完成课程的最低次数 1。

- [ ] **Step 2: 运行并确认类型或断言失败**

Run: `node --experimental-strip-types --test tests/progress-backup.test.mjs tests/catalog-progress.test.mjs`

Expected: FAIL，新字段未导出或未清洗。

- [ ] **Step 3: 扩展备份类型与白名单**

在 `BackupProgress` 和 `ParentProgress` 增加字段。`createProgressBackup` 只复制 `coursePlayCounts`；恢复后按 `KNOWN_COURSE_IDS` 与 `completed` 过滤；目录清洗对同一字段做副本与白名单处理，缺失的已完成课程补 1。

- [ ] **Step 4: 运行相关测试并确认通过**

Run: `node --experimental-strip-types --test tests/progress.test.mjs tests/progress-backup.test.mjs tests/catalog-progress.test.mjs`

Expected: 全部 PASS。

- [ ] **Step 5: 提交**

```bash
git add tests/progress-backup.test.mjs tests/catalog-progress.test.mjs lib/progress-backup.ts lib/catalog-progress.ts components/ParentPanel.tsx
git commit -m "feat: preserve play counts in safe backups"
```

### Task 4: 构建探险任务牌界面

**Files:**
- Create: `components/AdventureMissionBoard.tsx`
- Create: `tests/adventure-mission-board.test.mjs`
- Modify: `components/IslandMap.tsx`
- Modify: `components/BitIslandApp.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `completedCourseIds`、`coursePlayCounts`、`confidenceByCourse`、`onStartCourse(courseId)` 与 Task 2 的纯函数。
- Produces: 地图上的 `#adventure-missions` 区域、三张任务按钮、轮换按钮、能量 `progress` 和装备等级。

- [ ] **Step 1: 写组件契约的失败测试**

源码测试要求组件导入四个纯函数、渲染 `section`、原生 `progress`、`aria-live` 轮换状态、最多三张真实按钮和“换一批任务”。集成测试要求 `BitIslandApp` 将 `progress.coursePlayCounts` 传给 `IslandMap`，地图在 `LearningPlan` 前渲染任务牌。

- [ ] **Step 2: 运行并确认组件不存在的预期失败**

Run: `node --experimental-strip-types --test tests/adventure-mission-board.test.mjs tests/rendered-html.test.mjs`

Expected: FAIL，组件文件或任务牌标记不存在。

- [ ] **Step 3: 实现组件与数据接线**

组件以 `useState(0)` 保存轮换编号，以 `useMemo` 生成任务。点击任务调用 `onStartCourse(mission.course.id)`；点击轮换递增编号并更新 `aria-live` 为“任务已更新，第 N 批”。能量区域显示当前装备名、总能量与到下一等级差值。

- [ ] **Step 4: 写响应式与减少动画的失败检查**

在 `tests/rendered-html.test.mjs` 断言 `.adventure-mission-card` 最小高度不低于 44px；窄屏媒体查询把网格改为一列；`.bit-island-app--reduced-motion` 禁用任务牌过渡和装备动画。

- [ ] **Step 5: 运行并确认 CSS 检查失败**

Run: `node --experimental-strip-types --test tests/rendered-html.test.mjs`

Expected: FAIL，样式选择器尚不存在。

- [ ] **Step 6: 添加沿用岛屿视觉的 CSS**

使用现有 CSS 变量、圆角卡片、蓝绿橙三种任务边框与 CSS 形状装备。桌面三列、小屏一列，按钮触控尺寸至少 44px；减少动画模式将 `transition` 和 `animation` 设为 `none`。

- [ ] **Step 7: 运行组件和渲染测试并确认通过**

Run: `node --experimental-strip-types --test tests/adventure-mission-board.test.mjs tests/rendered-html.test.mjs`

Expected: 全部 PASS。

- [ ] **Step 8: 提交**

```bash
git add components/AdventureMissionBoard.tsx components/IslandMap.tsx components/BitIslandApp.tsx app/globals.css tests/adventure-mission-board.test.mjs tests/rendered-html.test.mjs
git commit -m "feat: add Bibi adventure mission board"
```

### Task 5: 文档、完整验证与 GitHub Pages 发布

**Files:**
- Modify: `README.md`
- Verify: `.github/workflows/deploy-pages.yml`
- Verify: `out-pages/`

**Interfaces:**
- Consumes: Tasks 1–4 的完整功能。
- Produces: 公开 GitHub Pages 上可用的新玩法与可追溯验证证据。

- [ ] **Step 1: 更新产品说明**

在 README 的课程范围中增加“探险任务牌、最多三次有效重玩能量、五级自动装备”，并在隐私段说明游玩次数仅本机保存、可导出恢复和重置。

- [ ] **Step 2: 运行快速完整测试**

Run: `node --experimental-strip-types --test tests/*.test.mjs`

Expected: 全部 PASS，无警告与失败。

- [ ] **Step 3: 运行生产发布门禁**

Run: `npm test && npm run typecheck && npm run lint && npm audit --audit-level=moderate && GITHUB_PAGES_BASE_PATH=/computer-study/ npm run test:pages`

Expected: 生产构建成功、所有测试通过、类型与代码检查通过、0 个中高危漏洞、Pages 输出测试通过。

- [ ] **Step 4: 提交文档并推送**

```bash
git add README.md
git commit -m "docs: explain adventure mission rewards"
git push origin main
```

- [ ] **Step 5: 验证发布工作流与公开页面**

Run: `gh run list --workflow deploy-pages.yml --limit 1`，等待最新 `main` 运行成功；再请求 `https://oldshipmaster.github.io/computer-study/`，确认 HTTP 200、HTML 或静态资源包含“比比的探险任务牌”和 `AdventureMissionBoard` 构建资源。

Expected: 最新提交的 build/deploy 均成功，公开页面已加载新版本。
