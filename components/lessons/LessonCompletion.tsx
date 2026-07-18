import { Bibi } from "@/components/Bibi";
import type { LessonCompletionProps } from "@/components/lessons/types";
import { LessonReflection } from "@/components/lessons/LessonReflection";
import { CURRICULUM_GUIDE } from "@/lib/curriculum-guide";
import type { CourseCompletionReward } from "@/lib/adventure-missions";

export function LessonCompletion({ definition, headingRef, onReturn, confidence, onConfidenceChange, adventureReward }: LessonCompletionProps & { adventureReward?: CourseCompletionReward; confidence?: "confident" | "practice" | "help"; onConfidenceChange: (confidence: "confident" | "practice" | "help") => void }) {
  const guide = CURRICULUM_GUIDE[definition.courseId];
  const firstCompletion = !adventureReward || adventureReward.playNumber === 1;
  return (
    <main className="lesson-preview">
      <section className="lesson-preview-card" aria-labelledby="complete-title">
        <div>
          <p className="hero-kicker" role="status">
            {firstCompletion ? `任务完成 · 获得${definition.badgeName}徽章` : `第 ${adventureReward.playNumber} 次完成 · 航线更加熟练`}
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
          {adventureReward ? (
            <section className={`completion-energy-reward ${adventureReward.rewarded ? "is-rewarded" : "is-full"}`} aria-label="本次探险能量奖励">
              <span aria-hidden="true">{adventureReward.rewarded ? `+${adventureReward.points}` : "✓"}</span>
              <div>
                <strong>{adventureReward.rewarded ? `获得 ${adventureReward.points} 点探险能量` : "本课能量已收集满"}</strong>
                <p>{adventureReward.rewarded ? "回到地图看看比比离下一件装备还有多远。" : "第 4 次起仍可自由巩固，但不会继续刷能量。"}</p>
              </div>
            </section>
          ) : null}
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
          <div className="completion-badge" aria-label={`获得${definition.badgeName}徽章`} role="img">
            <span aria-hidden="true">★</span>
            <strong>{definition.badgeName}</strong>
            <small>{firstCompletion ? "新徽章" : "重玩完成"}</small>
          </div>
          <Bibi mood="celebrating" message="做得很好！现在离开屏幕看看远处，让眼睛休息一会儿。" />
        </div>
      </section>
    </main>
  );
}
