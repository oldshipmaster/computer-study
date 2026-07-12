import { useState } from "react";
import { DEVICE_CASES, tryDeviceCheck } from "@/lib/troubleshoot-machine-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";
import "./DeviceClinic.css";

const CHECKS = [{ id: "check-power", label: "检查外部电源状态" }, { id: "check-volume", label: "检查静音和音量" }, { id: "restart-app", label: "只重开无响应程序" }, { id: "check-focus", label: "检查焦点并请大人看连接" }];
const CASE_ICONS: Record<string, string> = { dark: "🖥️", silent: "🔇", frozen: "🎨", keyboard: "⌨️" };
interface Props { onComplete: () => void; }

export function DeviceClinic({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("读现象和线索，选择最简单、可逆的检查。" );
  const [selectedCheck, setSelectedCheck] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [wrongCount, setWrongCount] = useState(0);
  const deviceCase = DEVICE_CASES[index];
  const selectedLabel = CHECKS.find((item) => item.id === selectedCheck)?.label;
  function check(id: string, detail: number) {
    if (solved || finished || isRepeatedPointerActivation(detail)) return;
    const result = tryDeviceCheck(deviceCase, id);
    const label = CHECKS.find((item) => item.id === id)?.label ?? id;
    setSelectedCheck(id);
    setFeedback(result.feedback);
    setAttempts((items) => [...items, `${label}：${result.solved ? "重新测试后恢复" : "不能解释线索"}`]);
    if (result.solved) setSolved(true); else setWrongCount((value) => value + 1);
  }
  function nextCase() {
    if (!solved) return;
    if (index === DEVICE_CASES.length - 1) { setFinished(true); setFeedback("四个虚拟案例都完成了安全排查。" ); return; }
    setIndex((value) => value + 1);
    setSelectedCheck(null);
    setSolved(false);
    setAttempts([]);
    setFeedback("新案例开始：先说清现象，再用线索选择一项检查。" );
  }
  return (
    <div className="device-clinic">
      {!finished ? <>
        <section className="clinic-case"><span>{CASE_ICONS[deviceCase.id]} 案例 {index + 1}/4</span><h2 aria-live="polite">{deviceCase.symptom}</h2><p><strong>观察线索：</strong>{deviceCase.clue}</p></section>
        <ol className="diagnosis-evidence-chain" aria-label="安全诊断证据链"><li className="is-complete"><small>1 · 现象</small><strong>{deviceCase.symptom}</strong></li><li className="is-complete"><small>2 · 线索</small><strong>{deviceCase.clue}</strong></li><li className={selectedCheck ? "is-complete" : ""}><small>3 · 单一检查</small><strong>{selectedLabel ?? "等待选择"}</strong></li><li className={solved ? "is-complete" : ""}><small>4 · 重新测试</small><strong>{solved ? "原来的动作恢复正常" : "等待检查结果"}</strong></li></ol>
        <div className="clinic-checks" role="group" aria-label="选择一项安全检查">{CHECKS.map((item) => <button aria-pressed={selectedCheck === item.id} disabled={solved} key={item.id} onClick={(event) => check(item.id, event.detail)} type="button">{item.label}</button>)}</div>
        <aside className="clinic-attempts"><strong>检查记录</strong>{attempts.length ? <ol>{attempts.map((item, attemptIndex) => <li key={`${item}-${attemptIndex}`}>{item}</li>)}</ol> : <p>每次只改一处，结果会记录在这里。</p>}</aside>
        {solved ? <button className="primary-action" onClick={nextCase} type="button">{index === DEVICE_CASES.length - 1 ? "查看诊断总结" : "确认恢复，下一案例"}</button> : null}
      </> : <section className="clinic-finish"><span aria-hidden="true">🩺✨</span><h2>四案诊断完成</h2><p>你完成了现象 → 线索 → 单一检查 → 重新测试的安全证据链。</p><p>额外尝试 {wrongCount} 次；尝试本身也是收集证据。</p><button className="primary-action" onClick={onComplete} type="button">完成安全排查训练</button></section>}
      <p role="status">{feedback}</p>
      <aside className="clinic-safety">停止并找大人：有液体、焦味、异常发热、火花，或需要接触插座和设备内部时。</aside>
    </div>
  );
}
