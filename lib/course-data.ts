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
    title: "搜索与链接导航", summary: "关键词、结果线索、链接和标签页。", skill: "信息检索", minutes: 9, difficulty: 2, playable: false,
  },
  {
    id: "downloads-and-cloud", islandId: "network-bay", order: 29,
    title: "下载、上传与云端", summary: "本机副本、传输、同步与共享。", skill: "网络文件", minutes: 9, difficulty: 2, playable: false,
  },
  {
    id: "network-troubleshooting", islandId: "network-bay", order: 30,
    title: "网络信号侦察", summary: "离线、弱信号、服务器和地址问题。", skill: "网络排障", minutes: 9, difficulty: 3, playable: false,
  },
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
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((course) => course.id === id);
}

export function getNextPlayableCourse(
  completedCourseIds: readonly string[],
): Course | undefined {
  return COURSES.find(
    (course) => course.playable && !completedCourseIds.includes(course.id),
  );
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
