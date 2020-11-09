import { tagName, layout } from '@ember-decorators/component';
import { getOwner } from '@ember/application';
import { computed as emberComputed, defineProperty } from '@ember/object';
import { computed, action, set } from '@ember/object';
import { filterBy } from '@ember/object/computed';
import { once, scheduleOnce } from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';

import merge from 'deepmerge';

import DEFAULT_THEME from 'ember-yeti-table/-private/themes/default-theme';
import defaultTo from 'ember-yeti-table/-private/utils/default-to';
import DidChangeAttrsComponent from 'ember-yeti-table/-private/utils/did-change-attrs-component';
import filterData from 'ember-yeti-table/-private/utils/filtering-utils';
import { sortMultiple, compareValues, mergeSort } from 'ember-yeti-table/-private/utils/sorting-utils';

import template from './template';

/**
 * bring ember-concurrency didCancel helper instead of
 * including the whole dependency
 */
const TASK_CANCELATION_NAME = 'TaskCancelation';
const didCancel = function (e) {
  return e && e.name === TASK_CANCELATION_NAME;
};

/**
  The primary Yeti Table component. This component represents the root of the
  table, and manages high level state of all of its subcomponents.

  ```hbs
  <YetiTable @data={{this.data}} as |table|>

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

  ```hbs
  <YetiTable @data={{this.data}} as |table|>

    <table.thead as |thead|>
      <thead.row as |row|>
        <row.column @prop="firstName">
          First name
        </row.column>
        <row.column @prop="lastName">
          Last name
        </row.column>
        <row.column @prop="points">
          Points
        </row.column>
      </thead.row>
    </table.thead>

    <table.body/>

  </YetiTable>
  ```

  @yield {object} table
  @yield {Component} table.header       the table header component (Single row in header)
  @yield {Component} table.thead        the table header component (Allows multiple rows in header)
  @yield {Component} table.body         the table body component
  @yield {Component} table.foot         the table footer component
  @yield {Component} table.pagination   the pagination controls component
  @yield {object} table.actions         an object that contains actions to interact with the table
  @yield {object} table.paginationData  object that represents the current pagination state
  @yield {boolean} table.isLoading      boolean that is `true` when data is being loaded
  @yield {array} table.columns          the columns on the table
  @yield {array} table.visibleColumns   the visible columns on the table
  @yield {array} table.rows             an array of all the rows yeti table knows of. In the sync case, it will contain the entire dataset. In the async case, it will be the same as `table.visibleRows`
  @yield {number} table.totalRows       the total number of rows on the table (regardless of pagination). Important argument in the async case to inform yeti table of the total number of rows in the dataset.
  @yield {array} table.visibleRows      the rendered rows on the table account for pagination, filtering, etc; when pagination is false, it will be the same length as totalRows
  @yield {object} table.theme           the theme being used
*/
@tagName('')
@layout(template)
class YetiTable extends DidChangeAttrsComponent {
  /**
   * An object that contains classes for yeti table to apply when rendering its various table
   * html elements. The theme object your pass in will be deeply merged with yeti-table's default theme
   * and with a theme defined in your environment.js at `ENV['ember-yeti-table'].theme`.
   */
  theme = {};

  /**
   * The data for Yeti Table to render. It can be an array or a promise that resolves with an array.
   * The only case when `@data` is optional is if a `@loadData` was passed in.
   */
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
  loadData;

  publicApi = {
    previousPage: this.previousPage,
    nextPage: this.nextPage,
    goToPage: this.goToPage,
    changePageSize: this.changePageSize,
    reloadData: this.runLoadData
  };

  /**
   * This function will be called when Yeti Table initializes. It will be called with
   * an object argument containing the functions for the possible actions you can make
   * on a table. This object contains the following actions:
   *   - previousPage
   *   - nextPage
   *   - goToPage
   *   - changePageSize
   *   - reloadData
   */
  registerApi;

  /**
   * Use this argument to enable the pagination feature. Default is `false`.
   */
  pagination = this.get('config').pagination === undefined ? false : this.get('config').pagination;

  /**
   * Controls the size of each page. Default is `15`.
   */
  pageSize = this.get('config').pageSize || 15;

  /**
   * Controls the current page to show. Default is `1`.
   */
  pageNumber = 1;

