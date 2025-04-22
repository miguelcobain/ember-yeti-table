import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';
import createRegex from './create-regex.js';

function createColumnFilters(columns) {
  let searcheableColumns = columns.filter(c => {
    return !isEmpty(c.filter) || !isEmpty(c.filterFunction);
  });
  return searcheableColumns.map(c => {
    let regex = createRegex(c.filter);
    return row => {
      let value = get(row, c.prop);
      let passesRegex = true;
      if (!isEmpty(c.filter)) {
        passesRegex = regex.test(value);
      }
      let passesCustom = true;
      if (!isEmpty(c.filterFunction)) {
        passesCustom = c.filterFunction(value, c.filterUsing);
      }
      return passesRegex && passesCustom;
    };
  });
}
function filterData(data, columns, globalFilter, filterFunction, filterUsing) {
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
        return globalRegex.test(get(row, c.prop));
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

export { filterData as default };
//# sourceMappingURL=filtering-utils.js.map
