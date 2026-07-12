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
    summary: "顺序执行。",
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
    summary: "条件判断。",
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
    title: "网址是网络地址", summary: "网站身份、路径与仿冒地址。", skill: "网址识别", minutes: 9, difficulty: 2, playable: true,
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
];

export const RECOMMENDED_ROUTE_IDS: string[] = Array.from(
  { length: Math.max(...ISLANDS.map((island) => island.courseIds.length)) },
  (_, round) => ISLANDS.flatMap((island) => island.courseIds[round] ?? []),
).flat();

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
} {
  const playableCourses = COURSES.filter((course) => course.playable);
  const nextCourse = getNextPlayableCourse(completedCourseIds);
  return {
    course: nextCourse ?? playableCourses[0],
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
