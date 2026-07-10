import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';

import createRegex from './create-regex.ts';
import type { ColumnDefinition, Row, RowFilterFunction } from '../types.ts';

function safeString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

function createColumnFilters(
  columns: ColumnDefinition[],
): Array<(row: Row) => boolean> {
  const searcheableColumns = columns.filter((c) => {
    return !isEmpty(c.filter) || !isEmpty(c.filterFunction);
  });

  return searcheableColumns.map((c) => {
    const regex = createRegex(c.filter);

    return (row: Row) => {
      const value = c.prop ? get(row, c.prop) : undefined;
      let passesRegex = true;

      if (!isEmpty(c.filter)) {
        passesRegex = regex ? regex.test(safeString(value)) : true;
      }

      let passesCustom = true;

      if (!isEmpty(c.filterFunction)) {
        passesCustom = c.filterFunction!(value, c.filterUsing);
      }

      return passesRegex && passesCustom;
    };
  });
}

export default function filterData(
  data: Row[],
  columns: ColumnDefinition[],
  globalFilter?: string,
  filterFunction?: RowFilterFunction,
  filterUsing?: unknown,
): Row[] {
  if (isEmpty(data)) {
    return [];
  }

  if (isEmpty(columns)) {
    // bail out if there are no columns to filter
    return data;
  }

  const globalRegex = createRegex(globalFilter, false, true, true);

  const columnFilters = createColumnFilters(columns);

  return data.filter((row) => {
    let passesGeneral = true;

    if (!isEmpty(globalRegex)) {
      passesGeneral = columns.some((c) => {
        return c.prop ? globalRegex!.test(safeString(get(row, c.prop))) : false;
      });
    }

    let passesColumn = true;

    if (!isEmpty(columnFilters)) {
      passesColumn = columnFilters.every((fn) => fn(row));
    }

    const passesCustom = true;
    if (!isEmpty(filterFunction)) {
      passesColumn = filterFunction!(row, filterUsing);
    }

    return passesGeneral && passesColumn && passesCustom;
  });
}
