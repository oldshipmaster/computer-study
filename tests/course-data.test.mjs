import assert from "node:assert/strict";
import test from "node:test";
import {
  COURSES,
  ISLANDS,
  getCourse,
  getCourseCardState,
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

test("only the keyboard flight lesson is playable in release one", () => {
  assert.deepEqual(
    COURSES.filter((course) => course.playable).map((course) => course.id),
    ["keyboard-flight"],
  );
  assert.equal(getCourse("keyboard-flight")?.title, "键盘驾驶飞船");
});

test("distinguishes completed, available, and upcoming lesson cards", () => {
  const firstCourse = getCourse("keyboard-flight");
  const secondCourse = getCourse("mouse-precision");

  assert.ok(firstCourse);
  assert.ok(secondCourse);
  assert.equal(getCourseCardState(firstCourse, []), "available");
  assert.equal(getCourseCardState(firstCourse, [firstCourse.id]), "completed");
  assert.equal(getCourseCardState(secondCourse, []), "upcoming");
});

test("finds the next unfinished playable lesson without hiding replayable cards", () => {
  assert.equal(getNextPlayableCourse([])?.id, "keyboard-flight");
  assert.equal(getNextPlayableCourse(["keyboard-flight"]), undefined);
  assert.equal(getCourseCardState(getCourse("keyboard-flight"), ["keyboard-flight"]), "completed");
});
