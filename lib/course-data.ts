import { ADVANCED_ISLAND_COURSE_IDS } from "./advanced-foundations/course-ids.ts";

export interface Course {
  id: string;
  islandId: string;
  order: number;
  title: string;
  summary: string;
  skill: string;
  minutes: number;
  difficulty: 1 | 2 | 3;
  playable: boolean;
}

export interface Island {
  id: string;
  name: string;
  subtitle: string;
  accent: string;
  icon: string;
  courseIds: string[];
}

export type CourseCardState = "completed" | "available" | "upcoming";

export const COURSES: Course[] = [
  {
    id: "keyboard-flight",
    islandId: "launch-harbor",
    order: 1,
    title: "键盘驾驶飞船",
    summary: "方向键、空格键、顺序执行。",
    skill: "键盘与顺序",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "mouse-precision",
    islandId: "launch-harbor",
    order: 2,
    title: "鼠标精准训练",
    summary: "移动、单击、双击和拖放。",
    skill: "鼠标操作",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "bilingual-input",
    islandId: "launch-harbor",
    order: 3,
    title: "中英文输入站",
    summary: "字母、数字、中文输入与退格键。",
    skill: "文字输入",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "desktop-adventure",
    islandId: "launch-harbor",
    order: 4,
    title: "桌面探险",
    summary: "窗口、图标、任务栏和程序切换。",
    skill: "桌面操作",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "program-landing",
    islandId: "launch-harbor",
    order: 5,
    title: "程序安全起降",
    summary: "打开、保存、关闭和正确退出。",
    skill: "程序操作",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "file-home",
    islandId: "file-forest",
    order: 6,
    title: "文件住在哪里",
    summary: "理解文件与文件夹。",
    skill: "文件管理",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "name-your-work",
    islandId: "file-forest",
    order: 7,
    title: "给作品起名字",
    summary: "文件命名和保存位置。",
    skill: "文件管理",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "move-and-copy",
    islandId: "file-forest",
    order: 8,
    title: "搬家与复制术",
    summary: "移动、复制和粘贴。",
    skill: "文件管理",
    minutes: 9,
    difficulty: 2,
    playable: true,
  },
  {
    id: "file-types",
    islandId: "file-forest",
    order: 9,
    title: "图片、文字与声音",
    summary: "认识常见文件类型。",
    skill: "文件类型",
    minutes: 9,
    difficulty: 2,
    playable: true,
  },
  {
    id: "learning-backpack",
    islandId: "file-forest",
    order: 10,
    title: "整理学习背包",
    summary: "建立并整理个人资料结构。",
    skill: "文件整理",
    minutes: 9,
    difficulty: 2,
    playable: true,
  },
  {
    id: "instruction-order",
    islandId: "robot-workshop",
    order: 11,
    title: "指令排排队",
    summary: "理解程序怎样从上到下顺序执行。",
    skill: "顺序执行",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "grid-city-navigation",
    islandId: "robot-workshop",
    order: 12,
    title: "方格城导航",
    summary: "认识方向与二维坐标。",
    skill: "坐标导航",
    minutes: 9,
    difficulty: 2,
    playable: true,
  },
  {
    id: "repeat-power",
    islandId: "robot-workshop",
    order: 13,
    title: "重复的力量",
    summary: "固定次数循环。",
    skill: "循环",
    minutes: 9,
    difficulty: 2,
    playable: true,
  },
  {
    id: "rainy-condition",
    islandId: "robot-workshop",
    order: 14,
    title: "如果下雨就撑伞",
    summary: "根据真假条件选择不同的行动分支。",
    skill: "条件判断",
    minutes: 9,
    difficulty: 2,
    playable: true,
  },
  {
    id: "bug-catcher",
    islandId: "robot-workshop",
    order: 15,
    title: "抓住小虫子",
    summary: "发现、解释和修复错误。",
    skill: "调试",
    minutes: 9,
    difficulty: 3,
    playable: true,
  },
  {
    id: "password-guardian",
    islandId: "safety-lighthouse",
    order: 16,
    title: "密码守护术",
    summary: "长密码与不共享原则。",
    skill: "账号安全",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "private-information",
    islandId: "safety-lighthouse",
    order: 17,
    title: "什么信息不能说",
    summary: "识别个人信息。",
    skill: "隐私安全",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "popup-fog",
    islandId: "safety-lighthouse",
    order: 18,
    title: "弹窗迷雾",
    summary: "识别广告、下载和可疑提示。",
    skill: "网络安全",
    minutes: 9,
    difficulty: 2,
    playable: true,
  },
  {
    id: "healthy-computer-habits",
    islandId: "safety-lighthouse",
    order: 19,
    title: "健康电脑习惯",
    summary: "坐姿、距离、时长与休息。",
    skill: "健康使用",
    minutes: 9,
    difficulty: 1,
    playable: true,
  },
  {
    id: "light-bit-island",
    islandId: "safety-lighthouse",
    order: 20,
    title: "点亮比特岛",
    summary: "综合运用文件、键盘与编程知识。",
    skill: "综合挑战",
    minutes: 9,
    difficulty: 3,
    playable: true,
  },
  {
    id: "input-process-output", islandId: "hardware-lab", order: 21,
    title: "信息加工流水线", summary: "输入、处理与输出。", skill: "计算机原理", minutes: 9, difficulty: 1, playable: true,
  },
  {
    id: "cpu-memory-storage", islandId: "hardware-lab", order: 22,
    title: "处理器、内存与存储", summary: "工作台、短期记忆和长期仓库。", skill: "计算机硬件", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "bits-and-data", islandId: "hardware-lab", order: 23,
    title: "0 和 1 的数据积木", summary: "用比特表示数字、颜色与符号。", skill: "数字与数据", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "hardware-software", islandId: "hardware-lab", order: 24,
    title: "硬件与软件搭档", summary: "物理部件和程序怎样合作。", skill: "系统概念", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "troubleshoot-machine", islandId: "hardware-lab", order: 25,
    title: "电脑小医生", summary: "观察、检查、改变一处、再测试。", skill: "设备排障", minutes: 9, difficulty: 3, playable: true,
  },
  {
    id: "network-journey", islandId: "network-bay", order: 26,
    title: "消息怎样穿过网络", summary: "设备、路由器、网络与服务器。", skill: "网络原理", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "web-address", islandId: "network-bay", order: 27,
    title: "网址是网络地址", summary: "网站身份、虚拟 DNS、路径与仿冒地址。", skill: "网址与名字解析", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "search-and-links", islandId: "network-bay", order: 28,
    title: "搜索与链接导航", summary: "关键词、结果线索、链接和标签页。", skill: "信息检索", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "downloads-and-cloud", islandId: "network-bay", order: 29,
    title: "下载、上传与云端", summary: "本机副本、传输、同步与共享。", skill: "网络文件", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "network-troubleshooting", islandId: "network-bay", order: 30,
    title: "网络信号侦察", summary: "离线、弱信号、服务器和地址问题。", skill: "网络排障", minutes: 9, difficulty: 3, playable: true,
  },
  {
    id: "pixel-art", islandId: "creative-workshop", order: 31,
    title: "像素画小工坊", summary: "像素、分辨率、颜色与图片格式。", skill: "数字图像", minutes: 9, difficulty: 1, playable: true,
  },
  {
    id: "document-design", islandId: "creative-workshop", order: 32,
    title: "文档排版设计", summary: "标题层级、段落、图片说明与导出。", skill: "文档创作", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "slide-story", islandId: "creative-workshop", order: 33,
    title: "幻灯片故事航线", summary: "顺序、重点、图像与口头表达。", skill: "演示表达", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "media-copyright", islandId: "creative-workshop", order: 34,
    title: "媒体与版权侦探", summary: "创作者、许可、引用与署名。", skill: "数字版权", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "data-table", islandId: "creative-workshop", order: 35,
    title: "数据表格实验", summary: "行列、统一格式、筛选与图表。", skill: "数据素养", minutes: 9, difficulty: 3, playable: true,
  },
  {
    id: "email-message", islandId: "future-station", order: 36,
    title: "电子邮件通信", summary: "收件人、主题、正文、附件与发送检查。", skill: "数字沟通", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "online-collaboration", islandId: "future-station", order: 37,
    title: "在线协作实验室", summary: "分工、评论、版本与共享权限。", skill: "在线协作", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "ai-helper", islandId: "future-station", order: 38,
    title: "AI 助手使用入门", summary: "清楚提问、保护隐私、核对并修改。", skill: "AI 素养", minutes: 9, difficulty: 2, playable: true,
  },
  {
    id: "verify-ai", islandId: "future-station", order: 39,
    title: "AI 信息核验站", summary: "拆分主张、查找来源、交叉核对。", skill: "事实核验", minutes: 9, difficulty: 3, playable: true,
  },
  {
    id: "digital-project", islandId: "future-station", order: 40,
    title: "数字项目总挑战", summary: "问题、计划、创作、测试、分享与反思。", skill: "综合项目", minutes: 10, difficulty: 3, playable: true,
  },
  { id: "events-handlers", islandId: "code-spaceport", order: 41, title: "事件启动器", summary: "按键、点击、计时与事件处理器。", skill: "事件编程", minutes: 9, difficulty: 2, playable: true },
  { id: "variables-score", islandId: "code-spaceport", order: 42, title: "变量能量箱", summary: "读取、更新和追踪程序状态。", skill: "变量", minutes: 9, difficulty: 2, playable: true },
  { id: "functions-tools", islandId: "code-spaceport", order: 43, title: "函数工具箱", summary: "定义、调用、参数、返回与复用。", skill: "函数", minutes: 9, difficulty: 3, playable: true },
  { id: "boolean-logic", islandId: "code-spaceport", order: 44, title: "真假逻辑门", summary: "并且、或者、不是与组合条件。", skill: "布尔逻辑", minutes: 9, difficulty: 3, playable: true },
  { id: "game-design", islandId: "code-spaceport", order: 45, title: "小游戏设计总装", summary: "目标、事件、变量、循环与试玩。", skill: "游戏设计", minutes: 10, difficulty: 3, playable: true },
  { id: "array-lockers", islandId: "data-structures", order: 46, title: "数组储物柜", summary: "用连续编号快速找到资料。", skill: "数组", minutes: 9, difficulty: 2, playable: true },
  { id: "linked-treasure", islandId: "data-structures", order: 47, title: "链表寻宝队", summary: "跟随下一站线索连接资料。", skill: "链表", minutes: 9, difficulty: 2, playable: true },
  { id: "stack-queue-dock", islandId: "data-structures", order: 48, title: "栈与队列码头", summary: "比较后进先出和先进先出。", skill: "栈与队列", minutes: 9, difficulty: 2, playable: true },
  { id: "tree-library", islandId: "data-structures", order: 49, title: "树形图书馆", summary: "从根节点沿分支整理资料。", skill: "树结构", minutes: 9, difficulty: 3, playable: true },
  { id: "graph-routes", islandId: "data-structures", order: 50, title: "图结构航线", summary: "用节点和边表示复杂连接。", skill: "图结构", minutes: 9, difficulty: 3, playable: true },
  { id: "linear-search", islandId: "algorithm-arena", order: 51, title: "逐个搜索赛", summary: "从头开始逐项寻找目标。", skill: "线性搜索", minutes: 9, difficulty: 2, playable: true },
  { id: "binary-search", islandId: "algorithm-arena", order: 52, title: "对半搜索赛", summary: "在有序资料中不断缩小范围。", skill: "二分搜索", minutes: 9, difficulty: 3, playable: true },
  { id: "bubble-sort", islandId: "algorithm-arena", order: 53, title: "冒泡排序池", summary: "比较邻居并交换错误顺序。", skill: "排序算法", minutes: 9, difficulty: 3, playable: true },
  { id: "task-decomposition", islandId: "algorithm-arena", order: 54, title: "任务拆解工坊", summary: "先完成依赖，再组合大任务。", skill: "任务分解", minutes: 9, difficulty: 2, playable: true },
  { id: "algorithm-efficiency", islandId: "algorithm-arena", order: 55, title: "算法效率擂台", summary: "比较不同方法需要多少步。", skill: "算法效率", minutes: 10, difficulty: 3, playable: true },
  { id: "program-process", islandId: "os-control-tower", order: 56, title: "程序变进程", summary: "观察程序运行时的状态变化。", skill: "进程状态", minutes: 9, difficulty: 2, playable: true },
  { id: "cpu-scheduling", islandId: "os-control-tower", order: 57, title: "CPU 调度台", summary: "让多个任务轮流使用处理器。", skill: "CPU 调度", minutes: 10, difficulty: 3, playable: true },
  { id: "memory-allocation", islandId: "os-control-tower", order: 58, title: "内存分配站", summary: "为任务申请、使用和释放内存。", skill: "内存管理", minutes: 9, difficulty: 3, playable: true },
  { id: "file-system-tree", islandId: "os-control-tower", order: 59, title: "文件系统树", summary: "理解路径如何穿过层层目录。", skill: "文件系统", minutes: 9, difficulty: 2, playable: true },
  { id: "device-coordination", islandId: "os-control-tower", order: 60, title: "设备协调队", summary: "排队共享打印机等外部设备。", skill: "设备管理", minutes: 9, difficulty: 3, playable: true },
  { id: "instruction-cycle", islandId: "systems-network-depths", order: 61, title: "指令周期潜航", summary: "取指、译码、执行再写回。", skill: "计算机组成", minutes: 9, difficulty: 3, playable: true },
  { id: "cache-station", islandId: "systems-network-depths", order: 62, title: "高速缓存中转站", summary: "用更近的存储加快访问。", skill: "存储层次", minutes: 9, difficulty: 3, playable: true },
  { id: "network-layers", islandId: "systems-network-depths", order: 63, title: "网络分层潜水艇", summary: "消息逐层包装，再逐层拆开。", skill: "网络分层", minutes: 9, difficulty: 3, playable: true },
  { id: "routing-maze", islandId: "systems-network-depths", order: 64, title: "路由迷宫", summary: "比较路线代价并寻找更短路径。", skill: "路由算法", minutes: 10, difficulty: 3, playable: true },
  { id: "reliable-transfer", islandId: "systems-network-depths", order: 65, title: "可靠传输救援", summary: "用编号、确认和重传防止丢包。", skill: "可靠传输", minutes: 10, difficulty: 3, playable: true },
];

