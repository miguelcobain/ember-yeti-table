import { getOwner } from '@ember/application';
import { action, notifyPropertyChange } from '@ember/object';
import { later, schedule, scheduleOnce } from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import merge from 'deepmerge';
import { use } from 'ember-resources';
import { trackedFunction } from 'ember-resources/util/function';
import { keepLatest } from 'ember-resources/util/keep-latest';
import { cached, dedupeTracked, localCopy } from 'tracked-toolbox';

import DEFAULT_THEME from 'ember-yeti-table/-private/themes/default-theme';
import filterData from 'ember-yeti-table/-private/utils/filtering-utils';
import { compareValues, mergeSort, sortMultiple } from 'ember-yeti-table/-private/utils/sorting-utils';
import Helper from '@ember/component/helper';
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
 @class YetiTable
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
// template imports
import { hash } from '@ember/helper';
import Table from 'ember-yeti-table/components/yeti-table/table';
import Header from 'ember-yeti-table/components/yeti-table/header';
import THead from 'ember-yeti-table/components/yeti-table/thead';
import Body from 'ember-yeti-table/components/yeti-table/body';
import TBody from 'ember-yeti-table/components/yeti-table/tbody';
import TFoot from 'ember-yeti-table/components/yeti-table/tfoot';
import Pagination from 'ember-yeti-table/components/yeti-table/pagination';

// bring ember-concurrency didCancel helper instead of
// including the whole dependency
const TASK_CANCELATION_NAME = 'TaskCancelation';
const didCancel = function (e) {
  return e && e.name === TASK_CANCELATION_NAME;
};

const getConfigWithDefault = function (key, defaultValue) {
  return function () {
    return this.config[key] ?? defaultValue;
  };
};

// we keep `totalRows` updated manually in an untracked property
// to allow the user to update it in a loadData call and avoid
// a re-run of the main tracked function
class UpdateTotalRows extends Helper {
  compute(positional, { context }) {
    context.totalRows = positional[0];
    notifyPropertyChange(context, 'normalizedTotalRows');
    notifyPropertyChange(context, 'paginationData');
    return '';
  }
}

// we need some control of how we update the filter property, hence this modifier
// in this case, any falsy value will be considered as en empty string, which will then
// be deduped.
class UpdateFilter extends Helper {
  compute(positional, { context }) {
    context.filter = positional[0] || '';
    return '';
  }
}

class ProcessedData extends Helper {
  compute(positional, { loadData, context }) {
    let data = context.latestData ?? [];

    if (!loadData) {
      context.processData(data);
    } else {
      /* eslint-disable ember/no-side-effects */
      // This is instrumental to ignoreDataChanges working
      context.processedData = data;
      /* eslint-enable */
    }
    return '';
  }
}

export default class YetiTable extends Component {
  <template>
    {{#let
      (hash
        table=(component Table theme=this.mergedTheme parent=this)
        header=(component
          Header
          columns=this.columns
          onColumnClick=this.onColumnSort
          sortable=this.sortable
          sortSequence=this.sortSequence
          parent=this
          theme=this.mergedTheme
        )
        thead=(component
          THead
          columns=this.columns
          onColumnClick=this.onColumnSort
          sortable=this.sortable
          sortSequence=this.sortSequence
          theme=this.mergedTheme
          parent=this
        )
        body=(component Body data=this.processedData columns=this.columns theme=this.mergedTheme parent=this)
        tbody=(component TBody data=this.processedData columns=this.columns theme=this.mergedTheme parent=this)
        tfoot=(component TFoot columns=this.columns theme=this.mergedTheme parent=this)
        pagination=(component
          Pagination
          disabled=this.isLoading
          theme=this.mergedTheme
          paginationData=this.paginationData
          paginationActions=(hash
            previousPage=this.previousPage
            nextPage=this.nextPage
            goToPage=this.goToPage
            changePageSize=this.changePageSize
          )
        )
        actions=this.publicApi
        paginationData=this.paginationData
        isLoading=this.resolvedData.isPending
        columns=this.columns
        visibleColumns=this.visibleColumns
        rows=this.normalizedRows
        totalRows=this.normalizedTotalRows
        visibleRows=this.processedData
        theme=this.mergedTheme
      )
      as |api|
    }}
      {{UpdateTotalRows @totalRows context=this}}
      {{UpdateFilter @filter context=this}}
      {{ProcessedData loadData=@loadData context=this}}

