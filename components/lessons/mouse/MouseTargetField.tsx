interface MouseTargetFieldProps {
  visited: readonly string[];
  onVisit: (targetId: string) => void;
}

const TARGETS = ["light-1", "light-2", "light-3"] as const;

export function MouseTargetField({ visited, onVisit }: MouseTargetFieldProps) {
  return (
    <div className="mouse-target-field" aria-label="导航灯训练区" role="group">
      {TARGETS.map((targetId, index) => (
        <button
          aria-label={`导航灯 ${index + 1}${visited.includes(targetId) ? "，已找到" : ""}`}
          className={`mouse-light mouse-light--${index + 1} ${visited.includes(targetId) ? "is-found" : ""}`}
          key={targetId}
          onFocus={() => onVisit(targetId)}
          onPointerEnter={() => onVisit(targetId)}
          type="button"
        >
          {visited.includes(targetId) ? "✓" : index + 1}
        </button>
      ))}
    </div>
  );
}
