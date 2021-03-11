import { getOwner } from '@ember/application';
import { computed as emberComputed, defineProperty } from '@ember/object';
import { computed, action, notifyPropertyChange } from '@ember/object';
import { once, scheduleOnce } from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';

import Component from '@glimmer/component';
import { tracked, cached } from '@glimmer/tracking';
import merge from 'deepmerge';
import { localCopy } from 'tracked-toolbox';

import DEFAULT_THEME from 'ember-yeti-table/-private/themes/default-theme';
import filterData from 'ember-yeti-table/-private/utils/filtering-utils';
import { sortMultiple, compareValues, mergeSort } from 'ember-yeti-table/-private/utils/sorting-utils';

/**
 * bring ember-concurrency didCancel helper instead of
 * including the whole dependency
 */
const TASK_CANCELATION_NAME = 'TaskCancelation';
const didCancel = function (e) {
  return e && e.name === TASK_CANCELATION_NAME;
};

const getWithConfig = function (obj, key, last) {
  const argVal = obj.args[key];
  let newVal;
  if (last === undefined) {
    newVal = argVal === undefined ? obj.config[key] : argVal;
  } else {
    newVal = argVal !== undefined && argVal !== last ? argVal : last;
  }

  return newVal;
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
  @yield {Component} table.tfoot        the table footer component
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
class YetiTable extends Component {
  getConfigWithDefault(prop, value, defaultValue) {
    if (isPresent(value)) {
      return value;
    } else {
      return isPresent(this.config[prop]) ? this.config[prop] : defaultValue;
    }
  }

  /**
   * An object that contains classes for yeti table to apply when rendering its various table
   * html elements. The theme object your pass in will be deeply merged with yeti-table's default theme
   * and with a theme defined in your environment.js at `ENV['ember-yeti-table'].theme`.
   *
   * @argument theme
   * @type {Object}
   */

  /**
   * The data for Yeti Table to render. It can be an array or a promise that resolves with an array.
   * The only case when `@data` is optional is if a `@loadData` was passed in.
   *
   *  @argument data
   *  @type {Array | Promise}
   */

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
   *
   * @argument loadData
   * @type {Function}
   */

  publicApi = {
    previousPage: this.previousPage,
    nextPage: this.nextPage,
    goToPage: this.goToPage,
    changePageSize: this.changePageSize,
    reloadData: this.fetchData
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
   *
   *   @argument registerApi
   *   @type {Function}
   */

  /**
   * Use this argument to enable the pagination feature. Default is `false`.
   *
   * @argument pagination
   * @type {Boolean}
   */
  @localCopy(getWithConfig)
  pagination;

  /**
   * Controls the size of each page. Default is `15`.
   *
   * @argument pageSize
   * @type {int}
   */
  @localCopy(getWithConfig)
  pageSize;

  /**
   * Controls the current page to show. Default is `1`.
   */
  @localCopy(getWithConfig)
  pageNumber;

  /**
   * Optional argument that informs yeti table of how many rows your data has.
   * Only needed when using a `@loadData` function and `@pagination={{true}}`.
   * When you use `@data`, Yeti Table uses the size of that array.
   * This information is used to calculate the pagination information that is yielded
   * and passed to the `@loadData` function.
   *
   * @argument totalRows
   * @type {int}
   */

  /**
   * The global filter. If passed in, Yeti Table will search all the rows that contain this
   * string and show them. Defaults to `''`.
   *
   * @argument filter
   * @type {String}
   */
  @localCopy(getWithConfig)
  filter;

  /**
   * An optional function to customize the filtering logic. This function should return true
   * or false to either include or exclude the row on the resulting set. If this function depends
   * on a value, pass that value as the `@filterUsing` argument.
   *
   * This function will be called with two arguments:
   * - `row` - the current data row to use for filtering
   * - `filterUsing` - the value you passed in as `@filterUsing`
   *
   * @argument filterFunction
   * @type {Function}
   */

  /**
   * If you `@filterFunction` function depends on a different value (other that `@filter`)
   * to show, pass it in this argument. Yeti Table uses this argument to know when to recalculate
   * the filtered rows.
   *
   * @argument filterUsing
   * @type {Object}
   */

  /**
   * Used to enable/disable sorting on all columns. You should use this to avoid passing
   * the @sortable argument to all columns.
   */
  @localCopy(getWithConfig)
  sortable;

  /**
   * Use the `@sortFunction` if you want to completely customize how the row sorting is done.
   * It will be invoked with two rows, the current sortings that are applied and the `@compareFunction`.
   *
   * @argument sortFunction
   * @type {Function}
   */
  @localCopy(getWithConfig)
  sortFunction;

  /**
   * Use `@compareFunction` if you just want to customize how two values relate to each other (not the entire row).
   * It will be invoked with two values and you just need to return `-1`, `0` or `1` depending on if first value is
   * greater than the second or not. The default compare function used is the `compare` function from `@ember/utils`.
   *
   * @argument compareFunction
   * @type {Function}
   */
  @localCopy(getWithConfig)
  compareFunction;

  /**
   * Use `@ignoreDataChanges` to prevent yeti table from observing changes to the underlying data and resorting or
   * refiltering. Useful when doing inline editing in a table.
   *
   * Defaults to false
   *
   * This is an initial render only value. Changing it after the table has been rendered will not be respected.
   *
   * @argument ignoreDataChanges
   * @type {boolean}
   */
  get ignoreDataChanges() {
    return this.getConfigWithDefault('ignoreDataChanges', this.args.ignoreDataChanges, false);
  }

  /**
   * Use `@sortSequence` to customize the sequence in which the sorting order will cycle when
   * clicking on the table headers. You can either pass in a comma-separated string or an array
   * of strings. Accepted values are `'asc'`, `'desc'` and `'unsorted'`. The default value is `['asc', 'desc']`.
   *
   * @argument sortSequence
   * @type {Array|string}
   */
  @localCopy(getWithConfig)
  sortSequence;

  /**
   * Use `@renderTableElement` to prevent yeti table from rendering the topmost <table> element.
   * Might be useful for styling purposes (e.g if you want to place your pagination controls outside
   * of your table element). If you set this to `false`, you should render the table element yourself
   * using the yielded `<t.table>` component.
   *
   * Defaults to true
   *
   * @argument renderTableElement
   * @type {boolean}
   */
  @localCopy(getWithConfig)
  renderTableElement;

  /**
   * The `@isColumnVisible` argument can be used to initialize the column visibility in a programmatic way.
   * For example, let's say you store the initial column visibility in local storage, then you can
   * use this function to initialize the `visible` column of the specific column. The given function should
   * return a boolean which will be assigned to the `visible` property of the column. An object representing
   * the column is passed in. Sou can use column.prop and column.name to know which column your computed
   * the visibility for.
   *
   * @argument isColumnVisible
   * @type {Function}
   */

  @tracked
  columns = [];

  @computed()
  get filteredData() {
    return [];
  }

  @computed()
  get sortedData() {
    return [];
  }

  @tracked
  resolvedData = [];

  // If the theme is replaced, this will invalidate, but not if any prop under theme is changed
  @cached
  get mergedTheme() {
    let configTheme = this.config.theme || {};
    let localTheme = this.args.theme || {};
    return merge.all([DEFAULT_THEME, configTheme, localTheme]);
  }

  @tracked
  isLoading = false;

  get visibleColumns() {
    return this.columns.filter(c => c.visible);
  }

  config;

  @cached
  get normalizedTotalRows() {
    if (!this.args.loadData) {
      // sync scenario using @data
      return this.sortedData?.length;
    } else {
      // async scenario. @loadData is present.
      if (this.args.totalRows === undefined) {
        // @totalRows was not passed in. Use the returned data set length.
        return this.resolvedData?.length;
      } else {
        // @totalRows was passed in.
        return this.args.totalRows;
      }
    }
  }

  @cached
  get normalizedRows() {
    if (!this.args.loadData) {
      // sync scenario using @data
      return this.sortedData;
    } else {
      // async scenario. @loadData is present.
      return this.resolvedData;
    }
  }

  @cached
  get paginationData() {
    let pageSize = this.pageSize;
    let pageNumber = this.pageNumber;
    let totalRows = this.normalizedTotalRows;
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

  @cached
  get pagedData() {
    let data = this.sortedData;

    if (this.pagination) {
      let { pageStart, pageEnd } = this.paginationData;
      data = data.slice(pageStart - 1, pageEnd); // slice excludes last element so we don't need to subtract 1
    }

    return data;
  }

  @cached
  get processedData() {
    if (this.args.loadData) {
      // skip processing and return raw data if remote data is enabled via `loadData`
      return this.resolvedData;
    } else {
      return this.pagedData;
    }
  }

  constructor() {
    super(...arguments);

    const config = getOwner(this).resolveRegistration('config:environment')['ember-yeti-table'] || {};
    const defaultConfig = {
      pagination: false,
      pageSize: 15,
      pageNumber: 1,
      filter: '',
      sortable: true,
      sortFunction: sortMultiple,
      compareFunction: compareValues,
      sortSequence: ['asc', 'desc'],
      renderTableElement: true
    };
    this.config = merge.all([defaultConfig, config]);

    this.createProperties();

    scheduleOnce('actions', null, this.fetchData);
  }

  @action
  notifyPropertyChange() {
    notifyPropertyChange(this, 'filteredData');
    this.fetchData();
  }

  @action
  fetchData() {
    if (this.args.loadData) {
      this.runLoadData();
    } else {
      let oldData = this._oldData;
      let data = this.args.data;

      if (data !== oldData) {
        if (data && data.then) {
          this.isLoading = true;
          data
            .then(resolvedData => {
              // check if data is still the same promise
              if (data === this.args.data && !this.isDestroyed) {
                this.resolvedData = resolvedData;
                this.isLoading = false;
              }
            })
            .catch(e => {
              if (!didCancel(e)) {
                if (!this.isDestroyed) {
                  this.isLoading = false;
                }
                // re-throw the non-cancellation error
                throw e;
              }
            });
        } else {
          this.resolvedData = data || [];
        }
      }

      this._oldData = data;
    }
  }

  runLoadData() {
    once(this.loadDataFunction);
  }

  @action
  async loadDataFunction() {
    let loadData = this.args.loadData;
    if (typeof loadData === 'function') {
      let param = {};

      if (this.pagination) {
        param.paginationData = this.paginationData;
      }

      param.sortData = this.columns.filter(c => !isEmpty(c.sort)).map(c => ({ prop: c.prop, direction: c.sort }));
      param.filterData = {
        filter: this.filter,
        filterUsing: this.filterUsing,
        columnFilters: this.columns.map(c => ({
          prop: c.prop,
          filter: c.filter,
          filterUsing: c.filterUsing
        }))
      };

      let promise = loadData(param);

      if (promise && promise.then) {
        this.isLoading = true;
        try {
          let resolvedData = await promise;
          if (!this.isDestroyed) {
            this.resolvedData = resolvedData;
            this.isLoading = false;
          }
        } catch (e) {
          if (!didCancel(e)) {
            if (!this.isDestroyed) {
              this.isLoading = false;
            }
            // re-throw the non-cancelation error
            throw e;
          }
        }
      } else {
        this.resolvedData = promise;
      }
    }
  }

  @action
  registerApi() {
    if (this.args.registerApi) {
      this.args.registerApi(this.publicApi);
    }
  }

  @action
  createProperties() {
    // This method is called twice. The properties have to be created early or they dont fire when changed
    // It has to be called a a second time after the columns have been created to re-create the
    // properties with the correct dependencies
    let depKeys = '[]';
    if (this.ignoreDataChanges === false) {
      // Only include columns with a prop
      // truncate prop names to the first period
      // get a unique list
      let columns = this.columns
        .filter(column => column.prop)
        .map(column => column.prop.split('.')[0])
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
        // only columns that have filterable = true and a prop defined will be considered
        let columns = this.columns.filter(c => c.filterable && isPresent(c.prop));

        return filterData(this.resolvedData, columns, this.filter, this.args.filterFunction, this.args.filterUsing);
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
        let data = this.filteredData;
        let sortableColumns = this.columns.filter(c => !isEmpty(c.sort));
        let sortings = sortableColumns.map(c => ({ prop: c.prop, direction: c.sort }));

        if (sortings.length > 0) {
          data = mergeSort(data, (itemA, itemB) => {
            return this.sortFunction(itemA, itemB, sortings, this.compareFunction);
          });
        }

        return data;
      })
    );
  }

  @action
  onColumnSort(column, e) {
    if (column.isSorted) {
      // if this column is already sorted, calculate the next
      // sorting on the sequence.
      let direction = column.sort;
      let sortSequence = column.normalizedSortSequence;
      direction = sortSequence[(sortSequence.indexOf(direction) + 1) % sortSequence.length];

      if (direction === 'unsorted') {
        direction = null;
      }
      column.sort = direction;

      if (!e.shiftKey) {
        // if not pressed shift, reset other column sorting
        let columns = this.columns.filter(c => c !== column);
        columns.forEach(c => (c.sort = null));
      }
    } else {
      // use first direction from sort sequence
      let direction = column.normalizedSortSequence[0];
      // create new sorting
      column.sort = direction;

      // normal click replaces all sorting with the new one
      // shift click adds a new sorting to the existing ones
      if (!e.shiftKey) {
        // if not pressed shift, reset other column sortings
        let columns = this.columns.filter(c => c !== column);
        columns.forEach(c => (c.sort = null));
      }
    }
    this.fetchData();
  }

  @action
  previousPage() {
    if (this.pagination) {
      let { pageNumber } = this.paginationData;
      this.pageNumber = Math.max(pageNumber - 1, 1);
      this.fetchData();
    }
  }

  @action
  nextPage() {
    if (this.pagination) {
      let { pageNumber, isLastPage } = this.paginationData;

      if (!isLastPage) {
        this.pageNumber = pageNumber + 1;
        this.fetchData();
      }
    }
  }

  @action
  goToPage(pageNumber) {
    if (this.pagination) {
      let { totalPages } = this.paginationData;
      pageNumber = Math.max(pageNumber, 1);

      if (totalPages) {
        pageNumber = Math.min(pageNumber, totalPages);
      }

      this.pageNumber = pageNumber;
      this.fetchData();
    }
  }

  @action
  changePageSize(pageSize) {
    if (this.pagination) {
      this.pageSize = parseInt(pageSize);
      this.fetchData();
    }
  }

  registerColumn(column) {
    if (this.args.isColumnVisible) {
      column.visible = this.args.isColumnVisible(column);
    }

    if (!this.columns.includes(column)) {
      this.columns.push(column);
      let notifyVisibleColumnsPropertyChange = () => notifyPropertyChange(this, 'visibleColumns');
      once(notifyVisibleColumnsPropertyChange);
    }
  }

  unregisterColumn(column) {
    if (this.columns.includes(column)) {
      this.columns = this.columns.filter(c => c !== column);
    }
  }
}

export default YetiTable;
