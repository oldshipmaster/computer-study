"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { shouldSpeakLesson } from "@/lib/lesson-audio";

const LessonAudioContext = createContext(false);
export function LessonAudioProvider({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  return <LessonAudioContext.Provider value={enabled}>{children}</LessonAudioContext.Provider>;
}

export function useLessonAudio(message: string) {
  const enabled = useContext(LessonAudioContext);
  useEffect(() => {
    const hasApi = "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
    if (!shouldSpeakLesson({ enabled, hidden: document.visibilityState !== "visible", hasApi, message })) return;
    const utterance = new window.SpeechSynthesisUtterance(message.trim());
    utterance.lang = "zh-CN";
    utterance.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    const stopWhenHidden = () => {
      if (document.visibilityState !== "visible") window.speechSynthesis.cancel();
    };
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => {
      document.removeEventListener("visibilitychange", stopWhenHidden);
      window.speechSynthesis.cancel();
    };
  }, [enabled, message]);
}
