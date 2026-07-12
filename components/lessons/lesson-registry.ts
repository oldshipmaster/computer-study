import { KeyboardFlightLesson } from "@/components/KeyboardFlightLesson";
import { MousePrecisionLesson } from "@/components/lessons/MousePrecisionLesson";
import { BilingualInputLesson } from "@/components/lessons/BilingualInputLesson";
import { DesktopAdventureLesson } from "@/components/lessons/DesktopAdventureLesson";
import { ProgramLandingLesson } from "@/components/lessons/ProgramLandingLesson";
import { PasswordGuardianLesson } from "@/components/lessons/PasswordGuardianLesson";
import { PopupFogLesson } from "@/components/lessons/PopupFogLesson";
import { LightBitIslandLesson } from "@/components/lessons/LightBitIslandLesson";
import type { LessonDefinition } from "@/components/lessons/types";
import { lazy } from "react";

const advancedLesson = <T extends Record<string, unknown>>(loader: () => Promise<T>, name: keyof T) => lazy(async () => ({ default: (await loader())[name] as LessonDefinition["Component"] }));
const InstructionOrderLesson = advancedLesson(() => import("@/components/lessons/InstructionOrderLesson"), "InstructionOrderLesson");
const GridCityNavigationLesson = advancedLesson(() => import("@/components/lessons/GridCityNavigationLesson"), "GridCityNavigationLesson");
const RepeatPowerLesson = advancedLesson(() => import("@/components/lessons/RepeatPowerLesson"), "RepeatPowerLesson");
const RainyConditionLesson = advancedLesson(() => import("@/components/lessons/RainyConditionLesson"), "RainyConditionLesson");
const BugCatcherLesson = advancedLesson(() => import("@/components/lessons/BugCatcherLesson"), "BugCatcherLesson");
const InputProcessOutputLesson = advancedLesson(() => import("@/components/lessons/InputProcessOutputLesson"), "InputProcessOutputLesson");
const CpuMemoryStorageLesson = advancedLesson(() => import("@/components/lessons/CpuMemoryStorageLesson"), "CpuMemoryStorageLesson");
const BitsAndDataLesson = advancedLesson(() => import("@/components/lessons/BitsAndDataLesson"), "BitsAndDataLesson");
const HardwareSoftwareLesson = advancedLesson(() => import("@/components/lessons/HardwareSoftwareLesson"), "HardwareSoftwareLesson");
const TroubleshootMachineLesson = advancedLesson(() => import("@/components/lessons/TroubleshootMachineLesson"), "TroubleshootMachineLesson");
const FileHomeLesson = advancedLesson(() => import("@/components/lessons/FileHomeLesson"), "FileHomeLesson");
const NameYourWorkLesson = advancedLesson(() => import("@/components/lessons/NameYourWorkLesson"), "NameYourWorkLesson");
const MoveAndCopyLesson = advancedLesson(() => import("@/components/lessons/MoveAndCopyLesson"), "MoveAndCopyLesson");
const FileTypesLesson = advancedLesson(() => import("@/components/lessons/FileTypesLesson"), "FileTypesLesson");
const LearningBackpackLesson = advancedLesson(() => import("@/components/lessons/LearningBackpackLesson"), "LearningBackpackLesson");
const NetworkJourneyLesson = advancedLesson(() => import("@/components/lessons/NetworkJourneyLesson"), "NetworkJourneyLesson");
const WebAddressLesson = advancedLesson(() => import("@/components/lessons/WebAddressLesson"), "WebAddressLesson");
const SearchAndLinksLesson = advancedLesson(() => import("@/components/lessons/SearchAndLinksLesson"), "SearchAndLinksLesson");
const DownloadsCloudLesson = advancedLesson(() => import("@/components/lessons/DownloadsCloudLesson"), "DownloadsCloudLesson");
const NetworkTroubleshootingLesson = advancedLesson(() => import("@/components/lessons/NetworkTroubleshootingLesson"), "NetworkTroubleshootingLesson");
const HealthyComputerHabitsLesson = advancedLesson(() => import("@/components/lessons/HealthyComputerHabitsLesson"), "HealthyComputerHabitsLesson");
const PrivateInformationLesson = advancedLesson(() => import("@/components/lessons/PrivateInformationLesson"), "PrivateInformationLesson");
const loadCoding = () => import("@/components/lessons/CodingLessons");
const EventsHandlersLesson = advancedLesson(loadCoding, "EventsHandlersLesson");
const VariablesScoreLesson = advancedLesson(loadCoding, "VariablesScoreLesson");
const FunctionsToolsLesson = advancedLesson(loadCoding, "FunctionsToolsLesson");
const BooleanLogicLesson = advancedLesson(loadCoding, "BooleanLogicLesson");
const GameDesignLesson = advancedLesson(loadCoding, "GameDesignLesson");
const loadFuture = () => import("@/components/lessons/FutureLessons");
const EmailMessageLesson = advancedLesson(loadFuture, "EmailMessageLesson");
const OnlineCollaborationLesson = advancedLesson(loadFuture, "OnlineCollaborationLesson");
const AiHelperLesson = advancedLesson(loadFuture, "AiHelperLesson");
const VerifyAiLesson = advancedLesson(loadFuture, "VerifyAiLesson");
const DigitalProjectLesson = advancedLesson(loadFuture, "DigitalProjectLesson");
const loadCreative = () => import("@/components/lessons/CreativeLessons");
const PixelArtLesson = advancedLesson(loadCreative, "PixelArtLesson");
const SlideStoryLesson = advancedLesson(loadCreative, "SlideStoryLesson");
const DocumentDesignLesson = advancedLesson(loadCreative, "DocumentDesignLesson");
const DataTableLesson = advancedLesson(loadCreative, "DataTableLesson");
const MediaCopyrightLesson = advancedLesson(loadCreative, "MediaCopyrightLesson");
const loadDataStructures = () => import("@/components/lessons/advanced/DataStructureLessons");
const loadAlgorithms = () => import("@/components/lessons/advanced/AlgorithmLessons");
const loadOperatingSystem = () => import("@/components/lessons/advanced/OperatingSystemLessons");
const loadSystemsNetwork = () => import("@/components/lessons/advanced/SystemsNetworkLessons");
const ArrayLockersLesson = advancedLesson(loadDataStructures, "ArrayLockersLesson");
const LinkedTreasureLesson = advancedLesson(loadDataStructures, "LinkedTreasureLesson");
const StackQueueDockLesson = advancedLesson(loadDataStructures, "StackQueueDockLesson");
const TreeLibraryLesson = advancedLesson(loadDataStructures, "TreeLibraryLesson");
const GraphRoutesLesson = advancedLesson(loadDataStructures, "GraphRoutesLesson");
const LinearSearchLesson = advancedLesson(loadAlgorithms, "LinearSearchLesson");
const BinarySearchLesson = advancedLesson(loadAlgorithms, "BinarySearchLesson");
const BubbleSortLesson = advancedLesson(loadAlgorithms, "BubbleSortLesson");
const TaskDecompositionLesson = advancedLesson(loadAlgorithms, "TaskDecompositionLesson");
const AlgorithmEfficiencyLesson = advancedLesson(loadAlgorithms, "AlgorithmEfficiencyLesson");
const ProgramProcessLesson = advancedLesson(loadOperatingSystem, "ProgramProcessLesson");
const CpuSchedulingLesson = advancedLesson(loadOperatingSystem, "CpuSchedulingLesson");
const MemoryAllocationLesson = advancedLesson(loadOperatingSystem, "MemoryAllocationLesson");
const FileSystemTreeLesson = advancedLesson(loadOperatingSystem, "FileSystemTreeLesson");
const DeviceCoordinationLesson = advancedLesson(loadOperatingSystem, "DeviceCoordinationLesson");
const InstructionCycleLesson = advancedLesson(loadSystemsNetwork, "InstructionCycleLesson");
const CacheStationLesson = advancedLesson(loadSystemsNetwork, "CacheStationLesson");
const NetworkLayersLesson = advancedLesson(loadSystemsNetwork, "NetworkLayersLesson");
const RoutingMazeLesson = advancedLesson(loadSystemsNetwork, "RoutingMazeLesson");
const ReliableTransferLesson = advancedLesson(loadSystemsNetwork, "ReliableTransferLesson");

