export interface DeviceCase { id: string; symptom: string; clue: string; safeCheck: string; correctCheck: string; }
export const DEVICE_CASES: DeviceCase[] = [
  { id: "dark", symptom: "屏幕是黑的", clue: "电源指示灯也没有亮", safeCheck: "请大人一起确认设备电源按钮和外部插头", correctCheck: "check-power" },
  { id: "silent", symptom: "视频没有声音", clue: "画面正常，音量图标显示静音", safeCheck: "检查静音和音量设置", correctCheck: "check-volume" },
  { id: "frozen", symptom: "一个画图程序不响应", clue: "其他程序还能使用", safeCheck: "先保存其他工作，再关闭并重新打开这个程序", correctCheck: "restart-app" },
  { id: "keyboard", symptom: "键盘按键没有输入", clue: "屏幕和鼠标都正常", safeCheck: "确认输入框有焦点，并请大人检查外部连接", correctCheck: "check-focus" },
];
export function tryDeviceCheck(deviceCase: DeviceCase, check: string) { const solved = check === deviceCase.correctCheck; return { solved, feedback: solved ? `检查与现象吻合：${deviceCase.safeCheck}。重新测试后恢复正常。` : "这个检查还不能解释现象。回到线索，一次只换一个简单检查。" }; }
