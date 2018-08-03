import Component from '@ember/component';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { computed as emberComputed, get, set, defineProperty } from '@ember/object';

import { tagName } from '@ember-decorators/component';
import { computed, action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { type, optional, arrayOf, unionOf, shapeOf } from '@ember-decorators/argument/type';
import { classNames } from '@ember-decorators/component';

import createRegex from 'ember-yeti-table/utils/create-regex';
import { sortMultiple, compareValues, mergeSort } from 'ember-yeti-table/utils/sorting-utils';


import layout from './template';
@tagName('table')
@classNames('yeti-table')
export default class YetiTable extends Component {
  layout = layout;

  @argument
  @type(optional(
    unionOf(
      arrayOf('object'),
      shapeOf({ then: Function })
    )
  ))
  data;

  resolvedData;

  @argument
  @type(optional(Function))
  loadData;

  isLoading = false;

  @argument
  @type('boolean')
  pagination = false;

  @argument
  @type('number')
  pageSize = 15;

  @argument
  @type('number')
  pageNumber = 1;

  @argument
  @type(optional('number'))
  totalRows;

  @argument
  @type(optional('string'))
  filter;

  @argument
  @type(optional(Function))
  filterFunction;

  @argument
  @type(optional('any'))
  filterUsing;

  @argument
  @type(Function)
  sortFunction = sortMultiple;

  @argument
  @type(Function)
  compareFunction = compareValues;

  @argument
  @type(optional('string'))
  sort = null;

  @computed('sort')
  get sortings() {
    let sort = this.get('sort');
    let sortings = [];

    if (sort) {
      sortings = sort.split(' ').map((sortDefinition) => {
        let [prop, direction] = sortDefinition.split(':');
        direction = direction ? direction : 'asc';
        return { prop, direction };
      });
    }

    return sortings;
  }

  @computed('filteredData.[]', 'sortings.[]', 'sortFunction', 'compareFunction')
  get sortedData() {
    let data = this.get('filteredData');
    let sortings = this.get('sortings');
    let sortFunction = this.get('sortFunction');
    let compareFunction = this.get('compareFunction');

    if (sortings.length > 0) {
      data = mergeSort(data, (itemA, itemB) => {
        return sortFunction(itemA, itemB, sortings, compareFunction);
      });
    }

    return data;
  }

  @computed('pageSize', 'pageNumber', 'totalRows')
  get paginationData() {
    let pageSize = this.get('pageSize');
    let pageNumber = this.get('pageNumber');
    let totalRows = this.get('totalRows');

    let pageStart = (pageNumber - 1) * pageSize;
    let pageEnd = pageStart + pageSize - 1;

    let isFirstPage = pageNumber === 1;
    let isLastPage, totalPages;

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
      data = data.slice(pageStart, pageEnd + 1); // slice excludes last element so we need to add 1
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

    let loadData = this.get('loadData');
    if (loadData) {
      this.addObserver('columns.@each.{filter,filterUsing}', this.runLoadData);
      this.addObserver('filter', this.runLoadData);
      this.addObserver('filterUsing', this.runLoadData);
      this.addObserver('sortings.@each.{prop,direction}', this.runLoadData);
      this.addObserver('paginationData', this.runLoadData);
      this.runLoadData();
    }

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

    // defining a computed property on didInsertElement doesn't seem
    // to trigger any observers. This forces an update.
    this.notifyPropertyChange('filteredData');
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    let loadData = this.get('loadData');
    if (loadData) {
      this.removeObserver('columns.@each.{filter,filterUsing}', this.runLoadData);
      this.removeObserver('filter', this.runLoadData);
      this.removeObserver('filterUsing', this.runLoadData);
    }
  }

  runLoadData() {
    let loadData = this.get('loadData');
    if (typeof loadData === 'function') {
      let param = {};

      if (this.get('pagination')) {
        param.paginationData = this.get('paginationData');
      }

      param.sortData = this.get('sortings');
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
  }

  @action
  onColumnSort(column, e) {
    let sortings = this.get('sortings');
    let prop = column.get('prop');
    let sorting = column.get('sorting');
    let direction = 'asc';

    if (sorting) {
      // if this column is already sorted, calculate the opposite
      // direction and remove old sorting
      direction = get(sorting, 'direction');
      direction = direction === 'asc' ? 'desc' : 'asc';
      set(sorting, 'direction', direction);

      if (!e.shiftKey) {
        sortings = [sorting];
      }
    } else {
      // create new sorting
      let newSorting = { prop, direction };

      // normal click replaces all sortings with the new one
      // shift click adds a new sorting to the existing ones
      if (e.shiftKey) {
        sortings.push(newSorting);
      } else {
        sortings = [newSorting];
      }
    }

    // generate the sort definition based on the new sortings
    let sort = sortings.map(({ prop, direction }) => `${prop}:${direction}`).join(' ');

    // update the sort property which will trigger the necessary updates to re-sort the data
    this.set('sort', sort);
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
      this.set('pageSize', pageSize);
    }
  }

  registerColumn(column) {
    this.get('columns').addObject(column);
  }

  unregisterColumn(column) {
    this.get('columns').removeObject(column);
  }
}
