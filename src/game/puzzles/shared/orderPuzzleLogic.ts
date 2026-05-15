export function moveItemUp<T>(items: readonly T[], item: T): T[] {
  const index = items.indexOf(item);
  if (index <= 0) {
    return [...items];
  }

  return moveItem(items, index, index - 1);
}

export function moveItemDown<T>(items: readonly T[], item: T): T[] {
  const index = items.indexOf(item);
  if (index === -1 || index >= items.length - 1) {
    return [...items];
  }

  return moveItem(items, index, index + 1);
}

export function isOrderCorrect<T>(currentOrder: readonly T[], correctOrder: readonly T[]): boolean {
  return currentOrder.length === correctOrder.length && currentOrder.every((item, index) => item === correctOrder[index]);
}

function moveItem<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}
