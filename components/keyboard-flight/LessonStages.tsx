import { CHALLENGE } from "@/lib/flight-engine.mjs";
import { FlightGrid, KeyboardDiagram } from "@/components/keyboard-flight/LessonVisuals";
import {
  KEY_DEFINITIONS,
  type Direction,
  type KeyDefinition,
  type Position,
} from "@/components/keyboard-flight/lesson-model";

interface IntroStageProps {
  onSkip: () => void;
}

export function IntroStage({ onSkip }: IntroStageProps) {
  return (
    <section className="flight-stage-card flight-stage-card--intro" aria-labelledby="intro-title">
      <div className="stage-copy">
        <p className="section-kicker">启航港 · 剧情</p>
        <h1 id="intro-title">飞船正在等待小领航员</h1>
        <p>控制台需要五个键盘信号。短短几秒后，我们就开始热身。</p>
        <button className="primary-action" onClick={onSkip} type="button">
          跳过动画，开始热身
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="launch-sequence" aria-hidden="true">
        <span className="launch-orbit launch-orbit--one" />
        <span className="launch-orbit launch-orbit--two" />
        <span className="intro-flight-ship">
          <span className="flight-ship-window" />
          <span className="flight-ship-flame" />
        </span>
        <span className="launch-signal">···</span>
      </div>
    </section>
  );
}

interface KeysStageProps {
  activeKey: KeyDefinition["key"] | null;
  highlightContinue: boolean;
  highlightedKey: KeyDefinition["key"] | null;
  onContinue: () => void;
  onKey: (key: KeyDefinition["key"]) => void;
  pressedKeys: Set<string>;
  title: string;
}

export function KeysStage({
  activeKey,
  highlightContinue,
  highlightedKey,
  onContinue,
  onKey,
  pressedKeys,
  title,
}: KeysStageProps) {
  const tutorialComplete = pressedKeys.size === KEY_DEFINITIONS.length;

  return (
    <section className="flight-stage-card" aria-labelledby="keys-title">
      <div className="stage-heading">
        <div>
          <p className="section-kicker">控制台校准</p>
          <h1 id="keys-title">{title}</h1>
        </div>
        <span className="stage-score">已点亮 {pressedKeys.size} / 5</span>
      </div>
      <div className="key-stage-layout">
        <KeyboardDiagram
          activeKey={activeKey}
          completedKeys={pressedKeys}
          highlightedKey={highlightedKey}
          onKey={onKey}
        />
        <div className="key-stage-status">
          <span className="control-console" aria-hidden="true">
            {KEY_DEFINITIONS.map((definition) => (
              <span
                className={pressedKeys.has(definition.key) ? "is-on" : ""}
                key={definition.key}
              />
            ))}
          </span>
          <strong>{tutorialComplete ? "控制台已恢复" : "每个按键按一次"}</strong>
          <p>真实键盘和画面按键都可以完成热身。</p>
          {tutorialComplete ? (
            <button
              className={`primary-action ${highlightContinue ? "is-hinting" : ""}`}
              onClick={onContinue}
              type="button"
            >
              进入飞船训练场
              <span aria-hidden="true">→</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

interface PracticeStageProps {
  activeKey: KeyDefinition["key"] | null;
  collected: boolean;
  direction: Direction;
  highlightContinue: boolean;
  highlightedKey: KeyDefinition["key"] | null;
  onContinue: () => void;
  onKey: (key: KeyDefinition["key"]) => void;
  position: Position;
  title: string;
}

export function PracticeStage({
  activeKey,
  collected,
  direction,
  highlightContinue,
  highlightedKey,
  onContinue,
  onKey,
  position,
  title,
}: PracticeStageProps) {
  return (
    <section className="flight-stage-card" aria-labelledby="practice-title">
      <div className="stage-heading">
        <div>
          <p className="section-kicker">实机练习</p>
          <h1 id="practice-title">{title}</h1>
        </div>
        <span className="stage-score">{collected ? "能量已收集" : "目标：能量星"}</span>
      </div>
      <div className="practice-layout">
        <FlightGrid
          collected={collected}
          direction={direction}
          label={
            collected
              ? "飞船已收集能量星"
              : `飞船位于第 ${position.x + 1} 列第 ${position.y + 1} 行，能量星位于第 ${CHALLENGE.star.x + 1} 列第 ${CHALLENGE.star.y + 1} 行`
          }
          position={position}
        />
        <div className="practice-controls">
          <KeyboardDiagram
            activeKey={activeKey}
            disabled={collected}
            highlightedKey={highlightedKey}
            onKey={onKey}
          />
          {collected ? (
            <button
              className={`primary-action ${highlightContinue ? "is-hinting" : ""}`}
              onClick={onContinue}
              type="button"
            >
              进入指令积木
              <span aria-hidden="true">→</span>
            </button>
          ) : (
            <p className="control-tip">提示：方向键移动，空格键收集。</p>
          )}
        </div>
      </div>
    </section>
  );
}

interface CompleteStageProps {
  badgeName: string;
  onExit: () => void;
}

export function CompleteStage({ badgeName, onExit }: CompleteStageProps) {
  return (
    <section
      className="flight-stage-card flight-stage-card--complete"
      aria-labelledby="lesson-complete-title"
    >
      <div className="completion-badge" aria-label={`获得${badgeName}徽章`}>
        <span aria-hidden="true">★</span>
        <strong>{badgeName}</strong>
        <small>新徽章</small>
      </div>
      <div className="stage-copy">
        <p className="section-kicker">任务完成</p>
        <h1 id="lesson-complete-title">你点亮了第一段航线</h1>
        <p>你认识了方向键和空格键，也发现指令会从第一步开始按顺序执行。</p>
        <button className="primary-action" onClick={onExit} type="button">
          回到岛屿地图
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
