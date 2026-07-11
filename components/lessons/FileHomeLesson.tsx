"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { VirtualFileExplorer } from "@/components/lessons/files/VirtualFileExplorer";
import type { LessonProps } from "@/components/lessons/types";
import { INITIAL_FILE_HOME_STATE, updateFileHome, type FileHomeAction } from "@/lib/file-home-lesson";

const STAGES = ["认识住处", "文件与文件夹", "沿地址前进", "返回上一级", "打开文件", "寻家挑战"];
const MESSAGES = ["文件像作品，文件夹像收纳盒；这里的一切都是虚拟练习。", "观察图标和文字，文件夹能装东西，文件保存内容。", "进入学习资料，再进入科学；地址栏会记录走过的路。", "用“上一级”回到学习资料，再重新进入科学。", "打开太阳系图片，看看文件怎样住在文件夹里。", "独立找到 学习资料/科学/太阳系.png，打开后再回到根目录。"];

export function FileHomeLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [files, setFiles] = useState(INITIAL_FILE_HOME_STATE); const [challengeOpened, setChallengeOpened] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function act(action: FileHomeAction) {
    const next = updateFileHome(files, action); setFiles(next);
    if (stage === 2 && next.address === "比特岛/学习资料/科学") setStage(3);
    else if (stage === 3 && action.type === "goBack") setStage(4);
    else if (stage === 4 && next.openedFile === "太阳系.png") { setStage(5); setFiles(INITIAL_FILE_HOME_STATE); }
    else if (stage === 5 && next.openedFile === "太阳系.png") setChallengeOpened(true);
    else if (stage === 5 && challengeOpened && action.type === "goRoot" && !awardedRef.current) { awardedRef.current = true; onAward("file-home", "file-home-finder"); onComplete(); }
  }
  return <LessonChrome courseName="文件住在哪里" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="file-home-mission">{stage < 2 ? <div className="file-concept-cards"><button onClick={() => stage === 0 ? setStage(1) : setStage(2)} type="button"><span>📁</span><strong>文件夹</strong><small>可以装文件和其他文件夹</small></button><button onClick={() => stage === 0 ? setStage(1) : setStage(2)} type="button"><span>📄</span><strong>文件</strong><small>保存文字、图片或声音</small></button></div> : <VirtualFileExplorer onAction={act} state={files} />}</div></LessonChrome>;
}
