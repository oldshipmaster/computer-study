import { useState } from "react";
import { bitsToColor, bitsToNumber, type Bit } from "@/lib/bits-data-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const TASKS = [{ kind: "number", width: 4, target: 5, label: "用 4 个比特表示数字 5" }, { kind: "number", width: 4, target: 10, label: "用 4 个比特表示数字 10" }, { kind: "number", width: 8, target: 65, label: "用一个字节表示数字 65" }, { kind: "color", width: 3, target: "magenta", label: "打开红色和蓝色通道，调出品红色" }] as const;
const CHANNELS = [{ name: "红", color: "red" }, { name: "绿", color: "green" }, { name: "蓝", color: "blue" }];
interface Props { onComplete: () => void; }

export function BitBoard({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const task = TASKS[index];
  const width = task.width;
  const [bits, setBits] = useState<Bit[]>(Array(width).fill(0));
  const value = task.kind === "color" ? bitsToColor(bits) : bitsToNumber(bits);
  const correct = value === task.target;
  function toggle(bitIndex: number) { setBits((current) => current.map((bit, i) => i === bitIndex ? (bit === 0 ? 1 : 0) : bit)); }
  function next(detail: number) { if (isRepeatedPointerActivation(detail) || !correct) return; if (index === TASKS.length - 1) onComplete(); else { const nextIndex = index + 1; setIndex(nextIndex); setBits(Array(TASKS[nextIndex].width).fill(0)); } }

  return <div className="bit-board"><h2 aria-live="polite">{task.label}</h2>{width === 8 ? <p className="byte-definition"><strong>1 字节 = 8 比特</strong><span>这一排可表示 0 到 255</span></p> : null}<div aria-label="比特开关" className={`bit-switches ${width === 8 ? "bit-switches--byte" : ""}`} role="group">{bits.map((bit, bitIndex) => <button aria-pressed={bit === 1} key={bitIndex} onClick={() => toggle(bitIndex)} type="button"><span>{bit}</span><small>{task.kind === "color" ? `${CHANNELS[bitIndex].name}通道` : `位值 ${2 ** (width - bitIndex - 1)}`}</small></button>)}</div>{task.kind === "number" ? <div aria-label="二进制位值相加过程" className="binary-equation" role="list">{bits.map((bit, bitIndex) => { const weight = 2 ** (width - bitIndex - 1); return <span className={bit ? "bit-weight--active" : ""} key={weight} role="listitem"><small>{bit} × {weight}</small><strong>{bit * weight}</strong></span>; })}<b aria-hidden="true">相加 ＝</b><strong>{value}</strong></div> : <div aria-label="红绿蓝颜色通道" className="color-channels" role="list">{bits.map((bit, bitIndex) => <span className={`color-channel color-channel--${CHANNELS[bitIndex].color}${bit ? " color-channel--on" : ""}`} key={CHANNELS[bitIndex].name} role="listitem"><i aria-hidden="true" /><strong>{CHANNELS[bitIndex].name}通道</strong><small>{bit ? "打开 · 1" : "关闭 · 0"}</small></span>)}</div>}<div className={`bit-result bit-result--${String(value)}`}><span>解释结果</span><strong>{String(value)}</strong></div><p aria-live="polite" role="status">{correct ? "编码正确！同一排 0 和 1 按当前规则解释成功。" : "切换比特灯，再观察解释结果。"}</p><button className="primary-action" disabled={!correct} onClick={(event) => next(event.detail)} type="button">下一组数据</button></div>;
}
