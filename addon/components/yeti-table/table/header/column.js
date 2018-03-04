import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../../../templates/components/yeti-table/table/header/column';
import { ChildMixin } from 'ember-composability-tools';

export default Component.extend(ChildMixin, {
  layout,
  tagName: '',
  orderable: true,
  searchable: true,
  visible: true,

  isSorted: computed('sortProperty', 'prop', function() {
    return this.get('sortProperty') === this.get('prop');
  }),

  isAscSorted: computed('isSorted', 'sortDirection', function() {
    return this.get('isSorted') && this.get('sortDirection') === 'asc';
  }),

  isDescSorted: computed('isSorted', 'sortDirection', function() {
    return this.get('isSorted') && this.get('sortDirection') === 'desc';
  })
});
