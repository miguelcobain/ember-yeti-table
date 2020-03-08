import { tagName, layout } from '@ember-decorators/component';
import { A } from '@ember/array';
import Component from '@ember/component';

import template from './template';

/**
  Renders a `<tr>` element and yields the column and cell component.
  ```hbs
  <table.thead as |head|>
    <head.row as |row|>
      <row.column @prop="firstName" as |column|>
        First name
        {{if column.isAscSorted "(sorted asc)"}}
        {{if column.isDescSorted "(sorted desc)"}}
      </head.column>
    </head.row>
  </table.thead>
  ```

  @yield {Component} column
  @yield {Component} cell
*/
@tagName('')
@layout(template)
class THeadRow extends Component {
  theme;

  parent;

  columns;

  sortable = true;

  sort = null;

  sortSequence;

  onColumnClick;

  cells = A();

  registerCell(cell) {
    let columns = this.get('columns');
    let prop = cell.get('prop');

    if (prop) {
      let column = columns.findBy('prop', prop);
      cell.set('column', column);
    } else {
      let index = this.get('cells.length');
      let column = columns[index];
      cell.set('column', column);
    }

    this.get('cells').addObject(cell);
  }

  unregisterCell(cell) {
    this.get('cells').removeObject(cell);
  }
}

export default THeadRow;
