import { _ as _applyDecoratedDescriptor, a as _defineProperty, b as _initializerDefineProperty } from '../_rollupPluginBabelHelpers-CROxMPeN.js';
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

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _class2;
const TASK_CANCELATION_NAME = 'TaskCancelation';
const didCancel = function (e1) {
  return e1 && e1.name === TASK_CANCELATION_NAME;
};
const getConfigWithDefault = function (key1, defaultValue1) {
  return function () {
    return this.config[key1] ?? defaultValue1;
  };
};
// we keep `totalRows` updated manually in an untracked property
// to allow the user to update it in a loadData call and avoid
// a re-run of the main tracked function
let UpdateTotalRows = class UpdateTotalRows extends Helper {
  compute(positional1, {
    context: context1
  }) {
    context1.totalRows = positional1[0];
    notifyPropertyChange(context1, 'normalizedTotalRows');
    notifyPropertyChange(context1, 'paginationData');
    return '';
  }
};
// we need some control of how we update the filter property, hence this modifier
// in this case, any falsy value will be considered as en empty string, which will then
// be deduped.
let UpdateFilter = class UpdateFilter extends Helper {
  compute(positional1, {
    context: context1
  }) {
    context1.filter = positional1[0] || '';
    return '';
  }
};
let ProcessedData = class ProcessedData extends Helper {
  compute(positional1, {
    loadData: loadData1,
    context: context1
  }) {
    let data1 = context1.latestData ?? [];
    if (!loadData1) {
      context1.processData(data1);
    } else {
      /* eslint-disable ember/no-side-effects */ // This is instrumental to ignoreDataChanges working
      context1.processedData = data1;
      /* eslint-enable */
    }
    return '';
  }
};
let YetiTable = (_dec = localCopy('args.pagination', getConfigWithDefault('pagination', false)), _dec2 = localCopy('args.pageSize', getConfigWithDefault('pageSize', 15)), _dec3 = localCopy('args.pageNumber', 1), _dec4 = localCopy('args.sortable', getConfigWithDefault('sortable', true)), _dec5 = localCopy('args.sortFunction', () => sortMultiple), _dec6 = localCopy('args.compareFunction', () => compareValues), _dec7 = localCopy('args.sortSequence', getConfigWithDefault('sortSequence', ['asc', 'desc'])), _dec8 = localCopy('args.ignoreDataChanges', getConfigWithDefault('ignoreDataChanges', false)), _dec9 = localCopy('args.renderTableElement', true), (_class = (_class2 = class YetiTable extends Component {
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
    let configTheme1 = this.config.theme || {};
    let localTheme1 = this.args.theme || {};
    return merge.all([DEFAULT_THEME, configTheme1, localTheme1]);
  }
  get visibleColumns() {
    return this.columns.filter(c1 => c1.visible === true);
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
    let pageSize1 = this.pageSize;
    let pageNumber1 = this.pageNumber;
    let totalRows1 = this.normalizedTotalRows;
    let isLastPage1, totalPages1;
    if (totalRows1) {
      totalPages1 = Math.ceil(totalRows1 / pageSize1);
      pageNumber1 = Math.min(pageNumber1, totalPages1);
      isLastPage1 = pageNumber1 === totalPages1;
    }
    let isFirstPage1 = pageNumber1 === 1;
    let pageStart1 = (pageNumber1 - 1) * pageSize1 + 1;
    let pageEnd1 = pageStart1 + pageSize1 - 1;
    if (totalRows1) {
      pageEnd1 = Math.min(pageEnd1, totalRows1);
    }
    return {
      pageSize: pageSize1,
      pageNumber: pageNumber1,
      pageStart: pageStart1,
      pageEnd: pageEnd1,
      isFirstPage: isFirstPage1,
      isLastPage: isLastPage1,
      totalRows: totalRows1,
      totalPages: totalPages1
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
      let data1 = this.args.data;
      if (this.columns.length == 0) {
        return [];
      }
      // call loadData if exists
      if (typeof this.args.loadData === 'function') {
        let params1 = this.computeLoadDataParams();
        try {
          data1 = await this.args.loadData(params1);
        } catch (e1) {
          if (!didCancel(e1)) {
            // re-throw the non-cancellation error
            throw e1;
          }
        }
      } else if (data1?.then) {
        // resolve the data promise (either from the @loadData call or @data)
        data1 = await data1;
      }
      if (this.isDestroyed) {
        return;
      }
      data1 = data1 || [];
      this.previousResolvedData = data1;
      return data1;
    }));
    _initializerDefineProperty(this, "latestData", _descriptor12, this);
    _initializerDefineProperty(this, "processedData", _descriptor13, this);
    _initializerDefineProperty(this, "processedDataRows", _descriptor14, this);
    if (typeof this.args.registerApi === 'function') {
      scheduleOnce('actions', null, this.args.registerApi, this.publicApi);
    }
  }
  processData(data1) {
    // only columns that have filterable = true and a prop defined will be considered
    let columns1 = this.columns.filter(c1 => c1.filterable && isPresent(c1.prop));
    let sortableColumns1 = this.columns.filter(c1 => !isEmpty(c1.sort));
    let sortings1 = sortableColumns1.map(c1 => ({
      prop: c1.prop,
      direction: c1.sort
    }));
    let filterFunction1 = this.args.filterFunction;
    let filterUsing1 = this.args.filterUsing;
    let filter1 = this.filter;
    let processTheData1 = () => {
      // filter the data
      data1 = filterData(data1, columns1, filter1, filterFunction1, filterUsing1);
      // Sort the data
      if (sortings1.length > 0) {
        data1 = mergeSort(data1, (itemA1, itemB1) => {
          return this.sortFunction(itemA1, itemB1, sortings1, this.compareFunction);
        });
      }
      this.processedDataRows = data1;
      // Paginate the Data
      if (this.pagination) {
        let {
          pageStart: pageStart1,
          pageEnd: pageEnd1
        } = this.paginationData;
        data1 = data1.slice(pageStart1 - 1, pageEnd1); // slice excludes last element so we don't need to subtract 1
      }
      this.processedData = data1;
    };
    if (this.ignoreDataChanges) {
      later(processTheData1, 0);
    } else {
      processTheData1();
    }
  }
  computeLoadDataParams() {
    let params1 = {};
    if (this.pagination) {
      params1.paginationData = this.paginationData;
    }
    params1.sortData = this.columns.filter(c1 => !isEmpty(c1.sort)).map(c1 => ({
      prop: c1.prop,
      direction: c1.sort
    }));
    params1.filterData = {
      filter: this.filter,
      filterUsing: this.args.filterUsing,
      columnFilters: this.columns.map(c1 => ({
        prop: c1.prop,
        filter: c1.filter,
        filterUsing: c1.filterUsing
      }))
    };
    return params1;
  }
  paginateData(data1) {
    if (this.pagination) {
      let {
        pageStart: pageStart1,
        pageEnd: pageEnd1
      } = this.paginationData;
      data1 = data1.slice(pageStart1 - 1, pageEnd1); // slice excludes last element so we don't need to subtract 1
    }
    return data1;
  }
  async reloadData() {
    return await this.resolvedData.retry();
  }
  onColumnSort(column1, e1) {
    if (column1.isSorted) {
      // if this column is already sorted, calculate the next
      // sorting on the sequence.
      let direction1 = column1.sort;
      let sortSequence1 = column1.normalizedSortSequence;
      direction1 = sortSequence1[(sortSequence1.indexOf(direction1) + 1) % sortSequence1.length];
      if (direction1 === 'unsorted') {
        direction1 = null;
      }
      column1.sort = direction1;
      if (!e1.shiftKey) {
        // if not pressed shift, reset other column sorting
        let columns1 = this.columns.filter(c1 => c1 !== column1);
        columns1.forEach(c1 => c1.sort = null);
      }
    } else {
      // use first direction from sort sequence
      let direction1 = column1.normalizedSortSequence[0];
      // create new sorting
      column1.sort = direction1;
      // normal click replaces all sortings with the new one
      // shift click adds a new sorting to the existing ones
      if (!e1.shiftKey) {
        // if not pressed shift, reset other column sortings
        let columns1 = this.columns.filter(c1 => c1 !== column1);
        columns1.forEach(c1 => c1.sort = null);
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
        isLastPage: isLastPage1
      } = this.paginationData;
      if (!isLastPage1) {
        this.pageNumber = this.pageNumber + 1;
      }
    }
  }
  goToPage(pageNumber1) {
    if (this.pagination) {
      let {
        totalPages: totalPages1
      } = this.paginationData;
      pageNumber1 = Math.max(pageNumber1, 1);
      if (totalPages1) {
        pageNumber1 = Math.min(pageNumber1, totalPages1);
      }
      this.pageNumber = pageNumber1;
    }
  }
  changePageSize(pageSize1) {
    if (this.pagination) {
      this.pageSize = parseInt(pageSize1);
    }
  }
  registerColumn(column1) {
    schedule('afterRender', this, function () {
      if (typeof this.args.isColumnVisible === 'function') {
        column1.visible = this.args.isColumnVisible(column1);
      }
      if (!this.columns.includes(column1)) {
        this.columns = [...this.columns, column1];
      }
    });
  }
  unregisterColumn(column1) {
    if (this.columns.includes(column1)) {
      this.columns = this.columns.filter(c1 => c1 !== column1);
    }
  }
}, setComponentTemplate(precompileTemplate("\n    {{#let (hash table=(component Table theme=this.mergedTheme parent=this) header=(component Header columns=this.columns onColumnClick=this.onColumnSort sortable=this.sortable sortSequence=this.sortSequence parent=this theme=this.mergedTheme) thead=(component THead columns=this.columns onColumnClick=this.onColumnSort sortable=this.sortable sortSequence=this.sortSequence theme=this.mergedTheme parent=this) body=(component Body data=this.processedData columns=this.columns theme=this.mergedTheme parent=this) tbody=(component TBody data=this.processedData columns=this.columns theme=this.mergedTheme parent=this) tfoot=(component TFoot columns=this.columns theme=this.mergedTheme parent=this) pagination=(component Pagination disabled=this.isLoading theme=this.mergedTheme paginationData=this.paginationData paginationActions=(hash previousPage=this.previousPage nextPage=this.nextPage goToPage=this.goToPage changePageSize=this.changePageSize)) actions=this.publicApi paginationData=this.paginationData isLoading=this.resolvedData.isPending columns=this.columns visibleColumns=this.visibleColumns rows=this.normalizedRows totalRows=this.normalizedTotalRows visibleRows=this.processedData theme=this.mergedTheme) as |api|}}\n      {{UpdateTotalRows @totalRows context=this}}\n      {{UpdateFilter @filter context=this}}\n      {{ProcessedData loadData=@loadData context=this}}\n\n      {{#if this.renderTableElement}}\n        <Table @theme={{this.mergedTheme}} @parent={{this}} ...attributes>\n          {{yield api}}\n        </Table>\n      {{else}}\n        {{yield api}}\n      {{/if}}\n\n    {{/let}}\n  ", {
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
  }),
  strictMode: true
}), _class2), _class2), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "pagination", [_dec], {
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
}), _applyDecoratedDescriptor(_class.prototype, "reloadData", [action], Object.getOwnPropertyDescriptor(_class.prototype, "reloadData"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onColumnSort", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onColumnSort"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "previousPage", [action], Object.getOwnPropertyDescriptor(_class.prototype, "previousPage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "nextPage", [action], Object.getOwnPropertyDescriptor(_class.prototype, "nextPage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "goToPage", [action], Object.getOwnPropertyDescriptor(_class.prototype, "goToPage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePageSize", [action], Object.getOwnPropertyDescriptor(_class.prototype, "changePageSize"), _class.prototype)), _class));

export { YetiTable as default };
//# sourceMappingURL=yeti-table.js.map
