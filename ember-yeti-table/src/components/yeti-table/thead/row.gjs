import Component from '@glimmer/component';

/**
  Renders a `<tr>` element and yields the column and cell component.
  ```hbs
  <table.thead as |head|>
    <head.row as |row|>
      <row.column @prop="firstName" as |column|>
        First name
        {{if column.isAscSorted "(sorted asc)"}}
        {{if column.isDescSorted "(sorted desc)"}}
      </row.column>
    </head.row>
  </table.thead>
  ```

  @class THeadRow
  @yield {Component} column
  @yield {Component} cell
*/

import Column from './row/column.gjs';
import Cell from './row/cell.gjs';
import { hash } from '@ember/helper';

export default class THeadRow extends Component {
  <template>
    <tr class='{{@trClass}} {{@theme.theadRow}} {{@theme.row}}' ...attributes>
      {{yield
        (hash
          column=(component
            Column sortable=@sortable sortSequence=@sortSequence onClick=@onColumnClick theme=@theme parent=@parent
          )
          cell=(component Cell theme=@theme parent=this columns=@columns)
        )
      }}
    </tr>
  </template>

  cells = [];

  registerCell(cell) {
    let index = this.cells.length;
    this.cells.push(cell);
    return index;
  }

  unregisterCell(cell) {
    let cells = this.cells;
    let index = cells.indexOf(cell);
    cells.splice(index, 1);
  }
}
