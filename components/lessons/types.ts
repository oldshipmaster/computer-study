import type { ComponentType, Ref } from "react";

export interface LessonProps {
  initialStage: number;
  reducedMotion: boolean;
  sound: boolean;
  onStageChange: (stage: number) => void;
  onAward: (courseId: string, badgeId: string) => void;
  onComplete: () => void;
  onExit: () => void;
}

export interface LessonDefinition {
  courseId: string;
  badgeId: string;
  badgeName: string;
  completionTitle: string;
  completionSummary: string;
  Component: ComponentType<LessonProps>;
}

export interface LessonCompletionProps {
  definition: LessonDefinition;
  headingRef: Ref<HTMLHeadingElement>;
  onReturn: () => void;
}
