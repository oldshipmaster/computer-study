import type { DragEvent, Ref } from "react";
import { FlightGrid } from "@/components/keyboard-flight/LessonVisuals";
import {
  FAILURE_MESSAGE,
  PROGRAM_DEFINITIONS,
  instructionLabel,
  type Direction,
  type Position,
  type ProgramInstruction,
  type ProgramQueueItem,
  type RunState,
} from "@/components/keyboard-flight/lesson-model";

interface ProgramStageProps {
  collected: boolean;
  currentInstruction: number | null;
  direction: Direction;
  guidance: string | null;
  headingRef: Ref<HTMLHeadingElement>;
  highlightRunButton: boolean;
  highlightedInstruction: ProgramInstruction | null;
  highlightedQueueIndex: number | null;
  onAdd: (instruction: ProgramInstruction) => void;
  onDragStart: (index: number) => void;
  onDrop: (targetIndex: number) => void;
  onMove: (index: number, offset: -1 | 1) => void;
  onRemove: (index: number) => void;
  onRun: () => void;
  position: Position;
  queue: ProgramQueueItem[];
  runLabel: string;
  runState: RunState;
  title: string;
}

export function ProgramStage({
  collected,
  currentInstruction,
  direction,
  guidance,
  headingRef,
  highlightRunButton,
  highlightedInstruction,
  highlightedQueueIndex,
  onAdd,
  onDragStart,
  onDrop,
  onMove,
  onRemove,
  onRun,
  position,
  queue,
  runLabel,
  runState,
  title,
}: ProgramStageProps) {
  const running = runState === "running";

  return (
    <section className="flight-stage-card" aria-labelledby="program-title">
      <div className="stage-heading">
        <div>
          <p className="section-kicker">顺序挑战</p>
          <h1
            className="screen-focus-heading"
            data-lesson-stage-heading
            id="program-title"
            ref={headingRef}
            tabIndex={-1}
          >
            {title}
          </h1>
        </div>
        <span className="stage-score">{queue.length} 块积木</span>
      </div>

      <div className="program-layout">
        <div className="program-workbench">
          <div className="instruction-palette" aria-label="可以添加的指令积木">
            {PROGRAM_DEFINITIONS.map((definition) => (
              <button
                className={`instruction-add instruction-add--${definition.instruction} ${
                  highlightedInstruction === definition.instruction ? "is-hinting" : ""
                }`}
                disabled={running}
                key={definition.instruction}
                onClick={() => onAdd(definition.instruction)}
                type="button"
              >
                <span aria-hidden="true">{definition.symbol}</span>
                {definition.label}
              </button>
            ))}
          </div>

          <div className="program-track">
            <div className="program-track-heading">
              <strong>飞行顺序</strong>
              <span>可拖动，也可用每块积木上的按钮调整</span>
            </div>
            {queue.length === 0 ? (
              <p className="empty-program">点击上方积木，把第一条指令放到这里。</p>
            ) : (
              <ol className="program-queue" aria-label="飞船指令顺序">
                {queue.map((item, index) => {
                  const { instruction } = item;
                  return (
                    <li
                      aria-current={currentInstruction === index ? "step" : undefined}
                      className={`program-block program-block--${instruction} ${
                        currentInstruction === index ? "is-current" : ""
                      } ${highlightedQueueIndex === index ? "is-hinting" : ""}`}
                      draggable={!running}
                      key={item.id}
                      onDragOver={(event: DragEvent<HTMLLIElement>) => event.preventDefault()}
                      onDragStart={(event: DragEvent<HTMLLIElement>) => {
                        onDragStart(index);
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", String(index));
                      }}
                      onDrop={(event: DragEvent<HTMLLIElement>) => {
                        event.preventDefault();
                        onDrop(index);
                      }}
                    >
                      <span className="program-step-number">{index + 1}</span>
                      <strong>{instructionLabel(instruction)}</strong>
                      <span className="program-block-controls">
                        <button
                          aria-label={`把第 ${index + 1} 步向左移动`}
                          disabled={running || index === 0}
                          onClick={() => onMove(index, -1)}
                          type="button"
                        >
                          ←
                        </button>
                        <button
                          aria-label={`把第 ${index + 1} 步向右移动`}
                          disabled={running || index === queue.length - 1}
                          onClick={() => onMove(index, 1)}
                          type="button"
                        >
                          →
                        </button>
                        <button
                          aria-label={`移除第 ${index + 1} 步${instructionLabel(instruction)}`}
                          disabled={running}
                          onClick={() => onRemove(index)}
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {guidance ? (
            <p className="one-step-guidance">
              <span aria-hidden="true">💡</span>
              {guidance}
            </p>
          ) : null}

          <button
            className={`run-program-action ${highlightRunButton ? "is-hinting" : ""}`}
            disabled={running || queue.length === 0}
            onClick={onRun}
            type="button"
          >
            {runLabel}
            <span aria-hidden="true">▶</span>
          </button>
        </div>

        <div className="program-flight-view">
          <FlightGrid
            collected={collected}
            direction={direction}
            label={
              runState === "failure"
                ? "飞船已安全返回起点"
                : `编程飞船位于第 ${position.x + 1} 列第 ${position.y + 1} 行`
            }
            position={position}
          />
          <p>
            {runState === "failure"
              ? FAILURE_MESSAGE
              : running
                ? "看，积木正在一块一块亮起。"
                : "陨石不会移动，先想好绕开的顺序。"}
          </p>
        </div>
      </div>
    </section>
  );
}
