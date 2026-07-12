export interface CreativeCard { id: string; prompt: string; options: [string, string, string]; answer: string; explanation: string; }
export interface CreativeMission { courseId: string; courseName: string; badgeId: string; stages: [string, string, string, string, string, string]; messages: [string, string, string, string, string, string]; demo: string; cards: [CreativeCard, CreativeCard, CreativeCard, CreativeCard]; }
const card = (id: string, prompt: string, options: [string, string, string], answer: string, explanation: string): CreativeCard => ({ id, prompt, options, answer, explanation });

export const CREATIVE_MISSIONS: Record<string, CreativeMission> = {
  "pixel-art": {
    courseId: "pixel-art", courseName: "像素画小工坊", badgeId: "pixel-artist", demo: "🟦🟦⬜⬜　每个小格都保存一种颜色",
    stages: ["图片由小格组成", "像素与分辨率", "颜色编码", "放大看细节", "保存图片", "像素设计挑战"],
    messages: ["位图由许多叫像素的小色格组成。", "相同大小里像素越多，通常能表现更多细节。", "每个像素用编码记录颜色。", "放大位图会看到格子，不会凭空增加真实细节。", "PNG 适合清晰图形，JPEG 常用于照片；保存副本再尝试修改。", "根据四个创作情境选择最合理的方法。"],
    cards: [card("p1", "把小图标放大很多后出现方格，原因是？", ["看到了原来的像素", "电脑坏了", "图片变成文件夹"], "看到了原来的像素", "位图放大后，每个原有像素也被放大。"), card("p2", "想保留透明背景的小图标，先尝试哪种格式？", ["PNG", "TXT", "MP3"], "PNG", "PNG 常用于需要清晰边缘和透明背景的图形。"), card("p3", "修改作品前怎样更容易回到原版？", ["先另存副本", "覆盖后不保存", "删除原图"], "先另存副本", "保留原件能让尝试更安全、可逆。"), card("p4", "同样尺寸下，更多像素通常意味着？", ["能表示更多细节", "一定更安全", "一定是音乐"], "能表示更多细节", "分辨率描述像素数量，但内容质量仍取决于创作和来源。")],
  },
  "document-design": {
    courseId: "document-design", courseName: "文档排版设计", badgeId: "document-designer", demo: "标题　→　小标题　→　正文　→　图片说明",
    stages: ["先想读者", "标题有层级", "段落与留白", "图片配说明", "检查再导出", "排版修复挑战"],
    messages: ["排版的目标是帮助读者理解，而不是把所有效果都用上。", "标题层级像地图，让人知道哪里是重点。", "短段落、对齐和留白能让页面更容易读。", "图片要与内容有关，并写清说明与来源。", "先检查内容和拼写，再保存可编辑版并按需要导出。", "为四份混乱文档选择清楚的修复方法。"],
    cards: [card("d1", "整页文字一样大，首先怎么改善？", ["建立标题和正文层级", "全部变彩虹色", "删除空格"], "建立标题和正文层级", "清楚的层级先帮助读者找到结构。"), card("d2", "一段有二十行，很难读，适合？", ["按意思分成短段落", "缩到最小字", "全改成大写"], "按意思分成短段落", "每段表达一个主要意思更容易阅读。"), card("d3", "网上找到一张图放进作业，还应做什么？", ["确认许可并标注来源", "假装自己画的", "删掉作者名"], "确认许可并标注来源", "使用他人作品要尊重许可和署名要求。"), card("d4", "交作业前最稳妥的文件策略？", ["保留可编辑版并导出提交版", "只留截图", "只存在临时内存"], "保留可编辑版并导出提交版", "源文件便于修改，提交版便于保持版式。")],
  },
  "slide-story": {
    courseId: "slide-story", courseName: "幻灯片故事航线", badgeId: "slide-storyteller", demo: "开场问题　→　三个重点　→　总结行动",
    stages: ["一句核心信息", "故事有顺序", "一页一个重点", "图像帮助说明", "演讲者来讲", "故事排序挑战"],
    messages: ["先确定希望听众最后记住的一句话。", "开场、发展和结尾让信息形成故事。", "每页保留一个重点，听众才不会同时读太多。", "图表和图片应解释内容，不只是装饰。", "幻灯片是提示，完整故事由演讲者讲出来。", "选择让演示更清楚的设计决定。"],
    cards: [card("s1", "一页塞进十个重点，最好怎么改？", ["拆成几页，每页一个重点", "把字缩小", "加更多动画"], "拆成几页，每页一个重点", "分步呈现能降低读者同时处理的信息量。"), card("s2", "介绍植物生长，哪种顺序最清楚？", ["种子、发芽、长叶、开花", "开花、种子、长叶、发芽", "随机排列"], "种子、发芽、长叶、开花", "时间顺序能帮助听众理解变化过程。"), card("s3", "演讲时应该？", ["看听众并用页面提示讲", "背对听众念完所有字", "让动画替自己讲"], "看听众并用页面提示讲", "页面支持表达，演讲者负责解释和交流。"), card("s4", "动画什么时候最有用？", ["帮助说明变化或顺序", "每个字都旋转", "越多越专业"], "帮助说明变化或顺序", "有目的的动画能引导注意，无关动画会分散注意。")],
  },
  "media-copyright": {
    courseId: "media-copyright", courseName: "媒体与版权侦探", badgeId: "copyright-scout", demo: "创作者　→　许可规则　→　使用方式　→　注明来源",
    stages: ["作品有创作者", "版权保护创作", "寻找许可线索", "引用与署名", "自己创作优先", "媒体使用挑战"],
    messages: ["图片、音乐、文字和视频通常都有创作者。", "能在网上看到，不等于可以随意复制发布。", "使用前查看老师要求、网站许可或开放授权。", "署名说明作品来自谁，但署名本身不一定等于获得许可。", "自己创作或使用明确允许的素材最稳妥。", "判断四种媒体使用情境。"],
    cards: [card("c1", "搜索结果里能看到图片，意味着？", ["仍要检查使用许可", "可以随意冒充作者", "没有创作者"], "仍要检查使用许可", "可访问不等于获得复制和发布许可。"), card("c2", "同学画的图想放进展示，应该？", ["先征得同意并署名", "擦掉签名", "偷偷截屏"], "先征得同意并署名", "尊重创作者包括询问、遵守约定和标注来源。"), card("c3", "标着可在课堂使用并要求署名的音乐，应该？", ["按要求署名", "去掉来源", "改名当自己的"], "按要求署名", "许可规则说明了允许范围和需要履行的条件。"), card("c4", "找不到许可说明时最稳妥？", ["换用自己创作或明确许可的素材", "猜它免费", "到处上传"], "换用自己创作或明确许可的素材", "不确定就不擅自发布，并向老师或家长确认。")],
  },
  "data-table": {
    courseId: "data-table", courseName: "数据表格实验", badgeId: "data-organizer", demo: "每一行是一条记录，每一列是一种属性",
    stages: ["问题决定数据", "行与列", "统一数据格式", "排序与筛选", "图表讲趋势", "数据整理挑战"],
    messages: ["先提出问题，再决定需要收集哪些数据。", "表格通常用行放记录、用列放同一种属性。", "同一列使用一致单位和格式才能比较。", "排序改变查看顺序，筛选只显示符合条件的记录。", "图表帮助发现规律，但标题、单位和数据来源都很重要。", "修复四张小学生数据表。"],
    cards: [card("t1", "记录每天气温时，同一列最好？", ["都使用同一种温度单位", "有的写摄氏有的写长度", "每格随意"], "都使用同一种温度单位", "一致单位让数据可以正确比较。"), card("t2", "只想看阅读时间超过30分钟的记录，使用？", ["筛选", "删除全部", "改文件名"], "筛选", "筛选暂时显示符合条件的数据，不应破坏原记录。"), card("t3", "想比较五天的步数高低，哪种图容易看？", ["有标题和单位的柱状图", "没有标签的花纹", "一段随机文字"], "有标题和单位的柱状图", "柱形长度适合比较数量，标签说明图表含义。"), card("t4", "调查同学爱好时不该收集？", ["家庭住址和密码", "最喜欢的运动", "最喜欢的书类"], "家庭住址和密码", "只收集回答问题所需、低风险的数据，绝不收集密码。")],
  },
};

export interface CreativeState { index: number; solved: number; completed: boolean; feedback: { kind: "idle" | "retry" | "correct"; message: string }; }
export const createCreativeState = (): CreativeState => ({ index: 0, solved: 0, completed: false, feedback: { kind: "idle", message: "观察情境，选择最能说明理由的答案。" } });
export function answerCreativeCard(mission: CreativeMission, state: CreativeState, optionIndex: number): CreativeState {
  if (state.completed) return state;
  const current = mission.cards[state.index];
  if (!current || current.options[optionIndex] !== current.answer) return { ...state, feedback: { kind: "retry", message: `再观察一下：${current?.explanation ?? "先读清情境。"}` } };
  const completed = state.index === mission.cards.length - 1;
  return { index: completed ? state.index : state.index + 1, solved: state.solved + 1, completed, feedback: { kind: "correct", message: completed ? "四张创作卡全部完成！" : current.explanation } };
}
