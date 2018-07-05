import Component from '@ember/component';
import { A } from '@ember/array';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, optional, arrayOf } from '@ember-decorators/argument/type';
import { Action } from '@ember-decorators/argument/types';

import layout from './template';

@tagName('tr')
export default class Row extends Component {
  layout = layout;

  @argument
  @required
  @type(arrayOf(Component))
  columns;

  @argument
  @type(optional(Action))
  onClick;

  init() {
    super.init(...arguments);
    this.set('cells', A());
  }

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
  }

  unregisterCell(cell) {
    this.get('cells').removeObject(cell);
  }

  click() {
    if (this.get('onClick')) {
      this.get('onClick')(...arguments);
    }
  }
}
