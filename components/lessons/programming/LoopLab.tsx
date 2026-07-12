import { useState } from "react";
import { runSquareLoop } from "@/lib/repeat-power-lesson";

interface Props { onSuccess: () => void; }

export function LoopLab({ onSuccess }: Props) {
  const [count, setCount] = useState(1);
  const [ran, setRan] = useState(false);
  const result = runSquareLoop(count);
  const drawnEdges = ran ? Math.min(count, 4) : 0;

  return <div className="loop-lab"><div aria-label={`机器人路径：画出 ${drawnEdges} 条边，位置 x ${result.position.x}、y ${result.position.y}`} className="loop-path-board" role="img"><span className={drawnEdges >= 1 ? "path-edge path-edge--top path-edge--drawn" : "path-edge path-edge--top"} /><span className={drawnEdges >= 2 ? "path-edge path-edge--right path-edge--drawn" : "path-edge path-edge--right"} /><span className={drawnEdges >= 3 ? "path-edge path-edge--bottom path-edge--drawn" : "path-edge path-edge--bottom"} /><span className={drawnEdges >= 4 ? "path-edge path-edge--left path-edge--drawn" : "path-edge path-edge--left"} />{[0, 1, 2, 3].map((corner) => <span className={drawnEdges > corner ? `loop-battery loop-battery--${corner} battery--collected` : `loop-battery loop-battery--${corner}`} key={corner}>🔋</span>)}<strong className="loop-robot">🤖</strong>{ran && count > 4 ? <em>又走了 {count - 4} 步，越过起点</em> : null}</div><div className="loop-block"><strong>重复</strong><label><span className="sr-only">重复次数</span><select onChange={(event) => { setCount(Number(event.target.value)); setRan(false); }} value={count}>{[1,2,3,4,5,6].map((value) => <option key={value} value={value}>{value} 次</option>)}</select></label><div><span>向前走一步</span><span>右转</span></div></div><p aria-live="polite" role="status">{ran ? result.success ? "正方形闭合，四块电池全部收集！" : `执行了 ${count} 次，收集 ${result.batteries} 块电池，机器人停在 (${result.position.x}, ${result.position.y})，路线还没有闭合。` : "先预测需要重复几次，再运行。"}</p><button className="primary-action" onClick={() => { setRan(true); if (result.success) onSuccess(); }} type="button">运行循环</button><small>循环积木 1 个 + 身体 2 条，比写 8 条重复指令更清楚。</small></div>;
}
