import Component from '@ember/component';
import layout from '../../../templates/components/yeti-table/table/header';

export default Component.extend({
  layout,
  tagName: 'thead',

  actions: {
    onColumnClick(column, e) {
      if (this.get('onColumnClick') && column.get('orderable')) {
        this.get('onColumnClick')(column, e);
      }
    }
  }
});
