export interface DictionaryEntry {
  id: string;
  islandId: string;
  term: string;
  english: string;
  explanation: string;
  example: string;
}

export const DICTIONARY_ENTRIES: readonly DictionaryEntry[] = [
  { id: "cursor", islandId: "launch-harbor", term: "光标", english: "Cursor", explanation: "屏幕上告诉你下一次点击或输入会发生在哪里的小标记。", example: "鼠标箭头和闪动的文字竖线都是光标。" },
  { id: "keyboard", islandId: "launch-harbor", term: "键盘", english: "Keyboard", explanation: "把按键动作变成文字或命令的输入设备。", example: "按方向键可以让游戏角色移动。" },
  { id: "application", islandId: "launch-harbor", term: "应用程序", english: "Application", explanation: "帮助电脑完成一种任务的一组指令。", example: "画图、写作和浏览网页要用不同的应用程序。" },
  { id: "file", islandId: "file-forest", term: "文件", english: "File", explanation: "电脑里保存的一份作品或资料。", example: "一张照片、一段声音和一篇作文都可以是文件。" },
  { id: "folder", islandId: "file-forest", term: "文件夹", english: "Folder", explanation: "用来分类收纳文件和其他文件夹的容器。", example: "把数学作业都放进“数学”文件夹。" },
  { id: "extension", islandId: "file-forest", term: "扩展名", english: "File extension", explanation: "文件名末尾表示文件种类的小尾巴。", example: ".png 常表示图片，.txt 常表示文字。" },
  { id: "algorithm", islandId: "robot-workshop", term: "算法", english: "Algorithm", explanation: "为了完成任务而排好顺序的一组清楚步骤。", example: "先穿袜子再穿鞋，就是一个有顺序的小算法。" },
  { id: "loop", islandId: "robot-workshop", term: "循环", english: "Loop", explanation: "让一组指令重复执行，不用每次重新写。", example: "重复四次“前进、右转”可以画出正方形。" },
  { id: "condition", islandId: "robot-workshop", term: "条件", english: "Condition", explanation: "让程序根据真假选择不同做法的规则。", example: "如果下雨就带伞，否则戴太阳帽。" },
  { id: "passphrase", islandId: "safety-lighthouse", term: "密码短语", english: "Passphrase", explanation: "由多个不相关词语组成、较长又容易记住的密码。", example: "真实密码只和家长一起设置，课程里只用虚构例子。" },
  { id: "private-information", islandId: "safety-lighthouse", term: "私人信息", english: "Private information", explanation: "能找到、联系或登录到某个人的信息。", example: "住址、电话和真实密码不能随便告诉网友。" },
  { id: "update", islandId: "safety-lighthouse", term: "更新", english: "Update", explanation: "给软件换上修复问题或增加功能的新版本。", example: "看到真实更新提示时先请家长确认。" },
  { id: "input-output", islandId: "hardware-lab", term: "输入与输出", english: "Input and output", explanation: "输入把信息送进电脑，输出把结果呈现给人。", example: "麦克风输入声音，扬声器输出声音。" },
  { id: "cpu", islandId: "hardware-lab", term: "处理器", english: "CPU", explanation: "读取并执行指令、处理数据的电脑部件。", example: "它会计算游戏角色下一步应该出现在哪里。" },
  { id: "memory-storage", islandId: "hardware-lab", term: "内存与存储", english: "Memory and storage", explanation: "内存放正在使用的内容，存储长期保存文件。", example: "关机后内存里的临时工作会消失，保存的文件还在。" },
  { id: "network", islandId: "network-bay", term: "网络", english: "Network", explanation: "让多台设备能够互相传递信息的连接。", example: "家里的电脑可以通过网络向网站服务器请求页面。" },
  { id: "packet", islandId: "network-bay", term: "数据包", english: "Packet", explanation: "网络把大消息拆成的小块，每块都带着目的地信息。", example: "像把一套积木分装进几个有地址的小盒子。" },
  { id: "url", islandId: "network-bay", term: "网址", english: "URL", explanation: "告诉浏览器去哪里找到某个网络资源的地址。", example: "要先看清网站身份，再决定是否打开链接。" },
  { id: "pixel", islandId: "creative-workshop", term: "像素", english: "Pixel", explanation: "数字图片中最小的颜色小方格。", example: "许多不同颜色的像素排在一起就形成图画。" },
  { id: "copyright", islandId: "creative-workshop", term: "版权", english: "Copyright", explanation: "保护创作者作品和使用方式的规则。", example: "使用别人的图片前要看许可并说明来源。" },
  { id: "data-table", islandId: "creative-workshop", term: "数据表", english: "Data table", explanation: "用行和列整齐记录同一种信息。", example: "用一行记录一天，用一列记录当天阅读分钟数。" },
  { id: "collaboration", islandId: "future-station", term: "在线协作", english: "Online collaboration", explanation: "多人通过网络共同完成作品，并清楚分工和沟通。", example: "一人写标题，一人画图，修改前先留下说明。" },
  { id: "ai", islandId: "future-station", term: "人工智能", english: "AI", explanation: "从大量例子中找规律，再生成回答或做出预测的计算机系统。", example: "AI 可以给点子，但也会自信地说错话。" },
  { id: "verification", islandId: "future-station", term: "信息核验", english: "Verification", explanation: "用可靠来源和更多证据检查一条说法。", example: "重要答案要和课本、老师或可信网站再比一比。" },
  { id: "event", islandId: "code-spaceport", term: "事件", english: "Event", explanation: "程序能够发现并作出反应的一次动作或变化。", example: "点击按钮、按下空格和计时结束都可以是事件。" },
  { id: "variable", islandId: "code-spaceport", term: "变量", english: "Variable", explanation: "程序里有名字、内容还能变化的小盒子。", example: "score 变量可以从 0 变成 10。" },
  { id: "function", islandId: "code-spaceport", term: "函数", english: "Function", explanation: "给一组可重复使用的指令起一个名字。", example: "把“播放声音、加一分”装进 collectStar 函数。" },
] as const;

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("zh-CN").replace(/\s+/g, " ");
}

export function searchDictionary(query: string): DictionaryEntry[] {
  const needle = normalize(query);
  if (!needle) return [...DICTIONARY_ENTRIES];
  return DICTIONARY_ENTRIES.filter((entry) =>
    normalize(`${entry.term} ${entry.english} ${entry.explanation} ${entry.example}`).includes(needle),
  );
}