export const LESSON_DEFINITIONS: Record<string, LessonDefinition> = {
  "keyboard-flight": {
    courseId: "keyboard-flight",
    badgeId: "keyboard-pilot",
    badgeName: "键盘领航员",
    completionTitle: "你已点亮第一段航线",
    completionSummary: "方向键负责移动，空格键负责行动，指令会按顺序执行。",
    Component: KeyboardFlightLesson,
  },
  "mouse-precision": {
    courseId: "mouse-precision",
    badgeId: "mouse-navigator",
    badgeName: "鼠标导航员",
    completionTitle: "港口导航台重新亮起来了",
    completionSummary: "你会移动、单击、双击和拖放，也知道如何用键盘完成同样的任务。",
    Component: MousePrecisionLesson,
  },
  "bilingual-input": {
    courseId: "bilingual-input",
    badgeId: "typing-communicator",
    badgeName: "输入通信员",
    completionTitle: "中英文通信站连接成功",
    completionSummary: "你会输入字母和数字、用退格键修正，也完成了中文输入法选词。",
    Component: BilingualInputLesson,
  },
  "desktop-adventure": {
    courseId: "desktop-adventure",
    badgeId: "desktop-explorer",
    badgeName: "桌面探险家",
    completionTitle: "模拟桌面整理完成",
    completionSummary: "你会打开、切换、最小化、恢复和关闭窗口，也认识了图标与任务栏。",
    Component: DesktopAdventureLesson,
  },
  "program-landing": {
    courseId: "program-landing",
    badgeId: "program-pilot",
    badgeName: "程序领航员",
    completionTitle: "启航港五段航线全部点亮",
    completionSummary: "你会安全打开程序、编辑内容、选择保存位置并正确关闭。",
    Component: ProgramLandingLesson,
  },
  "file-home": {
    courseId: "file-home",
    badgeId: "file-home-finder",
    badgeName: "文件寻家员",
    completionTitle: "你找到了文件的家",
    completionSummary: "你能分清文件与文件夹，也会沿着地址进入、返回并找到目标文件。",
    Component: FileHomeLesson,
  },
  "name-your-work": {
    courseId: "name-your-work",
    badgeId: "naming-designer",
    badgeName: "命名设计师",
    completionTitle: "作品有了清楚的名字和住处",
    completionSummary: "你会用内容线索命名、保留扩展名、处理重名并选择正确的保存位置。",
    Component: NameYourWorkLesson,
  },
  "move-and-copy": {
    courseId: "move-and-copy",
    badgeId: "file-mover",
    badgeName: "文件搬运师",
    completionTitle: "文件整理台恢复整齐",
    completionSummary: "你能分清移动与复制，会使用剪切、复制、粘贴和撤销。",
    Component: MoveAndCopyLesson,
  },
  "file-types": {
    courseId: "file-types",
    badgeId: "file-type-detective",
    badgeName: "类型侦探",
    completionTitle: "文件分类实验室整理完成",
    completionSummary: "你会用扩展名识别图片、文字和声音，也知道陌生文件要先问大人。",
    Component: FileTypesLesson,
  },
  "learning-backpack": {
    courseId: "learning-backpack",
    badgeId: "digital-organizer",
    badgeName: "数字整理师",
    completionTitle: "文件森林的学习背包整理完成",
    completionSummary: "你会搜索、排序、重命名、分类和从回收站恢复文件。",
    Component: LearningBackpackLesson,
  },
  "instruction-order": {
    courseId: "instruction-order",
    badgeId: "sequence-engineer",
    badgeName: "顺序工程师",
    completionTitle: "机器人工坊的第一座桥修好了",
    completionSummary: "你知道电脑从上到下执行指令，也能调整顺序让机器人完成任务。",
    Component: InstructionOrderLesson,
  },
  "grid-city-navigation": {
    courseId: "grid-city-navigation",
    badgeId: "grid-navigator",
    badgeName: "方格导航员",
    completionTitle: "方格城的三座信标全部点亮",
    completionSummary: "你会读取行列坐标、按方向移动，并能绕过边界和障碍规划路线。",
    Component: GridCityNavigationLesson,
  },
  "repeat-power": {
    courseId: "repeat-power",
    badgeId: "loop-builder",
    badgeName: "循环建造师",
    completionTitle: "重复能源环稳定运行",
    completionSummary: "你会发现重复模式、设置循环次数，并用更短的程序完成正方形任务。",
    Component: RepeatPowerLesson,
  },
  "rainy-condition": {
    courseId: "rainy-condition",
    badgeId: "condition-captain",
    badgeName: "条件判断员",
    completionTitle: "机器人学会根据情况安全行动",
    completionSummary: "你会判断真和假，理解那么与否则分支，也知道输入变化会改变结果。",
    Component: RainyConditionLesson,
  },
  "bug-catcher": {
    courseId: "bug-catcher",
    badgeId: "bug-catcher",
    badgeName: "调试侦探",
    completionTitle: "机器人工坊的程序小虫全部找到",
    completionSummary: "你会预测、观察证据、找到第一个不同点、修改一处并重新测试。",
    Component: BugCatcherLesson,
  },
  "password-guardian": {
    courseId: "password-guardian",
    badgeId: "password-guardian",
    badgeName: "密码守护者",
    completionTitle: "安全灯塔的账号大门锁好了",
    completionSummary: "你知道使用长而独特的密码、保持保密，并在需要时请家长帮助。",
    Component: PasswordGuardianLesson,
  },
  "private-information": {
    courseId: "private-information",
    badgeId: "privacy-sentinel",
    badgeName: "隐私哨兵",
    completionTitle: "个人信息防护门已经升起",
    completionSummary: "你会结合信息、询问者和场景判断，并能停止、关闭和向可信大人求助。",
    Component: PrivateInformationLesson,
  },
  "popup-fog": {
    courseId: "popup-fog",
    badgeId: "popup-scout",
    badgeName: "弹窗侦察员",
    completionTitle: "可疑弹窗迷雾已经散开",
    completionSummary: "你会检查来源、请求、催促和下载线索，并能关闭或向可信大人求助。",
    Component: PopupFogLesson,
  },
  "healthy-computer-habits": {
    courseId: "healthy-computer-habits",
    badgeId: "healthy-tech-user",
    badgeName: "健康使用达人",
    completionTitle: "健康使用节奏已经安排好",
    completionSummary: "你会检查坐姿、屏幕和光线，安排离屏休息，并在不舒服时告诉大人。",
    Component: HealthyComputerHabitsLesson,
  },
  "light-bit-island": {
    courseId: "light-bit-island",
    badgeId: "island-lighter",
    badgeName: "比特岛点灯师",
    completionTitle: "前四座知识岛的综合信号恢复",
    completionSummary: "你综合运用了电脑操作、文件管理、编程思维和数字安全知识，可以继续探索后九岛。",
    Component: LightBitIslandLesson,
  },
  "input-process-output": {
    courseId: "input-process-output",
    badgeId: "pipeline-engineer",
    badgeName: "流水线工程师",
    completionTitle: "三条信息加工流水线全部运行",
    completionSummary: "你会区分输入、处理和输出，并能追踪信息在电脑中的完整旅程。",
    Component: InputProcessOutputLesson,
  },
  "cpu-memory-storage": {
    courseId: "cpu-memory-storage",
    badgeId: "memory-manager",
    badgeName: "记忆管理师",
    completionTitle: "电脑内部三个岗位配合成功",
    completionSummary: "你会区分 CPU、工作内存和长期存储，也理解为什么修改后需要保存。",
    Component: CpuMemoryStorageLesson,
  },
  "bits-and-data": {
    courseId: "bits-and-data",
    badgeId: "bit-builder",
    badgeName: "比特积木师",
    completionTitle: "数字与颜色的比特灯全部点亮",
    completionSummary: "你会用 0 和 1 组合小数字与颜色，也理解数据需要编码规则。",
    Component: BitsAndDataLesson,
  },
  "hardware-software": {
    courseId: "hardware-software",
    badgeId: "system-partner",
    badgeName: "系统搭档师",
    completionTitle: "硬件和软件搭档任务全部启动",
    completionSummary: "你会区分物理部件与程序，也理解操作系统和软硬件怎样合作。",
    Component: HardwareSoftwareLesson,
  },
  "troubleshoot-machine": {
    courseId: "troubleshoot-machine",
    badgeId: "device-doctor",
    badgeName: "电脑小医生",
    completionTitle: "硬件实验岛的四个案例诊断完成",
    completionSummary: "你会描述现象、检查简单原因、一次改变一处、重新测试并安全求助。",
    Component: TroubleshootMachineLesson,
  },
  "network-journey": {
    courseId: "network-journey",
    badgeId: "packet-guide",
    badgeName: "数据包向导",
    completionTitle: "三组数据包完成网络往返",
    completionSummary: "你会解释设备、路由器、互联网与服务器在请求和响应中的角色。",
    Component: NetworkJourneyLesson,
  },
  "web-address": {
    courseId: "web-address",
    badgeId: "address-reader",
    badgeName: "网址阅读员",
    completionTitle: "五张网络地址卡检查完成",
    completionSummary: "你会区分连接方式、网站身份和路径，并能发现相似但不同的虚构地址。",
    Component: WebAddressLesson,
  },
  "search-and-links": {
    courseId: "search-and-links",
    badgeId: "search-navigator",
    badgeName: "搜索导航员",
    completionTitle: "虚拟搜索航线成功往返",
    completionSummary: "你会提炼关键词、比较结果线索，并使用链接和标签页保持方向。",
    Component: SearchAndLinksLesson,
  },
  "downloads-and-cloud": {
    courseId: "downloads-and-cloud",
    badgeId: "cloud-courier",
    badgeName: "云端运输员",
    completionTitle: "本机与云端副本追踪完成",
    completionSummary: "你会区分下载、上传、同步与共享，并理解多个位置可以保存不同副本。",
    Component: DownloadsCloudLesson,
  },
  "network-troubleshooting": {
    courseId: "network-troubleshooting",
    badgeId: "network-detective",
    badgeName: "网络侦察员",
    completionTitle: "网络海湾四类信号全部辨认",
    completionSummary: "你会比较现象，区分离线、弱信号、服务器与地址问题，并安全求助。",
    Component: NetworkTroubleshootingLesson,
  },
  "pixel-art": {
    courseId: "pixel-art", badgeId: "pixel-artist", badgeName: "像素艺术家",
    completionTitle: "像素画小工坊的色格全部点亮",
    completionSummary: "你会解释像素与分辨率，选择图片格式，并用保留原件的方法安全创作。",
    Component: PixelArtLesson,
  },
  "document-design": {
    courseId: "document-design", badgeId: "document-designer", badgeName: "文档设计师",
    completionTitle: "混乱文档恢复了清楚层级",
    completionSummary: "你会用标题、段落、留白和图片说明帮助读者，并保留可编辑版本。",
    Component: DocumentDesignLesson,
  },
  "slide-story": {
    courseId: "slide-story", badgeId: "slide-storyteller", badgeName: "幻灯片故事家",
    completionTitle: "演示故事航线顺利抵达终点",
    completionSummary: "你会确定核心信息、安排故事顺序、一页表达一个重点并用图像辅助说明。",
    Component: SlideStoryLesson,
  },
  "media-copyright": {
    courseId: "media-copyright", badgeId: "copyright-scout", badgeName: "版权侦察员",
    completionTitle: "四种媒体使用情境判断完成",
    completionSummary: "你知道网络作品也有创作者，会检查许可、遵守要求并正确署名。",
    Component: MediaCopyrightLesson,
  },
  "data-table": {
    courseId: "data-table", badgeId: "data-organizer", badgeName: "数据整理员",
    completionTitle: "四张数据表全部整理清楚",
    completionSummary: "你会用行列组织记录，保持格式与单位一致，并用筛选和图表回答问题。",
    Component: DataTableLesson,
  },
  "email-message": {
    courseId: "email-message", badgeId: "email-captain", badgeName: "邮件通信员",
    completionTitle: "四封虚拟邮件检查完成",
    completionSummary: "你会核对收件人、写清主题和正文、谨慎处理附件，并在真实发送前请大人帮助。",
    Component: EmailMessageLesson,
  },
  "online-collaboration": {
    courseId: "online-collaboration", badgeId: "collaboration-builder", badgeName: "协作建造师",
    completionTitle: "虚拟小组的协作冲突全部解决",
    completionSummary: "你会分工、给出具体友善的评论、查看版本记录，并选择最小共享权限。",
    Component: OnlineCollaborationLesson,
  },
  "ai-helper": {
    courseId: "ai-helper", badgeId: "ai-prompt-guide", badgeName: "AI 提问向导",
    completionTitle: "四项 AI 学习任务安全完成",
    completionSummary: "你会说清目标和要求、不输入隐私，并把 AI 输出当作需要人来核对修改的草稿。",
    Component: AiHelperLesson,
  },
  "verify-ai": {
    courseId: "verify-ai", badgeId: "ai-fact-checker", badgeName: "AI 核验员",
    completionTitle: "四条虚构 AI 回答完成核验",
    completionSummary: "你会拆分可核对主张、优先可靠来源、交叉比较，并诚实说明不确定。",
    Component: VerifyAiLesson,
  },
  "digital-project": {
    courseId: "digital-project", badgeId: "digital-project-leader", badgeName: "数字项目领队",
    completionTitle: "未来协作站的数字项目通过验收",
    completionSummary: "你综合运用了问题定义、任务分解、工具选择、测试改进和负责任分享，可以继续前往代码星港。",
    Component: DigitalProjectLesson,
  },
  "events-handlers": { courseId: "events-handlers", badgeId: "event-controller", badgeName: "事件控制员", completionTitle: "四段事件程序全部响应", completionSummary: "你会分清事件和处理器，并按事件实际发生顺序追踪程序。", Component: EventsHandlersLesson },
  "variables-score": { courseId: "variables-score", badgeId: "variable-keeper", badgeName: "变量保管员", completionTitle: "四个变量能量箱追踪完成", completionSummary: "你会设置初始值、读取当前值，并用旧值计算后存回新值。", Component: VariablesScoreLesson },
  "functions-tools": { courseId: "functions-tools", badgeId: "function-builder", badgeName: "函数建造师", completionTitle: "函数工具箱组装完成", completionSummary: "你会区分定义和调用，理解参数与返回值，并用函数复用指令。", Component: FunctionsToolsLesson },
  "boolean-logic": { courseId: "boolean-logic", badgeId: "logic-gate-keeper", badgeName: "逻辑门卫", completionTitle: "四座真假逻辑门全部打开", completionSummary: "你会追踪并且、或者、不是，并用括号理解组合条件。", Component: BooleanLogicLesson },
  "game-design": { courseId: "game-design", badgeId: "game-designer", badgeName: "小游戏设计师", completionTitle: "代码星港小游戏完成总装", completionSummary: "你综合使用目标、事件、变量、条件、循环、测试和安全原则设计游戏。", Component: GameDesignLesson },
  "array-lockers": { courseId: "array-lockers", badgeId: "array-navigator", badgeName: "数组导航员", completionTitle: "四个数组储物柜定位完成", completionSummary: "你会用从 0 开始的索引读取和更新数组中的指定位置。", Component: ArrayLockersLesson },
  "linked-treasure": { courseId: "linked-treasure", badgeId: "link-pathfinder", badgeName: "连接寻路员", completionTitle: "链表寻宝线重新连接", completionSummary: "你会沿下一站遍历节点，并能在中间插入、删除和重新连接。", Component: LinkedTreasureLesson },
  "stack-queue-dock": { courseId: "stack-queue-dock", badgeId: "stack-queue-captain", badgeName: "规则码头长", completionTitle: "栈与队列的两条航线运行正确", completionSummary: "你会比较栈的后进先出和队列的先进先出。", Component: StackQueueDockLesson },
  "tree-library": { courseId: "tree-library", badgeId: "tree-librarian", badgeName: "树形图书管理员", completionTitle: "太空图书沿树形路径找到", completionSummary: "你会从根节点沿父子分支找到叶节点，并说出完整路径。", Component: TreeLibraryLesson },
  "graph-routes": { courseId: "graph-routes", badgeId: "graph-navigator", badgeName: "图航线导航员", completionTitle: "图结构航线抵达山洞", completionSummary: "你会识别节点和边，沿相邻连接寻找可达路线并避免环。", Component: GraphRoutesLesson },
  "linear-search": { courseId: "linear-search", badgeId: "linear-search-scout", badgeName: "顺序查找侦察员", completionTitle: "目标数字按顺序找到", completionSummary: "你会从第一项开始逐个比较，并记录找到或查完所需的次数。", Component: LinearSearchLesson },
  "binary-search": { courseId: "binary-search", badgeId: "binary-search-scout", badgeName: "二分查找侦察员", completionTitle: "有序范围连续减半并找到目标", completionSummary: "你会检查中间位置，根据大小排除一半并更新查找边界。", Component: BinarySearchLesson },
  "bubble-sort": { courseId: "bubble-sort", badgeId: "sort-robot", badgeName: "排序机器人工程师", completionTitle: "四个数字完成冒泡排序", completionSummary: "你会比较相邻项目、交换错误顺序并重复多轮直到有序。", Component: BubbleSortLesson },
  "task-decomposition": { courseId: "task-decomposition", badgeId: "task-planner", badgeName: "任务规划师", completionTitle: "复杂任务拆分并正确组合", completionSummary: "你会拆分任务、识别依赖、安排可执行顺序并检查组合结果。", Component: TaskDecompositionLesson },
  "algorithm-efficiency": { courseId: "algorithm-efficiency", badgeId: "efficiency-referee", badgeName: "算法效率裁判", completionTitle: "两种查找算法完成效率比赛", completionSummary: "你会用操作次数比较算法，并解释数据增加时两种方法的变化。", Component: AlgorithmEfficiencyLesson },
  "program-process": { courseId: "program-process", badgeId: "process-controller", badgeName: "进程控制员", completionTitle: "虚拟进程完成完整生命周期", completionSummary: "你会区分程序和进程，并解释就绪、运行、等待、唤醒与结束。", Component: ProgramProcessLesson },
  "cpu-scheduling": { courseId: "cpu-scheduling", badgeId: "schedule-controller", badgeName: "调度控制员", completionTitle: "三个任务公平获得 CPU 时间片", completionSummary: "你会用时间片让多个任务轮流运行，并追踪剩余工作。", Component: CpuSchedulingLesson },
  "memory-allocation": { courseId: "memory-allocation", badgeId: "memory-room-manager", badgeName: "内存房间管理员", completionTitle: "有限内存完成分配与回收", completionSummary: "你会检查容量、拒绝超额申请，并在进程结束后释放空间。", Component: MemoryAllocationLesson },
  "file-system-tree": { courseId: "file-system-tree", badgeId: "file-system-guide", badgeName: "文件系统向导", completionTitle: "虚拟目录树中的目标文件找到", completionSummary: "你会从根目录沿路径找到文件，也理解层级和只读权限。", Component: FileSystemTreeLesson },
  "device-coordination": { courseId: "device-coordination", badgeId: "device-coordinator", badgeName: "设备协调员", completionTitle: "三个虚拟设备请求依次完成", completionSummary: "你会解释程序、操作系统、驱动和设备怎样合作处理请求。", Component: DeviceCoordinationLesson },
  "instruction-cycle": { courseId: "instruction-cycle", badgeId: "instruction-engineer", badgeName: "指令周期工程师", completionTitle: "两轮 CPU 指令周期追踪完成", completionSummary: "你会解释取指、译码、执行和写回怎样随时钟不断重复。", Component: InstructionCycleLesson },
  "cache-station": { courseId: "cache-station", badgeId: "cache-courier", badgeName: "缓存快递员", completionTitle: "三级数据快递命中判断完成", completionSummary: "你会比较缓存、内存和存储的距离、容量与等待成本。", Component: CacheStationLesson },
  "network-layers": { courseId: "network-layers", badgeId: "layer-packer", badgeName: "分层封装员", completionTitle: "四层网络信封完成封装与拆封", completionSummary: "你会说明应用、传输、网络和链路层分别添加和处理什么信息。", Component: NetworkLayersLesson },
  "routing-maze": { courseId: "routing-maze", badgeId: "route-planner", badgeName: "路由规划员", completionTitle: "最低代价路线和中断改道均完成", completionSummary: "你会根据可达性与路线代价选择下一跳，并在中断后重新路由。", Component: RoutingMazeLesson },
  "reliable-transfer": { courseId: "reliable-transfer", badgeId: "reliable-rescuer", badgeName: "可靠传输救援员", completionTitle: "丢失数据块完成确认与重传", completionSummary: "你会用编号、确认、超时、重传和排序恢复完整消息。", Component: ReliableTransferLesson },
};

export function getLessonDefinition(courseId: string): LessonDefinition | undefined {
  return LESSON_DEFINITIONS[courseId];
}
