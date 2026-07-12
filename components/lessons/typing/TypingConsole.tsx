import { useState, type CompositionEvent } from "react";
import { evaluateTypingTask, type TypingTask } from "@/lib/typing-lesson";

interface TypingConsoleProps {
  instruction: string;
  initialValue?: string;
  onSuccess: () => void;
  task: TypingTask;
}

export function TypingConsole({ instruction, initialValue = "", onSuccess, task }: TypingConsoleProps) {
  const [value, setValue] = useState(initialValue);
  const [composing, setComposing] = useState(false);
  const [shiftUsed, setShiftUsed] = useState(false);
  const evaluation = evaluateTypingTask(task, value, composing, { shiftUsed });
  const targetCharacters = [...task.target];
  const typedCharacters = [...value];
  const firstMismatch = targetCharacters.findIndex((character, index) => typedCharacters[index] !== character);

  function finishComposition(event: CompositionEvent<HTMLInputElement>) {
    setComposing(false);
    const next = event.currentTarget.value;
    setValue(next);
  }

  return (
    <div className="typing-console">
      <p className="typing-target"><span>目标</span><strong>{task.target}</strong></p>
      <label htmlFor="lesson-typing-input">{instruction}</label>
      <input
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        id="lesson-typing-input"
        onChange={(event) => setValue(event.target.value)}
        onCompositionEnd={finishComposition}
        onCompositionStart={() => setComposing(true)}
        onKeyDown={(event) => { if (task.kind === "shift" && event.shiftKey && event.key.toLowerCase() === task.target[0]?.toLowerCase()) setShiftUsed(true); }}
        spellCheck={false}
        value={value}
      />
      <div aria-label="逐字输入进度" className="typing-character-progress" role="list">
        {targetCharacters.map((character, index) => {
          const matched = typedCharacters[index] === character;
          const current = index === firstMismatch;
          return <span aria-current={current ? "step" : undefined} className={matched ? "typing-char--matched" : current ? "typing-char--current" : ""} key={`${character}-${index}`} role="listitem"><small>{index + 1}</small><strong>{character}</strong></span>;
        })}
        {typedCharacters.length > targetCharacters.length ? <span className="typing-char--extra" role="listitem"><small>多余</small><strong>{typedCharacters.slice(targetCharacters.length).join("")}</strong></span> : null}
      </div>
      {task.kind === "ime" ? <p aria-live="polite" className={composing ? "ime-status ime-status--composing" : "ime-status"}><span aria-hidden="true">中</span>{composing ? "正在选词，请先完成输入法组合" : "中文输入法就绪，选词完成后会确认文字"}</p> : null}
      {task.kind === "shift" ? <p aria-live="polite" className={shiftUsed ? "shift-combination-status is-complete" : "shift-combination-status"}><kbd>Shift</kbd><span aria-hidden="true">＋</span><kbd>{task.target[0]}</kbd>{shiftUsed ? "已检测到组合键" : "按住 Shift，再按字母"}</p> : null}
      <p aria-live="polite" className="typing-feedback">{evaluation.feedback}</p>
      <button className="primary-action" disabled={!evaluation.complete} onClick={onSuccess} type="button">信号正确，继续</button>
    </div>
  );
}
