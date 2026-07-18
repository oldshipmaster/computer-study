# 比特知识闪击赛实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用现有课程题库构建一局最多五题、带连击护盾和本机最佳成绩的可重复短挑战。

**Architecture:** `knowledge-sprint.ts` 把已有概念题与情境题转换成统一题型并实现纯状态机；`KnowledgeSprint.tsx` 负责短局界面、轮换、焦点和一次性成绩上报；`BitIslandApp` 继续拥有全部本机进度。现有进度、目录清洗和备份边界新增一个受限的 `knowledgeSprint` 统计对象。

**Tech Stack:** React 19、TypeScript 5.9、Node test runner、vinext/Vite、CSS、localStorage、GitHub Pages。

## Global Constraints

- 每局 2–4 分钟、最多五题、至少三道已解锁题才开放。
- 不使用倒计时、淘汰、排行榜、账号、云同步或探险能量奖励。
- 答错不重试同题：本题 0 分、连击归零、护盾减一，然后继续。
- 每题只能作答一次，回答后必须经过反馈阶段再进入下一题。
- 最高理论分 750；本机只保存 0–750 的最高分和 0–10,000 的完成局数。
- 不保存答案历史、姓名或自由文本，不增加依赖或网络请求。
- 保留 7 岁二年级、岛屿冒险和 8–10 分钟完整课程的既定产品方向。

---

### Task 1: 动态题组与短局状态机

**Files:**
- Create: `lib/knowledge-sprint.ts`
- Create: `tests/knowledge-sprint.test.mjs`

**Interfaces:**
- Consumes: `TERM_MATCH_QUESTIONS`、`REVIEW_QUESTIONS`、`REVIEW_REQUIREMENTS`。
- Produces: `buildKnowledgeSprintDeck(completedCourseIds, rotation, limit?)`、`createKnowledgeSprintState(questionCount)`、`answerKnowledgeSprint(state, optionIndex, deck, activationDetail?)`、`advanceKnowledgeSprint(state, deck, activationDetail?)`。

- [ ] **Step 1: 写题组生成的失败测试**

```js
test("builds an alternating deterministic deck without repeats", () => {
  const completed = ["keyboard-flight", "program-landing", "file-home", "learning-backpack", "instruction-order"];
  const first = buildKnowledgeSprintDeck(completed, 0);
  assert.equal(first.length, 5);
  assert.equal(new Set(first.map((question) => question.id)).size, 5);
  assert.deepEqual(first.map((question) => question.kind), ["concept", "scenario", "concept", "scenario", "concept"]);
  assert.deepEqual(buildKnowledgeSprintDeck(completed, 0), first);
  assert.notDeepEqual(buildKnowledgeSprintDeck(completed, 1), first);
});
```

再覆盖无课程为空、题库不足时不复制、无效轮换按 0、所有课程完成时仍限制五题。

- [ ] **Step 2: 运行并确认模块缺失的失败**

Run: `node --experimental-strip-types --test tests/knowledge-sprint.test.mjs`

Expected: FAIL，无法导入 `lib/knowledge-sprint.ts`。

- [ ] **Step 3: 实现统一题型与确定性轮换**

统一题型字段为 `id`、`kind`、`courseId`、`prompt`、`options`、`answer`、`explanation`。概念题用 `example` 作为解释，情境题用原有 `explanation`。分别筛选已解锁候选，按轮换编号循环偏移后交替抽取，最后用另一类补满，不重复 ID。

- [ ] **Step 4: 写状态机的失败测试**

```js
test("scores a combo and still finishes after a missed answer", () => {
  let state = createKnowledgeSprintState(3);
  state = answerKnowledgeSprint(state, deck[0].options.indexOf(deck[0].answer), deck);
  assert.equal(state.score, 100);
  state = advanceKnowledgeSprint(state, deck);
  state = answerKnowledgeSprint(state, deck[1].options.indexOf(deck[1].answer), deck);
  assert.equal(state.score, 225);
  state = advanceKnowledgeSprint(state, deck);
  state = answerKnowledgeSprint(state, deck[2].options.findIndex((item) => item !== deck[2].answer), deck);
  assert.equal(state.shields, 2);
  assert.deepEqual(state.missedCourseIds, [deck[2].courseId]);
  state = advanceKnowledgeSprint(state, deck);
  assert.equal(state.phase, "complete");
});
```

