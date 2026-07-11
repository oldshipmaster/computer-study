export type NetworkCause = "device-offline" | "weak-signal" | "server-unavailable" | "wrong-address";
export interface NetworkCase { id: NetworkCause; symptom: string; comparison: string; }
export const NETWORK_CASES: NetworkCase[] = [
  { id: "device-offline", symptom: "所有虚构网站都打不开", comparison: "网络图标显示未连接" },
  { id: "weak-signal", symptom: "靠近网络边缘时内容很慢", comparison: "信号格只有一格" },
  { id: "server-unavailable", symptom: "只有图书馆服务打不开", comparison: "其他虚构网站正常" },
  { id: "wrong-address", symptom: "页面提示找不到地址", comparison: "地址栏多输入了一个字母" },
];
export function diagnoseNetwork(item: NetworkCase) { const steps: Record<NetworkCause, string> = { "device-offline": "先看网络图标是否连接，再把现象告诉家长或老师。", "weak-signal": "移动到家长允许且信号更好的位置，仍有问题就求助。", "server-unavailable": "设备和其他服务正常，等待该服务器恢复后稍后再试。", "wrong-address": "对照可信来源逐字检查虚构地址并修正。" }; return { cause: item.id, nextStep: steps[item.id] }; }
