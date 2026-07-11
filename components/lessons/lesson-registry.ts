import { KeyboardFlightLesson } from "@/components/KeyboardFlightLesson";
import { MousePrecisionLesson } from "@/components/lessons/MousePrecisionLesson";
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
};

export function getLessonDefinition(courseId: string): LessonDefinition | undefined {
  return LESSON_DEFINITIONS[courseId];
}
