import Component from '@ember/component';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import {
  computed as emberComputed,
  get,
  defineProperty
} from '@ember/object';
import { once } from '@ember/runloop';

import { tagName } from '@ember-decorators/component';
import { computed, action } from '@ember-decorators/object';
import { reads, filterBy } from '@ember-decorators/object/computed';
import { argument } from '@ember-decorators/argument';
import {
  type,
  optional,
  arrayOf,
  unionOf,
  shapeOf
} from '@ember-decorators/argument/type';
import { classNames } from '@ember-decorators/component';

import createRegex from 'ember-yeti-table/-private/utils/create-regex';
import {
  sortMultiple,
  compareValues,
  mergeSort
} from 'ember-yeti-table/-private/utils/sorting-utils';

import layout from './template';

const arrayOrPromise = unionOf(
  arrayOf('object'),
  shapeOf({ then: Function })
);

/**
  The primary Yeti Table component. This component represents the root of the
  table, and manages high level state of all of its subcomponents.
  ```hbs
  <YetiTable @data={{data}} as |table|>

    <table.header as |header|>
      <header.column @prop="firstName">
        First name
      </header.column>
      <header.column @prop="lastName">
        Last name
      </header.column>
      <header.column @prop="points">
        Points
      </header.column>
    </table.header>

    <table.body/>

  </YetiTable>
  ```
  @yield {object} table
  @yield {Component} table.header       the table header component
  @yield {Component} table.body         the table body component
  @yield {Component} table.pagination   the pagination controls component
  @yield {object} table.actions         an object that contains actions to interact with the table
  @yield {object} table.paginationData  object that represents the current pagination state
  @yield {boolean} table.isLoading      boolean that is `true` when data is being loaded
  @yield {number} table.totalColumns    the number of visible columns on the table
*/
@tagName('table')
@classNames('yeti-table')
export default class YetiTable extends Component {
  layout = layout;

  /**
   * The data for Yeti Table to render. It can be an array or a promise that resolves with an array.
   * The only case when `@data` is optional is if a `@loadData` was passed in.
   */
  @argument
  @type(optional(arrayOrPromise))
  data;

  /**
   * The function that will be called when Yeti Table needs data. This argument is used
   * when you don't have all the data available or loading all rows at once isn't possible,
   * e.g the dataset is too large.
   *
   * By passing in a function to `@loadData` you assume the responsibility to filter, sort and
   * paginate the data (if said features are enabled).
   *
   * This function must return an array or a promise that resolves with an array.
   *
   * This function will be called with an argument with the current state of the table.
   * Use this object to know what data to fetch, pass it to the server, etc.
   * Please check the "Async Data" guide to understand what that object contains and
   * an example of its usage.
   */
  @argument
  @type(optional(Function))
  loadData;

  /**
   * Use this argument to enable the pagination feature. Default is `false`.
   */
  @argument
  @type('boolean')
  pagination = false;

  /**
   * Controls the size of each page. Default is `15`.
   */
  @argument
  @type('number')
  pageSize = 15;

  /**
   * Controls the current page to show. Default is `1`.
   */
  @argument
  @type('number')
  pageNumber = 1;

  /**
   * Optional argument that informs yeti table of how many rows your data has.
   * Only needed when using a `@loadData` function and `@pagination={{true}}`.
   * When you use `@data`, Yeti Table uses the size of that array.
   * This information is used to calculate the pagination information that is yielded
   * and passed to the `@loadData` function.
   */
  @argument
  @type(optional('number'))
  totalRows;

  /**
   * The global filter. If passed in, Yeti Table will search all the rows that contain this
   * string and show them. Defaults to `''`.
   */
  @argument({ defaultIfUndefined: true })
  @type(optional('string'))
  filter = '';

  /**
   * An optional function to customize the filtering logic. This function should return true
   * or false to either include or exclude the row on the resulting set. If this function depends
   * on a value, pass that value as the `@filterUsing` argument.
   *
   * This function will be called with two arguments:
   * - `row` - the current data row to use for filtering
   * - `filterUsing` - the value you passed in as `@filterUsing`
   */
  @argument
  @type(optional(Function))
  filterFunction;

  /**
   * If you `@filterFunction` function depends on a different value (other that `@filter`)
   * to show, pass it in this argument. Yeti Table uses this argument to know when to recalculate
   * the fitlered rows.
   */
  @argument
  @type(optional('any'))
  filterUsing;

  /**
   * Used to enable/disable sorting on all columns. You should use this to avoid passing
   * the @sortable argument to all columns.
   */
  @argument
  @type(optional('boolean'))
  sortable = true;

  /**
   * Use the `@sortFunction` if you want to completely customize how the row sorting is done.
   * It will be invoked with two rows, the current sortings that are applied and the `@compareFunction`.
   */
  @argument
  @type(Function)
  sortFunction = sortMultiple;

