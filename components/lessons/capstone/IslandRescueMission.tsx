import { useState } from "react";
import { CAPSTONE_TASKS, INITIAL_CAPSTONE_STATE, answerCapstoneTask } from "@/lib/light-bit-island-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

interface Props { onComplete: () => void; }
const DOMAIN_LABELS: Record<string, { label: string; icon: string }> = {
  files: { label: "文件", icon: "📁" }, keyboard: { label: "键盘", icon: "⌨️" }, input: { label: "输入", icon: "✍️" }, sequence: { label: "顺序", icon: "🔢" }, loop: { label: "循环", icon: "🔁" }, condition: { label: "条件", icon: "🔀" }, debug: { label: "调试", icon: "🔧" }, safety: { label: "安全", icon: "🛡️" },
};

export function IslandRescueMission({ onComplete }: Props) {
  const [state, setState] = useState(INITIAL_CAPSTONE_STATE);
  const task = CAPSTONE_TASKS.find((item) => !state.completedTaskIds.includes(item.id));
  function answer(optionId: string, detail: number) {
    if (!task || isRepeatedPointerActivation(detail)) return;
    setState(answerCapstoneTask(state, task.id, optionId));
  }
  return (
    <div className="island-rescue">
      <div className="energy-towers" aria-label={`已点亮 ${state.completedTaskIds.length} 座能量塔`} role="status">{CAPSTONE_TASKS.map((item, index) => { const domain = DOMAIN_LABELS[item.domain]; const lit = state.completedTaskIds.includes(item.id); return <span className={lit ? "is-lit" : ""} key={item.id}><b>{lit ? "★" : domain.icon}</b><small>{index + 1} · {domain.label}</small></span>; })}</div>
      {task ? <section><p className="section-kicker">综合任务 {state.completedTaskIds.length + 1}/8 · {DOMAIN_LABELS[task.domain].label}能力</p><h2>{task.title}</h2><p>{task.prompt}</p><div role="group" aria-label="选择任务答案">{task.options.map((option) => <button key={option.id} onClick={(event) => answer(option.id, event.detail)} type="button">{option.label}</button>)}</div></section> : (
        <section className="capstone-result"><span aria-hidden="true">🏝️✨</span><h2>八座能量塔全部点亮！</h2><p><strong>答对 8/8</strong> · 总尝试 {CAPSTONE_TASKS.length + state.wrongAttempts} 次</p><h3>能力总结</h3><ul className="capstone-skill-summary">{CAPSTONE_TASKS.map((item) => <li key={item.id}><span aria-hidden="true">{DOMAIN_LABELS[item.domain].icon}</span><div><strong>{DOMAIN_LABELS[item.domain].label} · {item.title}</strong><small>{item.explanation}</small></div></li>)}</ul><button className="primary-action" onClick={onComplete} type="button">完成综合救援</button></section>
      )}
      <p role="status">{state.feedback}</p>
      <aside>所有题目都来自虚拟任务，不会读取文件、输入内容或个人信息。答错可以重试，不扣分。</aside>
    </div>
  );
}
