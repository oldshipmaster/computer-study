export interface FoundationCapstoneMission {
  id: "organize-find" | "process-input" | "cpu-data" | "route-loss" | "design-system";
  domains: readonly string[];
  prompt: string;
  options: readonly [string, string, string];
  answer: string;
  explanation: string;
}

export const FOUNDATION_CAPSTONE: readonly FoundationCapstoneMission[] = [
  { id: "organize-find", domains: ["数据结构", "算法"], prompt: "探险队有很多按编号排好序的装备，要快速找到 42 号。哪套方案最合理？", options: ["放进有序数组，再用二分搜索", "随意堆放，再闭眼猜", "每次删除一半但不看大小"], answer: "放进有序数组，再用二分搜索", explanation: "数组让编号位置清楚；保持有序后，二分搜索才能根据大小安全排除一半。" },
  { id: "process-input", domains: ["操作系统", "事件编程"], prompt: "画图程序等待鼠标点击时，CPU 应该怎样安排？", options: ["让画图进程等待，先运行其他就绪任务", "让它一直占着 CPU 空等", "删除画图程序文件"], answer: "让画图进程等待，先运行其他就绪任务", explanation: "鼠标点击是事件；输入还没到时进程进入等待，调度器把 CPU 交给能继续的任务。" },
  { id: "cpu-data", domains: ["计算机组成", "数据结构"], prompt: "CPU 反复读取同一张小地图，怎样减少等待？", options: ["把常用地图保留在缓存，并用索引定位", "每次都从最慢存储重新找", "把地图变成真实住址"], answer: "把常用地图保留在缓存，并用索引定位", explanation: "缓存缩短常用数据的访问距离，索引则帮助程序准确找到需要的位置。" },
  { id: "route-loss", domains: ["网络路由", "可靠传输"], prompt: "路线 A 中断，而且 1 号数据块没有确认，发送方应该怎样处理？", options: ["改走可达路线并重传 1 号块", "继续走中断路线并假装收到", "把所有编号改成 0"], answer: "改走可达路线并重传 1 号块", explanation: "路由先排除不可达链路；可靠传输再根据编号和确认，只重传缺失的数据块。" },
  { id: "design-system", domains: ["数据结构", "算法", "操作系统", "网络"], prompt: "设计多人寻宝游戏时，哪项计划最完整？", options: ["选结构组织地图，写算法，测试资源调度和丢包恢复", "只挑漂亮颜色", "不测试就直接公开"], answer: "选结构组织地图，写算法，测试资源调度和丢包恢复", explanation: "完整系统需要组织数据、解决问题、管理有限资源，还要面对网络变化并用测试验证。" },
] as const;
