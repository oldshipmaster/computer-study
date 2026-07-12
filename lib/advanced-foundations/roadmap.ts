import type { AdvancedCourseId, AdvancedIslandId } from "./course-ids.ts";

export interface FoundationRoadmapThread {
  islandId: AdvancedIslandId;
  title: string;
  icon: string;
  bigQuestion: string;
  steps: readonly { courseId: AdvancedCourseId; label: string; connection: string }[];
}

export const FOUNDATION_ROADMAP: readonly FoundationRoadmapThread[] = [
  { islandId: "data-structures", title: "信息怎样摆放", icon: "🗂️", bigQuestion: "同一批信息，为什么换一种摆法就更容易找到和修改？", steps: [
    { courseId: "array-lockers", label: "排成一列", connection: "先用编号快速定位" },
    { courseId: "linked-treasure", label: "用线索串联", connection: "再理解不连续的连接" },
    { courseId: "stack-queue-dock", label: "规定进出顺序", connection: "为取出次序选择规则" },
    { courseId: "tree-library", label: "分层建立目录", connection: "把一条线扩展成层级" },
    { courseId: "graph-routes", label: "连接复杂网络", connection: "最后表达多方向关系" },
  ] },
  { islandId: "algorithm-arena", title: "步骤怎样变聪明", icon: "🏁", bigQuestion: "两个方法都能得到答案时，怎样用证据判断哪个更合适？", steps: [
    { courseId: "linear-search", label: "逐个寻找", connection: "建立最直观的基准" },
    { courseId: "binary-search", label: "每次减半", connection: "利用有序信息加速" },
    { courseId: "bubble-sort", label: "整理顺序", connection: "为快速查找准备数据" },
    { courseId: "task-decomposition", label: "拆开大任务", connection: "让步骤依赖清楚可见" },
    { courseId: "algorithm-efficiency", label: "比较工作量", connection: "用操作次数做出选择" },
  ] },
  { islandId: "os-control-tower", title: "系统怎样当总管", icon: "🎛️", bigQuestion: "很多程序同时想用电脑时，操作系统怎样维持公平和秩序？", steps: [
    { courseId: "program-process", label: "管理运行任务", connection: "先认识任务的状态" },
    { courseId: "cpu-scheduling", label: "轮流使用 CPU", connection: "再公平安排谁先运行" },
    { courseId: "memory-allocation", label: "分配工作空间", connection: "为任务划分有限内存" },
    { courseId: "file-system-tree", label: "组织长期资料", connection: "把内容放进目录树" },
    { courseId: "device-coordination", label: "共享外部设备", connection: "最后协调设备请求" },
  ] },
  { islandId: "systems-network-depths", title: "底层怎样传递信息", icon: "🌊", bigQuestion: "从 CPU 的一个节拍到网络的远方，信息怎样被快速又可靠地传递？", steps: [
    { courseId: "instruction-cycle", label: "执行一条指令", connection: "从 CPU 的基本节拍出发" },
    { courseId: "cache-station", label: "缩短等待距离", connection: "用多级存储层次加速" },
    { courseId: "network-layers", label: "逐层包装消息", connection: "把复杂通信任务分层" },
    { courseId: "routing-maze", label: "选择传输路线", connection: "让数据跨网络前进" },
    { courseId: "reliable-transfer", label: "发现丢失重传", connection: "保证消息完整到达" },
  ] },
] as const;