export const ISLANDS: Island[] = [
  {
    id: "launch-harbor",
    name: "启航港",
    subtitle: "从键盘和鼠标出发",
    accent: "coral",
    icon: "🚀",
    courseIds: [
      "keyboard-flight",
      "mouse-precision",
      "bilingual-input",
      "desktop-adventure",
      "program-landing",
    ],
  },
  {
    id: "file-forest",
    name: "文件森林",
    subtitle: "给每份作品找到家",
    accent: "mint",
    icon: "🌳",
    courseIds: [
      "file-home",
      "name-your-work",
      "move-and-copy",
      "file-types",
      "learning-backpack",
    ],
  },
  {
    id: "robot-workshop",
    name: "机器人工坊",
    subtitle: "把好想法变成指令",
    accent: "yellow",
    icon: "🤖",
    courseIds: [
      "instruction-order",
      "grid-city-navigation",
      "repeat-power",
      "rainy-condition",
      "bug-catcher",
    ],
  },
  {
    id: "safety-lighthouse",
    name: "安全灯塔",
    subtitle: "学会保护自己和电脑",
    accent: "sky",
    icon: "🔦",
    courseIds: [
      "password-guardian",
      "private-information",
      "popup-fog",
      "healthy-computer-habits",
      "light-bit-island",
    ],
  },
  {
    id: "hardware-lab",
    name: "硬件实验岛",
    subtitle: "看懂电脑内部怎样工作",
    accent: "yellow",
    icon: "⚙️",
    courseIds: ["input-process-output", "cpu-memory-storage", "bits-and-data", "hardware-software", "troubleshoot-machine"],
  },
  {
    id: "network-bay",
    name: "网络海湾",
    subtitle: "跟随信息穿过互联网",
    accent: "sky",
    icon: "🌐",
    courseIds: ["network-journey", "web-address", "search-and-links", "downloads-and-cloud", "network-troubleshooting"],
  },
  {
    id: "creative-workshop",
    name: "创作工坊",
    subtitle: "用电脑清楚地创作与表达",
    accent: "coral",
    icon: "🎨",
    courseIds: ["pixel-art", "document-design", "slide-story", "media-copyright", "data-table"],
  },
  {
    id: "future-station",
    name: "未来协作站",
    subtitle: "负责任地沟通、协作和使用 AI",
    accent: "mint",
    icon: "🛰️",
    courseIds: ["email-message", "online-collaboration", "ai-helper", "verify-ai", "digital-project"],
  },
  { id: "code-spaceport", name: "代码星港", subtitle: "用事件、变量和函数造游戏", accent: "yellow", icon: "🧩", courseIds: ["events-handlers", "variables-score", "functions-tools", "boolean-logic", "game-design"] },
  { id: "data-structures", name: "数据结构群岛", subtitle: "选择合适的方式组织信息", accent: "mint", icon: "🗂️", courseIds: [...ADVANCED_ISLAND_COURSE_IDS["data-structures"]] },
  { id: "algorithm-arena", name: "算法竞技场", subtitle: "比较解决问题的步骤和效率", accent: "coral", icon: "🏁", courseIds: [...ADVANCED_ISLAND_COURSE_IDS["algorithm-arena"]] },
  { id: "os-control-tower", name: "操作系统控制塔", subtitle: "协调任务、内存、文件和设备", accent: "yellow", icon: "🎛️", courseIds: [...ADVANCED_ISLAND_COURSE_IDS["os-control-tower"]] },
  { id: "systems-network-depths", name: "系统与网络深海站", subtitle: "潜入指令、存储和网络深处", accent: "sky", icon: "🌊", courseIds: [...ADVANCED_ISLAND_COURSE_IDS["systems-network-depths"]] },
];

