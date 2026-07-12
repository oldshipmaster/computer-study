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
  const evaluation = evaluateTypingTask(task, value, composing);

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
        spellCheck={false}
        value={value}
      />
      <p aria-live="polite" className="typing-feedback">{evaluation.feedback}</p>
      <button className="primary-action" disabled={!evaluation.complete} onClick={onSuccess} type="button">信号正确，继续</button>
    </div>
  );
}
