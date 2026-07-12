import assert from "node:assert/strict";
import test from "node:test";
import {
  applyQueueAction,
  applyStackAction,
  findGraphPath,
  findTreePath,
  insertLinkedNode,
  readArraySlot,
  removeLinkedNode,
  updateArraySlot,
  walkLinkedNodes,
} from "../lib/advanced-foundations/data-structures.ts";

test("array lockers read and update only valid integer indexes", () => {
  const lockers = ["贝壳", "星星", "地图"];

  assert.equal(readArraySlot(lockers, 1), "星星");
  assert.equal(readArraySlot(lockers, -1), null);
  assert.equal(readArraySlot(lockers, 1.5), null);
  assert.equal(readArraySlot(lockers, 9), null);
  assert.deepEqual(updateArraySlot(lockers, 1, "钥匙"), ["贝壳", "钥匙", "地图"]);
  assert.deepEqual(updateArraySlot(lockers, 9, "钥匙"), lockers);
  assert.deepEqual(lockers, ["贝壳", "星星", "地图"]);
});

test("linked traversal follows next pointers and stops safely at a cycle", () => {
  const nodes = {
    a: { value: "灯塔", next: "b" },
    b: { value: "码头", next: "c" },
    c: { value: "山洞", next: "b" },
  };

  assert.deepEqual(walkLinkedNodes(nodes, "a"), ["a", "b", "c"]);
  assert.deepEqual(walkLinkedNodes(nodes, "missing"), []);
});

test("linked insertion and removal reconnect copied nodes", () => {
  const nodes = {
    a: { value: "A", next: "c" },
    c: { value: "C", next: null },
  };
  const inserted = insertLinkedNode(nodes, "a", "b", "B");

  assert.deepEqual(walkLinkedNodes(inserted, "a"), ["a", "b", "c"]);
  assert.equal(nodes.a.next, "c");
  assert.deepEqual(walkLinkedNodes(removeLinkedNode(inserted, "a", "b"), "a"), ["a", "c"]);
  assert.deepEqual(removeLinkedNode(nodes, "a", "missing"), nodes);
});

test("stack removes newest while queue removes oldest", () => {
  const stack = applyStackAction(["红", "蓝"], { type: "pop" });
  const queue = applyQueueAction(["红", "蓝"], { type: "dequeue" });

  assert.deepEqual(stack, { items: ["红"], removed: "蓝" });
  assert.deepEqual(queue, { items: ["蓝"], removed: "红" });
  assert.deepEqual(applyStackAction([], { type: "pop" }), { items: [], removed: null });
  assert.deepEqual(applyQueueAction([], { type: "dequeue" }), { items: [], removed: null });
  assert.deepEqual(applyStackAction(["红"], { type: "push", value: "蓝" }).items, ["红", "蓝"]);
  assert.deepEqual(applyQueueAction(["红"], { type: "enqueue", value: "蓝" }).items, ["红", "蓝"]);
});

test("tree path follows parent-child branches", () => {
  const tree = {
    library: ["science", "stories"],
    science: ["space", "animals"],
    stories: ["adventure"],
    space: [],
    animals: [],
    adventure: [],
  };

  assert.deepEqual(findTreePath(tree, "library", "space"), ["library", "science", "space"]);
  assert.deepEqual(findTreePath(tree, "science", "adventure"), []);
});

test("graph path finds the shortest reachable route without looping", () => {
  const graph = {
    harbor: ["forest", "lab"],
    forest: ["harbor", "tower"],
    lab: ["harbor", "tower"],
    tower: ["forest", "lab", "cave"],
    cave: ["tower"],
    moon: [],
  };

  assert.deepEqual(findGraphPath(graph, "harbor", "cave"), ["harbor", "forest", "tower", "cave"]);
  assert.deepEqual(findGraphPath(graph, "harbor", "moon"), []);
  assert.deepEqual(findGraphPath(graph, "cave", "cave"), ["cave"]);
});