再覆盖首次正确 100、五题全连击 750、连续答对递增、答错归零、护盾最低 0、反馈阶段重复作答无效、双击无效、完成后保持原状态。

- [ ] **Step 5: 运行并确认状态机断言失败**

Run: `node --experimental-strip-types --test tests/knowledge-sprint.test.mjs`

Expected: FAIL，状态机函数或计分尚未实现。

- [ ] **Step 6: 实现不可变短局状态机**

`phase` 为 `answering | feedback | complete`。正确得分为 `100 + currentStreak * 25`，然后 streak 加一；错误记录课程、清零 streak、护盾 `Math.max(0, shields - 1)`。`advanceKnowledgeSprint` 只在反馈阶段工作，末题进入完成状态，其余题 index 加一并清空反馈。

- [ ] **Step 7: 运行并确认引擎测试通过**

Run: `node --experimental-strip-types --test tests/knowledge-sprint.test.mjs`

Expected: 全部 PASS。

- [ ] **Step 8: 提交**

```bash
git add lib/knowledge-sprint.ts tests/knowledge-sprint.test.mjs
git commit -m "feat: add knowledge sprint game engine"
```

### Task 2: 安全保存本机最佳成绩

**Files:**
- Modify: `lib/progress.mjs`
- Modify: `lib/progress-backup.ts`
- Modify: `lib/catalog-progress.ts`
- Modify: `components/ParentPanel.tsx`
- Modify: `tests/progress.test.mjs`
- Modify: `tests/progress-backup.test.mjs`
- Modify: `tests/catalog-progress.test.mjs`

**Interfaces:**
- Produces: `ProgressState.knowledgeSprint`；`recordKnowledgeSprint(progress, score)`。

- [ ] **Step 1: 写迁移、记录和清洗的失败测试**

旧记录应补 `{ bestScore: 0, runsPlayed: 0 }`；合法成绩更新最高分与局数；低分不降低最佳分；非法分数返回原对象；第 10,001 局仍封顶 10,000。损坏的负数、小数、超范围和字符串字段回退为 0，重置清零。

- [ ] **Step 2: 运行并确认新字段缺失**

Run: `node --experimental-strip-types --test tests/progress.test.mjs`

Expected: FAIL，`knowledgeSprint` 或 `recordKnowledgeSprint` 不存在。

- [ ] **Step 3: 实现进度解析与记录函数**

在默认进度中增加 `{ bestScore: 0, runsPlayed: 0 }`。解析分别限制 0–750 与 0–10,000 整数。`recordKnowledgeSprint` 只接受 0–750 整数并返回带 `Math.max` 最高分及封顶局数的新对象。

- [ ] **Step 4: 写备份和目录清洗的失败测试**

导出只包含两个数字，不包含伪造 `answers`；恢复和目录清洗对无效值回退为 0；合法值保持；旧备份自动补默认值。

- [ ] **Step 5: 运行并确认备份相关失败**

Run: `node --experimental-strip-types --test tests/progress-backup.test.mjs tests/catalog-progress.test.mjs`

Expected: FAIL，新字段未进入白名单或清洗。

- [ ] **Step 6: 扩展类型、白名单与清洗**

在 `BackupProgress`、`ParentProgress` 增加同一对象。创建备份时显式复制两个数字；恢复与目录清洗均调用相同范围规则生成新对象，不能透传额外字段。

- [ ] **Step 7: 运行三组进度测试并确认通过**

Run: `node --experimental-strip-types --test tests/progress.test.mjs tests/progress-backup.test.mjs tests/catalog-progress.test.mjs`

Expected: 全部 PASS。

- [ ] **Step 8: 提交**

```bash
git add lib/progress.mjs lib/progress-backup.ts lib/catalog-progress.ts components/ParentPanel.tsx tests/progress.test.mjs tests/progress-backup.test.mjs tests/catalog-progress.test.mjs
git commit -m "feat: persist private sprint best scores"
```

### Task 3: 构建知识闪击赛界面并接入地图

**Files:**
- Create: `components/KnowledgeSprint.tsx`
- Create: `tests/knowledge-sprint-component.test.mjs`
- Modify: `components/IslandMap.tsx`
- Modify: `components/BitIslandApp.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: Task 1 引擎、`completedCourseIds`、`knowledgeSprint`、`onRecordSprint(score)`、`onStartCourse(courseId)`。
- Produces: `#knowledge-sprint` 挑战区和一次性局末成绩上报。

