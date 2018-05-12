import Component from '@ember/component';
import layout from '../../../templates/components/yeti-table/table/header';
import { ParentMixin, ChildMixin } from 'ember-composability-tools';

export default Component.extend(ParentMixin, ChildMixin, {
  layout,
  tagName: '',

  actions: {
    onColumnClick(column, e) {
      if (this.get('onColumnClick') && column.get('orderable')) {
        let el = e.currentTarget;
        let index = [...el.parentNode.querySelectorAll('th')].indexOf(el);
        this.get('onColumnClick')(index, e);
      }
    }
  }
});
