import { useState } from "react";
import { inspectPrompt, type PromptAction, type PromptSignals } from "@/lib/popup-fog-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";
import "./PromptInspector.css";

const CASES: Array<{ title: string; body: string; source: string; signals: PromptSignals }> = [
  { title: "恭喜中奖！马上输入密码", body: "只剩 10 秒，立刻领取。", source: "prize-now.example", signals: { trustedSource: false, urgent: true, asksSecret: true, download: false, expected: false } },
  { title: "安装超级加速器", body: "点击下载陌生程序。", source: "fast-game.example", signals: { trustedSource: false, urgent: false, asksSecret: false, download: true, expected: false } },
  { title: "课程需要打开讲义", body: "老师说今天会用这份文件，请家长确认。", source: "school.example", signals: { trustedSource: true, urgent: false, asksSecret: false, download: true, expected: true } },
  { title: "休息提醒", body: "你已经学习一会儿了，看看远处。", source: "比特岛课程", signals: { trustedSource: true, urgent: false, asksSecret: false, download: false, expected: true } },
  { title: "账号将在一分钟后消失", body: "发送验证码才能保留账号。", source: "account-help.example", signals: { trustedSource: false, urgent: true, asksSecret: true, download: false, expected: false } },
];
const SIGNALS: Array<{ id: keyof PromptSignals; label: string; icon: string }> = [{ id: "trustedSource", label: "来源可信", icon: "🏷️" }, { id: "urgent", label: "催促行动", icon: "⏱️" }, { id: "asksSecret", label: "索要秘密", icon: "🔑" }, { id: "download", label: "包含下载", icon: "⬇️" }, { id: "expected", label: "符合当前任务", icon: "🎯" }];
const ACTIONS: Array<{ id: PromptAction; label: string }> = [{ id: "close", label: "关闭，不操作" }, { id: "ask", label: "给大人看" }, { id: "continue", label: "确认后继续" }];
interface Props { onComplete: () => void; }

export function PromptInspector({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("先检查来源和请求，再选择行动。" );
  const [scanned, setScanned] = useState<Array<keyof PromptSignals>>([]);
  const [records, setRecords] = useState<Array<{ title: string; action: PromptAction; flags: string[] }>>([]);
  const [finished, setFinished] = useState(false);
  const current = CASES[index];
  const inspection = inspectPrompt(current.signals);
  function scan(id: keyof PromptSignals) { setScanned((items) => items.includes(id) ? items : [...items, id]); }
  function signalIsRisk(id: keyof PromptSignals) { return id === "trustedSource" ? !current.signals[id] : id === "expected" ? !current.signals[id] : id === "download" ? current.signals.download && !current.signals.expected : current.signals[id]; }
  function choose(action: PromptAction, detail: number) {
    if (scanned.length < SIGNALS.length || isRepeatedPointerActivation(detail)) return;
    if (action !== inspection.action) { setFeedback("先别点弹窗里的内容。用扫描结果检查来源、催促、秘密和下载线索。" ); return; }
    setRecords((items) => [...items, { title: current.title, action, flags: inspection.warningFlags }]);
    if (index === CASES.length - 1) { setFinished(true); setFeedback("五个虚拟提示都完成了安全扫描。" ); }
    else { setIndex((value) => value + 1); setScanned([]); setFeedback("判断完成，迷雾散开一层。" ); }
  }
  return <div className="prompt-inspector">{!finished ? <>
    <div className="fake-browser"><header><span>虚拟页面 · 不会打开链接</span><code>{current.source}</code></header><section><h2 aria-live="polite">{current.title}</h2><p>{current.body}</p></section></div>
    <div className="prompt-signal-scanner" aria-label="五项弹窗安全扫描" role="group">{SIGNALS.map((signal) => { const revealed = scanned.includes(signal.id); const risk = revealed && signalIsRisk(signal.id); return <button aria-pressed={revealed} className={risk ? "is-risk" : revealed ? "is-clear" : ""} key={signal.id} onClick={() => scan(signal.id)} type="button"><span>{signal.icon}</span><strong>{signal.label}</strong><small>{revealed ? risk ? "⚠ 风险信号" : "✓ 未发现风险" : "点击扫描"}</small></button>; })}</div>
    <p className="scanner-summary">已扫描 {scanned.length}/5：{scanned.length === 5 ? inspection.warningFlags.length ? inspection.warningFlags.join("、") : "来源可信、内容符合预期" : "完成全部扫描后再行动"}</p>
    <div className="prompt-actions">{ACTIONS.map((action) => <button disabled={scanned.length < SIGNALS.length} key={action.id} onClick={(event) => choose(action.id, event.detail)} type="button">{action.label}</button>)}</div>
  </> : <section className="prompt-finish"><span aria-hidden="true">🔍🛡️</span><h2>五案扫描完成</h2><ul>{records.map((record) => <li key={record.title}><strong>{record.title}</strong><small>{record.flags.length ? record.flags.join("、") : "低风险且符合任务"} → {ACTIONS.find((item) => item.id === record.action)?.label}</small></li>)}</ul><button className="primary-action" onClick={onComplete} type="button">完成弹窗安全扫描</button></section>}
    <p role="status">{feedback} 案例 {Math.min(index + 1, 5)}/5</p>
  </div>;
}
