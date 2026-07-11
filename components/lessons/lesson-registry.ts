import { KeyboardFlightLesson } from "@/components/KeyboardFlightLesson";
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
};

export function getLessonDefinition(courseId: string): LessonDefinition | undefined {
  return LESSON_DEFINITIONS[courseId];
}
