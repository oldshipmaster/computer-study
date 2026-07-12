import { getNextPlayableCourse, type Course } from "./course-data.ts";

export interface CourseGuide { objectives: [string, string, string]; parentPrompt: string; }
const guide = (a: string, b: string, c: string, parentPrompt: string): CourseGuide => ({ objectives: [a, b, c], parentPrompt });

export const CURRICULUM_GUIDE: Record<string, CourseGuide> = {
  "keyboard-flight": guide("认识方向键与空格键", "按顺序执行指令", "预测程序运行结果", "请孩子解释：飞船为什么严格按队列行动？"),
  "mouse-precision": guide("移动与指向", "单击、双击和拖放", "使用键盘替代路径", "请孩子演示单击和双击有什么不同。"),
  "bilingual-input": guide("准确输入字母数字", "使用退格修正", "完成中文输入法选词", "请孩子说说输入法选词完成前为什么不能判定结果。"),
  "desktop-adventure": guide("认识图标与窗口", "切换和最小化程序", "从任务栏恢复并关闭", "请孩子指出当前哪个窗口在最前面，并说明线索。"),
  "program-landing": guide("打开与编辑程序内容", "选择位置并保存", "处理未保存更改提示", "请孩子解释关闭前什么时候会出现保存提醒。"),
  "file-home": guide("分清文件与文件夹", "读取路径地址", "进入、返回和寻找文件", "请孩子用住址比喻解释文件路径。"),
  "name-your-work": guide("使用描述性名称", "保留文件扩展名", "选择位置并处理重名", "请孩子比较“新建文件”和清楚名称哪个更容易找。"),
  "move-and-copy": guide("区分移动与复制", "使用剪切复制粘贴", "用撤销修正操作", "请孩子数一数移动和复制后各有几份。"),
  "file-types": guide("从扩展名获得类型线索", "分类图片文字声音", "陌生类型先求助", "请孩子说明扩展名为什么只是线索而不是安全证明。"),
  "learning-backpack": guide("搜索和排序文件", "重命名与分类", "从回收站恢复", "请孩子讲出自己的文件夹结构为什么容易找。"),
  "instruction-order": guide("理解从上到下执行", "发现前置步骤", "重新排列程序", "请孩子指出错误程序第一次不合理的步骤。"),
  "grid-city-navigation": guide("读取行列坐标", "按方向改变位置", "避开边界和障碍规划", "请孩子在移动前说出下一格坐标。"),
  "repeat-power": guide("发现重复模式", "设置固定循环次数", "比较长程序和循环程序", "请孩子解释正方形为什么要重复四次。"),
  "rainy-condition": guide("判断条件真或假", "理解那么和否则", "根据变化输入选择分支", "请孩子改变一个条件，预测程序会走哪条分支。"),
  "bug-catcher": guide("先预测再运行", "比较期望和实际", "做最小修改并复测", "请孩子说出证据，而不是直接告诉他怎么改。"),
  "password-guardian": guide("理解长口令优势", "每个账号使用不同密码", "保密并向家长求助", "只讨论虚构示例，不询问或展示家庭真实密码。"),
  "private-information": guide("识别私密信息", "结合询问者和场景", "停止关闭并求助", "请孩子练习一句话：我先不发，要问大人。"),
  "popup-fog": guide("检查弹窗来源", "识别催促下载和索密", "选择关闭或求助", "请孩子指出弹窗里最值得警惕的一条线索。"),
  "healthy-computer-habits": guide("检查坐姿屏幕和光线", "短课后离屏休息", "不舒服立即告诉大人", "和孩子一起安排一段学习与离屏活动节奏。"),
  "light-bit-island": guide("综合调用文件与输入技能", "综合使用编程思维", "综合做出安全决定", "让孩子逐题解释依据，不以答对速度作为目标。"),
  "input-process-output": guide("识别输入设备", "理解处理环节", "识别输出设备并追踪信息", "请孩子选一个日常操作，口述输入处理输出。"),
  "cpu-memory-storage": guide("理解 CPU 的处理角色", "区分工作内存", "理解保存到长期存储", "请孩子解释为什么重启前要保存作品。"),
  "bits-and-data": guide("认识比特的两种状态", "用位值组合数字", "理解编码规则决定含义", "请孩子用四盏开关灯表示一个小数字。"),
  "hardware-software": guide("区分硬件和软件", "理解操作系统协调", "为任务选择软硬件搭档", "请孩子说出一个程序需要哪些物理部件帮助。"),
  "troubleshoot-machine": guide("准确描述设备现象", "先查简单可逆原因", "一次改一处并复测", "只追问观察到什么，涉及电源和设备内部立刻由大人处理。"),
  "network-journey": guide("认识设备和路由器", "理解互联网连接多个网络", "认识服务器请求与响应", "请孩子扮演数据包，走一遍请求和返回路线。"),
  "web-address": guide("拆分连接方式网站身份路径", "完整核对网站身份", "识别相似虚构地址", "请孩子用手指出网址中真正的网站身份。"),
  "search-and-links": guide("提炼搜索关键词", "比较结果与来源线索", "使用链接和标签页导航", "请孩子解释为什么第一个结果不一定最可靠。"),
  "downloads-and-cloud": guide("区分本机与云端副本", "理解下载上传和同步", "理解共享是访问权限", "请孩子画出作品在本机和云端各有一份的示意图。"),
  "network-troubleshooting": guide("描述网络故障范围", "区分连接服务器和地址问题", "选择安全检查并求助", "请孩子比较所有服务失败和单个服务失败有什么不同。"),
  "pixel-art": guide("理解像素和分辨率", "认识颜色编码与图片格式", "保留原件并安全修改", "请孩子放大一张虚构像素图，解释看到方格的原因。"),
  "document-design": guide("建立标题和正文层级", "用段落留白帮助阅读", "保留源文件并规范导出", "请孩子指出一页文档中最先被看到的信息，并说明为什么。"),
  "slide-story": guide("确定一句核心信息", "按顺序组织开场发展结尾", "用页面支持口头表达", "请孩子只看标题复述整段演示的故事顺序。"),
  "media-copyright": guide("知道数字作品有创作者", "查看使用许可与范围", "尊重署名并优先自己创作", "一起检查一份素材的作者与许可，不上传真实作品。"),
  "data-table": guide("用行列组织记录", "保持单位与格式一致", "用筛选和图表回答问题", "请孩子说明排序和筛选有什么不同，并举一个低风险数据例子。"),
  "email-message": guide("核对收件人与主题", "写清楚礼貌的正文", "谨慎处理附件和真实发送", "使用虚构地址练习；真实账号、附件和发送必须由家长或老师协助。"),
  "online-collaboration": guide("为共同目标明确分工", "给出具体友善的评论", "理解版本记录和最小权限", "请孩子把一句模糊评价改成针对作品、可以行动的建议。"),
  "ai-helper": guide("理解 AI 生成而非真正理解", "用目标背景要求说清任务", "保护隐私并由人核对修改", "只用虚构内容练习提示，不上传孩子姓名、学校、照片或未获许可作品。"),
  "verify-ai": guide("识别可核对的具体主张", "优先权威和原始来源", "交叉核对并表达不确定", "选一个低风险虚构主张，让孩子说明需要什么证据才能相信。"),
  "digital-project": guide("从清楚问题开始", "拆分任务并选择工具", "测试改进后负责任分享", "请孩子用问题、计划、证据、改进四句话复盘项目，不要求公开发布。"),
};

export function getNextCourseGuide(completedCourseIds: readonly string[]): { course: Course; guide: CourseGuide } | undefined {
  const course = getNextPlayableCourse(completedCourseIds);
  const courseGuide = course ? CURRICULUM_GUIDE[course.id] : undefined;
  return course && courseGuide ? { course, guide: courseGuide } : undefined;
}
