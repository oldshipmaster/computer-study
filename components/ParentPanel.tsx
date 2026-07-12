"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { COURSES, CURRICULUM_FACTS } from "@/lib/course-data";
import { LESSON_DEFINITIONS } from "@/components/lessons/lesson-registry";
import { summarizeIslandProgress } from "@/lib/parent-progress-summary";
import { getNextCourseGuide } from "@/lib/curriculum-guide";
import { createProgressBackup, parseProgressBackup } from "@/lib/progress-backup";
import { ParentCurriculumOutline } from "@/components/ParentCurriculumOutline";
import { buildProgressStats } from "@/lib/progress-stats";
import { ParentFamilyPlan } from "@/components/ParentFamilyPlan";
import { buildConfidenceStats } from "@/lib/confidence-stats";

export interface ParentProgress {
  version: 1;
  completedCourseIds: string[];
  badgeIds: string[];
  confidenceByCourse: Record<string, "confident" | "practice" | "help">;
  resume: { courseId: string; stage: number } | null;
  settings: {
    sound: boolean;
    reducedMotion: boolean;
  };
}

export interface ParentPanelProps {
  progress: ParentProgress;
  storageUnavailable: boolean;
  onSettingsChange: (settings: ParentProgress["settings"]) => void;
  onReset: () => void;
  onRestore: (progress: ParentProgress) => void;
  onStartCourse: (courseId: string) => void;
  onClose: () => void;
}

const BADGE_NAMES = Object.fromEntries(
  Object.values(LESSON_DEFINITIONS).map((definition) => [
    definition.badgeId,
    definition.badgeName,
  ]),
);

