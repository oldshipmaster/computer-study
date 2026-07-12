import { Bibi } from "@/components/Bibi";
import type { LessonCompletionProps } from "@/components/lessons/types";
import { LessonReflection } from "@/components/lessons/LessonReflection";
import { CURRICULUM_GUIDE } from "@/lib/curriculum-guide";

export function LessonCompletion({ definition, headingRef, onReturn, confidence, onConfidenceChange }: LessonCompletionProps & { confidence?: "confident" | "practice" | "help"; onConfidenceChange: (confidence: "confident" | "practice" | "help") => void }) {
  const guide = CURRICULUM_GUIDE[definition.courseId];
  return (
    <main className="lesson-preview">
      <section className="lesson-preview-card" aria-labelledby="complete-title">
        <div>
          <p className="hero-kicker" role="status">
            任务完成 · 获得{definition.badgeName}徽章
          </p>
          <h1
            className="screen-focus-heading"
            id="complete-title"
            ref={headingRef}
            tabIndex={-1}
          >
            {definition.completionTitle}
          </h1>
          <p>{definition.completionSummary}</p>
          {guide ? <LessonReflection guide={guide} /> : null}
          <section className="confidence-check" aria-labelledby="confidence-heading">
            <h2 id="confidence-heading">这节课现在感觉怎样？</h2>
            <div>
              <button aria-pressed={confidence === "confident"} onClick={() => onConfidenceChange("confident")} type="button">🙂 我会讲了</button>
              <button aria-pressed={confidence === "practice"} onClick={() => onConfidenceChange("practice")} type="button">↻ 我想再练</button>
              <button aria-pressed={confidence === "help"} onClick={() => onConfidenceChange("help")} type="button">🙋 请大人帮忙</button>
            </div>
            <p role="status">{confidence ? "已记在这台电脑上，之后随时可以改。" : "任选一个最接近的感受，不是考试。"}</p>
          </section>
          <button className="primary-action" onClick={onReturn} type="button">
            回到岛屿地图
          </button>
        </div>
        <div className="completion-summary">
          <div className="completion-badge" aria-label={`获得${definition.badgeName}徽章`}>
            <span aria-hidden="true">★</span>
            <strong>{definition.badgeName}</strong>
            <small>新徽章</small>
          </div>
          <Bibi mood="celebrating" message="做得很好！现在离开屏幕看看远处，让眼睛休息一会儿。" />
        </div>
      </section>
    </main>
  );
}
