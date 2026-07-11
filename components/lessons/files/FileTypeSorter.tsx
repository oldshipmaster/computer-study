import { useState } from "react";
import { INITIAL_SORT_STATE, sortFile, type FileCategory } from "@/lib/file-types-lesson";
const FILES = ["海岛.png", "机器人.jpg", "日记.txt", "诗歌.md", "鸟鸣.mp3", "故事.wav", "神秘礼物.exe", "没有后缀"];
const TRAYS: Array<{ id: FileCategory; label: string; icon: string }> = [{ id: "image", label: "图片", icon: "🖼️" }, { id: "text", label: "文字", icon: "📄" }, { id: "audio", label: "声音", icon: "🔊" }, { id: "unknown", label: "未知，问大人", icon: "❓" }];
interface Props { onComplete: () => void; }
export function FileTypeSorter({ onComplete }: Props) {
  const [state, setState] = useState(INITIAL_SORT_STATE); const [selected, setSelected] = useState<string | null>(null);
  function place(category: FileCategory) { if (!selected) return; const next = sortFile(state, selected, category); setState(next); if (Object.keys(next.sorted).length === FILES.length) onComplete(); }
  return <div className="file-type-sorter"><div className="unsorted-files" aria-label="待分类文件">{FILES.map((name) => <button aria-pressed={selected === name} disabled={Boolean(state.sorted[name])} key={name} onClick={() => setSelected(name)} type="button">{state.sorted[name] ? "✓ " : ""}{name}</button>)}</div><div className="type-trays">{TRAYS.map((tray) => <button key={tray.id} onClick={() => place(tray.id)} type="button"><span>{tray.icon}</span><strong>{tray.label}</strong><small>{Object.values(state.sorted).filter((value) => value === tray.id).length} 个</small></button>)}</div><p role="status">{state.wrongAttempts ? "进度还在。看看文件名最后的扩展名，再选一次。" : "先选文件，再选分类盒。"}</p><aside>陌生文件即使改了扩展名也不一定安全，不打开，先问可信的大人。</aside></div>;
}
