import assert from "node:assert/strict";
import test from "node:test";
import {
  COURSES,
  CURRICULUM_FACTS,
  ISLANDS,
  getCourse,
  getCourseCardState,
  getMapMission,
  getNextPlayableCourse,
  RECOMMENDED_ROUTE_IDS,
} from "../lib/course-data.ts";

const COURSE_TITLES = [
  "键盘驾驶飞船",
  "鼠标精准训练",
  "中英文输入站",
  "桌面探险",
  "程序安全起降",
  "文件住在哪里",
  "给作品起名字",
  "搬家与复制术",
  "图片、文字与声音",
  "整理学习背包",
  "指令排排队",
  "方格城导航",
  "重复的力量",
  "如果下雨就撑伞",
  "抓住小虫子",
  "密码守护术",
  "什么信息不能说",
  "弹窗迷雾",
  "健康电脑习惯",
  "点亮比特岛",
  "信息加工流水线",
  "处理器、内存与存储",
  "0 和 1 的数据积木",
  "硬件与软件搭档",
  "电脑小医生",
  "消息怎样穿过网络",
  "网址是网络地址",
  "搜索与链接导航",
  "下载、上传与云端",
  "网络信号侦察",
  "像素画小工坊",
  "文档排版设计",
  "幻灯片故事航线",
  "媒体与版权侦探",
  "数据表格实验",
  "电子邮件通信",
  "在线协作实验室",
  "AI 助手使用入门",
  "AI 信息核验站",
  "数字项目总挑战",
  "事件启动器",
  "变量能量箱",
  "函数工具箱",
  "真假逻辑门",
  "小游戏设计总装",
  "数组储物柜", "链表寻宝队", "栈与队列码头", "树形图书馆", "图结构航线",
  "逐个搜索赛", "对半搜索赛", "冒泡排序池", "任务拆解工坊", "算法效率擂台",
  "程序变进程", "CPU 调度台", "内存分配站", "文件系统树", "设备协调队",
  "指令周期潜航", "高速缓存中转站", "网络分层潜水艇", "路由迷宫", "可靠传输救援",
];

test("publishes thirteen islands and sixty-five ordered lessons", () => {
  assert.equal(ISLANDS.length, 13);
  assert.equal(COURSES.length, 65);
  assert.deepEqual(
    COURSES.map((course) => course.order),
    Array.from({ length: 65 }, (_, index) => index + 1),
  );
  assert.deepEqual(COURSES.map((course) => course.title), COURSE_TITLES);
  assert.ok(ISLANDS.every((island) => island.courseIds.length === 5));
});

test("derives public curriculum facts from the live catalog", () => {
  assert.deepEqual(CURRICULUM_FACTS, {
    islandCount: ISLANDS.length,
    courseCount: COURSES.length,
    minutesPerCourse: { minimum: 9, maximum: 10 },
  });
  assert.ok(Object.isFrozen(CURRICULUM_FACTS));
  assert.ok(Object.isFrozen(CURRICULUM_FACTS.minutesPerCourse));
});

test("publishes only lessons with complete interactive implementations", () => {
  assert.equal(COURSES.filter((course) => course.playable).length, 65);
  assert.equal(getCourse("input-process-output")?.playable, true);
  assert.equal(getCourse("cpu-memory-storage")?.playable, true);
  assert.equal(getCourse("bits-and-data")?.playable, true);
  assert.equal(getCourse("hardware-software")?.playable, true);
  assert.equal(getCourse("troubleshoot-machine")?.playable, true);
  assert.equal(getCourse("network-journey")?.playable, true);
  assert.equal(getCourse("web-address")?.playable, true);
  assert.equal(getCourse("search-and-links")?.playable, true);
  assert.equal(getCourse("downloads-and-cloud")?.playable, true);
  assert.equal(getCourse("network-troubleshooting")?.playable, true);
  assert.equal(getCourse("pixel-art")?.playable, true);
  assert.equal(getCourse("document-design")?.playable, true);
  assert.equal(getCourse("slide-story")?.playable, true);
  assert.equal(getCourse("media-copyright")?.playable, true);
  assert.equal(getCourse("data-table")?.playable, true);
  assert.equal(getCourse("email-message")?.playable, true);
  assert.equal(getCourse("online-collaboration")?.playable, true);
  assert.equal(getCourse("ai-helper")?.playable, true);
  assert.equal(getCourse("verify-ai")?.playable, true);
  assert.equal(getCourse("digital-project")?.playable, true);
  assert.equal(getCourse("events-handlers")?.playable, true);
  assert.equal(getCourse("variables-score")?.playable, true);
  assert.equal(getCourse("functions-tools")?.playable, true);
  assert.equal(getCourse("boolean-logic")?.playable, true);
  assert.equal(getCourse("game-design")?.playable, true);
  assert.equal(getCourse("keyboard-flight")?.title, "键盘驾驶飞船");
});

