import Component from '@ember/component';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { computed as emberComputed, get, set, defineProperty } from '@ember/object';

import { tagName } from '@ember-decorators/component';
import { computed, action } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, optional, arrayOf } from '@ember-decorators/argument/type';

import createRegex from 'ember-yeti-table/utils/create-regex';
import { sortMultiple, compareValues, mergeSort } from 'ember-yeti-table/utils/sorting-utils';


import layout from './template';
@tagName('table')
export default class YetiTable extends Component {
  layout = layout;

  @argument
  @required
  @type(arrayOf('object'))
  data;

  @argument
  @type(optional(Function))
  filterFunction;

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

  @reads('sortedData') processedData;

  init() {
    super.init(...arguments);
    this.set('columns', A());
    this.set('filteredData', []);
  }

  didInsertElement() {
    super.didInsertElement(...arguments);

    let columns = this.get('columns').mapBy('prop');

    defineProperty(this, 'filteredData', emberComputed(`data.@each.{${columns.join(',')}}`, 'columns.@each.{prop,filterFunction,filterText,filterUsing,filterable}', 'filterText', 'filterUsing', 'filterFunction', function() {
      let data = this.get('data');

      if (isEmpty(data)) {
        return [];
      }

      // only columns that have filterable = true will be considered
      let filterableColumns = this.get('columns').filter((c) => c.get('filterable'));

      if (isEmpty(filterableColumns)) {
        // bail out if there are no columns to filter
        return data;
      }

      let filterText = this.get('filterText');
      let generalRegex = createRegex(filterText, false, true, true);
      let searcheableColumns = filterableColumns.filter((c) => !isEmpty(c.get('filterText')) || !isEmpty(c.get('filterFunction')));

      let columnFilters = searcheableColumns.map((c) => {
        let regex = createRegex(c.get('filterText'));

        return (row) => {
          let value = get(row, c.get('prop'));
          let passesRegex = true;

          if (!isEmpty(c.get('filterText'))) {
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

  @action
  onColumnSort(column, e) {
    let prop = column.get('prop');
    let sortings = this.get('sortings');
    let sorting = sortings.find((s) => s.prop === column.get('prop'));

    // 1. column is already sorted and we need to change direction
    // 2. column is not sorted and we need to update the sorting
    //   2.1 normal click replace the sorting with the new one
    //   2.2 shift+click adds the new sorting

    if (sorting) {
      let direction = get(sorting, 'direction');
      let newDirection = direction === 'asc' ? 'desc' : 'asc';
      set(sorting, 'direction', newDirection);
    } else {
      let newSorting = { prop, direction: 'asc' };

      if (e.shiftKey) {
        sortings = [...sortings, newSorting];
      } else {
        sortings = [newSorting];
      }
    }

    let sort = sortings.map(({ prop, direction }) => `${prop}:${direction}`).join(' ');

    this.set('sort', sort);
  }

  registerColumn(column) {
    this.get('columns').addObject(column);
  }

  unregisterColumn(column) {
    this.get('columns').removeObject(column);
  }
}