  /**
   * Optional argument that informs yeti table of how many rows your data has.
   * Only needed when using a `@loadData` function and `@pagination={{true}}`.
   * When you use `@data`, Yeti Table uses the size of that array.
   * This information is used to calculate the pagination information that is yielded
   * and passed to the `@loadData` function.
   */
  totalRows;

  /**
   * The global filter. If passed in, Yeti Table will search all the rows that contain this
   * string and show them. Defaults to `''`.
   */
  @defaultTo('')
  filter;

  /**
   * An optional function to customize the filtering logic. This function should return true
   * or false to either include or exclude the row on the resulting set. If this function depends
   * on a value, pass that value as the `@filterUsing` argument.
   *
   * This function will be called with two arguments:
   * - `row` - the current data row to use for filtering
   * - `filterUsing` - the value you passed in as `@filterUsing`
   */
  filterFunction;

  /**
   * If you `@filterFunction` function depends on a different value (other that `@filter`)
   * to show, pass it in this argument. Yeti Table uses this argument to know when to recalculate
   * the fitlered rows.
   */
  filterUsing;

  /**
   * Used to enable/disable sorting on all columns. You should use this to avoid passing
   * the @sortable argument to all columns.
   */
  sortable = this.get('config').sortable === undefined ? true : this.get('config').sortable;

  /**
   * Use the `@sortFunction` if you want to completely customize how the row sorting is done.
   * It will be invoked with two rows, the current sortings that are applied and the `@compareFunction`.
   */
  sortFunction = sortMultiple;

  /**
   * Use `@compareFunction` if you just want to customize how two values relate to each other (not the entire row).
   * It will be invoked with two values and you just need to return `-1`, `0` or `1` depending on if first value is
   * greater than the second or not. The default compare function used is the `compare` function from `@ember/utils`.
   */
  compareFunction = compareValues;

  /**
   * Use `@sortSequence` to customize the sequence in which the sorting order will cycle when
   * clicking on the table headers. You can either pass in a comma-separated string or an array
   * of strings. Accepted values are `'asc'`, `'desc'` and `'unsorted'`. The default value is `['asc', 'desc']`.
   */
  sortSequence = this.get('config').sortSequence || ['asc', 'desc'];

  /**
   * Use `@ignoreDataChanges` to prevent yeti table from observing changes to the underlying data and resorting or
   * refiltering. Useful when doing inline editing in a table.
   *
   * Defaults to false
   *
   * This is an initial render only value. Changing it after the table has been rendered will not be respected.
   *
   * @type {boolean}
   */
  ignoreDataChanges = false;

  /**
   * Use `@renderTableElement` to prevent yeti table from rendering the topmost <table> element.
   * Might be useful for styling purposes (e.g if you want to place your pagination controls outside
   * of your table element). If you set this to `false`, you should render the table element yourself
   * using the yielded `<t.table>` component.
   *
   * Defaults to true
   *
   * @type {boolean}
   */
  renderTableElement = true;

  /**
   * The `@isColumnVisible` argument can be used to initialize the column visibility in a programatic way.
   * For example, let's say you store the initial column visibility in local storage, then you can
   * use this function to initialize the `visible` column of the specific column. The given function should
   * return a boolean which will be assigned to the `visible` property of the column. An object representing
   * the column is passed in. Sou can use column.prop and column.name to know which column your computed
   * the visibility for.
   *
   * @type {Function}
   */
  isColumnVisible;

  // If the theme is replaced, this will invalidate, but not if any prop under theme is changed
  @computed('theme', 'config.theme')
  get mergedTheme() {
    let configTheme = this.get('config').theme || {};
    let localTheme = this.get('theme');
    return merge.all([DEFAULT_THEME, configTheme, localTheme]);
  }

  isLoading = false;

  @filterBy('columns', 'visible', true) visibleColumns;

  @computed
  get config() {
    return getOwner(this).resolveRegistration('config:environment')['ember-yeti-table'] || {};
  }

  @computed('loadData', 'sortedData.[]', 'resolvedData.[]', 'totalRows')
  get normalizedTotalRows() {
    if (!this.get('loadData')) {
      // sync scenario using @data
      return this.get('sortedData.length');
    } else {
      // async scenario. @loadData is present.
      if (this.get('totalRows') === undefined) {
        // @totalRows was not passed in. Use the returned data set length.
        return this.get('resolvedData.length');
      } else {
        // @totalRows was passed in.
        return this.get('totalRows');
      }
    }
  }

