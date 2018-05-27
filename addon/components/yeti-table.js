import Component from '@ember/component';
import layout from '../templates/components/yeti-table';
import { computed, get, defineProperty } from '@ember/object';
import { sort } from '@ember/object/computed';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import createRegex from 'ember-yeti-table/utils/create-regex';

export default Component.extend({
  layout,

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

    defineProperty(this, 'filteredData', computed(`data.@each.{${columns.join(',')}}`, 'columns.[]', 'searchText', function() {
      let data = this.get('data');
      let searchRegex = createRegex(this.get('searchText'), false, true, true);
      let columns = this.get('columns').mapBy('prop');

      if (isEmpty(data)) {
        return [];
      }

      if (!searchRegex) {
        return data;
      }

      return data.filter(((row) => {
        return columns.some((prop) => {
          return searchRegex.test(get(row, prop));
        });
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
