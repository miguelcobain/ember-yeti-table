import { _ as _applyDecoratedDescriptor, a as _defineProperty, b as _initializerDefineProperty } from '../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import { getOwner } from '@ember/application';
import { action, notifyPropertyChange } from '@ember/object';
import { scheduleOnce, later, schedule } from '@ember/runloop';
import { isPresent, isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import merge from 'deepmerge';
import { use } from 'ember-resources';
import { trackedFunction } from 'reactiveweb/function';
import { keepLatest } from 'reactiveweb/keep-latest';
import { localCopy, cached, dedupeTracked } from 'tracked-toolbox';
import DEFAULT_THEME from '../themes/default-theme.js';
import filterData from '../utils/filtering-utils.js';
import { sortMultiple, compareValues, mergeSort } from '../utils/sorting-utils.js';
import Helper from '@ember/component/helper';
import { hash } from '@ember/helper';
import Table from './yeti-table/table.js';
import Header from './yeti-table/header.js';
import THead from './yeti-table/thead.js';
import Body from './yeti-table/body.js';
import TBody from './yeti-table/tbody.js';
import TFoot from './yeti-table/tfoot.js';
import Pagination from './yeti-table/pagination.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _YetiTable;
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
  compute(positional, {
    context
  }) {
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
  compute(positional, {
    context
  }) {
    context.filter = positional[0] || '';
    return '';
  }
}
class ProcessedData extends Helper {
  compute(positional, {
    loadData,
    context
  }) {
    let data = context.latestData ?? [];
    if (!loadData) {
      context.processData(data);
    } else {
      /* eslint-disable ember/no-side-effects */ // This is instrumental to ignoreDataChanges working
      context.processedData = data;
      /* eslint-enable */
    }
    return '';
  }
}
let YetiTable = (_dec = localCopy('args.pagination', getConfigWithDefault('pagination', false)), _dec2 = localCopy('args.pageSize', getConfigWithDefault('pageSize', 15)), _dec3 = localCopy('args.pageNumber', 1), _dec4 = localCopy('args.sortable', getConfigWithDefault('sortable', true)), _dec5 = localCopy('args.sortFunction', () => sortMultiple), _dec6 = localCopy('args.compareFunction', () => compareValues), _dec7 = localCopy('args.sortSequence', getConfigWithDefault('sortSequence', ['asc', 'desc'])), _dec8 = localCopy('args.ignoreDataChanges', getConfigWithDefault('ignoreDataChanges', false)), _dec9 = localCopy('args.renderTableElement', true), _class = (_YetiTable = class YetiTable extends Component {
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
  */ // If the theme is replaced, this will invalidate, but not if any prop under theme is changed
  get mergedTheme() {
    let configTheme = this.config.theme || {};
    let localTheme = this.args.theme || {};
    return merge.all([DEFAULT_THEME, configTheme, localTheme]);
  }
  get visibleColumns() {
    return this.columns.filter(c => c.visible === true);
  }
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
    return {
      pageSize,
      pageNumber,
      pageStart,
      pageEnd,
      isFirstPage,
      isLastPage,
      totalRows,
      totalPages
    };
  }
  constructor() {
    super(...arguments);
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
    _defineProperty(this, "publicApi", {
      previousPage: this.previousPage,
      nextPage: this.nextPage,
      goToPage: this.goToPage,
      changePageSize: this.changePageSize,
      reloadData: this.reloadData
    });
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
    _initializerDefineProperty(this, "pagination", _descriptor, this);
    /**
    * Controls the size of each page. Default is `15`.
    *
    * @argument pageSize
    * @type {number}
    */
    _initializerDefineProperty(this, "pageSize", _descriptor2, this);
    /**
    * Controls the current page to show. Default is `1`.
    *
    * @argument pageNumber
    * @type {number}
    */
    _initializerDefineProperty(this, "pageNumber", _descriptor3, this);
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
    _defineProperty(this, "totalRows", void 0);
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
    _initializerDefineProperty(this, "filter", _descriptor4, this);
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
    _initializerDefineProperty(this, "sortable", _descriptor5, this);
    /**
    * Use the `@sortFunction` if you want to completely customize how the row sorting is done.
    * It will be invoked with two rows, the current sortings that are applied and the `@compareFunction`.
    *
    * @argument sortFunction
    * @type {Function}
    */
    _initializerDefineProperty(this, "sortFunction", _descriptor6, this);
    /**
    * Use `@compareFunction` if you just want to customize how two values relate to each other (not the entire row).
    * It will be invoked with two values and you just need to return `-1`, `0` or `1` depending on if first value is
    * greater than the second or not. The default compare function used is the `compare` function from `@ember/utils`.
    *
    * @argument compareFunction
    * @type {Function}
    */
    _initializerDefineProperty(this, "compareFunction", _descriptor7, this);
    /**
    * Use `@sortSequence` to customize the sequence in which the sorting order will cycle when
    * clicking on the table headers. You can either pass in a comma-separated string or an array
    * of strings. Accepted values are `'asc'`, `'desc'` and `'unsorted'`. The default value is `['asc', 'desc']`.
    *
    * @argument sortSequence
    * @type {Array<string> | string}
    */
    _initializerDefineProperty(this, "sortSequence", _descriptor8, this);
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
    _initializerDefineProperty(this, "ignoreDataChanges", _descriptor9, this);
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
    _initializerDefineProperty(this, "renderTableElement", _descriptor10, this);
    _defineProperty(this, "config", getOwner(this).resolveRegistration('config:environment')['ember-yeti-table'] || {});
    _initializerDefineProperty(this, "columns", _descriptor11, this);
    _defineProperty(this, "previousResolvedData", []);
    _defineProperty(this, "resolvedData", trackedFunction(this, async () => {
      let data = this.args.data;
      if (this.columns.length == 0) {
        return [];
      }
      // call loadData if exists
      if (typeof this.args.loadData === 'function') {
        let params = this.computeLoadDataParams();
        try {
          data = await this.args.loadData(params);
        } catch (e) {
          if (!didCancel(e)) {
            // re-throw the non-cancellation error
            throw e;
          }
        }
      } else if (data?.then) {
        // resolve the data promise (either from the @loadData call or @data)
        data = await data;
      }
      if (this.isDestroyed) {
        return;
      }
      data = data || [];
      this.previousResolvedData = data;
      return data;
    }));
    _initializerDefineProperty(this, "latestData", _descriptor12, this);
    _initializerDefineProperty(this, "processedData", _descriptor13, this);
    _initializerDefineProperty(this, "processedDataRows", _descriptor14, this);
    if (typeof this.args.registerApi === 'function') {
      scheduleOnce('actions', null, this.args.registerApi, this.publicApi);
    }
  }
  processData(data) {
    // only columns that have filterable = true and a prop defined will be considered
    let columns = this.columns.filter(c => c.filterable && isPresent(c.prop));
    let sortableColumns = this.columns.filter(c => !isEmpty(c.sort));
    let sortings = sortableColumns.map(c => ({
      prop: c.prop,
      direction: c.sort
    }));
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
        let {
          pageStart,
          pageEnd
        } = this.paginationData;
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
    params.sortData = this.columns.filter(c => !isEmpty(c.sort)).map(c => ({
      prop: c.prop,
      direction: c.sort
    }));
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
      let {
        pageStart,
        pageEnd
      } = this.paginationData;
      data = data.slice(pageStart - 1, pageEnd); // slice excludes last element so we don't need to subtract 1
    }
    return data;
  }
  async reloadData() {
    return await this.resolvedData.retry();
  }
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
        columns.forEach(c => c.sort = null);
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
        columns.forEach(c => c.sort = null);
      }
    }
  }
  previousPage() {
    if (this.pagination) {
      this.pageNumber = Math.max(this.pageNumber - 1, 1);
    }
  }
  nextPage() {
    if (this.pagination) {
      let {
        isLastPage
      } = this.paginationData;
      if (!isLastPage) {
        this.pageNumber = this.pageNumber + 1;
      }
    }
  }
  goToPage(pageNumber) {
    if (this.pagination) {
      let {
        totalPages
      } = this.paginationData;
      pageNumber = Math.max(pageNumber, 1);
      if (totalPages) {
        pageNumber = Math.min(pageNumber, totalPages);
      }
      this.pageNumber = pageNumber;
    }
  }
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
}, setComponentTemplate(precompileTemplate("\n    {{#let (hash table=(component Table theme=this.mergedTheme parent=this) header=(component Header columns=this.columns onColumnClick=this.onColumnSort sortable=this.sortable sortSequence=this.sortSequence parent=this theme=this.mergedTheme) thead=(component THead columns=this.columns onColumnClick=this.onColumnSort sortable=this.sortable sortSequence=this.sortSequence theme=this.mergedTheme parent=this) body=(component Body data=this.processedData columns=this.columns theme=this.mergedTheme parent=this) tbody=(component TBody data=this.processedData columns=this.columns theme=this.mergedTheme parent=this) tfoot=(component TFoot columns=this.columns theme=this.mergedTheme parent=this) pagination=(component Pagination disabled=this.isLoading theme=this.mergedTheme paginationData=this.paginationData paginationActions=(hash previousPage=this.previousPage nextPage=this.nextPage goToPage=this.goToPage changePageSize=this.changePageSize)) actions=this.publicApi paginationData=this.paginationData isLoading=this.resolvedData.isPending columns=this.columns visibleColumns=this.visibleColumns rows=this.normalizedRows totalRows=this.normalizedTotalRows visibleRows=this.processedData theme=this.mergedTheme) as |api|}}\n      {{UpdateTotalRows @totalRows context=this}}\n      {{UpdateFilter @filter context=this}}\n      {{ProcessedData loadData=@loadData context=this}}\n\n      {{#if this.renderTableElement}}\n        <Table @theme={{this.mergedTheme}} @parent={{this}} ...attributes>\n          {{yield api}}\n        </Table>\n      {{else}}\n        {{yield api}}\n      {{/if}}\n\n    {{/let}}\n  ", {
  strictMode: true,
  scope: () => ({
    hash,
    Table,
    Header,
    THead,
    Body,
    TBody,
    TFoot,
    Pagination,
    UpdateTotalRows,
    UpdateFilter,
    ProcessedData
  })
}), _YetiTable), _YetiTable), _descriptor = _applyDecoratedDescriptor(_class.prototype, "pagination", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "pageSize", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "pageNumber", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "filter", [dedupeTracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return '';
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "sortable", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "sortFunction", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "compareFunction", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "sortSequence", [_dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "ignoreDataChanges", [_dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "renderTableElement", [_dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class.prototype, "mergedTheme", [cached], Object.getOwnPropertyDescriptor(_class.prototype, "mergedTheme"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "visibleColumns", [cached], Object.getOwnPropertyDescriptor(_class.prototype, "visibleColumns"), _class.prototype), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "columns", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return [];
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "latestData", [use], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return keepLatest({
      value: () => this.resolvedData.value ?? [],
      when: () => this.resolvedData.isPending
    });
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "processedData", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, "processedDataRows", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class.prototype, "reloadData", [action], Object.getOwnPropertyDescriptor(_class.prototype, "reloadData"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onColumnSort", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onColumnSort"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "previousPage", [action], Object.getOwnPropertyDescriptor(_class.prototype, "previousPage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "nextPage", [action], Object.getOwnPropertyDescriptor(_class.prototype, "nextPage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "goToPage", [action], Object.getOwnPropertyDescriptor(_class.prototype, "goToPage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePageSize", [action], Object.getOwnPropertyDescriptor(_class.prototype, "changePageSize"), _class.prototype), _class);

export { YetiTable as default };
//# sourceMappingURL=yeti-table.js.map
