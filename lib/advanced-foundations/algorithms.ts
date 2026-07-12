export interface SearchTrace {
  checkedIndexes: number[];
  foundIndex: number;
}

export function linearSearchTrace<T>(
  items: readonly T[],
  target: T,
): SearchTrace {
  const checkedIndexes: number[] = [];
  for (let index = 0; index < items.length; index += 1) {
    checkedIndexes.push(index);
    if (Object.is(items[index], target)) return { checkedIndexes, foundIndex: index };
  }
  return { checkedIndexes, foundIndex: -1 };
}

export function binarySearchTrace(items: readonly number[], target: number) {
  if (items.some((value, index) => index > 0 && items[index - 1] > value)) {
    return { checkedIndexes: [], ranges: [], foundIndex: -1, valid: false };
  }

  const checkedIndexes: number[] = [];
  const ranges: Array<[number, number]> = [];
  let low = 0;
  let high = items.length - 1;

  while (low <= high) {
    ranges.push([low, high]);
    const middle = Math.floor((low + high) / 2);
    checkedIndexes.push(middle);
    if (items[middle] === target) {
      return { checkedIndexes, ranges, foundIndex: middle, valid: true };
    }
    if (items[middle] < target) low = middle + 1;
    else high = middle - 1;
  }

  return { checkedIndexes, ranges, foundIndex: -1, valid: true };
}

export function bubbleSortPass(items: readonly number[]) {
  const values = [...items];
  const comparisons: Array<[number, number]> = [];
  const swaps: Array<[number, number]> = [];

  for (let index = 0; index < values.length - 1; index += 1) {
    const pair: [number, number] = [index, index + 1];
    comparisons.push(pair);
    if (values[index] > values[index + 1]) {
      [values[index], values[index + 1]] = [values[index + 1], values[index]];
      swaps.push(pair);
    }
  }

  return { values, comparisons, swaps };
}

export interface DependentTask {
  id: string;
  dependsOn: readonly string[];
}

export function validateTaskOrder(
  tasks: readonly DependentTask[],
  proposedOrder: readonly string[],
) {
  const tasksById = new Map(tasks.map((task) => [task.id, task]));
  const completed = new Set<string>();

  for (const taskId of proposedOrder) {
    const task = tasksById.get(taskId);
    if (!task || task.dependsOn.some((dependency) => !completed.has(dependency))) {
      return { valid: false, blockedTaskId: taskId };
    }
    completed.add(taskId);
  }

  return {
    valid: completed.size === tasks.length,
    blockedTaskId: completed.size === tasks.length
      ? null
      : tasks.find((task) => !completed.has(task.id))?.id ?? null,
  };
}

export function compareSearchCosts(itemCount: number) {
  const safeCount = Number.isFinite(itemCount)
    ? Math.max(0, Math.floor(itemCount))
    : 0;
  return {
    itemCount: safeCount,
    linear: safeCount,
    binary: safeCount === 0 ? 0 : Math.ceil(Math.log2(safeCount)) + 1,
  };
}
