import { useState } from "react";
import { runSquareLoop } from "@/lib/repeat-power-lesson";
interface Props { onSuccess: () => void; }
export function LoopLab({ onSuccess }: Props) {
  const [count, setCount] = useState(1); const [ran, setRan] = useState(false); const result = runSquareLoop(count);
  return <div className="loop-lab"><div className="loop-scene" aria-label="机器人画正方形" role="img"><span>🔋</span><span>—</span><span>🔋</span><br/><span>|</span><span>🤖</span><span>|</span><br/><span>🔋</span><span>—</span><span>🔋</span></div><div className="loop-block"><strong>重复</strong><label><span className="sr-only">重复次数</span><select onChange={(event) => { setCount(Number(event.target.value)); setRan(false); }} value={count}>{[1,2,3,4,5,6].map((value) => <option key={value} value={value}>{value} 次</option>)}</select></label><div><span>向前走一步</span><span>右转</span></div></div><p role="status">{ran ? result.success ? "正方形闭合，四块电池全部收集！" : `执行了 ${count} 次，收集 ${result.batteries} 块电池，路线还没有闭合。` : "先预测需要重复几次，再运行。"}</p><button className="primary-action" onClick={() => { setRan(true); if (result.success) onSuccess(); }} type="button">运行循环</button><small>循环积木 1 个 + 身体 2 条，比写 8 条重复指令更清楚。</small></div>;
}
