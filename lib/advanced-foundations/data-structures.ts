export interface LinkedNode<T> {
  value: T;
  next: string | null;
}

export type LinkedNodes<T> = Readonly<Record<string, LinkedNode<T>>>;
export type AdjacencyMap = Readonly<Record<string, readonly string[]>>;

export function readArraySlot<T>(items: readonly T[], index: number): T | null {
  return Number.isInteger(index) && index >= 0 && index < items.length
    ? items[index]
    : null;
}

export function updateArraySlot<T>(
  items: readonly T[],
  index: number,
  value: T,
): T[] {
  if (readArraySlot(items, index) === null) return [...items];
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

export function walkLinkedNodes<T>(
  nodes: LinkedNodes<T>,
  headId: string,
): string[] {
  const visited = new Set<string>();
  const path: string[] = [];
  let currentId: string | null = headId;

  while (currentId && nodes[currentId] && !visited.has(currentId)) {
    visited.add(currentId);
    path.push(currentId);
    currentId = nodes[currentId].next;
  }

  return path;
}

export function insertLinkedNode<T>(
  nodes: LinkedNodes<T>,
  afterId: string,
  newId: string,
  value: T,
): Record<string, LinkedNode<T>> {
  const after = nodes[afterId];
  if (!after || nodes[newId]) return copyLinkedNodes(nodes);

  const result = copyLinkedNodes(nodes);
  result[afterId] = { ...after, next: newId };
  result[newId] = { value, next: after.next };
  return result;
}

export function removeLinkedNode<T>(
  nodes: LinkedNodes<T>,
  headId: string,
  targetId: string,
): Record<string, LinkedNode<T>> {
  if (!nodes[targetId] || targetId === headId) return copyLinkedNodes(nodes);

  const predecessorId = walkLinkedNodes(nodes, headId).find(
    (nodeId) => nodes[nodeId].next === targetId,
  );
  if (!predecessorId) return copyLinkedNodes(nodes);

  const result = copyLinkedNodes(nodes);
  result[predecessorId] = {
    ...result[predecessorId],
    next: result[targetId].next,
  };
  delete result[targetId];
  return result;
}

export type StackAction<T> =
  | { type: "push"; value: T }
  | { type: "pop" };

export function applyStackAction<T>(items: readonly T[], action: StackAction<T>) {
  if (action.type === "push") {
    return { items: [...items, action.value], removed: null as T | null };
  }
  return {
    items: items.slice(0, -1),
    removed: items.at(-1) ?? null,
  };
}

export type QueueAction<T> =
  | { type: "enqueue"; value: T }
  | { type: "dequeue" };

export function applyQueueAction<T>(items: readonly T[], action: QueueAction<T>) {
  if (action.type === "enqueue") {
    return { items: [...items, action.value], removed: null as T | null };
  }
  return {
    items: items.slice(1),
    removed: items[0] ?? null,
  };
}

export function findTreePath(
  tree: AdjacencyMap,
  rootId: string,
  targetId: string,
): string[] {
  return findBreadthFirstPath(tree, rootId, targetId);
}

export function findGraphPath(
  graph: AdjacencyMap,
  startId: string,
  targetId: string,
): string[] {
  return findBreadthFirstPath(graph, startId, targetId);
}

function copyLinkedNodes<T>(nodes: LinkedNodes<T>) {
  return Object.fromEntries(
    Object.entries(nodes).map(([id, node]) => [id, { ...node }]),
  );
}

function findBreadthFirstPath(
  adjacency: AdjacencyMap,
  startId: string,
  targetId: string,
): string[] {
  if (!adjacency[startId] || !adjacency[targetId]) return [];
  const visited = new Set([startId]);
  const queue: string[][] = [[startId]];

  while (queue.length) {
    const path = queue.shift()!;
    const currentId = path.at(-1)!;
    if (currentId === targetId) return path;

    for (const neighborId of adjacency[currentId] ?? []) {
      if (!adjacency[neighborId] || visited.has(neighborId)) continue;
      visited.add(neighborId);
      queue.push([...path, neighborId]);
    }
  }

  return [];
}