  @computed('loadData', 'sortedData.[]', 'resolvedData.[]')
  get normalizedRows() {
    if (!this.get('loadData')) {
      // sync scenario using @data
      return this.get('sortedData');
    } else {
      // async scenario. @loadData is present.
      return this.get('resolvedData');
    }
  }

  @computed('pageSize', 'pageNumber', 'normalizedTotalRows')
  get paginationData() {
    let pageSize = this.get('pageSize');
    let pageNumber = this.get('pageNumber');
    let totalRows = this.get('normalizedTotalRows');
    let isLastPage, totalPages;

    if (totalRows) {
      totalPages = Math.ceil(totalRows / pageSize);
      pageNumber = Math.min(pageNumber, totalPages);
      isLastPage = pageNumber === totalPages;
    }

    let isFirstPage = pageNumber === 1;
    let pageStart = (pageNumber - 1) * pageSize;

    let pageEnd = pageStart + pageSize - 1;

    // make pageStart and pageEnd 1-indexed
    pageStart += 1;
    pageEnd += 1;

    if (totalRows) {
      pageEnd = Math.min(pageEnd, totalRows);
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

    this.columns = [];
    this.filteredData = [];
    this.sortedData = [];
    this.resolvedData = [];
    this.didChangeAttrsConfig = {
      attrs: ['filter', 'filterUsing', 'pageSize', 'pageNumber']
    };

    if (this.registerApi) {
      scheduleOnce('actions', null, this.registerApi, this.publicApi);
    }
  }

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);

    let oldData = this._oldData;
    let data = this.get('data');

    if (data !== oldData) {
      if (data && data.then) {
        this.set('isLoading', true);
        data
          .then(resolvedData => {
            // check if data is still the same promise
            if (data === this.get('data') && !this.isDestroyed) {
              this.set('resolvedData', resolvedData);
              this.set('isLoading', false);
            }
          })
          .catch(e => {
            if (!didCancel(e)) {
              if (!this.isDestroyed) {
                this.set('isLoading', false);
              }
              // re-throw the non-cancellation error
              throw e;
            }
          });
      } else {
        this.set('resolvedData', data || []);
      }
    }

