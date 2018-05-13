import Component from '@ember/component';
import layout from '../templates/components/yeti-table';
import { computed, get, defineProperty } from '@ember/object';
import { sort } from '@ember/object/computed';
import { isArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import createRegex from 'ember-yeti-table/utils/create-regex';

export default Component.extend({
  layout,

  _columns: computed('columns.[]', function() {
    let columns = this.get('columns') || [];
    return isArray(columns) ? columns : columns.trim().split(' ');
  }),

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

  sortIndex: computed('sortProperty', '_columns.[]', function() {
    return this.get('_columns').indexOf(this.get('sortProperty'));
  }),

  orderedData: sort('filteredData', '_sortDefinition'),

  // workaround for https://github.com/emberjs/ember.js/pull/16632
  processedData: computed('_sortDefinition', 'orderedData', 'filteredData', function() {
    if (isEmpty(this.get('_sortDefinition'))) {
      return this.get('filteredData');
    } else {
      return this.get('orderedData');
    }
  }),

  init() {
    this._super(...arguments);
    let columns = this.get('_columns');

    defineProperty(this, 'filteredData', computed(`data.@each.{${columns.join(',')}}`, '_columns.[]', 'searchText', function() {
      let data = this.get('data');
      let searchRegex = createRegex(this.get('searchText'), false, true, true);
      let columns = this.get('_columns');

      if (!searchRegex) {
        return data;
      }

      return data.filter(((row) => {
        return columns.some((prop) => {
          return searchRegex.test(get(row, prop));
        });
      }));
    }));
  },

  onColumnSort(index) {
    let prop = this.get('_columns')[index];
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
});
