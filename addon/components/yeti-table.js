import Component from '@ember/component';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { computed as emberComputed, get, defineProperty } from '@ember/object';
import { sort } from '@ember/object/computed';

import { tagName } from '@ember-decorators/component';
import { computed, action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, optional, arrayOf } from '@ember-decorators/argument/type';

import createRegex from 'ember-yeti-table/utils/create-regex';

import layout from '../templates/components/yeti-table';

@tagName('table')
export default class YetiTable extends Component {
  layout = layout;

  @argument
  @required
  @type(arrayOf('object'))
  data;

  @argument
  @type(optional('string'))
  sortProperty = null;

  @argument
  @type('string')
  sortDirection = 'asc';

  @computed('sortDefinition', 'sortProperty', 'sortDirection')
  get _sortDefinition() {
    let sortDefinition = this.get('sortDefinition');

    if (sortDefinition) {
      return sortDefinition.split(' ');
    } else {
      let def = [];
      if (this.get('sortProperty')) {
        def.push(`${this.get('sortProperty')}:${this.get('sortDirection')}`);
      }
      return def;
    }
  }

  // workaround for https://github.com/emberjs/ember.js/pull/16632
  @computed('_sortDefinition', 'sortedData.[]', 'filteredData.[]')
  get processedData() {
    if (isEmpty(this.get('_sortDefinition'))) {
      return this.get('filteredData');
    } else {
      return this.get('sortedData');
    }
  }

  init() {
    super.init(...arguments);
    this.set('columns', A());
    this.set('filteredData', []);

    // defining this in init is needed because `sort` macro only
    // supports passing in a function and not a key to a function
    let comparator = this.get('comparator');
    if (typeof comparator === 'function') {
      let sortFn = (itemA, itemB) => {
        let compareValue = comparator(itemA, itemB, this.get('sortProperty'), this.get('sortDirection'));
        return this.get('sortProperty') === 'asc' ? compareValue : -compareValue;
      };
      defineProperty(this, 'sortedData', sort('filteredData', sortFn));
    } else {
      defineProperty(this, 'sortedData', sort('filteredData', '_sortDefinition'));
    }

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
  onColumnSort(column) {
    let prop = column.get('prop');
    let sortProperty = this.get('sortProperty');

    if (sortProperty === prop) {
      let sortDirection = this.get('sortDirection');
      let newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      this.set('sortDirection', newDirection);
    } else {
      this.set('sortProperty', prop);
      this.set('sortDirection', 'asc');
    }
    this.set('sortDefinition', null);
  }

  registerColumn(column) {
    this.get('columns').addObject(column);
  }

  unregisterColumn(column) {
    this.get('columns').removeObject(column);
  }
}