  /**
   * Use `@compareFunction` if you just want to customize how two values relate to each other (not the entire row).
   * It will be invoked with two values and you just need to return `-1`, `0` or `1` depending on if first value is
   * greater than the second or not. The default compare function used is the `compare` function from `@ember/utils`.
   */
  @argument
  @type(Function)
  compareFunction = compareValues;

  isLoading = false;

  resolvedData;

  @filterBy('columns', 'visible', true) visibleColumns;
  @reads('visibleColumns.length') totalColumns;

  @computed('pageSize', 'pageNumber', 'totalRows', 'loadData', 'sortedData.[]')
  get paginationData() {
    let pageSize = this.get('pageSize');
    let pageNumber = this.get('pageNumber');
    let totalRows = this.get('totalRows');

    let pageStart = (pageNumber - 1) * pageSize;
    let pageEnd = pageStart + pageSize - 1;

    // make pageStart and pageEnd 1-indexed
    pageStart += 1;
    pageEnd += 1;

    let isFirstPage = pageNumber === 1;
    let isLastPage, totalPages;

    if (!this.get('loadData')) {
      totalRows = this.get('sortedData.length');
    }

    if (totalRows) {
      totalPages = Math.ceil(totalRows / pageSize);
      isLastPage = pageNumber === totalPages;
      pageEnd = Math.min(pageEnd, totalRows)
    }

    return { pageSize, pageNumber, pageStart, pageEnd, isFirstPage, isLastPage, totalRows, totalPages };
  }

  @computed('sortedData.[]', 'pagination', 'paginationData')
  get pagedData() {
    let pagination = this.get('pagination');
    let data = this.get('sortedData');

    if (pagination) {
      let { pageStart, pageEnd } = this.get('paginationData');
      data = data.slice(pageStart - 1, pageEnd); // slice excludes last element so we don't need to subtract 1
    }

    return data;
  }

  @computed('pagedData', 'resolvedData', 'loadData')
  get processedData() {
    if (this.get('loadData')) {
      // skip processing and return raw data if remote data is enabled via `loadData`
      return this.get('resolvedData');
    } else {
      return this.get('pagedData');
    }
  }

  init() {
    super.init(...arguments);
    this.set('columns', A());
    this.set('filteredData', []);
    this.set('sortedData', []);
    this.set('resolvedData', []);
  }

  didReceiveAttrs() {
    // data has changed
    let oldData = this._oldData;
    let data = this.get('data');

    if (data !== oldData) {
      if (data && data.then) {
        this.set('isLoading', true);
        data.then((resolvedData) => {
          // check if data is still the same promise
          if (data === this.get('data') && !this.isDestroyed) {
            this.set('resolvedData', resolvedData);
          }
        }).finally(() => {
          if (!this.isDestroyed) {
            this.set('isLoading', false);
          }
        });
      } else {
        this.set('resolvedData', data || []);
      }
    }

    this._oldData = data;
  }

  didInsertElement() {
    super.didInsertElement(...arguments);

    let columns = this.get('columns').mapBy('prop');

    defineProperty(this, 'filteredData', emberComputed(`resolvedData.@each.{${columns.join(',')}}`, 'columns.@each.{prop,filterFunction,filter,filterUsing,filterable}', 'filter', 'filterUsing', 'filterFunction', function() {
      let data = this.get('resolvedData');

      if (isEmpty(data)) {
        return [];
      }

      // only columns that have filterable = true will be considered
      let filterableColumns = this.get('columns').filter((c) => c.get('filterable'));

      if (isEmpty(filterableColumns)) {
        // bail out if there are no columns to filter
        return data;
      }

      let filter = this.get('filter');
      let generalRegex = createRegex(filter, false, true, true);
      let searcheableColumns = filterableColumns.filter((c) => !isEmpty(c.get('filter')) || !isEmpty(c.get('filterFunction')));

      let columnFilters = searcheableColumns.map((c) => {
        let regex = createRegex(c.get('filter'));

        return (row) => {
          let value = get(row, c.get('prop'));
          let passesRegex = true;

          if (!isEmpty(c.get('filter'))) {
            passesRegex = regex.test(value);
          }

          let passesCustom = true;

          if (!isEmpty(c.get('filterFunction'))) {
            passesCustom = c.get('filterFunction')(value, c.get('filterUsing'))
          }

          return passesRegex && passesCustom;
        };
      });

      return data.filter(((row) => {
        let passesGeneral = true;

        if (!isEmpty(generalRegex)) {
          passesGeneral = filterableColumns.some((c) => {
            return generalRegex.test(get(row, c.get('prop')));
          });
        }

        let passesColumn = true;

        if (!isEmpty(columnFilters)) {
          passesColumn = columnFilters.every((fn) => fn(row));
        }

        let passesCustom = true;
        let customFilter = this.get('filterFunction');
        if (!isEmpty(customFilter)) {
          passesColumn = customFilter(row, this.get('filterUsing'));
        }

        return passesGeneral && passesColumn && passesCustom;
      }));
    }));

    defineProperty(this, 'sortedData', emberComputed(`filteredData.@each.{${columns.join(',')}}`, 'columns.@each.{prop,sort,sortable}', 'sortFunction', 'compareFunction', function() {
      let data = this.get('filteredData');
      let sortableColumns = this.get('columns').filter((c) => !isEmpty(c.get('sort')));
      let sortings = sortableColumns.map((c) => ({ prop: c.get('prop'), direction: c.get('sort') }));
      let sortFunction = this.get('sortFunction');
      let compareFunction = this.get('compareFunction');

      if (sortings.length > 0) {
        data = mergeSort(data, (itemA, itemB) => {
          return sortFunction(itemA, itemB, sortings, compareFunction);
        });
      }

      return data;
    }));

    // defining a computed property on didInsertElement doesn't seem
    // to trigger any updates. This forces an update.
    this.notifyPropertyChange('filteredData');
    this.notifyPropertyChange('sortedData');
    let loadData = this.get('loadData');
    if (loadData) {
      this.addObserver('columns.@each.filter', this.runLoadData);
      this.addObserver('columns.@each.filterUsing', this.runLoadData);
      this.addObserver('columns.@each.sort', this.runLoadData);
      this.addObserver('filter', this.runLoadData);
      this.addObserver('filterUsing', this.runLoadData);
      this.addObserver('pageSize', this.runLoadData);
      this.addObserver('pageNumber', this.runLoadData);
      this.runLoadData();
    }
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    let loadData = this.get('loadData');
    if (loadData) {
      this.removeObserver('columns.@each.filter', this.runLoadData);
      this.removeObserver('columns.@each.filterUsing', this.runLoadData);
      this.removeObserver('columns.@each.sort', this.runLoadData);
      this.removeObserver('filter', this.runLoadData);
      this.removeObserver('filterUsing', this.runLoadData);
      this.removeObserver('pageSize', this.runLoadData);
      this.removeObserver('pageNumber', this.runLoadData);
    }
  }

