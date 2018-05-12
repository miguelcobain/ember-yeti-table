import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../../../templates/components/yeti-table/table/header/column';

export default Component.extend({
  layout,
  tagName: 'th',
  classNameBindings: ['isAscSorted:yeti-table-sorted-asc', 'isDescSorted:yeti-table-sorted-desc'],
  orderable: true,

  isSorted: computed('sortIndex', 'columnIndex', function() {
    return this.get('sortIndex') === this.get('columnIndex');
  }),

  isAscSorted: computed('isSorted', 'sortDirection', function() {
    return this.get('isSorted') && this.get('sortDirection') === 'asc';
  }),

  isDescSorted: computed('isSorted', 'sortDirection', function() {
    return this.get('isSorted') && this.get('sortDirection') === 'desc';
  }),

  didInsertElement() {
    this._super(...arguments);
    let index = [...this.element.parentNode.querySelectorAll('th')].indexOf(this.element);
    this.set('columnIndex', index);
  },

  click() {
    this.get('onClick')(this, ...arguments);
  }
});
