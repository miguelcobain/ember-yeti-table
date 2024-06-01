import { get } from '@ember/object';
import { compare, isNone } from '@ember/utils';
import type { IterableElement } from 'type-fest';

export type ComparatorFunction<T> = (a: T, b: T) => number;

export type SortProps = { prop?: string, direction?: 'asc' | 'desc' | null }[];
export type SortFunction<T> = (itemA: T, itemB: T, sorts: SortProps, compare: ComparatorFunction<T>) => number;

function merge<T extends Array<unknown>>(left: T, right: T, comparator: ComparatorFunction<IterableElement<T>>): T {
  let mergedArray: T = [] as unknown as T;
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    let comparison = comparator(left[leftIndex] as IterableElement<T>, right[rightIndex] as IterableElement<T>);

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
 *
 * @function
 * @param {Array} array The array to be sorted
 * @param {Comparator} comparator The comparator function to compare elements with.
 * @return {Array} A sorted array
 */
export function mergeSort<T extends Array<unknown>>(array: T, comparator: ComparatorFunction<IterableElement<T>> = compare): T {
  if (array.length <= 1) {
    return array;
  }

  let middleIndex = Math.floor(array.length / 2);
  let leftArray = mergeSort(array.slice(0, middleIndex) as T, comparator);
  let rightArray = mergeSort(array.slice(middleIndex) as T, comparator);

  return merge(leftArray as T, rightArray  as T, comparator);
}

export function sortMultiple<T>(itemA: T, itemB: T, sorts: SortProps, compare: ComparatorFunction<T>) {
  let compareValue;

  for (let { prop, direction } of sorts) {
    let valueA = get(itemA, prop!) as T;
    let valueB = get(itemB, prop!) as T;

    compareValue = direction === 'asc' ? compare(valueA, valueB) : -compare(valueA, valueB);

    if (compareValue !== 0) {
      break;
    }
  }

  return compareValue;
}

function isExactlyNaN(value: unknown) {
  return typeof value === 'number' && isNaN(value);
}

function isEmpty(value: unknown) {
  return isNone(value) || isExactlyNaN(value);
}

function orderEmptyValues<T>(itemA:T, itemB:T) {
  let aIsEmpty = isEmpty(itemA);
  let bIsEmpty = isEmpty(itemB);

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

export function compareValues<T>(itemA: T, itemB: T) {
  if (isEmpty(itemA) || isEmpty(itemB)) {
    return orderEmptyValues(itemA, itemB);
  }

  return compare(itemA, itemB);
}
