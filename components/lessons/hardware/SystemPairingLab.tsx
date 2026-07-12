import { useState } from "react";
import {
  canCompleteTask,
  classifySystemItem,
} from "@/lib/hardware-software-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const ITEMS = [
  { id: "mouse", label: "鼠标", icon: "🖱️" },
  { id: "screen", label: "屏幕", icon: "🖥️" },
  { id: "paint-app", label: "画图程序", icon: "🎨" },
  { id: "printer", label: "打印机", icon: "🖨️" },
  { id: "print-app", label: "打印程序", icon: "📄" },
  { id: "microphone", label: "麦克风", icon: "🎤" },
  { id: "music-app", label: "录音程序", icon: "🎵" },
];
const TASKS = [
  { id: "draw", label: "画一幅画" },
  { id: "print", label: "打印作品" },
  { id: "record", label: "录一段声音" },
];

interface Props {
  onComplete: () => void;
}

export function SystemPairingLab({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("同时选择任务需要的硬件和软件。");
  const task = TASKS[index];
  const hardware = ITEMS.filter(
    (item) =>
      selected.includes(item.id) && classifySystemItem(item.id) === "hardware",
  );
  const software = ITEMS.filter(
    (item) =>
      selected.includes(item.id) && classifySystemItem(item.id) === "software",
  );
  const systemReady = canCompleteTask(task.id, selected);

  function check(detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    if (!systemReady) {
      setFeedback("还缺搭档：检查是否既有能摸到的硬件，也有负责指令的软件。");
      return;
    }
    if (index === TASKS.length - 1) onComplete();
    else {
      setIndex((value) => value + 1);
      setSelected([]);
      setFeedback("搭档成功，换一个任务继续。");
    }
  }

  return (
    <div className="system-pairing">
      <h2 aria-live="polite">任务：{task.label}</h2>
      <div aria-label="选择硬件和软件" role="group">
        {ITEMS.map((item) => (
          <button
            aria-pressed={selected.includes(item.id)}
            key={item.id}
            onClick={() =>
              setSelected((items) =>
                items.includes(item.id)
                  ? items.filter((id) => id !== item.id)
                  : [...items, item.id],
              )
            }
            type="button"
          >
            <span>{item.icon}</span>
            <strong>{item.label}</strong>
            <small>
              {classifySystemItem(item.id) === "hardware" ? "硬件" : "软件"}
            </small>
          </button>
        ))}
      </div>
      <div
        aria-label="当前组装的计算机系统"
        className="system-blueprint"
        role="group"
      >
        <section className="hardware-slot">
          <small>硬件槽 · 能摸到的部件</small>
          <strong>
            {hardware.length
              ? hardware.map((item) => `${item.icon} ${item.label}`).join(" + ")
              : "等待硬件"}
          </strong>
        </section>
        <b aria-hidden="true">＋</b>
        <section className="software-slot">
          <small>软件槽 · 告诉硬件怎么做</small>
          <strong>
            {software.length
              ? software.map((item) => `${item.icon} ${item.label}`).join(" + ")
              : "等待软件"}
          </strong>
        </section>
        <b aria-hidden="true">＝</b>
        <section
          className={
            systemReady ? "system-output system-output--ready" : "system-output"
          }
        >
          <small>系统输出</small>
          <strong>
            {systemReady ? `✓ 可以${task.label}` : "还不能完成任务"}
          </strong>
        </section>
      </div>
      <p>硬件和软件一起工作，才组成能完成任务的计算机系统。</p>
      <p aria-live="polite" role="status">
        {feedback}
      </p>
      <button
        className="primary-action"
        onClick={(event) => check(event.detail)}
        type="button"
      >
        启动这组搭档
      </button>
    </div>
  );
}
