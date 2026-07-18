# CPU 时间片调度台实施计划

1. 编写失败优先测试，定义六套任务、装入容量和轮转执行规则。
2. 实现 `lib/cpu-scheduler-game.ts` 的不可变有界状态机。
3. 编写组件契约测试并实现懒加载 `CpuSchedulerGame.tsx` 与独立 CSS。
4. 接入 `IslandMap`，补充渲染、README 与隐私说明。
5. 执行完整测试、类型、lint、审计、Pages 预算，提交推送并验证公网。
