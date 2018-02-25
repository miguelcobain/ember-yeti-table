import Component from '@ember/component';
import layout from '../templates/components/yeti-table';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { sort, reads } from '@ember/object/computed';

export default Component.extend({
  layout,

  sortProperty: null,
  sortDirection: 'asc',
  sortDefinition: computed('sortProperty', 'sortDirection', function() {
    let defs = [];
    if (this.get('sortProperty')) {
      defs.push(`${this.get('sortProperty')}:${this.get('sortDirection')}`);
    }
    return defs;
  }),

  orderedData: sort('data', 'sortDefinition'),
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
  }
});
