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
};

export function getLessonDefinition(courseId: string): LessonDefinition | undefined {
  return LESSON_DEFINITIONS[courseId];
}
