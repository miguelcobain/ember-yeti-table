import Component from '@ember/component';
import layout from '../../../../templates/components/yeti-table/table/body/row';

export default Component.extend({
  layout,
  tagName: 'tr',

  click() {
    if (this.get('onClick')) {
      this.get('onClick')(...arguments);
    }
  }
});
