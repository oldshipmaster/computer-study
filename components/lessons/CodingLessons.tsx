import type { LessonProps } from "@/components/lessons/types";
import { CodingMissionLesson } from "@/components/lessons/coding/CodingMissionLesson";
import { CODING_MISSIONS } from "@/lib/coding-missions";
export const EventsHandlersLesson = (props: LessonProps) => <CodingMissionLesson mission={CODING_MISSIONS["events-handlers"]} {...props} />;
export const VariablesScoreLesson = (props: LessonProps) => <CodingMissionLesson mission={CODING_MISSIONS["variables-score"]} {...props} />;
export const FunctionsToolsLesson = (props: LessonProps) => <CodingMissionLesson mission={CODING_MISSIONS["functions-tools"]} {...props} />;
export const BooleanLogicLesson = (props: LessonProps) => <CodingMissionLesson mission={CODING_MISSIONS["boolean-logic"]} {...props} />;
export const GameDesignLesson = (props: LessonProps) => <CodingMissionLesson mission={CODING_MISSIONS["game-design"]} {...props} />;
