"use client";
import { useEffect, useState } from "react";
import { getSessionClockState } from "@/lib/session-clock";
export function LessonSessionClock() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setSeconds((value) => value + 15);
    }, 15_000);
    return () => window.clearInterval(timer);
  }, []);
  const clock = getSessionClockState(seconds);
  return <div className={`lesson-session-clock lesson-session-clock--${clock.phase}`} role="timer" aria-live={clock.phase === "break" ? "polite" : "off"}><span aria-hidden="true">◷</span><span>{clock.label}</span></div>;
}