      {{#if this.renderTableElement}}
        <Table @theme={{this.mergedTheme}} @parent={{this}} ...attributes>
          {{yield api}}
        </Table>
      {{else}}
        {{yield api}}
      {{/if}}

    {{/let}}
  </template>
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
   * @argument data
   * @type {Array | Promise<Array>}
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
    reloadData: this.reloadData
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
   * @argument registerApi
   * @type {Function}
   */

  /**
   * Use this argument to enable the pagination feature. Default is `false`.
   *
   * @argument pagination
   * @type {Boolean}
   */
  @localCopy('args.pagination', getConfigWithDefault('pagination', false))
  pagination;

  /**
   * Controls the size of each page. Default is `15`.
   *
   * @argument pageSize
   * @type {number}
   */
  @localCopy('args.pageSize', getConfigWithDefault('pageSize', 15))
  pageSize;

  /**
   * Controls the current page to show. Default is `1`.
   *
   * @argument pageNumber
   * @type {number}
   */
  @localCopy('args.pageNumber', 1)
  pageNumber;

  /**
   * Optional argument that informs yeti table of how many rows your data has.
   * Only needed when using a `@loadData` function and `@pagination={{true}}`.
   * When you use `@data`, Yeti Table uses the size of that array.
   * This information is used to calculate the pagination information that is yielded
   * and passed to the `@loadData` function.
   *
   * @argument totalRows
   * @type {number}
   */
  totalRows;

  // we keep `totalRows` updated manually in an untracked property
  // to allow the user to update it in a loadData call and avoid
  // a re-run of the main tracked function
  // @action
  // updateTotalRows(totalRows) {
  //   this.totalRows = totalRows;
  //   notifyPropertyChange(this, 'normalizedTotalRows');
  //   notifyPropertyChange(this, 'paginationData');
  // }

  /**
   * The global filter. If passed in, Yeti Table will search all the rows that contain this
   * string and show them. Defaults to `''`.
   *
   * @argument filter
   * @type {String}
   */
  @dedupeTracked
  filter = '';

  // we need some control of how we update the filter property, hence this modifier
  // in this case, any falsy value will be considered as en empty string, which will then
  // be deduped.
  // @action
  // updateFilter(filter) {
  //   this.filter = filter || '';
  // }

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
   * the fitlered rows.
   *
   * @argument filterUsing
   * @type {Object}
   */

  /**
   * Used to enable/disable sorting on all columns. You should use this to avoid passing
   * the @sortable argument to all columns. Defaults to `true`.
   *
   * @argument sortable
   * @type {Boolean}
   */
  @localCopy('args.sortable', getConfigWithDefault('sortable', true))
  sortable;

  /**
   * Use the `@sortFunction` if you want to completely customize how the row sorting is done.
   * It will be invoked with two rows, the current sortings that are applied and the `@compareFunction`.
   *
   * @argument sortFunction
   * @type {Function}
   */
  @localCopy('args.sortFunction', () => sortMultiple)
  sortFunction;

  /**
   * Use `@compareFunction` if you just want to customize how two values relate to each other (not the entire row).
   * It will be invoked with two values and you just need to return `-1`, `0` or `1` depending on if first value is
   * greater than the second or not. The default compare function used is the `compare` function from `@ember/utils`.
   *
   * @argument compareFunction
   * @type {Function}
   */
  @localCopy('args.compareFunction', () => compareValues)
  compareFunction;

  /**
   * Use `@sortSequence` to customize the sequence in which the sorting order will cycle when
   * clicking on the table headers. You can either pass in a comma-separated string or an array
   * of strings. Accepted values are `'asc'`, `'desc'` and `'unsorted'`. The default value is `['asc', 'desc']`.
   *
   * @argument sortSequence
   * @type {Array<string> | string}
   */
  @localCopy('args.sortSequence', getConfigWithDefault('sortSequence', ['asc', 'desc']))
  sortSequence;

  /**
   * Use `@ignoreDataChanges` to prevent yeti table from observing changes to the underlying data and resorting or
   * refiltering. Useful when doing inline editing in a table.
   *
   * Defaults to `false`.
   *
   * This is an initial render only value. Changing it after the table has been rendered will not be respected.
   *
   * @argument ignoreDataChanges
   * @type {boolean}
   */
  @localCopy('args.ignoreDataChanges', getConfigWithDefault('ignoreDataChanges', false))
  ignoreDataChanges;

  /**
   * Use `@renderTableElement` to prevent yeti table from rendering the topmost <table> element.
   * Might be useful for styling purposes (e.g if you want to place your pagination controls outside
   * of your table element). If you set this to `false`, you should render the table element yourself
   * using the yielded `<t.table>` component.
   *
   * Defaults to `true`.
   *
   * @argument renderTableElement
   * @type {boolean}
   */
  @localCopy('args.renderTableElement', true)
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

  // If the theme is replaced, this will invalidate, but not if any prop under theme is changed
  @cached
  get mergedTheme() {
    let configTheme = this.config.theme || {};
    let localTheme = this.args.theme || {};
    return merge.all([DEFAULT_THEME, configTheme, localTheme]);
  }

  @cached
  get visibleColumns() {
    return this.columns.filter(c => c.visible === true);
  }

  config = getOwner(this).resolveRegistration('config:environment')['ember-yeti-table'] || {};

  get normalizedTotalRows() {
    if (!this.args.loadData) {
      // sync scenario using @data
      return this.processedDataRows?.length || 0;
    } else {
      // async scenario. @loadData is present.
      if (this.totalRows === undefined) {
        // @totalRows was not passed in. Use the latest returned data set length as a fallback
        return this.previousResolvedData.length || 0;
      } else {
        // @totalRows was passed in.
        return this.totalRows;
      }
    }
  }

  get normalizedRows() {
    if (!this.args.loadData) {
      // sync scenario using @data
      return this.processedDataRows;
    } else {
      // async scenario. @loadData is present.
      return this.processedData;
    }
  }

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
    let pageStart = (pageNumber - 1) * pageSize + 1;
    let pageEnd = pageStart + pageSize - 1;

    if (totalRows) {
      pageEnd = Math.min(pageEnd, totalRows);
    }

    return { pageSize, pageNumber, pageStart, pageEnd, isFirstPage, isLastPage, totalRows, totalPages };
  }

  @tracked
  columns = [];

  constructor() {
    super(...arguments);

    if (typeof this.args.registerApi === 'function') {
      scheduleOnce('actions', null, this.args.registerApi, this.publicApi);
    }
  }

  previousResolvedData = [];

  resolvedData = trackedFunction(this, async () => {
    let data = this.args.data;

    if (this.columns.length == 0) {
      return [];
    }

    // call loadData if exists
    if (typeof this.args.loadData === 'function') {
      let params = this.computeLoadDataParams();
      data = this.args.loadData(params);
    }

    // resolve the data promise (either from the @loadData call or @data)
    if (data?.then) {
      try {
        data = await data;
      } catch (e) {
        if (!didCancel(e)) {
          // re-throw the non-cancellation error
          throw e;
        }
      }
    }

    if (this.isDestroyed) {
      return;
    }

    data = data || [];

    this.previousResolvedData = data;

    return data;
  });

  @use latestData = keepLatest({
    value: () => this.resolvedData.value ?? [],
    when: () => this.resolvedData.isPending
  });

  @tracked
  processedData;

  @tracked
  processedDataRows;

  processData(data) {
    // only columns that have filterable = true and a prop defined will be considered
    let columns = this.columns.filter(c => c.filterable && isPresent(c.prop));

    let sortableColumns = this.columns.filter(c => !isEmpty(c.sort));
    let sortings = sortableColumns.map(c => ({ prop: c.prop, direction: c.sort }));

    let filterFunction = this.args.filterFunction;
    let filterUsing = this.args.filterUsing;
    let filter = this.filter;

    let processTheData = () => {
      // filter the data
      data = filterData(data, columns, filter, filterFunction, filterUsing);
      // Sort the data
      if (sortings.length > 0) {
        data = mergeSort(data, (itemA, itemB) => {
          return this.sortFunction(itemA, itemB, sortings, this.compareFunction);
        });
      }

      this.processedDataRows = data;

      // Paginate the Data
      if (this.pagination) {
        let { pageStart, pageEnd } = this.paginationData;
        data = data.slice(pageStart - 1, pageEnd); // slice excludes last element so we don't need to subtract 1
      }

      this.processedData = data;
    };

    if (this.ignoreDataChanges) {
      later(processTheData, 0);
    } else {
      processTheData();
    }
  }

  computeLoadDataParams() {
    let params = {};

    if (this.pagination) {
      params.paginationData = this.paginationData;
    }

    params.sortData = this.columns.filter(c => !isEmpty(c.sort)).map(c => ({ prop: c.prop, direction: c.sort }));
    params.filterData = {
      filter: this.filter,
      filterUsing: this.args.filterUsing,
      columnFilters: this.columns.map(c => ({
        prop: c.prop,
        filter: c.filter,
        filterUsing: c.filterUsing
      }))
    };

    return params;
  }

  paginateData(data) {
    if (this.pagination) {
      let { pageStart, pageEnd } = this.paginationData;
      data = data.slice(pageStart - 1, pageEnd); // slice excludes last element so we don't need to subtract 1
    }

    return data;
  }

  @action
  async reloadData() {
    return await this.resolvedData.retry();
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

      // normal click replaces all sortings with the new one
      // shift click adds a new sorting to the existing ones
      if (!e.shiftKey) {
        // if not pressed shift, reset other column sortings
        let columns = this.columns.filter(c => c !== column);
        columns.forEach(c => (c.sort = null));
      }
    }
  }

  @action
  previousPage() {
    if (this.pagination) {
      this.pageNumber = Math.max(this.pageNumber - 1, 1);
    }
  }

  @action
  nextPage() {
    if (this.pagination) {
      let { isLastPage } = this.paginationData;

      if (!isLastPage) {
        this.pageNumber = this.pageNumber + 1;
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
    }
  }

  @action
  changePageSize(pageSize) {
    if (this.pagination) {
      this.pageSize = parseInt(pageSize);
    }
  }

  registerColumn(column) {
    schedule('afterRender', this, function () {
      if (typeof this.args.isColumnVisible === 'function') {
        column.visible = this.args.isColumnVisible(column);
      }

      if (!this.columns.includes(column)) {
        this.columns = [...this.columns, column];
      }
    });
  }

  unregisterColumn(column) {
    if (this.columns.includes(column)) {
      this.columns = this.columns.filter(c => c !== column);
    }
  }
}