    this._oldData = data;
  }

  didChangeAttrs() {
    this.runLoadData();
  }

  didInsertElement() {
    super.didInsertElement(...arguments);

    let depKeys = '[]';
    if (this.get('ignoreDataChanges') === false) {
      // Only include columns with a prop
      // truncate prop names to the first period
      // get a unique list
      let columns = this.get('columns')
        .filter(column => column.get('prop'))
        .map(column => column.get('prop').split('.')[0])
        .filter((v, i, a) => a.indexOf(v) === i);

      if (columns.length > 0) {
        depKeys = `@each.{${columns.join(',')}}`;
      }
    }

    let filteredDataDeps = [
      `resolvedData.${depKeys}`,
      'columns.@each.{prop,filterFunction,filter,filterUsing,filterable}',
      'filter',
      'filterUsing',
      'filterFunction'
    ];

    defineProperty(
      this,
      'filteredData',
      emberComputed(...filteredDataDeps, function () {
        let data = this.get('resolvedData');
        // only columns that have filterable = true and a prop defined will be considered
        let columns = this.get('columns').filter(c => c.get('filterable') && isPresent(c.get('prop')));
        let filter = this.get('filter');
        let filterFunction = this.get('filterFunction');
        let filterUsing = this.get('filterUsing');

        return filterData(data, columns, filter, filterFunction, filterUsing);
      })
    );

    let sortedDataDeps = [
      `filteredData.${depKeys}`,
      'columns.@each.{prop,sort,sortable}',
      'sortFunction',
      'compareFunction'
    ];

    defineProperty(
      this,
      'sortedData',
      emberComputed(...sortedDataDeps, function () {
        let data = this.get('filteredData');
        let sortableColumns = this.get('columns').filter(c => !isEmpty(c.get('sort')));
        let sortings = sortableColumns.map(c => ({ prop: c.get('prop'), direction: c.get('sort') }));
        let sortFunction = this.get('sortFunction');
        let compareFunction = this.get('compareFunction');

        if (sortings.length > 0) {
          data = mergeSort(data, (itemA, itemB) => {
            return sortFunction(itemA, itemB, sortings, compareFunction);
          });
        }

        return data;
      })
    );

    // defining a computed property on didInsertElement doesn't seem
    // to trigger any updates. This forces an update.
    this.notifyPropertyChange('filteredData');
    this.notifyPropertyChange('sortedData');
    this.runLoadData();
  }

  @action
  runLoadData() {
    let loadData = this.get('loadData');
    if (loadData) {
      let loadDataFunction = async () => {
        let loadData = this.get('loadData');
        if (typeof loadData === 'function') {
          let param = {};

          if (this.get('pagination')) {
            param.paginationData = this.get('paginationData');
          }

          param.sortData = this.get('columns')
            .filter(c => !isEmpty(c.get('sort')))
            .map(c => ({ prop: c.get('prop'), direction: c.get('sort') }));
          param.filterData = {
            filter: this.get('filter'),
            filterUsing: this.get('filterUsing'),
            columnFilters: this.get('columns').map(c => ({
              filter: c.get('filter'),
              filterUsing: c.get('filterUsing')
            }))
          };

          let promise = loadData(param);

          if (promise && promise.then) {
            this.set('isLoading', true);
            try {
              let resolvedData = await promise;
              if (!this.isDestroyed) {
                this.set('resolvedData', resolvedData);
                this.set('isLoading', false);
              }
            } catch (e) {
              if (!didCancel(e)) {
                if (!this.isDestroyed) {
                  this.set('isLoading', false);
                }
                // re-throw the non-cancelation error
                throw e;
              }
            }
          } else {
            this.set('resolvedData', promise);
          }
        }
      };

      once(loadDataFunction);
    }
  }

  @action
  onColumnSort(column, e) {
    if (column.get('isSorted')) {
      // if this column is already sorted, calculate the next
      // sorting on the sequence.
      let direction = column.get('sort');
      let sortSequence = column.get('normalizedSortSequence');
      direction = sortSequence[(sortSequence.indexOf(direction) + 1) % sortSequence.length];

      if (direction === 'unsorted') {
        direction = null;
      }
      column.set('sort', direction);

      if (!e.shiftKey) {
        // if not pressed shift, reset other column sortings
        let columns = this.get('columns').filter(c => c !== column);
        columns.forEach(c => c.set('sort', null));
      }
    } else {
      // use first direction from sort sequence
      let direction = column.get('normalizedSortSequence')[0];
      // create new sorting
      column.set('sort', direction);

      // normal click replaces all sortings with the new one
      // shift click adds a new sorting to the existing ones
      if (!e.shiftKey) {
        // if not pressed shift, reset other column sortings
        let columns = this.get('columns').filter(c => c !== column);
        columns.forEach(c => c.set('sort', null));
      }
    }
    this.runLoadData();
  }

  @action
  previousPage() {
    if (this.get('pagination')) {
      let { pageNumber } = this.get('paginationData');
      this.setInternalProp('pageNumber', Math.max(pageNumber - 1, 1));
      this.runLoadData();
    }
  }

  @action
  nextPage() {
    if (this.get('pagination')) {
      let { pageNumber, isLastPage } = this.get('paginationData');

      if (!isLastPage) {
        this.setInternalProp('pageNumber', pageNumber + 1);
        this.runLoadData();
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

      this.setInternalProp('pageNumber', pageNumber);
      this.runLoadData();
    }
  }

  @action
  changePageSize(pageSize) {
    if (this.get('pagination')) {
      this.setInternalProp('pageSize', parseInt(pageSize));
      this.runLoadData();
    }
  }

  registerColumn(column) {
    if (this.isColumnVisible) {
      let visible = this.isColumnVisible(column);
      set(column, 'visible', visible);
    }

    let columns = this.get('columns');
    if (!columns.includes(column)) {
      columns.push(column);
    }
  }

  unregisterColumn(column) {
    let columns = this.get('columns');
    if (columns.includes(column)) {
      this.set(
        'columns',
        columns.filter(c => c !== column)
      );
    }
  }
}

export default YetiTable;
