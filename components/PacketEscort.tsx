"use client";

import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import {
  PACKET_ESCORT_MISSIONS,
  PACK_LAYER_ORDER,
  UNPACK_LAYER_ORDER,
  advancePacketEscortMission,
  buildPacketEscortDeck,
  chooseEscortRoute,
  confirmPacketOrder,
  createPacketEscortState,
  launchPacketTransfer,
  moveReceivedPacket,
  packPacketLayer,
  packetEscortShortcutIndex,
  retransmitPacket,
  unpackPacketLayer,
  type PacketLayer,
} from "@/lib/packet-escort";
import "./PacketEscort.css";

interface PacketEscortProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

const REQUIRED_COURSE_IDS = ["network-layers", "routing-maze", "reliable-transfer"] as const;
const LAYER_COPY: Record<PacketLayer, { label: string; icon: string; purpose: string }> = {
  application: { label: "应用层", icon: "文", purpose: "说明消息内容" },
  transport: { label: "传输层", icon: "#", purpose: "加入分组编号与确认" },
  network: { label: "网络层", icon: "址", purpose: "加入目的地址" },
  link: { label: "链路层", icon: "站", purpose: "写入下一站设备" },
};
const PHASES = [
  ["pack", "逐层打包"], ["route", "选择路线"], ["send", "发射分组"],
  ["retransmit", "精确重传"], ["order", "接收排序"], ["unpack", "反向拆层"],
] as const;

