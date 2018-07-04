import Component from '@ember/component';
import layout from '../templates/components/yeti-table';
import { computed, get, defineProperty } from '@ember/object';
import { sort } from '@ember/object/computed';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import createRegex from 'ember-yeti-table/utils/create-regex';

export default Component.extend({
  layout,
  tagName: 'table',

  sortProperty: null,
  sortDirection: 'asc',
  _sortDefinition: computed('sortDefinition', 'sortProperty', 'sortDirection', function() {
    if (this.get('sortDefinition')) {
      return this.get('sortDefinition').split(' ');
    } else {
      let def = [];
      if (this.get('sortProperty')) {
        def.push(`${this.get('sortProperty')}:${this.get('sortDirection')}`);
      }
      return def;
    }
  }),

  orderedData: sort('filteredData', '_sortDefinition'),

  // workaround for https://github.com/emberjs/ember.js/pull/16632
  processedData: computed('_sortDefinition', 'orderedData.[]', 'filteredData.[]', function() {
    if (isEmpty(this.get('_sortDefinition'))) {
      return this.get('filteredData');
    } else {
      return this.get('orderedData');
    }
  }),

  init() {
    this._super(...arguments);
    this.set('columns', A());
    this.set('filteredData', []);
  },

  didInsertElement() {
    this._super(...arguments);

    let columns = this.get('columns').mapBy('prop');

    defineProperty(this, 'filteredData', computed(`data.@each.{${columns.join(',')}}`, 'columns.@each.{prop,searchText,filterable}', 'searchText', function() {
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

      let searchText = this.get('searchText');
      let generalRegex = createRegex(searchText, false, true, true);
      let searcheableColumns = filterableColumns.filter((c) => !isEmpty(c.get('searchText')));
      let columnRegexes = searcheableColumns.map((c) => ({
        prop: c.get('prop'),
        searchRegex: createRegex(c.get('searchText'), false, true, true)
      }));

      return data.filter(((row) => {
        let passesGeneral = true;

        if (!isEmpty(generalRegex)) {
          passesGeneral = filterableColumns.some((c) => {
            return generalRegex.test(get(row, c.get('prop')));
          });
        }

        let passesColumn = true;

        if (!isEmpty(columnRegexes)) {
          passesColumn = columnRegexes.every(({ prop, searchRegex }) => {
            return searchRegex.test(get(row, prop));
          });
        }

        return passesGeneral && passesColumn;
      }));
    }));

    // defining a computed property on didInsertElement doesn't seem
    // to trigger any observers. This forces an update.
    this.notifyPropertyChange('filteredData');
  },

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
  },

  registerColumn(column) {
    this.get('columns').addObject(column);
  },

  unregisterColumn(column) {
    this.get('columns').removeObject(column);
  }
});
