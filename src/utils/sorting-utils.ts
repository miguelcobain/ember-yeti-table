import { get } from '@ember/object';
import { compare, isNone } from '@ember/utils';

import type { Sort } from '../types.ts';

export type Comparator<T = unknown> = (a: T, b: T) => number;

function merge<T>(left: T[], right: T[], comparator: Comparator<T>): T[] {
  const mergedArray: T[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    const comparison = comparator(left[leftIndex]!, right[rightIndex]!);

    if (comparison <= 0) {
      mergedArray.push(left[leftIndex]!);
      leftIndex++;
    } else {
      mergedArray.push(right[rightIndex]!);
      rightIndex++;
    }
  }

  if (leftIndex < left.length) {
    mergedArray.splice(mergedArray.length, 0, ...left.slice(leftIndex));
  }

  if (rightIndex < right.length) {
    mergedArray.splice(mergedArray.length, 0, ...right.slice(rightIndex));
  }

  return mergedArray;
}

/**
 * An implementation of the standard merge sort algorithm.
 *
 * This is necessary because we need a stable sorting algorithm that accepts
 * a general comparator. The built in sort function and Ember's sort functions
 * are not stable, and `_.sortBy` doesn't take a general comparator. Ideally
 * lodash would add a `_.sort` function whose API would mimic this function's.
 */
export function mergeSort<T>(
  array: T[],
  comparator: Comparator<T> = compare,
): T[] {
  if (array.length <= 1) {
    return array;
  }

  const middleIndex = Math.floor(array.length / 2);
  const leftArray = mergeSort(array.slice(0, middleIndex), comparator);
  const rightArray = mergeSort(array.slice(middleIndex), comparator);

  return merge(leftArray, rightArray, comparator);
}

export function sortMultiple<T>(
  itemA: T,
  itemB: T,
  sorts: Sort[],
  compareFn: Comparator,
): number {
  let compareValue = 0;

  for (const { prop, direction } of sorts) {
    const valueA = get(itemA as object, prop);
    const valueB = get(itemB as object, prop);

    compareValue =
      direction === 'asc'
        ? compareFn(valueA, valueB)
        : -compareFn(valueA, valueB);

    if (compareValue !== 0) {
      break;
    }
  }

  return compareValue;
}

function isExactlyNaN(value: unknown): boolean {
  return typeof value === 'number' && isNaN(value);
}

function isEmpty(value: unknown): boolean {
  return isNone(value) || isExactlyNaN(value);
}

function orderEmptyValues(itemA: unknown, itemB: unknown): number {
  const aIsEmpty = isEmpty(itemA);
  const bIsEmpty = isEmpty(itemB);

  if (aIsEmpty && !bIsEmpty) {
    return -1;
  } else if (bIsEmpty && !aIsEmpty) {
    return 1;
  } else if (isNone(itemA) && isExactlyNaN(itemB)) {
    return -1;
  } else if (isExactlyNaN(itemA) && isNone(itemB)) {
    return 1;
  } else {
    return 0;
  }
}

export function compareValues(itemA: unknown, itemB: unknown): number {
  if (isEmpty(itemA) || isEmpty(itemB)) {
    return orderEmptyValues(itemA, itemB);
  }

  return compare(itemA, itemB);
}

export default compareValues;
