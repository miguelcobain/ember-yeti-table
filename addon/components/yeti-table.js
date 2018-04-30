import Component from '@ember/component';
import layout from '../templates/components/yeti-table';
import { computed, defineProperty } from '@ember/object';
import { sort, reads } from '@ember/object/computed';
import { ParentMixin } from 'ember-composability-tools';

export default Component.extend(ParentMixin, {
  layout,

  columns: reads('childComponents.firstObject.columns'),
  filteredData: null,

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
  processedData: reads('orderedData'),

  onColumnSort(prop) {
    let sortProperty = this.get('sortProperty');
    if (sortProperty === prop) {
      let sortDirection = this.get('sortDirection');
      let newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      this.set('sortDirection', newDirection);
    } else {
      this.set('sortProperty', prop);
      this.set('sortDirection', 'asc');
    }
  },

  init() {
    this._super(...arguments);
    defineProperty(this, 'filteredData', computed('data.[]', 'columns.@each.prop', function () {
      return this.get('data');
    }));
  }
});