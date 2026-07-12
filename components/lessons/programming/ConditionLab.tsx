import { useState } from "react";
import { runSafetyProgram, type SafetyInputs } from "@/lib/rainy-condition-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const SCENARIOS: SafetyInputs[] = [{ raining: true, bridgeOpen: false }, { raining: false, bridgeOpen: true }, { raining: true, bridgeOpen: true }];
interface Props { onComplete: () => void; }

export function ConditionLab({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [bridgeAction, setBridgeAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("观察条件，再选择两个分支结果。");
  const scenario = SCENARIOS[index];
  const expected = runSafetyProgram(scenario);

  function check(detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    if (equipment === expected.equipment && bridgeAction === expected.bridgeAction) {
      if (index === SCENARIOS.length - 1) onComplete();
      else { setIndex((value) => value + 1); setEquipment(null); setBridgeAction(null); setFeedback("条件改变了，请重新运行同一段程序。"); }
    } else setFeedback("程序给了新证据。逐个检查：下雨吗？桥开放吗？");
  }

  return <div className="condition-lab"><div aria-live="polite" className="condition-weather"><span>{scenario.raining ? "🌧️" : "☀️"}</span><strong>{scenario.raining ? "正在下雨：真" : "正在下雨：假"}</strong><span>{scenario.bridgeOpen ? "🟢" : "🔴"}</span><strong>{scenario.bridgeOpen ? "桥开放：真" : "桥开放：假"}</strong></div><div className="condition-program"><section className="decision-tree"><code>如果 正在下雨？</code><div aria-label="选择天气条件分支" role="group"><button aria-pressed={equipment === "umbrella"} className={equipment === "umbrella" ? "decision-branch--selected" : ""} onClick={() => setEquipment("umbrella")} type="button"><small>条件为真 · 那么</small>撑伞 ☂️</button><button aria-pressed={equipment === "sunhat"} className={equipment === "sunhat" ? "decision-branch--selected" : ""} onClick={() => setEquipment("sunhat")} type="button"><small>条件为假 · 否则</small>戴遮阳帽 🧢</button></div></section><section className="decision-tree"><code>如果 桥开放？</code><div aria-label="选择桥梁条件分支" role="group"><button aria-pressed={bridgeAction === "cross"} className={bridgeAction === "cross" ? "decision-branch--selected" : ""} onClick={() => setBridgeAction("cross")} type="button"><small>条件为真 · 那么</small>安全过桥</button><button aria-pressed={bridgeAction === "wait"} className={bridgeAction === "wait" ? "decision-branch--selected" : ""} onClick={() => setBridgeAction("wait")} type="button"><small>条件为假 · 否则</small>原地等待</button></div></section></div><div aria-label="当前条件程序输出" className="program-output" role="status"><strong>程序输出</strong><span>{equipment === "umbrella" ? "☂️ 撑伞" : equipment === "sunhat" ? "🧢 戴遮阳帽" : "等待天气分支"}</span><b>＋</b><span>{bridgeAction === "cross" ? "🚶 安全过桥" : bridgeAction === "wait" ? "✋ 原地等待" : "等待桥梁分支"}</span></div><p aria-live="polite" role="status">{feedback} 场景 {index + 1}/3</p><button className="primary-action" onClick={(event) => check(event.detail)} type="button">运行条件程序</button></div>;
}
