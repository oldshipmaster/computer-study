"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { TypingConsole } from "@/components/lessons/typing/TypingConsole";
import type { LessonProps } from "@/components/lessons/types";
import { normalizeTypingResumeStage, type TypingTask } from "@/lib/typing-lesson";

const STAGE_NAMES = ["认识键位", "英文呼号", "数字坐标", "退格修正", "中文通信", "混合挑战"];
const TASKS: Array<{ heading: string; message: string; task?: TypingTask; initialValue?: string }> = [
  { heading: "手指准备好", message: "键盘可以输入字母、数字和中文。真实输入框会保护输入法正常工作。" },
  { heading: "发送英文呼号", message: "请准确输入三个小写字母。", task: { target: "bit", kind: "exact" } },
  { heading: "发送数字坐标", message: "数字键也能组成信息。", task: { target: "2026", kind: "exact" } },
  { heading: "用退格键修正", message: "末尾多了一个 X，用 Backspace 擦掉它。", task: { target: "BIBI", kind: "correction" }, initialValue: "BIBIX" },
  { heading: "切换中文输入", message: "使用电脑上的中文输入法输入比比，选词完成后再继续。", task: { target: "比比", kind: "ime" } },
  { heading: "完成混合通信", message: "字母、中文和数字可以出现在同一条消息中。", task: { target: "bit比比2026", kind: "ime" } },
];

export function BilingualInputLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => normalizeTypingResumeStage(initialStage));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  const current = TASKS[stage];

  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);

  function next() {
    if (stage < TASKS.length - 1) {
      setStage(stage + 1);
      return;
    }
    if (awardedRef.current) return;
    awardedRef.current = true;
    onAward("bilingual-input", "typing-communicator");
    onComplete();
  }

  return (
    <LessonChrome courseName="中英文输入站" currentStage={stage} heading={current.heading} headingRef={headingRef} message={current.message} onExit={onExit} stageNames={STAGE_NAMES}>
      <div className="typing-mission">
        {current.task ? <TypingConsole initialValue={current.initialValue} instruction="在这里输入，不会上传或保存你的文字" key={stage} onSuccess={next} task={current.task} /> : <button className="primary-action" onClick={next} type="button">开始发送通信</button>}
        <div className="onscreen-key-guide" aria-label="键盘提示" role="img"><kbd>A–Z</kbd><kbd>0–9</kbd><kbd>Backspace</kbd><kbd>中 / 英</kbd></div>
      </div>
    </LessonChrome>
  );
}
