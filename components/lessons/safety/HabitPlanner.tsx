import { useState } from "react";
import { evaluateRoutine, evaluateSetup, type SetupChoices } from "@/lib/healthy-habits-lesson";
import "./HabitPlanner.css";

const SETUP_LABELS: Array<[keyof SetupChoices, string]> = [["feetSupported", "双脚有支撑"], ["shouldersRelaxed", "肩膀放松"], ["screenComfortable", "屏幕距离和高度看着舒服"], ["lightComfortable", "光线不刺眼也不太暗"]];
const ACTIONS = [{ id: "learn", label: "学习一节 9 分钟小课", short: "学习 9 分钟", icon: "💻" }, { id: "look-far", label: "离屏看远处", short: "看远处", icon: "👀" }, { id: "move", label: "站起来活动", short: "活动", icon: "🙆" }, { id: "offline-play", label: "进行离线游戏", short: "离线游戏", icon: "🧩" }];
interface Props { onComplete: () => void; }

export function HabitPlanner({ onComplete }: Props) {
  const [setup, setSetup] = useState<SetupChoices>({ feetSupported: false, shouldersRelaxed: false, screenComfortable: false, lightComfortable: false });
  const [routine, setRoutine] = useState<string[]>(["setup"]);
  const setupResult = evaluateSetup(setup);
  const routineResult = evaluateRoutine(routine);
  const learningCount = routine.filter((item) => item === "learn").length;
  const breakCount = routine.filter((item) => ["look-far", "move", "offline-play"].includes(item)).length;
  const ready = setupResult.ready && routineResult.balanced && learningCount >= 2 && breakCount >= 1;
  function addAction(id: string) {
    setRoutine((items) => items.length < 8 ? [...items, id] : items);
  }
  return (
    <div className="habit-planner">
      <div className="comfort-desk" aria-label={`虚拟学习桌：${setupResult.ready ? "四项设置舒适" : `还有 ${setupResult.missing.length} 项待调整`}`} role="img">
        <span className={`desk-light ${setup.lightComfortable ? "desk-light--comfortable" : ""}`}>💡</span>
        <span className={`desk-screen ${setup.screenComfortable ? "desk-screen--comfortable" : ""}`}>小课画面</span>
        <span className={`desk-person ${setup.shouldersRelaxed ? "desk-person--relaxed" : ""}`}><i>🙂</i><b>肩膀</b></span>
        <span className={`desk-feet ${setup.feetSupported ? "desk-feet--supported" : ""}`}>双脚</span>
        <span className="desk-table" />
      </div>
      <fieldset><legend>调整虚拟学习桌</legend>{SETUP_LABELS.map(([key, label]) => <button aria-pressed={setup[key]} key={key} onClick={() => setSetup((current) => ({ ...current, [key]: !current[key] }))} type="button">{setup[key] ? "✓ " : "○ "}{label}</button>)}</fieldset>
      <ul className="comfort-signals" aria-label="舒适设置进度">{SETUP_LABELS.map(([key, label]) => <li className={setup[key] ? "is-ready" : ""} key={key}><span>{setup[key] ? "✓" : "!"}</span>{label}</li>)}</ul>
      <section><h2>安排学习与离屏休息</h2><div className="routine-line">{routine.map((item, index) => { const action = ACTIONS.find((candidate) => candidate.id === item); return <span className={item === "learn" ? "is-screen-time" : "is-break-time"} key={`${item}-${index}`}>{item === "setup" ? "🪑 准备" : `${action?.icon} ${action?.short}`}</span>; })}</div><div className="routine-stats"><strong>节奏统计</strong><span>屏幕学习：{learningCount * 9} 分钟</span><span>离屏休息：{breakCount} 次</span></div><div className="routine-actions">{ACTIONS.map((action) => <button disabled={routine.length >= 8} key={action.id} onClick={() => addAction(action.id)} type="button">+ {action.label}</button>)}<button disabled={routine.length <= 1} onClick={() => setRoutine((items) => items.slice(0, -1))} type="button">撤销最后一步</button><button onClick={() => setRoutine(["setup"])} type="button">重新安排</button></div></section>
      <p role="status">{ready ? "准备和节奏都很舒服，可以完成挑战。" : routineResult.consecutiveLearning ? "两段学习连在一起了，中间加一次离屏休息。" : !setupResult.ready ? `先调整学习桌，还有 ${setupResult.missing.length} 项。` : "安排学习、休息、再学习。"}</p>
      <button className="primary-action" disabled={!ready} onClick={onComplete} type="button">完成健康习惯计划</button>
      <aside>眼睛、头、脖子、手腕或身体不舒服时，马上停止并告诉家长或老师。</aside>
    </div>
  );
}