export const RECOMMENDED_ROUTE_IDS: string[] = Array.from(
  { length: Math.max(...ISLANDS.map((island) => island.courseIds.length)) },
  (_, round) => ISLANDS.flatMap((island) => island.courseIds[round] ?? []),
).flat();

export const CURRICULUM_FACTS = Object.freeze({
  islandCount: ISLANDS.length,
  courseCount: COURSES.length,
  minutesPerCourse: Object.freeze({
    minimum: Math.min(...COURSES.map((course) => course.minutes)),
    maximum: Math.max(...COURSES.map((course) => course.minutes)),
  }),
});

export function getCourse(id: string): Course | undefined {
  return COURSES.find((course) => course.id === id);
}

export function getNextPlayableCourse(
  completedCourseIds: readonly string[],
): Course | undefined {
  const completed = new Set(completedCourseIds);
  return RECOMMENDED_ROUTE_IDS
    .map((courseId) => getCourse(courseId))
    .find((course) => course?.playable && !completed.has(course.id));
}

export function getMapMission(completedCourseIds: readonly string[]): {
  course: Course | undefined;
  complete: boolean;
};
export function getMapMission(completedCourseIds: readonly string[], resume?: { courseId: string; stage: number } | null): {
  course: Course | undefined;
  complete: boolean;
};
export function getMapMission(completedCourseIds: readonly string[], resume?: { courseId: string; stage: number } | null): {
  course: Course | undefined;
  complete: boolean;
} {
  const playableCourses = COURSES.filter((course) => course.playable);
  const nextCourse = getNextPlayableCourse(completedCourseIds);
  const resumeCourse = resume && Number.isInteger(resume.stage) && resume.stage >= 0 && resume.stage <= 5 && !completedCourseIds.includes(resume.courseId) ? getCourse(resume.courseId) : undefined;
  return {
    course: resumeCourse?.playable ? resumeCourse : nextCourse ?? playableCourses[0],
    complete:
      playableCourses.length > 0 &&
      playableCourses.every((course) => completedCourseIds.includes(course.id)),
  };
}

export function getCourseCardState(
  course: Course,
  completedCourseIds: readonly string[],
): CourseCardState {
  if (completedCourseIds.includes(course.id)) {
    return "completed";
  }

  return course.playable ? "available" : "upcoming";
}
