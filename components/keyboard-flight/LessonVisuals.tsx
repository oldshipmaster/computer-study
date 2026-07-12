import { CHALLENGE } from "@/lib/flight-engine.mjs";
import {
  KEY_DEFINITIONS,
  samePosition,
  type Direction,
  type KeyDefinition,
  type Position,
} from "@/components/keyboard-flight/lesson-model";

interface FlightGridProps {
  collected: boolean;
  direction: Direction;
  label: string;
  position: Position;
}

export function FlightGrid({ collected, direction, label, position }: FlightGridProps) {
  const cells = Array.from({ length: CHALLENGE.width * CHALLENGE.height }, (_, index) => ({
    x: index % CHALLENGE.width,
    y: Math.floor(index / CHALLENGE.width),
  }));

  return (
    <div className="flight-grid" role="img" aria-label={label}>
      {cells.map((cell) => {
        const hasShip = samePosition(cell, position);
        const hasAsteroid = CHALLENGE.asteroids.some((asteroid) =>
          samePosition(cell, asteroid),
        );
        const hasStar = !collected && samePosition(cell, CHALLENGE.star);

        return (
          <span className="flight-grid-cell" key={`${cell.x}-${cell.y}`}>
            {hasStar ? (
              <span className="energy-star" aria-hidden="true">
                ★
              </span>
            ) : null}
            {hasAsteroid ? (
              <span className="flight-asteroid" aria-hidden="true">
                <span />
                <span />
              </span>
            ) : null}
            {hasShip ? (
              <span className="flight-ship" data-direction={direction} aria-hidden="true">
                <span className="flight-ship-window" />
                <span className="flight-ship-flame" />
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

interface KeyboardDiagramProps {
  activeKey: KeyDefinition["key"] | null;
  completedKeys?: Set<string>;
  disabled?: boolean;
  highlightedKey: KeyDefinition["key"] | null;
  onKey: (key: KeyDefinition["key"]) => void;
}

const EMPTY_KEYS = new Set<string>();

export function KeyboardDiagram({
  activeKey,
  completedKeys,
  disabled = false,
  highlightedKey,
  onKey,
}: KeyboardDiagramProps) {
  const trackedKeys = completedKeys ?? EMPTY_KEYS;

  return (
    <div className="lesson-keyboard" aria-label="方向键和空格键" role="group">
      {KEY_DEFINITIONS.map((item) => {
        const completed = trackedKeys.has(item.key);
        const classNames = [
          "lesson-key",
          activeKey === item.key ? "is-active" : "",
          completed ? "is-complete" : "",
          highlightedKey === item.key ? "is-hinting" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            aria-label={`${item.label}，${item.name}`}
            aria-pressed={completedKeys ? completed : undefined}
            className={classNames}
            data-key-slot={item.slot}
            disabled={disabled}
            key={item.key}
            onClick={() => onKey(item.key)}
            type="button"
          >
            <span className="lesson-key-symbol" aria-hidden="true">
              {item.label}
            </span>
            <span className="lesson-key-name">{completed ? "已点亮" : item.name}</span>
          </button>
        );
      })}
    </div>
  );
}
