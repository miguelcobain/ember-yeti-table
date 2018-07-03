import Component from '@ember/component';
import layout from '../../../../templates/components/yeti-table/body/row/cell';

export default Component.extend({
  layout,
  tagName: '',

  init() {
    this._super(...arguments);
    if (this.get('parent')) {
      this.get('parent').registerCell(this);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.get('parent')) {
      this.get('parent').unregisterCell(this);
    }
  }
});
