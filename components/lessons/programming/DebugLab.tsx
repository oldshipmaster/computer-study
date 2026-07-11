import { useState } from "react";
import { BUG_CASES, applyFix, diagnoseBug, type FixId } from "@/lib/bug-catcher-lesson";
const FIXES: Array<{ id: FixId; label: string }> = [{ id: "swap-first-two", label: "交换前两条指令" }, { id: "repeat-four", label: "把重复 3 次改成 4 次" }, { id: "swap-branches", label: "交换那么和否则分支" }];
interface Props { onComplete: () => void; }
export function DebugLab({ onComplete }: Props) {
  const [index, setIndex] = useState(0); const [feedback, setFeedback] = useState("先读期望和实际，再选择最小修改。"); const bugCase = BUG_CASES[index]; const diagnosis = diagnoseBug(bugCase);
  function fix(id: FixId) { const result = applyFix(bugCase, id); setFeedback(result.feedback); if (result.fixed) { if (index === BUG_CASES.length - 1) onComplete(); else setIndex((value) => value + 1); } }
  return <div className="debug-lab"><header><span>🐛 案例 {index + 1}/3</span><h2>{bugCase.title}</h2></header><div className="debug-columns"><section><h3>程序</h3><ol>{bugCase.program.map((line, lineIndex) => <li key={`${line}-${lineIndex}`}>{line}</li>)}</ol></section><section><h3>运行证据</h3><p>{diagnosis.evidence}</p><strong>小虫类型：{diagnosis.bugType === "order" ? "顺序" : diagnosis.bugType === "count" ? "次数" : "分支"}</strong></section></div><fieldset><legend>只改一处，再测试</legend>{FIXES.map((fixOption) => <button key={fixOption.id} onClick={() => fix(fixOption.id)} type="button">{fixOption.label}</button>)}</fieldset><p role="status">{feedback}</p></div>;
}
