import Component from '@ember/component';
import { A } from '@ember/array';
import layout from '../../../../templates/components/yeti-table/table/body/row';

export default Component.extend({
  layout,
  tagName: 'tr',

  init() {
    this._super(...arguments);
    this.set('cells', A());
  },

  registerCell(cell) {
    let columns = this.get('columns');
    let prop = cell.get('prop');

    if (prop) {
      let column = columns.findBy('prop', prop);
      cell.set('column', column);
    } else {
      let index = this.get('cells.length');
      let column = columns.objectAt(index);
      cell.set('column', column);
    }

    this.get('cells').addObject(cell);
  },

  unregisterCell(cell) {
    this.get('cells').removeObject(cell);
  },

  click() {
    if (this.get('onClick')) {
      this.get('onClick')(...arguments);
    }
  }
});
