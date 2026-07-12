import { useEffect } from "react";
import type { DocumentAction, DocumentState } from "@/lib/program-landing-lesson";
import { matchesPrimaryShortcut } from "@/lib/keyboard-shortcuts";
interface Props { state: DocumentState; onAction: (action: DocumentAction) => void; }

export function DocumentSimulator({ state, onAction }: Props) {
  useEffect(() => {
    function saveWithKeyboard(event: KeyboardEvent) {
      if (!state.open || !matchesPrimaryShortcut(event, "s")) return;
      event.preventDefault();
      onAction({ type: "save", location: "任务文件夹" });
    }
    window.addEventListener("keydown", saveWithKeyboard);
    return () => window.removeEventListener("keydown", saveWithKeyboard);
  }, [onAction, state.open]);

  return <div className="document-simulator">
    {!state.open ? <button className="document-file" onClick={() => onAction({ type: "open" })} type="button"><span aria-hidden="true">📄</span>打开任务便笺</button> : <section className="document-window" aria-label="任务便笺程序"><header><strong>任务便笺 {state.dirty ? "· 未保存" : "· 已保存"}</strong><button aria-label="关闭任务便笺" onClick={() => onAction({ type: "requestClose" })} type="button">×</button></header><label htmlFor="mission-note">任务呼号</label><textarea id="mission-note" onChange={(event) => onAction({ type: "edit", content: event.target.value })} placeholder="例如：BIBI-7" value={state.content} /><div className="document-actions"><button className="primary-action" onClick={() => onAction({ type: "save", location: "任务文件夹" })} type="button">保存到任务文件夹</button><span>{state.saveLocation ? `位置：${state.saveLocation}` : "还没有保存位置"}</span><p className="save-shortcut-hint"><kbd>Ctrl/⌘</kbd> + <kbd>S</kbd> 也能快捷保存</p></div></section>}
    {state.closePrompt ? <div className="save-prompt" role="dialog" aria-modal="true" aria-labelledby="save-prompt-title"><h2 id="save-prompt-title">要保存刚才的修改吗？</h2><p>保存后再关闭，作品不会丢失。</p><div><button className="primary-action" onClick={() => onAction({ type: "saveAndClose", location: "任务文件夹" })} type="button">保存并关闭</button><button onClick={() => onAction({ type: "cancelClose" })} type="button">返回继续编辑</button><button className="discard-action" onClick={() => onAction({ type: "discardAndClose" })} type="button">不保存并关闭</button></div></div> : null}
  </div>;
}
