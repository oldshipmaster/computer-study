import { GRID_OBSTACLES, GRID_SIZE, GRID_TARGETS, coordinateKey, type GridDirection, type GridState } from "@/lib/grid-city-lesson";

interface Props {
  state: GridState;
  onMove: (direction: GridDirection) => void;
}

export function GridCityGame({ state, onMove }: Props) {
  return <div className="grid-city-game">
    <div className="grid-label-row" aria-hidden="true">
      {Array.from({ length: GRID_SIZE }, (_, index) => <span key={index}>列{index + 1}</span>)}
    </div>
    <div className="grid-city" role="grid" aria-label="六行六列的方格城">
      {Array.from({ length: GRID_SIZE }, (_, rowIndex) => {
        const row = rowIndex + 1;
        return <div className="grid-row" key={row} role="row">
          {Array.from({ length: GRID_SIZE }, (__, colIndex) => {
            const cell = { row, col: colIndex + 1 };
            const key = coordinateKey(cell);
            const robot = state.position.row === cell.row && state.position.col === cell.col;
            const label = `第${cell.row}行第${cell.col}列${GRID_OBSTACLES.includes(key) ? "，障碍" : GRID_TARGETS.includes(key) ? "，坐标信标" : ""}${robot ? "，机器人在这里" : ""}`;
            return <div aria-label={label} className={`grid-cell ${GRID_OBSTACLES.includes(key) ? "is-obstacle" : ""} ${state.visitedTargets.includes(key) ? "is-visited" : ""}`} key={key} role="gridcell">
              <small>{cell.row},{cell.col}</small>
              <span>{robot ? "🤖" : GRID_OBSTACLES.includes(key) ? "🪨" : GRID_TARGETS.includes(key) ? "⭐" : ""}</span>
            </div>;
          })}
        </div>;
      })}
    </div>
    <div className="grid-controls" aria-label="机器人方向控制">
      <button onClick={() => onMove("up")} type="button">↑ 上</button>
      <button onClick={() => onMove("left")} type="button">← 左</button>
      <button onClick={() => onMove("down")} type="button">↓ 下</button>
      <button onClick={() => onMove("right")} type="button">→ 右</button>
    </div>
    <p role="status">{state.feedback} 已找到 {state.visitedTargets.length}/3 个信标。</p>
  </div>;
}
