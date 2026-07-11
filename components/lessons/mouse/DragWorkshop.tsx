import { useState } from "react";

interface DragWorkshopProps {
  delivered: readonly string[];
  onDrop: (crateId: string, bayId: string) => void;
}

const ITEMS = [
  { id: "red", label: "红色" },
  { id: "blue", label: "蓝色" },
  { id: "green", label: "绿色" },
] as const;

export function DragWorkshop({ delivered, onDrop }: DragWorkshopProps) {
  const [selectedCrate, setSelectedCrate] = useState<string | null>(null);

  return (
    <div className="drag-workshop">
      <div className="crate-row" aria-label="补给箱">
        {ITEMS.map((item) => (
          <button
            aria-pressed={selectedCrate === item.id}
            className={`supply-crate supply-crate--${item.id}`}
            disabled={delivered.includes(item.id)}
            draggable={!delivered.includes(item.id)}
            key={item.id}
            onClick={() => setSelectedCrate(item.id)}
            onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
            type="button"
          >
            {delivered.includes(item.id) ? "已送达" : `${item.label}补给箱`}
          </button>
        ))}
      </div>
      <div className="bay-row" aria-label="停靠位">
        {ITEMS.map((item) => (
          <button
            className={`supply-bay supply-bay--${item.id}`}
            key={item.id}
            onClick={() => selectedCrate && onDrop(selectedCrate, item.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              onDrop(event.dataTransfer.getData("text/plain"), item.id);
            }}
            type="button"
          >
            {item.label}停靠位
          </button>
        ))}
      </div>
      <p className="interaction-help">可拖动补给箱；也可以先点补给箱，再点同色停靠位。</p>
    </div>
  );
}
