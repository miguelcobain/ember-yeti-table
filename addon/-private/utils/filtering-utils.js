import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';

import createRegex from 'ember-yeti-table/-private/utils/create-regex';

function createColumnFilters(columns) {
  let searcheableColumns = columns.filter(c => {
    return !isEmpty(get(c, 'filter')) || !isEmpty(get(c, 'filterFunction'));
  });

  return searcheableColumns.map(c => {
    let regex = createRegex(get(c, 'filter'));

    return row => {
      let value = get(row, get(c, 'prop'));
      let passesRegex = true;

      if (!isEmpty(get(c, 'filter'))) {
        passesRegex = regex.test(value);
      }

      let passesCustom = true;

      if (!isEmpty(get(c, 'filterFunction'))) {
        passesCustom = get(c, 'filterFunction')(value, get(c, 'filterUsing'));
      }

      return passesRegex && passesCustom;
    };
  });
}

export default function filterData(data, columns, globalFilter, filterFunction, filterUsing) {
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

    if (!isEmpty(globalRegex)) {
      passesGeneral = columns.some(c => {
        return globalRegex.test(get(row, get(c, 'prop')));
      });
    }

    let passesColumn = true;

    if (!isEmpty(columnFilters)) {
      passesColumn = columnFilters.every(fn => fn(row));
    }

    let passesCustom = true;
    if (!isEmpty(filterFunction)) {
      passesColumn = filterFunction(row, filterUsing);
    }

    return passesGeneral && passesColumn && passesCustom;
  });
}
