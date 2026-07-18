# 十三岛 Boss 战实施计划

> **For agentic workers:** Implement task-by-task with tests written before production behavior.

**Goal:** 为十三座岛增加完成五课后解锁的三阶段综合 Boss 战，并安全保存点亮记录。

**Architecture:** `island-boss.ts` 保存十三场结构化内容、解锁计算与纯状态机；进度层只保存已完成 Boss ID；`IslandBossArena.tsx` 管理选择、阶段交互、焦点和一次性完成上报；`BitIslandApp` 继续拥有本机进度。

**Tech Stack:** React 19、TypeScript 5.9、Node test runner、vinext/Vite、CSS、localStorage、GitHub Pages。

## Task 1：十三岛内容、解锁与状态机

- 新建 `lib/island-boss.ts`、`tests/island-boss.test.mjs`。
- 先断言十三个 Boss 与十三座岛一一对应，每场恰有 4 条证据、2 个正确证据、4 个行动、3 个有序正确行动和 3 个解释。
- 断言只有五课全部完成才解锁，未知或重复 ID 不会误解锁。
- 先写失败测试，再实现 `createIslandBossState`、`toggleBossEvidence`、`queueBossAction`、`removeBossAction`、`submitBossPhase`、`advanceBossPhase`。
- 覆盖错误保留输入、正确三阶段推进、双击防护、队列去重与上限、完成后稳定。
- 提交：`feat: add thirteen island boss engines`。

## Task 2：安全保存 Boss 点亮记录

- 修改 `lib/progress.mjs`、`lib/progress-backup.ts`、`lib/catalog-progress.ts`、`components/ParentPanel.tsx` 及三组进度测试。
- `completedBossIds` 只允许十三个已知 Boss ID、去重、最多十三项；旧记录为空数组。
- `completeIslandBoss` 只接受已知且当前已解锁的 Boss，非法输入返回原对象。
- 重置清空；备份、恢复、目录清洗显式白名单复制，不透传阶段答案。
- 提交：`feat: persist private island boss victories`。

## Task 3：Boss 战界面与地图接线

- 新建 `components/IslandBossArena.tsx`、`tests/island-boss-component.test.mjs`。
- 先断言锁定进度、下一课按钮、Boss 雷达、三种交互、撤回重排、状态播报、阶段焦点、完成上报和重玩。
- 在 `IslandMap` 的知识闪击赛后、学习计划前接入，导航增加“Boss 战”。
- `BitIslandApp` 通过 `completeIslandBoss` 记录胜利。
- CSS 覆盖桌面/手机、44px 触控、减少动画、强制颜色；渲染测试覆盖新锚点和零状态。
- 提交：`feat: add thirteen island boss arena`。

## Task 4：文档、完整门禁与发布

- README 说明解锁规则、三阶段综合玩法与只保存完成 ID 的隐私边界。
- 完整运行：`npm test && npm run typecheck && npm run lint && npm audit --audit-level=moderate && GITHUB_PAGES_BASE_PATH=/computer-study/ npm run test:pages`。
- 推送 `main`，等待 `deploy-pages.yml` 成功。
- 公网要求 HTTP 200，公开主脚本含“十三岛 Boss 战”“证据扫描”“行动编队”“原理核心”。

