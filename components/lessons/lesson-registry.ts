import { KeyboardFlightLesson } from "@/components/KeyboardFlightLesson";
import { MousePrecisionLesson } from "@/components/lessons/MousePrecisionLesson";
import { BilingualInputLesson } from "@/components/lessons/BilingualInputLesson";
import { DesktopAdventureLesson } from "@/components/lessons/DesktopAdventureLesson";
import { ProgramLandingLesson } from "@/components/lessons/ProgramLandingLesson";
import { FileHomeLesson } from "@/components/lessons/FileHomeLesson";
import { NameYourWorkLesson } from "@/components/lessons/NameYourWorkLesson";
import { MoveAndCopyLesson } from "@/components/lessons/MoveAndCopyLesson";
import { FileTypesLesson } from "@/components/lessons/FileTypesLesson";
import { LearningBackpackLesson } from "@/components/lessons/LearningBackpackLesson";
import { InstructionOrderLesson } from "@/components/lessons/InstructionOrderLesson";
import { GridCityNavigationLesson } from "@/components/lessons/GridCityNavigationLesson";
import { RepeatPowerLesson } from "@/components/lessons/RepeatPowerLesson";
import { RainyConditionLesson } from "@/components/lessons/RainyConditionLesson";
import { BugCatcherLesson } from "@/components/lessons/BugCatcherLesson";
import { PasswordGuardianLesson } from "@/components/lessons/PasswordGuardianLesson";
import { PrivateInformationLesson } from "@/components/lessons/PrivateInformationLesson";
import { PopupFogLesson } from "@/components/lessons/PopupFogLesson";
import { HealthyComputerHabitsLesson } from "@/components/lessons/HealthyComputerHabitsLesson";
import { LightBitIslandLesson } from "@/components/lessons/LightBitIslandLesson";
import { InputProcessOutputLesson } from "@/components/lessons/InputProcessOutputLesson";
import type { LessonDefinition } from "@/components/lessons/types";

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
    completionTitle: "比特岛二十段学习航线全部点亮",
    completionSummary: "你综合运用了电脑操作、文件管理、编程思维和数字安全知识。",
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
};

export function getLessonDefinition(courseId: string): LessonDefinition | undefined {
  return LESSON_DEFINITIONS[courseId];
}