  runLoadData() {
    once(() => {
      let loadData = this.get('loadData');
      if (typeof loadData === 'function') {
        let param = {};

        if (this.get('pagination')) {
          param.paginationData = this.get('paginationData');
        }

        param.sortData = this.get('columns')
          .filter((c) => !isEmpty(c.get('sort')))
          .map((c) => ({ prop: c.get('prop'), direction: c.get('sort') }));
        param.filterData = {
          filter: this.get('filter'),
          filterUsing: this.get('filterUsing'),
          columnFilters: this.get('columns').map((c) => ({ filter: c.get('filter'), filterUsing: c.get('filterUsing') }))
        };

        let promise = loadData(param);

        if (promise && promise.then) {
          this.set('isLoading', true);
          promise.then((resolvedData) => {
            if (!this.isDestroyed) {
              this.set('resolvedData', resolvedData);
            }
          }).finally(() => {
            if (!this.isDestroyed) {
              this.set('isLoading', false);
            }
          });
        } else {
          this.set('resolvedData', promise);
        }
      }
    });
  }

  @action
  onColumnSort(column, e) {
    let direction = 'asc';

    if (column.get('isSorted')) {
      // if this column is already sorted, calculate the opposite
      // direction and remove old sorting
      direction = column.get('sort');
      direction = direction === 'asc' ? 'desc' : 'asc';
      column.set('sort', direction);

      if (!e.shiftKey) {
        // if not pressed shift, reset other column sortings
        let columns = this.get('columns').filter((c) => c !== column);
        columns.forEach((c) => c.set('sort', null));
      }
    } else {
      // create new sorting
      column.set('sort', direction);

      // normal click replaces all sortings with the new one
      // shift click adds a new sorting to the existing ones
      if (!e.shiftKey) {
        // if not pressed shift, reset other column sortings
        let columns = this.get('columns').filter((c) => c !== column);
        columns.forEach((c) => c.set('sort', null));
      }
    }
  }

  @action
  previousPage() {
    if (this.get('pagination')) {
      let { pageNumber } = this.get('paginationData');
      this.set('pageNumber', Math.max(pageNumber - 1, 1));
    }
  }

  @action
  nextPage() {
    if (this.get('pagination')) {
      let { pageNumber, isLastPage } = this.get('paginationData');

      if (!isLastPage) {
        this.set('pageNumber', pageNumber + 1);
      }
    }
  }

  @action
  goToPage(pageNumber) {
    if (this.get('pagination')) {
      let { totalPages } = this.get('paginationData');
      pageNumber = Math.max(pageNumber, 1);

      if (totalPages) {
        pageNumber = Math.min(pageNumber, totalPages);
      }

      this.set('pageNumber', pageNumber);
    }
  }

  @action
  changePageSize(pageSize) {
    if (this.get('pagination')) {
      this.set('pageSize', parseInt(pageSize));
    }
  }

  registerColumn(column) {
    this.get('columns').addObject(column);
  }

  unregisterColumn(column) {
    this.get('columns').removeObject(column);
  }
}
