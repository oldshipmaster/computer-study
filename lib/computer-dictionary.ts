export interface DictionaryEntry {
  id: string;
  islandId: string;
  courseId: string;
  term: string;
  english: string;
  explanation: string;
  example: string;
}

export const DICTIONARY_ENTRIES: readonly DictionaryEntry[] = [
  { id: "cursor", islandId: "launch-harbor", courseId: "mouse-precision", term: "光标", english: "Cursor", explanation: "屏幕上告诉你下一次点击或输入会发生在哪里的小标记。", example: "鼠标箭头和闪动的文字竖线都是光标。" },
  { id: "keyboard", islandId: "launch-harbor", courseId: "keyboard-flight", term: "键盘", english: "Keyboard", explanation: "把按键动作变成文字或命令的输入设备。", example: "按方向键可以让游戏角色移动。" },
  { id: "application", islandId: "launch-harbor", courseId: "program-landing", term: "应用程序", english: "Application", explanation: "帮助电脑完成一种任务的一组指令。", example: "画图、写作和浏览网页要用不同的应用程序。" },
  { id: "input-method", islandId: "launch-harbor", courseId: "bilingual-input", term: "输入法", english: "Input method", explanation: "把键盘按键组合转换成不同语言文字的工具。", example: "输入拼音后选中文字，文字才真正进入文档。" },
  { id: "desktop", islandId: "launch-harbor", courseId: "desktop-adventure", term: "桌面", english: "Desktop", explanation: "电脑登录后用来放图标、窗口和任务栏的主要工作区域。", example: "最前面的窗口通常是现在正在操作的程序。" },
  { id: "file", islandId: "file-forest", courseId: "file-home", term: "文件", english: "File", explanation: "电脑里保存的一份作品或资料。", example: "一张照片、一段声音和一篇作文都可以是文件。" },
  { id: "folder", islandId: "file-forest", courseId: "learning-backpack", term: "文件夹", english: "Folder", explanation: "用来分类收纳文件和其他文件夹的容器。", example: "把数学作业都放进“数学”文件夹。" },
  { id: "extension", islandId: "file-forest", courseId: "file-types", term: "扩展名", english: "File extension", explanation: "文件名末尾表示文件种类的小尾巴。", example: ".png 常表示图片，.txt 常表示文字。" },
  { id: "filename", islandId: "file-forest", courseId: "name-your-work", term: "文件名", english: "Filename", explanation: "帮助人分辨和寻找文件的名称，通常还带有扩展名。", example: "2026春游照片.png 比“新建文件9.png”更容易找到。" },
  { id: "move-copy", islandId: "file-forest", courseId: "move-and-copy", term: "移动与复制", english: "Move and copy", explanation: "移动改变原件位置，复制保留原件并产生一份副本。", example: "把照片复制到备份文件夹后，两个位置各有一份。" },
  { id: "algorithm", islandId: "robot-workshop", courseId: "instruction-order", term: "算法", english: "Algorithm", explanation: "为了完成任务而排好顺序的一组清楚步骤。", example: "先穿袜子再穿鞋，就是一个有顺序的小算法。" },
  { id: "loop", islandId: "robot-workshop", courseId: "repeat-power", term: "循环", english: "Loop", explanation: "让一组指令重复执行，不用每次重新写。", example: "重复四次“前进、右转”可以画出正方形。" },
  { id: "condition", islandId: "robot-workshop", courseId: "rainy-condition", term: "条件", english: "Condition", explanation: "让程序根据真假选择不同做法的规则。", example: "如果下雨就带伞，否则戴太阳帽。" },
  { id: "coordinate", islandId: "robot-workshop", courseId: "grid-city-navigation", term: "坐标", english: "Coordinate", explanation: "用行和列等数字准确表示一个位置的方法。", example: "第 2 行第 4 列可以写成一个方格坐标。" },
  { id: "debugging", islandId: "robot-workshop", courseId: "bug-catcher", term: "调试", english: "Debugging", explanation: "找到程序第一次偏离预期的位置，小步修改后重新测试。", example: "先比较预期路线和实际路线，再只改一条指令。" },
  { id: "passphrase", islandId: "safety-lighthouse", courseId: "password-guardian", term: "密码短语", english: "Passphrase", explanation: "由多个不相关词语组成、较长又容易记住的密码。", example: "真实密码只和家长一起设置，课程里只用虚构例子。" },
  { id: "private-information", islandId: "safety-lighthouse", courseId: "private-information", term: "私人信息", english: "Private information", explanation: "能找到、联系或登录到某个人的信息。", example: "住址、电话和真实密码不能随便告诉网友。" },
  { id: "update", islandId: "safety-lighthouse", courseId: "popup-fog", term: "更新", english: "Update", explanation: "给软件换上修复问题或增加功能的新版本。", example: "看到真实更新提示时先请家长确认。" },
  { id: "ergonomics", islandId: "safety-lighthouse", courseId: "healthy-computer-habits", term: "健康使用", english: "Ergonomics", explanation: "用合适坐姿、光线、距离和休息节奏保护身体。", example: "短课后离开屏幕看远处，眼睛不舒服马上告诉大人。" },
  { id: "digital-citizenship", islandId: "safety-lighthouse", courseId: "light-bit-island", term: "数字公民", english: "Digital citizenship", explanation: "安全、尊重、负责地使用数字工具并照顾自己和他人。", example: "不分享隐私，尊重作品来源，不确定时先停下求助。" },
  { id: "input-output", islandId: "hardware-lab", courseId: "input-process-output", term: "输入与输出", english: "Input and output", explanation: "输入把信息送进电脑，输出把结果呈现给人。", example: "麦克风输入声音，扬声器输出声音。" },
  { id: "cpu-memory-storage", islandId: "hardware-lab", courseId: "cpu-memory-storage", term: "处理器、内存与存储", english: "CPU, memory and storage", explanation: "处理器执行指令，内存放正在使用的内容，存储长期保存文件。", example: "关机后未保存的内存内容会消失，已保存文件还在。" },
  { id: "bit", islandId: "hardware-lab", courseId: "bits-and-data", term: "比特", english: "Bit / Byte", explanation: "比特只有 0 或 1；连续 8 个比特组成一个字节。", example: "一个字节有 256 种不同的 0 和 1 组合。" },
  { id: "hardware-software", islandId: "hardware-lab", courseId: "hardware-software", term: "硬件与软件", english: "Hardware and software", explanation: "硬件是能触摸的部件，软件是让硬件工作的指令。", example: "画画需要鼠标和屏幕，也需要画图程序。" },
  { id: "troubleshooting", islandId: "hardware-lab", courseId: "troubleshoot-machine", term: "故障排查", english: "Troubleshooting", explanation: "从简单安全的现象开始，一次检查一个原因并观察结果。", example: "先看音量是否关闭，不自己拆开设备。" },
  { id: "network", islandId: "network-bay", courseId: "network-troubleshooting", term: "网络故障范围", english: "Network scope", explanation: "比较一台还是多台设备、一个还是所有网站失败，以缩小原因范围。", example: "只有一个网站打不开和全家都断网可能是不同问题。" },
  { id: "packet", islandId: "network-bay", courseId: "network-journey", term: "数据包", english: "Packet", explanation: "网络把大消息拆成的小块，每块都带着目的地信息。", example: "像把一套积木分装进几个有地址的小盒子。" },
  { id: "url", islandId: "network-bay", courseId: "web-address", term: "网址", english: "URL / DNS", explanation: "网址写出网络位置，DNS 帮设备把网站名字找到对应的数字地址。", example: "能解析出数字地址不等于可信，仍要看清网站身份。" },
  { id: "search-terms", islandId: "network-bay", courseId: "search-and-links", term: "搜索关键词", english: "Search terms", explanation: "从问题中挑出的核心词语，帮助搜索工具找到更相关的结果。", example: "把“为什么月亮会变化形状”提炼为“月相 原因 儿童”。" },
  { id: "cloud", islandId: "network-bay", courseId: "downloads-and-cloud", term: "云端", english: "Cloud", explanation: "通过网络访问的远程服务器和存储空间。", example: "下载会把云端文件复制到本机，上传方向相反。" },
  { id: "pixel", islandId: "creative-workshop", courseId: "pixel-art", term: "像素", english: "Pixel", explanation: "数字图片中最小的颜色小方格。", example: "许多不同颜色的像素排在一起就形成图画。" },
  { id: "copyright", islandId: "creative-workshop", courseId: "media-copyright", term: "版权", english: "Copyright", explanation: "保护创作者作品和使用方式的规则。", example: "使用别人的图片前要看许可并说明来源。" },
  { id: "data-table", islandId: "creative-workshop", courseId: "data-table", term: "数据表", english: "Data table", explanation: "用行和列整齐记录同一种信息。", example: "用一行记录一天，用一列记录当天阅读分钟数。" },
  { id: "visual-hierarchy", islandId: "creative-workshop", courseId: "document-design", term: "视觉层级", english: "Visual hierarchy", explanation: "用标题、字号、留白和顺序告诉读者先看什么。", example: "大标题先说明主题，正文再补充细节。" },
  { id: "slide", islandId: "creative-workshop", courseId: "slide-story", term: "幻灯片", english: "Slide", explanation: "演示中承载一个重点、配合口头讲解的一页画面。", example: "开场、发展和结尾按顺序组成一个小故事。" },
  { id: "collaboration", islandId: "future-station", courseId: "online-collaboration", term: "在线协作", english: "Online collaboration", explanation: "多人通过网络共同完成作品，并清楚分工和沟通。", example: "一人写标题，一人画图，修改前先留下说明。" },
  { id: "ai", islandId: "future-station", courseId: "ai-helper", term: "人工智能", english: "AI", explanation: "从大量例子中找规律，再生成回答或做出预测的计算机系统。", example: "AI 可以给点子，但也会自信地说错话。" },
  { id: "verification", islandId: "future-station", courseId: "verify-ai", term: "信息核验", english: "Verification", explanation: "用可靠来源和更多证据检查一条说法。", example: "重要答案要和课本、老师或可信网站再比一比。" },
  { id: "email", islandId: "future-station", courseId: "email-message", term: "电子邮件", english: "Email", explanation: "带有收件人、主题、正文和可选附件的网络消息。", example: "真实发送前要核对收件人，附件操作请大人协助。" },
  { id: "digital-project", islandId: "future-station", courseId: "digital-project", term: "数字项目", english: "Digital project", explanation: "从问题出发，经过计划、制作、测试和改进形成的数字作品。", example: "先定义要帮助谁，再选择工具并用反馈改进。" },
  { id: "event", islandId: "code-spaceport", courseId: "events-handlers", term: "事件", english: "Event", explanation: "程序能够发现并作出反应的一次动作或变化。", example: "点击按钮、按下空格和计时结束都可以是事件。" },
  { id: "variable", islandId: "code-spaceport", courseId: "variables-score", term: "变量", english: "Variable", explanation: "程序里有名字、内容还能变化的小盒子。", example: "score 变量可以从 0 变成 10。" },
  { id: "function", islandId: "code-spaceport", courseId: "functions-tools", term: "函数", english: "Function", explanation: "给一组可重复使用的指令起一个名字。", example: "把“播放声音、加一分”装进 collectStar 函数。" },
  { id: "boolean", islandId: "code-spaceport", courseId: "boolean-logic", term: "布尔逻辑", english: "Boolean logic", explanation: "用真和假以及“并且、或者、不是”组合判断。", example: "有钥匙并且门是关着的，才执行开门。" },
  { id: "game-rule", islandId: "code-spaceport", courseId: "game-design", term: "游戏规则", english: "Game rule", explanation: "说明目标、允许的行动、得分和结束条件的约定。", example: "玩家收集三颗星得胜，碰到障碍会回到起点。" },
  { id: "array", islandId: "data-structures", courseId: "array-lockers", term: "数组", english: "Array", explanation: "把同类资料按连续编号排在一起的数据结构。", example: "储物柜编号能直接指向第几个物品。" },
  { id: "linked-list", islandId: "data-structures", courseId: "linked-treasure", term: "链表", english: "Linked list", explanation: "每个节点保存内容和通往下一节点的线索。", example: "寻宝卡写着宝物，也写着下一站位置。" },
  { id: "stack", islandId: "data-structures", courseId: "stack-queue-dock", term: "栈", english: "Stack", explanation: "后放进去的内容会先被取出的数据结构。", example: "叠起来的盘子通常从最上面先拿。" },
  { id: "tree", islandId: "data-structures", courseId: "tree-library", term: "树", english: "Tree", explanation: "从一个根节点向下分出多层子节点的结构。", example: "学校文件夹下可以再分年级和班级。" },
  { id: "graph", islandId: "data-structures", courseId: "graph-routes", term: "图", english: "Graph", explanation: "用节点和边表示许多对象及其连接关系。", example: "地铁站是节点，站点之间的线路是边。" },
  { id: "linear-search", islandId: "algorithm-arena", courseId: "linear-search", term: "线性搜索", english: "Linear search", explanation: "从第一项开始逐个比较直到找到目标。", example: "翻卡片时从左到右一张一张检查。" },
  { id: "binary-search", islandId: "algorithm-arena", courseId: "binary-search", term: "二分搜索", english: "Binary search", explanation: "在有序资料中每次舍弃不可能的一半。", example: "猜数时先猜中间值再缩小范围。" },
  { id: "bubble-sort", islandId: "algorithm-arena", courseId: "bubble-sort", term: "冒泡排序", english: "Bubble sort", explanation: "反复比较相邻项目并交换错误顺序的算法。", example: "较大的数字经过交换逐步移动到右边。" },
  { id: "decomposition", islandId: "algorithm-arena", courseId: "task-decomposition", term: "任务分解", english: "Decomposition", explanation: "把复杂问题拆成更容易完成的小任务。", example: "做海报可拆成写标题、画图和检查。" },
  { id: "efficiency", islandId: "algorithm-arena", courseId: "algorithm-efficiency", term: "算法效率", english: "Algorithm efficiency", explanation: "算法完成任务所需步骤或资源的多少。", example: "资料很多时对半搜索通常比较次数更少。" },
  { id: "process", islandId: "os-control-tower", courseId: "program-process", term: "进程", english: "Process", explanation: "程序运行起来后由操作系统管理的任务。", example: "同一个画图程序可以同时打开两个进程。" },
  { id: "scheduling", islandId: "os-control-tower", courseId: "cpu-scheduling", term: "调度", english: "Scheduling", explanation: "安排多个任务何时轮流使用处理器的规则。", example: "每个任务使用一个时间片后先让给下一个。" },
  { id: "allocation", islandId: "os-control-tower", courseId: "memory-allocation", term: "内存分配", english: "Memory allocation", explanation: "为运行中的任务划出可使用的内存空间。", example: "任务结束后释放格子，新任务才能继续使用。" },
  { id: "file-system", islandId: "os-control-tower", courseId: "file-system-tree", term: "文件系统", english: "File system", explanation: "操作系统组织、命名和寻找文件的规则。", example: "路径像地址一样逐层穿过文件夹。" },
  { id: "device-queue", islandId: "os-control-tower", courseId: "device-coordination", term: "设备队列", english: "Device queue", explanation: "等待共享设备处理的一列任务请求。", example: "打印机一次打印一份，其他作业按顺序等待。" },
  { id: "instruction-cycle", islandId: "systems-network-depths", courseId: "instruction-cycle", term: "指令周期", english: "Instruction cycle", explanation: "处理器取指、译码、执行并写回的一轮工作。", example: "CPU 完成一条指令后继续取下一条。" },
  { id: "cache", islandId: "systems-network-depths", courseId: "cache-station", term: "高速缓存", english: "Cache", explanation: "保存常用资料、速度比内存更快的小空间。", example: "常用卡片放在手边比每次去仓库更快。" },
  { id: "encapsulation", islandId: "systems-network-depths", courseId: "network-layers", term: "封装", english: "Encapsulation", explanation: "网络发送时每一层为数据加上自己的信息。", example: "消息像礼物一样逐层套上标签和包装。" },
  { id: "routing", islandId: "systems-network-depths", courseId: "routing-maze", term: "路由", english: "Routing", explanation: "为数据包选择通往目标网络的路径。", example: "路由器比较路线代价后决定下一站。" },
  { id: "acknowledgement", islandId: "systems-network-depths", courseId: "reliable-transfer", term: "确认应答", english: "Acknowledgement", explanation: "接收方告诉发送方某个数据包已经收到。", example: "没有等到确认时，发送方会再次发送。" },
] as const;

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("zh-CN").replace(/\s+/g, " ");
}

export function searchDictionary(query: string): DictionaryEntry[] {
  const needle = normalize(query);
  if (!needle) return [...DICTIONARY_ENTRIES];
  const exactShortAsciiToken = /^[a-z0-9]{1,2}$/.test(needle);
  return DICTIONARY_ENTRIES.filter((entry) => {
    const haystack = normalize(`${entry.term} ${entry.english} ${entry.explanation} ${entry.example}`);
    return exactShortAsciiToken
      ? haystack.split(/[^a-z0-9]+/).includes(needle)
      : haystack.includes(needle);
  });
}
