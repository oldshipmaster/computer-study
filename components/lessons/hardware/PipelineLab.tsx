import { useState } from "react";
import { runInformationPipeline } from "@/lib/input-process-output-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

type PipelineRole = "input" | "process" | "output";
const TASKS = [
  { id: "press-A", prompt: "按下 A 后怎样在屏幕出现字母？", answer: { input: "⌨️ 键盘", process: "🧠 CPU", output: "🖥️ 屏幕" } },
  { id: "record-voice", prompt: "录音怎样再从扬声器播放？", answer: { input: "🎤 麦克风", process: "🧠 CPU", output: "🔊 扬声器" } },
  { id: "click-print", prompt: "单击打印怎样变成纸面作品？", answer: { input: "🖱️ 鼠标", process: "🧠 CPU", output: "🖨️ 打印机" } },
];
const OPTIONS: Record<PipelineRole, string[]> = { input: ["⌨️ 键盘", "🎤 麦克风", "🖱️ 鼠标"], process: ["🧠 CPU", "🖥️ 屏幕", "📁 文件夹"], output: ["🖥️ 屏幕", "🔊 扬声器", "🖨️ 打印机"] };
const ROLE_LABELS: Record<PipelineRole, string> = { input: "输入设备", process: "处理部分", output: "输出设备" };
interface Props { onComplete: () => void; }

export function PipelineLab({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selection, setSelection] = useState<Partial<Record<PipelineRole, string>>>({});
  const [feedback, setFeedback] = useState("先预测输入设备、处理部分和输出设备。" );
  const task = TASKS[index];
  const answer = task.answer;
  const steps = runInformationPipeline(task.id);

  function check(detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    const correct = selection.input === answer.input && selection.process === answer.process && selection.output === answer.output;
    if (!correct) { setFeedback("流水线还没有接通：输入负责收集，CPU 负责处理，输出负责呈现结果。" ); return; }
    setRevealed(true);
    setFeedback("三段连接正确！现在沿箭头观察信息怎样变化。" );
  }
  function next(detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    if (index === TASKS.length - 1) onComplete();
    else { setIndex((value) => value + 1); setSelection({}); setRevealed(false); setFeedback("新任务开始，重新选择三段流水线。" ); }
  }

  return <div className="pipeline-lab"><h2 aria-live="polite">{task.prompt}</h2><div aria-label="当前信息处理流水线" className="pipeline-roles" role="img">{(["input", "process", "output"] as PipelineRole[]).map((role, roleIndex) => <span className={selection[role] ? "pipeline-flow--active" : ""} key={role}><small>{ROLE_LABELS[role]}</small><strong>{selection[role] ?? "等待选择"}</strong>{revealed ? <em>{steps[roleIndex]}</em> : null}</span>).flatMap((node, roleIndex) => roleIndex < 2 ? [node, <b aria-hidden="true" key={`arrow-${roleIndex}`}>→</b>] : [node])}</div>{!revealed ? <div className="pipeline-choice-grid">{(["input", "process", "output"] as PipelineRole[]).map((role) => <fieldset key={role}><legend>{ROLE_LABELS[role]}</legend>{OPTIONS[role].map((option) => <button aria-pressed={selection[role] === option} key={option} onClick={() => setSelection((current) => ({ ...current, [role]: option }))} type="button">{option}</button>)}</fieldset>)}</div> : <ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol>}<p aria-live="polite" role="status">{feedback}</p><button className="primary-action" onClick={(event) => revealed ? next(event.detail) : check(event.detail)} type="button">{revealed ? "下一个流水线" : "运行我的流水线"}</button></div>;
}
