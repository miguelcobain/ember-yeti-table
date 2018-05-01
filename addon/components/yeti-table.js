import Component from '@ember/component';
import layout from '../templates/components/yeti-table';
import { computed } from '@ember/object';
import { sort, reads } from '@ember/object/computed';
import { ParentMixin } from 'ember-composability-tools';

export default Component.extend(ParentMixin, {
  layout,

  columns: reads('childComponents.firstObject.columns'),

  filteredData: computed('data.[]', function() {
    // filter logic here
    return this.get('data');
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

  orderedData: sort('filteredData', '_sortDefinition'),

  processedData: reads('orderedData'),

  didInsertParent() {
    this._super(...arguments);
    let props = this.get('columns').mapBy('prop');
    this._observerPaths = props.map((p) => `data.@each.${p}`);
    this._observerPaths.forEach((path) => {
      this.addObserver(path, this, 'scheduleProcessData');
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this._observerPaths.forEach((path) => {
      this.removeObserver(path, this, 'scheduleProcessData');
    });
  },

  scheduleProcessData() {
    this.notifyPropertyChange('filteredData');
  },

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
    this.set('sortDefinition', null);
  }
});