export function ParentPanel({
  progress,
  storageUnavailable,
  onSettingsChange,
  onReset,
  onRestore,
  onStartCourse,
  onClose,
}: ParentPanelProps) {
  const [resetConfirmationVisible, setResetConfirmationVisible] = useState(false);
  const [backupStatus, setBackupStatus] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const resetActionButtonRef = useRef<HTMLButtonElement>(null);
  const resetKeepButtonRef = useRef<HTMLButtonElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);
  const islandProgress = summarizeIslandProgress(progress.completedCourseIds);
  const nextCourseGuide = getNextCourseGuide(progress.completedCourseIds);
  const progressStats = buildProgressStats(progress.completedCourseIds);
  const reviewCourses = COURSES.filter((course) => ["practice", "help"].includes(progress.confidenceByCourse[course.id]));
  const confidenceStats = buildConfidenceStats(progress.completedCourseIds, progress.confidenceByCourse);

  useLayoutEffect(() => {
    closeButtonRef.current?.focus();

    function handleFocusIn(event: FocusEvent) {
      const panel = panelRef.current;

      if (!panel || (event.target instanceof Node && panel.contains(event.target))) {
        return;
      }

      closeButtonRef.current?.focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusableElements = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) {
          return;
        }

        if (!panelRef.current.contains(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? lastElement : firstElement).focus();
          return;
        }

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [onClose]);

  useLayoutEffect(() => {
    if (resetConfirmationVisible) {
      resetKeepButtonRef.current?.focus();
    }
  }, [resetConfirmationVisible]);

  function updateSetting(setting: keyof ParentProgress["settings"], value: boolean) {
    onSettingsChange({
      ...progress.settings,
      [setting]: value,
    });
  }

  function confirmReset() {
    onReset();
    closeResetConfirmation();
  }

  function closeResetConfirmation() {
    setResetConfirmationVisible(false);
    window.setTimeout(() => resetActionButtonRef.current?.focus(), 0);
  }

  function downloadBackup() {
    const text = createProgressBackup(progress);
    const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `bit-island-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setBackupStatus("学习记录已导出到这台电脑的下载文件夹。请由家长妥善保管。");
  }

  async function restoreBackup(file: File | undefined) {
    if (!file) return;
    const result = parseProgressBackup(await file.text());
    if (!result.ok) { setBackupStatus(result.message); return; }
    onRestore(result.progress);
    setBackupStatus(`已恢复 ${result.progress.completedCourseIds.length} 节课程记录。`);
    if (backupInputRef.current) backupInputRef.current.value = "";
  }

  return (
    <div className="parent-panel-backdrop">
      <section
        aria-labelledby="parent-panel-title"
        aria-modal="true"
        className="parent-panel"
        ref={panelRef}
        role="dialog"
      >
        <header className="parent-panel-header">
          <div>
            <p className="section-kicker">大人设置</p>
            <h1 id="parent-panel-title">家长区</h1>
            <p>查看这台电脑上的学习记录，并调整上课体验。</p>
          </div>
          <button
            aria-label="关闭家长区"
            className="parent-panel-close"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <span aria-hidden="true">×</span>
            <span>关闭</span>
          </button>
        </header>

        {storageUnavailable ? (
          <div className="parent-storage-notice" role="status">
            <span aria-hidden="true">!</span>
            <p>
              <strong>目前无法保存到这台电脑</strong>
              <span>本次设置和学习进度可能会在关闭页面后丢失。</span>
            </p>
          </div>
        ) : null}

        <div className="parent-panel-grid">
          <section className="parent-progress-card" aria-labelledby="local-progress-title">
            <div className="parent-card-heading">
              <div>
                <p className="section-kicker">学习概览</p>
                <h2 id="local-progress-title">本机学习进度</h2>
              </div>
              <span className="parent-course-count">
                <strong>{progress.completedCourseIds.length}</strong> / {COURSES.length} 课
              </span>
            </div>

            <div className="parent-stat-grid">
              <div><strong>{progressStats.percent}%</strong><span>总体完成</span></div>
              <div><strong>{progressStats.completedMinutes}</strong><span>已探索分钟</span></div>
              <div><strong>{progressStats.completedIslands} / {CURRICULUM_FACTS.islandCount}</strong><span>岛屿印章</span></div>
              <div><strong>{progressStats.remainingRounds}</strong><span>约剩周数 · 每周5次</span></div>
            </div>

            <div className="parent-badge-summary">
              <h3>{CURRICULUM_FACTS.islandCount} 岛进度</h3>
              <ul className="parent-island-progress">
                {islandProgress.map((island) => (
                  <li key={island.id}>
                    <span aria-hidden="true">{island.icon}</span>
                    <span>
                      <strong>{island.name}</strong>
                      <small>{island.completed} / {island.total} 课</small>
                    </span>
                    <progress
                      aria-label={`${island.name}完成进度`}
                      max={island.total}
                      value={island.completed}
                    />
                  </li>
                ))}
              </ul>

              <h3>已获得徽章</h3>
              {progress.badgeIds.length > 0 ? (
                <ul className="parent-badge-list">
                  {progress.badgeIds.map((badgeId) => (
                    <li key={badgeId}>
                      <span aria-hidden="true">★</span>
                      {BADGE_NAMES[badgeId] ?? badgeId}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>完成任意一课后，对应徽章会出现在这里。</p>
              )}
            </div>

            <div className="parent-next-guide">
              <h3>{nextCourseGuide ? "下一课家长提示" : "全部课程已完成"}</h3>
              {nextCourseGuide ? (
                <>
                  <strong>{nextCourseGuide.course.title}</strong>
                  <ul>
                    {nextCourseGuide.guide.objectives.map((objective) => (
                      <li key={objective}>{objective}</li>
                    ))}
                  </ul>
                  <p>{nextCourseGuide.guide.parentPrompt}</p>
                </>
              ) : (
                <p>请孩子挑选喜欢的课程重玩，并用自己的话讲解学到的本领。</p>
              )}
            </div>
            <div className="parent-review-guide">
              <h3>孩子标记的复习课</h3>
              <div className="parent-confidence-stats" aria-label={`已自评 ${confidenceStats.rated} 课`}><span><strong>{confidenceStats.confident}</strong>会讲</span><span><strong>{confidenceStats.practice}</strong>再练</span><span><strong>{confidenceStats.help}</strong>需帮助</span><span><strong>{confidenceStats.unrated}</strong>未自评</span></div>
              {reviewCourses.length ? <ul>{reviewCourses.map((course) => <li key={course.id}><span>{progress.confidenceByCourse[course.id] === "help" ? "🙋" : "↻"}</span><strong>{course.title}</strong><small>{progress.confidenceByCourse[course.id] === "help" ? "希望大人一起看看" : "想再练一次"}</small><button onClick={() => onStartCourse(course.id)} type="button">打开这课</button></li>)}</ul> : <p>孩子还没有标记需要复习的课程。</p>}
            </div>
          </section>

          <section className="parent-settings-card" aria-labelledby="learning-settings-title">
            <div className="parent-card-heading">
              <div>
                <p className="section-kicker">上课体验</p>
                <h2 id="learning-settings-title">声音与动画</h2>
              </div>
            </div>

            <label className="parent-setting-row">
              <span>
                <strong>声音提示</strong>
                <small>在互动后朗读比比的文字提示。</small>
              </span>
              <input
                checked={progress.settings.sound}
                onChange={(event) => updateSetting("sound", event.target.checked)}
                type="checkbox"
              />
              <span className="parent-switch" aria-hidden="true" />
            </label>

            <label className="parent-setting-row">
              <span>
                <strong>减少动画</strong>
                <small>停用漂浮、移动和提示脉冲效果。</small>
              </span>
              <input
                checked={progress.settings.reducedMotion}
                onChange={(event) => updateSetting("reducedMotion", event.target.checked)}
                type="checkbox"
              />
              <span className="parent-switch" aria-hidden="true" />
            </label>
          </section>
        </div>

        <ParentCurriculumOutline completedCourseIds={progress.completedCourseIds} />
        <ParentFamilyPlan completedCourseIds={progress.completedCourseIds} resume={progress.resume} />

        <section className="parent-backup-card" aria-labelledby="backup-progress-title">
          <div className="parent-backup-tools">
            <div><h2 id="backup-progress-title">备份学习记录</h2><p>只保存课程、徽章、自评选择和设置，不含姓名、账号、自由文本或答题内容。</p></div>
            <div>
              <button className="parent-secondary-action" onClick={downloadBackup} type="button">导出 JSON 备份</button>
              <button className="parent-secondary-action" onClick={() => backupInputRef.current?.click()} type="button">恢复以前的备份</button>
              <input accept="application/json,.json" className="visually-hidden" onChange={(event) => void restoreBackup(event.target.files?.[0])} ref={backupInputRef} tabIndex={-1} type="file" />
            </div>
            {backupStatus ? <p className="parent-backup-status" role="status">{backupStatus}</p> : null}
          </div>
        </section>

        <section className="parent-reset-card" aria-labelledby="reset-progress-title">
          <div>
            <h2 id="reset-progress-title">重置学习进度</h2>
            <p>保留声音和动画设置，只清除已完成课程、徽章、自评选择和续课位置。</p>
          </div>
          {resetConfirmationVisible ? (
            <div className="parent-reset-confirmation" role="alert">
              <p>清空后不能恢复。确定要继续吗？</p>
              <div>
                <button
                  className="parent-danger-action"
                  onClick={confirmReset}
                  type="button"
                >
                  确认清空这台电脑上的学习记录
                </button>
                <button
                  className="parent-secondary-action"
                  onClick={closeResetConfirmation}
                  ref={resetKeepButtonRef}
                  type="button"
                >
                  保留学习记录
                </button>
              </div>
            </div>
          ) : (
            <button
              className="parent-reset-action"
              onClick={() => setResetConfirmationVisible(true)}
              ref={resetActionButtonRef}
              type="button"
            >
              重置学习进度
            </button>
          )}
        </section>
      </section>
    </div>
  );
}
