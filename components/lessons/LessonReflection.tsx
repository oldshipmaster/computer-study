"use client";
import { useState } from "react";
import type { CourseGuide } from "@/lib/curriculum-guide";
import { toggleReflectionItem } from "@/lib/reflection-checklist";

export function LessonReflection({ guide }: { guide: CourseGuide }) {
  const [checked, setChecked] = useState<number[]>([]);
  const complete = checked.length === guide.objectives.length;
  return <section className="lesson-reflection" aria-labelledby="reflection-heading">
    <p className="section-kicker">一分钟口述复盘</p>
    <h2 id="reflection-heading">先不看答案，说说我学会了什么</h2>
    <div>{guide.objectives.map((objective, index) => <button aria-pressed={checked.includes(index)} key={objective} onClick={() => setChecked((current) => toggleReflectionItem(current, index, guide.objectives.length))} type="button"><span aria-hidden="true">{checked.includes(index) ? "✓" : "○"}</span>{objective}</button>)}</div>
    <p role="status">{complete ? `复盘完成！再想一想：${guide.parentPrompt}` : `还可以口述 ${guide.objectives.length - checked.length} 项。不会也没关系，回地图重玩就好。`}</p>
  </section>;
}
