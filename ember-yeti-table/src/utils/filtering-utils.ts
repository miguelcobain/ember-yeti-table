import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';

import createRegex from './create-regex.ts';
import type Column from '../components/yeti-table/thead/row/column.ts';
import type { TableData } from '../components/yeti-table/body.ts';
import type { FilterFunction } from '../components/yeti-table.ts';
import type THeadRow from '../components/yeti-table/thead/row.ts';

function createColumnFilters(columns: Column[]) {
  let searcheableColumns = columns.filter(c => {
    return !isEmpty(c.filter) || !isEmpty(c.filterFunction);
  });

  return searcheableColumns.map(c => {
    let regex = createRegex(c.filter!)!;

    return (row: THeadRow) => {
      let value = get(row, c.prop!) as string;
      let passesRegex = true;

      if (!isEmpty(c.filter)) {
        passesRegex = regex.test(value);
      }

      let passesCustom = true;

      if (c.filterFunction && c.filterUsing) {
        passesCustom = c.filterFunction(value, c.filterUsing);
      }

      return passesRegex && passesCustom;
    };
  });
}

export default function filterData(data: TableData[], columns: Column[], globalFilter: string, filterFunction?: FilterFunction, filterUsing?: string) {
  if (isEmpty(data)) {
    return [];
  }

  if (isEmpty(columns)) {
    // bail out if there are no columns to filter
    return data;
  }

  let globalRegex = createRegex(globalFilter, false, true, true);

  let columnFilters = createColumnFilters(columns);

  return data.filter(row => {
    let passesGeneral = true;

    if (globalRegex) {
      passesGeneral = columns.some(c => {
        return globalRegex!.test(get(row, c.prop!) as string);
      });
    }

    let passesColumn = true;

    if (columnFilters) {
      passesColumn = columnFilters.every(fn => fn(row as any));
    }

    let passesCustom = true;
    if (filterFunction) {
      passesColumn = filterFunction(row, filterUsing);
    }

    return passesGeneral && passesColumn && passesCustom;
  });
}
