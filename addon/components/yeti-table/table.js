import Component from '@ember/component';
import layout from '../../templates/components/yeti-table/table';

export default Component.extend({
  layout,
  tagName: 'table',

  onColumnClick(column) {
    if (this.get('onColumnSort')) {
      this.get('onColumnSort')(column);
    }
  }
});
