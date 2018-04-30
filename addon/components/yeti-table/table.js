import Component from '@ember/component';
import layout from '../../templates/components/yeti-table/table';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { ParentMixin, ChildMixin } from 'ember-composability-tools';

export default Component.extend(ParentMixin, ChildMixin, {
  layout,
  tagName: 'table',

  headerComponent: computed('childComponents.@each._isHeader', function() {debugger;
    return this.get('childComponents').findBy('_isHeader');
  }),

  columns: reads('headerComponent.childComponents'),

  bodyComponent: computed('childComponents.@each._isBody', function() {
    return this.get('childComponents').findBy('_isBody');
  }),

  onColumnClick(e) {
    if (this.get('onColumnSort')) {
      let el = e.target;
      let index = [...el.parentNode.children].indexOf(el);
      let column = this.get('columns').objectAt(index);
      let prop = column.get('prop');
      let orderable = column.get('orderable');
      if (orderable && prop) {
        this.get('onColumnSort')(prop, index, column);
      }
    }
  }
});
