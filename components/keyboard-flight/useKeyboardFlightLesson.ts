import { useCallback, useEffect, useRef, useState } from "react";
import {
  BADGE_ID,
  COURSE_ID,
  HINT_DELAY_MS,
  LESSON_STAGES,
  SECOND_HINT_DELAY_MS,
  SECOND_HINTS,
  STAGE_GUIDES,
  normalizeInitialLessonStage,
  type LessonStage,
} from "@/components/keyboard-flight/lesson-model";
import { useFlightProgram } from "@/components/keyboard-flight/useFlightProgram";
import { useKeyboardPractice } from "@/components/keyboard-flight/useKeyboardPractice";

interface UseKeyboardFlightLessonOptions {
  initialStage: number;
  onAward: (courseId: string, badgeId: string) => void;
  onComplete: () => void;
  onStageChange: (stage: number) => void;
  reducedMotion: boolean;
  sound: boolean;
}

export function useKeyboardFlightLesson({
  initialStage,
  onAward,
  onComplete,
  onStageChange,
  reducedMotion,
  sound,
}: UseKeyboardFlightLessonOptions) {
  const safeInitialStage = normalizeInitialLessonStage(initialStage);
  const initialLessonStage = LESSON_STAGES[safeInitialStage];

  const [stage, setStage] = useState<LessonStage>(initialLessonStage);
  const [guideMessage, setGuideMessage] = useState(STAGE_GUIDES[initialLessonStage]);
  const [activityVersion, setActivityVersion] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const userGestureRef = useRef(false);
  const completionReportedRef = useRef(false);

  const markUserGesture = useCallback(() => {
    userGestureRef.current = true;
  }, []);

  const speakCaption = useCallback(
    (caption: string) => {
      if (
        !sound ||
        !userGestureRef.current ||
        typeof window === "undefined" ||
        !("speechSynthesis" in window) ||
        typeof window.SpeechSynthesisUtterance !== "function"
      ) {
        return;
      }

      try {
        const utterance = new window.SpeechSynthesisUtterance(caption);
        utterance.lang = "zh-CN";
        utterance.rate = 0.92;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech is optional; visible captions always carry the instruction.
      }
    },
    [sound],
  );

  const announce = useCallback(
    (caption: string, withSpeech = true) => {
      setGuideMessage(caption);
      if (withSpeech) {
        speakCaption(caption);
      }
    },
    [speakCaption],
  );

  const registerUsefulInput = useCallback(() => {
    setHintLevel(0);
    setActivityVersion((version) => version + 1);
  }, []);

  const goToStage = useCallback(
    (nextStage: LessonStage, withSpeech: boolean) => {
      setStage(nextStage);
      setHintLevel(0);
      setActivityVersion((version) => version + 1);
      announce(STAGE_GUIDES[nextStage], withSpeech);
      if (nextStage !== "complete") {
        onStageChange(LESSON_STAGES.indexOf(nextStage));
      }
    },
    [announce, onStageChange],
  );

  useEffect(() => {
    if (stage !== "intro") {
      return;
    }

    const introTimer = window.setTimeout(
      () => goToStage("keys", false),
      reducedMotion ? 0 : 3_600,
    );
    return () => window.clearTimeout(introTimer);
  }, [goToStage, reducedMotion, stage]);

  useEffect(() => {
    if (stage === "intro" || stage === "complete") {
      return;
    }

    const firstHint = window.setTimeout(() => setHintLevel(1), HINT_DELAY_MS);
    const secondHint = window.setTimeout(() => {
      setHintLevel(2);
      const caption = SECOND_HINTS[stage];
      if (caption) {
        announce(caption, false);
      }
    }, SECOND_HINT_DELAY_MS);

    return () => {
      window.clearTimeout(firstHint);
      window.clearTimeout(secondHint);
    };
  }, [activityVersion, announce, stage]);

  useEffect(() => {
    if (stage !== "complete" || completionReportedRef.current) {
      return;
    }

    completionReportedRef.current = true;
    onComplete();
  }, [onComplete, stage]);

  const awardCompletion = useCallback(
    () => onAward(COURSE_ID, BADGE_ID),
    [onAward],
  );
  const completeProgram = useCallback(() => goToStage("complete", true), [goToStage]);
  const keyboardPractice = useKeyboardPractice({
    announce,
    hintLevel,
    markUserGesture,
    registerUsefulInput,
  });
  const flightProgram = useFlightProgram({
    announce,
    hintLevel,
    markUserGesture,
    onSuccess: awardCompletion,
    onSuccessTransition: completeProgram,
    reducedMotion,
    registerUsefulInput,
  });

  const moveFromIntro = useCallback(() => {
    markUserGesture();
    goToStage("keys", true);
  }, [goToStage, markUserGesture]);

  const moveFromKeys = useCallback(() => {
    markUserGesture();
    goToStage("practice", true);
  }, [goToStage, markUserGesture]);

  const moveFromPractice = useCallback(() => {
    markUserGesture();
    goToStage("program", true);
  }, [goToStage, markUserGesture]);

  return {
    ...keyboardPractice,
    ...flightProgram,
    guideMessage,
    hintLevel,
    moveFromIntro,
    moveFromKeys,
    moveFromPractice,
    stage,
    stageIndex: LESSON_STAGES.indexOf(stage),
  };
}
