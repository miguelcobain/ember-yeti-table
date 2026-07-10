import type { ContentValue } from '@glint/template';
import { get as emberGet } from '@ember/object';

export const toContentValue = (value: unknown): ContentValue => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(value);
};

export const getContentValue = (
  obj: unknown,
  path: string | undefined,
): ContentValue => {
  if (!path || obj === null || obj === undefined) {
    return '';
  }
  return toContentValue(emberGet(obj, path));
};
