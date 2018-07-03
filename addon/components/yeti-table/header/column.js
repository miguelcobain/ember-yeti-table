import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../../templates/components/yeti-table/header/column';

export default Component.extend({
  layout,
  tagName: '',

  orderable: true,
  visible: true,
  filterable: true,
  searchText: '',

  isSorted: computed('sortProperty', 'prop', function() {
    return this.get('sortProperty') === this.get('prop');
  }),

  isAscSorted: computed('isSorted', 'sortDirection', function() {
    return this.get('isSorted') && this.get('sortDirection') === 'asc';
  }),

  isDescSorted: computed('isSorted', 'sortDirection', function() {
    return this.get('isSorted') && this.get('sortDirection') === 'desc';
  }),

  init() {
    this._super(...arguments);
    if (this.get('parent')) {
      this.get('parent').registerColumn(this);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.get('parent')) {
      this.get('parent').unregisterColumn(this);
    }
  }
});