test("distinguishes completed, available, and upcoming lesson cards", () => {
  const firstCourse = getCourse("keyboard-flight");
  const secondCourse = getCourse("mouse-precision");
  const thirdCourse = getCourse("bilingual-input");
  const fourthCourse = getCourse("desktop-adventure");
  const fifthCourse = getCourse("program-landing");
  const sixthCourse = getCourse("file-home");
  const seventhCourse = getCourse("name-your-work");
  const eighthCourse = getCourse("move-and-copy");
  const ninthCourse = getCourse("file-types");
  const tenthCourse = getCourse("learning-backpack");
  const eleventhCourse = getCourse("instruction-order");
  const twelfthCourse = getCourse("grid-city-navigation");
  const thirteenthCourse = getCourse("repeat-power");
  const fourteenthCourse = getCourse("rainy-condition");
  const fifteenthCourse = getCourse("bug-catcher");
  const sixteenthCourse = getCourse("password-guardian");
  const seventeenthCourse = getCourse("private-information");
  const eighteenthCourse = getCourse("popup-fog");
  const nineteenthCourse = getCourse("healthy-computer-habits");
  const twentiethCourse = getCourse("light-bit-island");

  assert.ok(firstCourse);
  assert.ok(secondCourse);
  assert.ok(thirdCourse);
  assert.ok(fourthCourse);
  assert.ok(fifthCourse);
  assert.ok(sixthCourse);
  assert.ok(seventhCourse);
  assert.ok(eighthCourse);
  assert.ok(ninthCourse);
  assert.ok(tenthCourse);
  assert.ok(eleventhCourse);
  assert.ok(twelfthCourse);
  assert.ok(thirteenthCourse);
  assert.ok(fourteenthCourse);
  assert.ok(fifteenthCourse);
  assert.ok(sixteenthCourse);
  assert.ok(seventeenthCourse);
  assert.ok(eighteenthCourse);
  assert.ok(nineteenthCourse);
  assert.ok(twentiethCourse);
  assert.equal(getCourseCardState(firstCourse, []), "available");
  assert.equal(getCourseCardState(firstCourse, [firstCourse.id]), "completed");
  assert.equal(getCourseCardState(secondCourse, []), "available");
  assert.equal(getCourseCardState(thirdCourse, []), "available");
  assert.equal(getCourseCardState(fourthCourse, []), "available");
  assert.equal(getCourseCardState(fifthCourse, []), "available");
  assert.equal(getCourseCardState(sixthCourse, []), "available");
  assert.equal(getCourseCardState(seventhCourse, []), "available");
  assert.equal(getCourseCardState(eighthCourse, []), "available");
  assert.equal(getCourseCardState(ninthCourse, []), "available");
  assert.equal(getCourseCardState(tenthCourse, []), "available");
  assert.equal(getCourseCardState(eleventhCourse, []), "available");
  assert.equal(getCourseCardState(twelfthCourse, []), "available");
  assert.equal(getCourseCardState(thirteenthCourse, []), "available");
  assert.equal(getCourseCardState(fourteenthCourse, []), "available");
  assert.equal(getCourseCardState(fifteenthCourse, []), "available");
  assert.equal(getCourseCardState(sixteenthCourse, []), "available");
  assert.equal(getCourseCardState(seventeenthCourse, []), "available");
  assert.equal(getCourseCardState(eighteenthCourse, []), "available");
  assert.equal(getCourseCardState(nineteenthCourse, []), "available");
  assert.equal(getCourseCardState(twentiethCourse, []), "available");
});

test("finds the next unfinished playable lesson without hiding replayable cards", () => {
  assert.equal(getNextPlayableCourse([])?.id, "keyboard-flight");
  assert.equal(getNextPlayableCourse(["keyboard-flight"])?.id, "file-home");
  assert.equal(getNextPlayableCourse(["keyboard-flight", "file-home"])?.id, "instruction-order");
  assert.equal(getCourseCardState(getCourse("keyboard-flight"), ["keyboard-flight"]), "completed");
});

test("interleaves all thirteen domains in five learning rounds", () => {
  assert.equal(RECOMMENDED_ROUTE_IDS.length, 65);
  assert.equal(new Set(RECOMMENDED_ROUTE_IDS).size, 65);
  assert.deepEqual(RECOMMENDED_ROUTE_IDS.slice(0, 13), [
    "keyboard-flight", "file-home", "instruction-order", "password-guardian",
    "input-process-output", "network-journey", "pixel-art", "email-message", "events-handlers",
    "array-lockers", "linear-search", "program-process", "instruction-cycle",
  ]);
  assert.deepEqual(RECOMMENDED_ROUTE_IDS.slice(-13), [
    "program-landing", "learning-backpack", "bug-catcher", "light-bit-island",
    "troubleshoot-machine", "network-troubleshooting", "data-table", "digital-project", "game-design",
    "graph-routes", "algorithm-efficiency", "device-coordination", "reliable-transfer",
  ]);
  assert.deepEqual(new Set(RECOMMENDED_ROUTE_IDS), new Set(COURSES.map((course) => course.id)));
});

test("turns the map mission into a celebration after all lessons are complete", () => {
  const first = getMapMission([]);
  assert.equal(first.complete, false);
  assert.equal(first.course?.id, "keyboard-flight");

  const finished = getMapMission(COURSES.map((course) => course.id));
  assert.equal(finished.complete, true);
  assert.equal(finished.course?.id, "keyboard-flight");
});

test("prioritizes a valid unfinished resume without overriding completion", () => {
  assert.equal(getMapMission([], { courseId: "data-table", stage: 4 }).course?.id, "data-table");
  assert.equal(getMapMission(["data-table"], { courseId: "data-table", stage: 4 }).course?.id, "keyboard-flight");
  assert.equal(getMapMission([], { courseId: "unknown", stage: 2 }).course?.id, "keyboard-flight");
  assert.equal(getMapMission([], { courseId: "data-table", stage: 6 }).course?.id, "keyboard-flight");
  const all = COURSES.map((course) => course.id);
  assert.equal(getMapMission(all, { courseId: "data-table", stage: 4 }).complete, true);
});
