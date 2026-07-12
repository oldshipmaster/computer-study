"use client";
import { useEffect, useState } from "react";
import { getSessionClockState } from "@/lib/session-clock";
export function LessonSessionClock() {
  const [seconds, setSeconds] = useState(0);
  const [breakDismissed, setBreakDismissed] = useState(false);
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setSeconds((value) => value + 15);
    }, 15_000);
    return () => window.clearInterval(timer);
  }, []);
  const clock = getSessionClockState(seconds);
  const announceMilestone = seconds === 480 || seconds === 600;
  return <><div className={`lesson-session-clock lesson-session-clock--${clock.phase}`} role="timer" aria-live={announceMilestone ? "polite" : "off"} aria-atomic="true"><span aria-hidden="true">◷</span><span>{clock.label}</span></div>{clock.phase === "break" && !breakDismissed ? <aside aria-labelledby="lesson-break-title" className="lesson-break-checklist"><h2 id="lesson-break-title">这一步做完就休息</h2><ul><li>✓ 保存当前进度</li><li>👀 看看远处</li><li>🙆 站起来活动</li></ul><button onClick={() => setBreakDismissed(true)} type="button">我知道了，完成后休息</button></aside> : null}</>;
}
