import { useState } from "react";
import { INITIAL_SORT_STATE, sortFile, type FileCategory } from "@/lib/file-types-lesson";

const FILES = ["海岛.png", "机器人.jpg", "日记.txt", "诗歌.md", "鸟鸣.mp3", "故事.wav", "神秘礼物.exe", "没有后缀"];
const TRAYS: Array<{ id: FileCategory; label: string; icon: string }> = [{ id: "image", label: "图片", icon: "🖼️" }, { id: "text", label: "文字", icon: "📄" }, { id: "audio", label: "声音", icon: "🔊" }, { id: "unknown", label: "未知，问大人", icon: "❓" }];
const RECOMMENDATIONS: Record<FileCategory, string> = { image: "图片查看器", text: "文字编辑器", audio: "音频播放器", unknown: "不要打开，先问可信的大人" };
interface Props { onComplete: () => void; }

function splitFileName(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? { stem: name.slice(0, dot), extension: name.slice(dot) } : { stem: name, extension: "没有扩展名" };
}

export function FileTypeSorter({ onComplete }: Props) {
  const [state, setState] = useState(INITIAL_SORT_STATE);
  const [selected, setSelected] = useState<string | null>(null);
  const inspected = selected ? splitFileName(selected) : null;

  function place(category: FileCategory) {
    if (!selected) return;
    const next = sortFile(state, selected, category);
    setState(next);
    if (next.sorted[selected]) setSelected(null);
    if (Object.keys(next.sorted).length === FILES.length) onComplete();
  }

  return <div className="file-type-sorter"><div aria-label="待分类文件" className="unsorted-files" role="group">{FILES.map((name) => <button aria-pressed={selected === name} disabled={Boolean(state.sorted[name])} key={name} onClick={() => setSelected(name)} type="button">{state.sorted[name] ? "✓ " : ""}{name}</button>)}</div><div aria-live="polite" className="file-inspector"><strong>🔎 文件名放大镜</strong>{inspected ? <><span><small>文件名称</small>{inspected.stem}</span><b aria-hidden="true">＋</b><span className="extension-chip"><small>扩展名</small>{inspected.extension}</span></> : <p>先选择一个文件，观察最后一个点之后的文字。</p>}</div><div aria-label="文件类型分类盒" className="type-trays" role="group">{TRAYS.map((tray) => <button key={tray.id} onClick={() => place(tray.id)} type="button"><span>{tray.icon}</span><strong>{tray.label}</strong><small>{Object.values(state.sorted).filter((value) => value === tray.id).length} 个</small></button>)}</div>{Object.keys(state.sorted).length ? <div aria-label="已识别文件及推荐打开方式" className="sorted-file-results" role="list">{Object.entries(state.sorted).map(([name, category]) => <span key={name} role="listitem"><strong>{name}</strong><small>{TRAYS.find((tray) => tray.id === category)?.icon} {TRAYS.find((tray) => tray.id === category)?.label}</small><em>推荐打开方式：{RECOMMENDATIONS[category]}</em></span>)}</div> : null}<p aria-live="polite" role="status">{state.wrongAttempts ? "进度还在。看看文件名最后的扩展名，再选一次。" : "先选文件，再选分类盒。"}</p><aside>陌生文件即使改了扩展名也不一定安全，不打开，先问可信的大人。</aside></div>;
}
