import { useState } from "react";
import { NETWORK_CASES, diagnoseNetwork, type NetworkCause } from "@/lib/network-troubleshooting-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const OPTIONS: Array<{ id: NetworkCause; label: string; checkpoint: string; icon: string }> = [
  { id: "device-offline", label: "这台设备没有连接", checkpoint: "设备连接", icon: "💻" },
  { id: "weak-signal", label: "当前位置网络信号弱", checkpoint: "信号强度", icon: "📶" },
  { id: "server-unavailable", label: "一个服务器暂时不可用", checkpoint: "服务器", icon: "🗄️" },
  { id: "wrong-address", label: "地址输入有误", checkpoint: "地址拼写", icon: "🔤" },
];
interface Props { onComplete: () => void; }

export function NetworkClinic({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState<NetworkCause | null>(null);
  const [feedback, setFeedback] = useState("先比较：是所有服务、一个服务，还是地址问题？" );
  const item = NETWORK_CASES[index];
  const diagnosis = diagnoseNetwork(item);

  function answer(cause: NetworkCause, detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    setChecked(cause);
    if (cause !== diagnosis.cause) { setFeedback("这个原因还不能解释全部现象。比较其他服务和网络图标。" ); return; }
    if (index === NETWORK_CASES.length - 1) onComplete();
    else { setIndex((value) => value + 1); setChecked(null); setFeedback(`判断正确。安全下一步：${diagnosis.nextStep}`); }
  }

  return <div className="network-clinic"><section><span>📶 案例 {index + 1}/4</span><h2 aria-live="polite">{item.symptom}</h2><p><strong>观察证据：</strong>{item.comparison}</p></section><div aria-label="按顺序检查网络环节" className="diagnostic-chain" role="group">{OPTIONS.map((option, optionIndex) => <button aria-pressed={checked === option.id} className={checked === option.id ? "diagnostic-node--checked" : ""} key={option.id} onClick={(event) => answer(option.id, event.detail)} type="button"><span>{option.icon}</span><small>检查点 {optionIndex + 1}</small><strong>{option.checkpoint}</strong><em>{option.label}</em></button>)}</div><p aria-live="polite" role="status">{feedback}</p><aside>不要独自重置路由器、恢复出厂或更改真实网络密码；把观察到的现象告诉家长、老师或负责设备的大人。</aside></div>;
}
