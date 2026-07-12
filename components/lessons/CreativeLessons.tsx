import type { LessonProps } from "@/components/lessons/types";
import { CreativeMissionLesson } from "@/components/lessons/creative/CreativeMissionLesson";
import { CREATIVE_MISSIONS } from "@/lib/creative-missions";

export const PixelArtLesson = (props: LessonProps) => <CreativeMissionLesson mission={CREATIVE_MISSIONS["pixel-art"]} {...props} />;
export const DocumentDesignLesson = (props: LessonProps) => <CreativeMissionLesson mission={CREATIVE_MISSIONS["document-design"]} {...props} />;
export const SlideStoryLesson = (props: LessonProps) => <CreativeMissionLesson mission={CREATIVE_MISSIONS["slide-story"]} {...props} />;
export const MediaCopyrightLesson = (props: LessonProps) => <CreativeMissionLesson mission={CREATIVE_MISSIONS["media-copyright"]} {...props} />;
export const DataTableLesson = (props: LessonProps) => <CreativeMissionLesson mission={CREATIVE_MISSIONS["data-table"]} {...props} />;
