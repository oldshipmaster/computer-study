"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { DocumentSimulator } from "@/components/lessons/program-landing/DocumentSimulator";
import type { LessonProps } from "@/components/lessons/types";
import { INITIAL_DOCUMENT_STATE, updateDocument, type DocumentAction } from "@/lib/program-landing-lesson";

const STAGES = ["认识程序", "打开便笺", "编辑内容", "保存作品", "安全关闭", "独立起降"];
const MESSAGES = ["程序像一间工作室：打开后工作，保存作品，再安全关闭。", "打开任务便笺，看看程序窗口。", "输入一个短呼号，例如 BIBI-7。", "把作品保存到指定的任务文件夹。", "关闭已保存的窗口，不会出现丢失提醒。", "独立完成打开、输入、保存和关闭。若忘记保存，先选择“保存并关闭”。"];

export function ProgramLandingLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [documentState, setDocumentState] = useState(INITIAL_DOCUMENT_STATE);
  const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);

  function act(action: DocumentAction) {
    const next = updateDocument(documentState, action); setDocumentState(next);
    if (stage === 1 && action.type === "open") setStage(2);
    else if (stage === 2 && action.type === "edit" && action.content.trim().length >= 3) setStage(3);
    else if (stage === 3 && action.type === "save") setStage(4);
    else if (stage === 4 && action.type === "requestClose" && !next.open) { setStage(5); setDocumentState(INITIAL_DOCUMENT_STATE); }
    else if (stage === 5 && !next.open && next.savedContent.trim().length >= 3 && (action.type === "requestClose" || action.type === "saveAndClose") && !awardedRef.current) { awardedRef.current = true; onAward("program-landing", "program-pilot"); onComplete(); }
  }

  return <LessonChrome courseName="程序安全起降" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="program-landing-mission">{stage === 0 ? <button className="primary-action" onClick={() => setStage(1)} type="button">开始程序起降训练</button> : <DocumentSimulator onAction={act} state={documentState} />}</div></LessonChrome>;
}
