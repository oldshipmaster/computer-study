import type { AdvancedCourseId } from "./course-ids.ts";

export interface FoundationPracticeQuestion {
  id: string;
  domain: "数据结构" | "算法" | "操作系统" | "系统与网络";
  courseId: AdvancedCourseId;
  prompt: string;
  options: readonly [string, string, string];
  answer: string;
  explanation: string;
}

const BANK: readonly (readonly FoundationPracticeQuestion[])[] = [
  [
    { id: "array-index", domain: "数据结构", courseId: "array-lockers", prompt: "数组 [星星, 月亮, 火箭] 中，索引 1 是什么？", options: ["月亮", "星星", "火箭"], answer: "月亮", explanation: "数组索引从 0 开始，所以索引 1 是第二项。" },
    { id: "queue-first", domain: "数据结构", courseId: "stack-queue-dock", prompt: "小鲸、海星、海豚依次排队，谁先离开队列？", options: ["小鲸", "海豚", "海星"], answer: "小鲸", explanation: "队列先进先出，最先加入的小鲸先离开。" },
    { id: "graph-edge", domain: "数据结构", courseId: "graph-routes", prompt: "图中两个地点之间可以直接移动，需要有什么？", options: ["连接它们的边", "相同的名字", "相同的颜色"], answer: "连接它们的边", explanation: "图用边表示节点之间可以直接到达。" },
  ],
  [
    { id: "binary-half", domain: "算法", courseId: "binary-search", prompt: "二分搜索比较中间值后，下一步是什么？", options: ["排除不可能的一半", "重新随机猜", "删除全部资料"], answer: "排除不可能的一半", explanation: "资料有序时，大小关系能排除一半范围。" },
    { id: "sort-neighbor", domain: "算法", courseId: "bubble-sort", prompt: "冒泡排序每一步比较谁？", options: ["相邻的两个项目", "第一项和最后一项", "三个随机项目"], answer: "相邻的两个项目", explanation: "冒泡排序沿序列比较相邻项目，顺序错就交换。" },
    { id: "cost-proof", domain: "算法", courseId: "algorithm-efficiency", prompt: "公平比较两个算法，输入应该怎样？", options: ["使用相同输入", "一个多一个少", "完全不运行"], answer: "使用相同输入", explanation: "相同输入下记录步骤数，比较才有意义。" },
  ],
  [
    { id: "process-wait", domain: "操作系统", courseId: "program-process", prompt: "进程正在等键盘输入，它处于什么状态？", options: ["等待", "运行", "完成"], answer: "等待", explanation: "缺少输入时进程无法继续，会进入等待状态。" },
    { id: "memory-release", domain: "操作系统", courseId: "memory-allocation", prompt: "任务结束后，内存空间应该怎样？", options: ["释放并复用", "永久占用", "变成键盘"], answer: "释放并复用", explanation: "操作系统回收已结束任务的空间，供新任务使用。" },
    { id: "device-order", domain: "操作系统", courseId: "device-coordination", prompt: "多份作业共享一台打印机，怎样避免混乱？", options: ["排成设备队列", "同时覆盖打印", "随机删除作业"], answer: "排成设备队列", explanation: "设备队列让请求按顺序获得共享设备。" },
  ],
  [
    { id: "cycle-order", domain: "系统与网络", courseId: "instruction-cycle", prompt: "取指之后，CPU 的下一阶段通常是什么？", options: ["译码", "写回", "关机"], answer: "译码", explanation: "CPU 先取到指令，再译码理解需要执行的操作。" },
    { id: "layer-unpack", domain: "系统与网络", courseId: "network-layers", prompt: "网络消息到达后，包装按什么顺序拆？", options: ["从外到内", "从内到外", "永远不拆"], answer: "从外到内", explanation: "发送时逐层向外包装，接收时从最外层反向拆开。" },
    { id: "ack-missing", domain: "系统与网络", courseId: "reliable-transfer", prompt: "发送方没等到数据块确认，超时后应该做什么？", options: ["重传缺失块", "假装成功", "删除接收方"], answer: "重传缺失块", explanation: "确认和超时让发送方发现丢失并进行重传。" },
  ],
] as const;

export function createFoundationPractice(seed: number): FoundationPracticeQuestion[] {
  const safeSeed = Number.isFinite(seed) ? Math.abs(Math.floor(seed)) : 0;
  return BANK.map((questions, domainIndex) => questions[(safeSeed + domainIndex) % questions.length]);
}
