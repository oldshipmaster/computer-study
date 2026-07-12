import type { LessonProps } from "@/components/lessons/types";
import { FutureMissionLesson } from "@/components/lessons/future/FutureMissionLesson";
import { FUTURE_MISSIONS } from "@/lib/future-missions";

export const EmailMessageLesson = (props: LessonProps) => <FutureMissionLesson mission={FUTURE_MISSIONS["email-message"]} {...props} />;
export const OnlineCollaborationLesson = (props: LessonProps) => <FutureMissionLesson mission={FUTURE_MISSIONS["online-collaboration"]} {...props} />;
export const AiHelperLesson = (props: LessonProps) => <FutureMissionLesson mission={FUTURE_MISSIONS["ai-helper"]} {...props} />;
export const VerifyAiLesson = (props: LessonProps) => <FutureMissionLesson mission={FUTURE_MISSIONS["verify-ai"]} {...props} />;
export const DigitalProjectLesson = (props: LessonProps) => <FutureMissionLesson mission={FUTURE_MISSIONS["digital-project"]} {...props} />;
