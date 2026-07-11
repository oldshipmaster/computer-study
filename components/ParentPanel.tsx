"use client";

import { useEffect, useRef, useState } from "react";
import { COURSES } from "@/lib/course-data";

export interface ParentProgress {
  completedCourseIds: string[];
  badgeIds: string[];
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
  onClose: () => void;
}

const BADGE_NAMES: Record<string, string> = {
  "keyboard-pilot": "键盘领航员",
};

export function ParentPanel({
  progress,
  storageUnavailable,
  onSettingsChange,
  onReset,
  onClose,
}: ParentPanelProps) {
  const [resetConfirmationVisible, setResetConfirmationVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const resetActionButtonRef = useRef<HTMLButtonElement>(null);
  const resetConfirmationButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

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

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === lastElement ||
            !panelRef.current.contains(document.activeElement))
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (resetConfirmationVisible) {
      queueMicrotask(() => resetConfirmationButtonRef.current?.focus());
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

            <div className="parent-badge-summary">
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
                <p>完成第一课后，徽章会出现在这里。</p>
              )}
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

        <section className="parent-reset-card" aria-labelledby="reset-progress-title">
          <div>
            <h2 id="reset-progress-title">重置学习进度</h2>
            <p>保留声音和动画设置，只清除已完成课程、徽章和续课位置。</p>
          </div>
          {resetConfirmationVisible ? (
            <div className="parent-reset-confirmation" role="alert">
              <p>清空后不能恢复。确定要继续吗？</p>
              <div>
                <button
                  className="parent-danger-action"
                  onClick={confirmReset}
                  ref={resetConfirmationButtonRef}
                  type="button"
                >
                  确认清空这台电脑上的学习记录
                </button>
                <button
                  className="parent-secondary-action"
                  onClick={closeResetConfirmation}
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