- [ ] **Step 1: 写组件契约的失败测试**

源码测试要求：锁定态少于三题、原生 `progress`、护盾文字、答案按钮、反馈 `role="status"`、下一题按钮、完成页、最佳分、`reportedRunRef` 一局只上报一次、错题课程按钮。集成测试要求地图把组件放在任务牌与学习计划之间，应用传入进度和记录回调。

- [ ] **Step 2: 运行并确认组件缺失**

Run: `node --experimental-strip-types --test tests/knowledge-sprint-component.test.mjs`

Expected: FAIL，组件文件不存在。

- [ ] **Step 3: 实现 React 短局流程**

组件用 `useMemo` 生成 deck、`useState` 保存 rotation/state、`useLayoutEffect` 管理题目与完成标题焦点、`useEffect + reportedRunRef` 在完成时调用一次 `onRecordSprint(state.score)`。重开时轮换加一、复位 ref 和状态。锁定态通过 `getMapMission` 或传入的下一课程 ID 打开下一课。

- [ ] **Step 4: 在应用中接线**

`BitIslandApp` 增加 `recordSprintScore` 回调，调用 `recordKnowledgeSprint`；`IslandMapProps` 增加 `knowledgeSprint` 与 `onRecordSprint`，导航增加“闪击赛”，在 `<AdventureMissionBoard>` 后渲染 `<KnowledgeSprint>`。

- [ ] **Step 5: 写 CSS 可访问性失败检查**

断言答案与继续按钮至少 44px；680px 下答案网格一列；减少动画禁用 `.sprint-combo` 和 `.sprint-shields` 动画；强制颜色下被选反馈和护盾保持边框。

- [ ] **Step 6: 运行并确认样式检查失败**

Run: `node --experimental-strip-types --test tests/knowledge-sprint-component.test.mjs tests/rendered-html.test.mjs`

Expected: FAIL，相关选择器尚不存在。

- [ ] **Step 7: 添加岛屿风格界面样式**

挑战台使用深海蓝控制台、黄色分数、珊瑚连击和薄荷正确反馈；桌面左侧状态、右侧问题，移动端单列。按钮、焦点、状态文字、进度和强制颜色满足设计文档。

- [ ] **Step 8: 构建并运行组件及渲染测试**

Run: `npm run build && node --experimental-strip-types --test tests/knowledge-sprint-component.test.mjs tests/rendered-html.test.mjs && npm run typecheck`

Expected: 构建成功，测试与类型全部 PASS。

- [ ] **Step 9: 提交**

```bash
git add components/KnowledgeSprint.tsx components/IslandMap.tsx components/BitIslandApp.tsx app/globals.css tests/knowledge-sprint-component.test.mjs tests/rendered-html.test.mjs
git commit -m "feat: add replayable knowledge sprint"
```

### Task 4: 文档、完整门禁与公开发布

**Files:**
- Modify: `README.md`
- Verify: `.github/workflows/deploy-pages.yml`
- Verify: `out-pages/`

**Interfaces:**
- Produces: GitHub Pages 上公开可玩的闪击赛与完整验证证据。

- [ ] **Step 1: 更新产品与隐私说明**

README 增加“五题闪击赛、连击护盾、本机最佳成绩、错题回课”，隐私段说明只保存最佳分和局数，不保存答案历史。

- [ ] **Step 2: 运行完整发布门禁**

Run: `npm test && npm run typecheck && npm run lint && npm audit --audit-level=moderate && GITHUB_PAGES_BASE_PATH=/computer-study/ npm run test:pages`

Expected: 所有测试 0 失败、类型和代码检查通过、0 个中高危漏洞、Pages 输出验证通过。

- [ ] **Step 3: 提交并推送 main**

```bash
git add README.md
git commit -m "docs: explain the knowledge sprint"
git push origin main
```

- [ ] **Step 4: 验证 CI 与公开页面**

等待最新提交对应的 `deploy-pages.yml` build/deploy 均为 success。请求 `https://oldshipmaster.github.io/computer-study/`，要求 HTTP 200，并从公开主脚本确认同时含“比特知识闪击赛”“本机最佳”和“回到对应课程加练”。
