import Component from '@ember/component';
import { A } from '@ember/array';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { optional, unionOf, arrayOf } from '@ember-decorators/argument/types';
import { Action } from '@ember-decorators/argument/types';

import layout from './template';

/**
  Renders a `<tr>` element and yields the column and cell component.
  ```hbs
  <table.head as |head|>
    <head.row as |row|>
      <row.column @prop="firstName" as |column|>
        First name
        {{if column.isAscSorted "(sorted asc)"}}
        {{if column.isDescSorted "(sorted desc)"}}
      </head.column>
    </head.row>
  </table.head>
  ```

  @yield {Component} column
  @yield {Component} cell
*/
@tagName('')
class Row extends Component {
  layout = layout;

  @argument('object')
  theme;

  @argument(Component)
  parent;

  @argument(arrayOf(Component))
  columns;

  @argument('boolean')
  sortable = true;

  @argument(optional('string'))
  sort = null;

  @argument(unionOf('string', arrayOf('string')))
  sortSequence;

  @argument(Action)
  onColumnClick;

  @argument(optional('boolean'))
  useSortIndicator = false;

  cells = A();

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

}

export default Row;
