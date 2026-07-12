import type { AdvancedIslandId } from "./course-ids.ts";

export interface AdvancedParentCoachCard {
  islandId: AdvancedIslandId;
  title: string;
  bigIdea: string;
  misconception: string;
  questions: readonly [string, string];
  offlineActivity: string;
}

export const ADVANCED_PARENT_COACH: readonly AdvancedParentCoachCard[] = [
  { islandId: "data-structures", title: "数据结构", bigIdea: "重点不是记住名字，而是根据任务选择合适的信息组织方式。", misconception: "孩子可能以为数组、树和图只是不同画法，其实它们允许的访问与连接规则不同。", questions: ["如果要公平排队，你会选栈还是队列？为什么？", "如果地点能连接很多方向，一条直线还够用吗？"], offlineActivity: "用便签做节点、毛线做连接，让孩子把家庭房间画成一张小图。" },
  { islandId: "algorithm-arena", title: "算法", bigIdea: "同一问题可以有多种正确方法，还要比较步骤、条件和工作量。", misconception: "孩子可能把最快理解为第一次碰巧更快，要提醒他用相同输入重复比较。", questions: ["这个方法每一步排除了哪些不可能？", "资料变成两倍多时，步骤会增加多少？"], offlineActivity: "准备一叠排好序的数字卡，一人藏目标，一人用逐个找和对半找比赛并计步。" },
  { islandId: "os-control-tower", title: "操作系统", bigIdea: "操作系统像总管，在有限的处理器、内存、文件和设备之间协调多个任务。", misconception: "孩子可能以为多个程序真的在同一瞬间一起跑，可以用快速轮流解释时间片。", questions: ["这个任务为什么现在要等待？", "任务结束后，哪些资源应该还给系统？"], offlineActivity: "用一支笔当 CPU，三个人轮流拿一小段时间，体验时间片调度。" },
  { islandId: "systems-network-depths", title: "计算机组成与网络", bigIdea: "信息在每一层都有明确任务，从 CPU 周期到网络传输都依靠可检查的步骤。", misconception: "孩子可能把缓存当成永久仓库，或以为网络丢包后整条消息只能从头发送。", questions: ["现在的信息在哪里，下一站是谁？", "如果这一块没确认，最小的补救动作是什么？"], offlineActivity: "把一句话剪成编号纸条，故意藏起一张，用确认和重传把消息重新拼完整。" },
] as const;