export function PacketEscort({ completedCourseIds, onStartCourse }: PacketEscortProps) {
  const completedRequired = REQUIRED_COURSE_IDS.filter((id) => completedCourseIds.includes(id));
  const unlocked = completedRequired.length === REQUIRED_COURSE_IDS.length;
  const nextCourse = getCourse(REQUIRED_COURSE_IDS.find((id) => !completedCourseIds.includes(id)) ?? "");
  const [started, setStarted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(() => buildPacketEscortDeck(rotation), [rotation]);
  const [game, setGame] = useState(() => createPacketEscortState(PACKET_ESCORT_MISSIONS.length));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  useLayoutEffect(() => {
    if (!shouldFocusRef.current) return;
    headingRef.current?.focus();
    shouldFocusRef.current = false;
  }, [game.missionIndex, game.phase, started]);

  function focusHeading() {
    shouldFocusRef.current = true;
    window.setTimeout(() => headingRef.current?.focus(), 0);
  }

  function startEscort() {
    setGame(createPacketEscortState(deck.length));
    setStarted(true);
    focusHeading();
  }

  function replayEscort() {
    const nextRotation = rotation + 1;
    setRotation(nextRotation);
    setGame(createPacketEscortState(buildPacketEscortDeck(nextRotation).length));
    setStarted(true);
    focusHeading();
  }

  if (!unlocked) {
    return (
      <section className="packet-escort-shell packet-escort-locked" id="packet-escort" aria-labelledby="packet-escort-heading">
        <span className="packet-escort-badge" aria-hidden="true">▣</span>
        <div><p className="section-kicker">端到端网络游戏</p><h2 id="packet-escort-heading">网络数据包护航</h2><p>先学会网络分层、路由和可靠传输，再来亲手护送完整消息。</p><strong>已完成 {completedRequired.length} / {REQUIRED_COURSE_IDS.length} 门必修课</strong></div>
        {nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一门：{nextCourse.title}</button> : null}
      </section>
    );
  }

  if (!started) {
    return (
      <section className="packet-escort-shell packet-escort-menu" id="packet-escort" aria-labelledby="packet-escort-heading">
        <div><p className="section-kicker">六次护航 · 无真实联网 · 可反复修复</p><h2 id="packet-escort-heading">网络数据包护航</h2><p>逐层打包消息、比较路线、找回丢失分组、整理编号，再反向拆包恢复内容。</p></div>
        <button onClick={startEscort} type="button">开始网络护航</button>
      </section>
    );
  }

  if (game.phase === "complete") {
    return (
      <section className="packet-escort-shell packet-escort-complete" id="packet-escort" aria-labelledby="packet-escort-complete-heading">
        <span aria-hidden="true">📦</span>
        <div><p>六次端到端护航全部完成</p><h2 id="packet-escort-complete-heading" ref={headingRef} tabIndex={-1}>网络护航工程师！</h2><strong>你用每一段证据证明了消息为什么能完整到达。</strong></div>
        <button onClick={replayEscort} type="button">重玩六次网络护航</button>
      </section>
    );
  }

  const mission = deck[game.missionIndex];
  const currentPhaseIndex = game.phase === "solved" ? PHASES.length : PHASES.findIndex(([phase]) => phase === game.phase);

  function nextMission(event: MouseEvent<HTMLButtonElement>) {
    focusHeading();
    setGame((current) => advancePacketEscortMission(current, event.detail));
  }

  function handleEscortKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const choiceCount = game.phase === "route" ? mission.routes.length : game.phase === "retransmit" ? mission.fragments.length : game.phase === "pack" || game.phase === "unpack" ? PACK_LAYER_ORDER.length : 0;
    const choiceIndex = packetEscortShortcutIndex(event.key, choiceCount);
    if (choiceIndex !== null) {
      event.preventDefault();
      if (game.phase === "pack") setGame((current) => packPacketLayer(current, mission, PACK_LAYER_ORDER[choiceIndex], 0));
      else if (game.phase === "route") setGame((current) => chooseEscortRoute(current, mission, mission.routes[choiceIndex].id, 0));
      else if (game.phase === "retransmit") setGame((current) => retransmitPacket(current, mission, choiceIndex, 0));
      else if (game.phase === "unpack") setGame((current) => unpackPacketLayer(current, mission, UNPACK_LAYER_ORDER[choiceIndex], 0));
      return;
    }
    if (event.key !== "Enter" || event.target instanceof HTMLButtonElement) return;
    if (game.phase === "send") setGame((current) => launchPacketTransfer(current, mission, 0));
    else if (game.phase === "order") setGame((current) => confirmPacketOrder(current, mission, 0));
    else if (game.phase === "solved") {
      focusHeading();
      setGame((current) => advancePacketEscortMission(current, 0));
    } else return;
    event.preventDefault();
  }

  return (
    <section className="packet-escort-shell packet-escort-game" id="packet-escort" aria-labelledby="packet-escort-game-heading" onKeyDown={handleEscortKeyDown}>
      <header className="packet-escort-heading">
        <p>护航任务 {game.missionIndex + 1} / {game.missionCount}</p>
        <h2 id="packet-escort-game-heading" ref={headingRef} tabIndex={-1}>{mission.title}</h2>
        <span>{mission.story}</span>
        <progress aria-label="网络数据包护航进度" max={game.missionCount} value={game.solved} />
      </header>

      <ol className="packet-phase-track" aria-label="本次网络护航的六个阶段">{PHASES.map(([phase, label], index) => <li aria-current={game.phase === phase ? "step" : undefined} className={index < currentPhaseIndex ? "is-done" : ""} key={phase}><b>{index + 1}</b><span>{label}</span></li>)}</ol>

      {game.phase === "pack" ? (
        <section className="packet-stage" aria-labelledby="packet-pack-heading">
          <header><p>第 1 段</p><h3 id="packet-pack-heading">逐层打包</h3><span>先包消息内容，再一层层写上运输信息。</span></header>
          <div className="packet-pack-layout">
            <div className="packet-envelope-stack" aria-label="已经加入的网络层" role="img"><span className="packet-message-core">{mission.message}</span>{PACK_LAYER_ORDER.map((layer, index) => <span className={`packet-envelope layer-${layer} ${game.packedLayers.includes(layer) ? "is-packed" : ""}`} key={layer} style={{ inset: `${26 - index * 7}px` }}><b>{LAYER_COPY[layer].label}</b></span>)}</div>
            <div className="packet-layer-actions" role="group" aria-label="选择下一层">{PACK_LAYER_ORDER.map((layer, index) => <button aria-keyshortcuts={String(index + 1)} className="packet-escort-action" disabled={game.packedLayers.includes(layer)} key={layer} onClick={(event) => setGame((current) => packPacketLayer(current, mission, layer, event.detail))} type="button"><kbd>{index + 1}</kbd><b>{LAYER_COPY[layer].icon}</b><span>{LAYER_COPY[layer].label}</span><small>{LAYER_COPY[layer].purpose}</small></button>)}</div>
          </div>
        </section>
      ) : null}

      {game.phase === "route" ? (
        <section className="packet-stage" aria-labelledby="packet-route-heading">
          <header><p>第 2 段</p><h3 id="packet-route-heading">选择路线</h3><span>比较数字的总代价，不要只数经过几个节点。</span></header>
          <div className="packet-route-grid">{mission.routes.map((route, index) => <button aria-keyshortcuts={String(index + 1)} className="packet-route-card packet-escort-action" key={route.id} onClick={(event) => setGame((current) => chooseEscortRoute(current, mission, route.id, event.detail))} type="button"><kbd>{index + 1}</kbd><strong>{route.label}</strong><span>{route.nodes.join(" → ")}</span><b>总代价 {route.cost}</b></button>)}</div>
        </section>
      ) : null}

      {game.phase === "send" ? (
        <section className="packet-stage" aria-labelledby="packet-send-heading">
          <header><p>第 3 段</p><h3 id="packet-send-heading">发射分组</h3><span>消息已经切成带编号的小组；模拟网络会保留到达和丢失证据。</span></header>
          <div className="packet-launch-lane" aria-label="等待发射的分组" role="list">{mission.fragments.map((fragment, sequence) => <span key={sequence} role="listitem"><b>#{sequence + 1}</b><span>{fragment}</span></span>)}</div>
          <button aria-keyshortcuts="Enter" className="packet-escort-action packet-primary-action" onClick={(event) => setGame((current) => launchPacketTransfer(current, mission, event.detail))} type="button">发射全部编号分组</button>
        </section>
      ) : null}

      {game.phase === "retransmit" ? (
        <section className="packet-stage" aria-labelledby="packet-retransmit-heading">
          <header><p>第 4 段</p><h3 id="packet-retransmit-heading">精确重传</h3><span>根据接收端已有的分组编号，只补发缺少的那一组。</span></header>
          <div className="packet-arrival-grid" role="group" aria-label="分组到达证据">{mission.fragments.map((fragment, sequence) => { const arrived = game.receivedOrder.includes(sequence); return <button aria-keyshortcuts={String(sequence + 1)} aria-label={`第 ${sequence + 1} 组，${arrived ? "已到达" : "缺失，点击重传"}`} className={`packet-escort-action ${arrived ? "is-arrived" : "is-missing"}`} disabled={arrived} key={sequence} onClick={(event) => setGame((current) => retransmitPacket(current, mission, sequence, event.detail))} type="button"><kbd>{sequence + 1}</kbd><b>#{sequence + 1}</b><span>{fragment}</span><small>{arrived ? "已确认" : "没有确认"}</small></button>; })}</div>
        </section>
      ) : null}

      {game.phase === "order" ? (
        <section className="packet-stage" aria-labelledby="packet-order-heading">
          <header><p>第 5 段</p><h3 id="packet-order-heading">接收排序</h3><span>分组编号必须从 1 连续排列，内容才能正确组装。</span></header>
          <ol className="packet-order-list" aria-label="当前接收顺序">{game.receivedOrder.map((sequence, index) => <li key={sequence}><span><b>#{sequence + 1}</b><strong>{mission.fragments[sequence]}</strong></span><span><button aria-label={`把第 ${sequence + 1} 组向前移动`} disabled={index === 0} onClick={() => setGame((current) => moveReceivedPacket(current, index, index - 1))} type="button">←</button><button aria-label={`把第 ${sequence + 1} 组向后移动`} disabled={index === game.receivedOrder.length - 1} onClick={() => setGame((current) => moveReceivedPacket(current, index, index + 1))} type="button">→</button></span></li>)}</ol>
          <button aria-keyshortcuts="Enter" className="packet-escort-action packet-primary-action" onClick={(event) => setGame((current) => confirmPacketOrder(current, mission, event.detail))} type="button">确认编号并组装消息</button>
        </section>
      ) : null}

      {game.phase === "unpack" ? (
        <section className="packet-stage" aria-labelledby="packet-unpack-heading">
          <header><p>第 6 段</p><h3 id="packet-unpack-heading">反向拆层</h3><span>发送时由内向外包装，接收时要从最外层向内拆。</span></header>
          <div className="packet-unpack-layout"><div className="packet-envelope-stack is-receiving" aria-label="等待拆除的网络层" role="img"><span className="packet-message-core">恢复的消息</span>{PACK_LAYER_ORDER.map((layer, index) => <span className={`packet-envelope layer-${layer} ${game.unpackedLayers.includes(layer) ? "is-unpacked" : "is-packed"}`} key={layer} style={{ inset: `${26 - index * 7}px` }}><b>{LAYER_COPY[layer].label}</b></span>)}</div><div className="packet-layer-actions" role="group" aria-label="选择要拆除的层">{UNPACK_LAYER_ORDER.map((layer, index) => <button aria-keyshortcuts={String(index + 1)} className="packet-escort-action" disabled={game.unpackedLayers.includes(layer)} key={layer} onClick={(event) => setGame((current) => unpackPacketLayer(current, mission, layer, event.detail))} type="button"><kbd>{index + 1}</kbd><b>{LAYER_COPY[layer].icon}</b><span>拆 {LAYER_COPY[layer].label}</span></button>)}</div></div>
        </section>
      ) : null}

      {game.phase === "solved" ? (
        <section className="packet-stage packet-message-recovered" aria-labelledby="packet-recovered-heading"><span aria-hidden="true">✓</span><div><p>恢复的消息</p><h3 id="packet-recovered-heading">{game.assembledMessage}</h3><strong>四层全部正确移除，消息内容没有丢字也没有乱序。</strong></div><button aria-keyshortcuts="Enter" className="packet-escort-action" onClick={nextMission} type="button">{game.missionIndex === game.missionCount - 1 ? "查看护航报告" : "接入下一次护航"} →</button></section>
      ) : null}

      <p className="packet-keyboard-hint">{game.phase === "send" ? <>按 <kbd>Enter</kbd> 发射全部分组</> : game.phase === "order" ? <>用箭头按钮排好编号，再按 <kbd>Enter</kbd> 确认</> : game.phase === "solved" ? <>按 <kbd>Enter</kbd> 接入下一次护航</> : <>按数字键 <kbd>1</kbd>–<kbd>{game.phase === "route" ? mission.routes.length : game.phase === "retransmit" ? mission.fragments.length : 4}</kbd> 选择当前操作</>}</p>
      <p className={`packet-escort-feedback is-${game.phase}`} role="status">{game.feedback}</p>
    </section>
  );
}
