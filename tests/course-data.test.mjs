import assert from "node:assert/strict";
import test from "node:test";
import {
  COURSES,
  ISLANDS,
  getCourse,
  getCourseCardState,
  getMapMission,
  getNextPlayableCourse,
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
];

test("publishes four islands and twenty ordered lessons", () => {
  assert.equal(ISLANDS.length, 4);
  assert.equal(COURSES.length, 20);
  assert.deepEqual(
    COURSES.map((course) => course.order),
    Array.from({ length: 20 }, (_, index) => index + 1),
  );
  assert.deepEqual(COURSES.map((course) => course.title), COURSE_TITLES);
  assert.ok(ISLANDS.every((island) => island.courseIds.length === 5));
});

test("publishes only lessons with complete interactive implementations", () => {
  assert.deepEqual(
    COURSES.filter((course) => course.playable).map((course) => course.id),
    COURSE_TITLES.map((_, index) => COURSES[index].id),
  );
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
  assert.equal(getNextPlayableCourse(["keyboard-flight"])?.id, "mouse-precision");
  assert.equal(getCourseCardState(getCourse("keyboard-flight"), ["keyboard-flight"]), "completed");
});

test("turns the map mission into a celebration after all lessons are complete", () => {
  const first = getMapMission([]);
  assert.equal(first.complete, false);
  assert.equal(first.course?.id, "keyboard-flight");

  const finished = getMapMission(COURSES.map((course) => course.id));
  assert.equal(finished.complete, true);
  assert.equal(finished.course?.id, "keyboard-flight");
});
