import type { ReactNode, Ref } from "react";

interface LessonChromeProps {
  children: ReactNode;
  courseName: string;
  currentStage: number;
  heading: string;
  headingRef: Ref<HTMLHeadingElement>;
  message: string;
  onExit: () => void;
  stageNames: readonly string[];
}

export function LessonChrome({
  children,
  courseName,
  currentStage,
  heading,
  headingRef,
  message,
  onExit,
  stageNames,
}: LessonChromeProps) {
  return (
    <main className="interactive-lesson">
      <header className="lesson-topbar">
        <button className="back-action" onClick={onExit} type="button">
          <span aria-hidden="true">←</span> 返回课程地图
        </button>
        <div>
          <span className="lesson-course-name">{courseName}</span>
          <span className="lesson-stage-count">
            第 {currentStage + 1} / {stageNames.length} 段
          </span>
        </div>
      </header>
      <ol className="lesson-progress" aria-label="课程进度">
        {stageNames.map((stageName, index) => (
          <li
            aria-current={index === currentStage ? "step" : undefined}
            className={`${index < currentStage ? "is-complete" : ""} ${
              index === currentStage ? "is-current" : ""
            }`}
            key={stageName}
          >
            <span>{index + 1}</span><strong>{stageName}</strong>
          </li>
        ))}
      </ol>
      <section className="lesson-shell" aria-labelledby="lesson-stage-heading">
        <div className="lesson-visible-caption" aria-live="polite" aria-atomic="true">
          {message}
        </div>
        <h1 id="lesson-stage-heading" ref={headingRef} tabIndex={-1}>{heading}</h1>
        {children}
      </section>
    </main>
  );
}
