# 逻辑电路实验台实施计划

**Goal:** 构建一个延迟加载、可反复运行真值表并包含自由实验的逻辑电路小游戏。

## Task 1：纯电路引擎

- 新建 `lib/logic-circuit-lab.ts`、`tests/logic-circuit-lab.test.mjs`。
- 先测试 AND/OR/XOR/NOT 的所有输入，六关结构完整、两层槽引用有效。
- 测试运行电路会枚举全部输入组合并比较目标；错误保留选择，正确才能推进；双击、无效门、缺槽、完成后输入均安全。
- 实现确定性轮换与不可变状态机。
- 提交：`feat: add logic circuit puzzle engine`。

## Task 2：互动界面与自由实验

- 新建 `components/LogicCircuitLab.tsx`、`components/LogicCircuitLab.css`、`tests/logic-circuit-component.test.mjs`。
- 锁定态显示两门必修进度和下一课；开放后提供挑战与自由实验入口。
- 挑战界面渲染门槽、连接、真值表、测试反馈、进度与重玩。
- 自由实验渲染 A/B 开关、四种门和带真假文字的输出灯。
- 在 `IslandMap` 通过 `lazy + Suspense` 接到 Boss 战之后、学习计划之前；导航增加“电路台”。
- 更新渲染与性能测试，确保首屏不包含完整游戏实现，懒加载资源进入离线清单。
- 提交：`feat: add replayable logic circuit lab`。

## Task 3：文档、全量门禁与发布

- README 说明玩法、解锁和不保存实验操作。
- 运行 `npm test && npm run typecheck && npm run lint && npm audit --audit-level=moderate && GITHUB_PAGES_BASE_PATH=/computer-study/ npm run test:pages`。
- 推送 `main`，等待 GitHub Pages 成功；公网脚本确认“逻辑电路实验台”“运行全部输入”“自由实验”。

