import Component from '@glimmer/component';

/**
  Renders a `<tr>` element and yields cell component.
  ```hbs
  <table.tfoot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.tfoot>
  ```

  @class TFootRow
  @yield {object} row
  @yield {Component} row.cell
*/

import { hash } from '@ember/helper';
import Cell from 'ember-yeti-table/components/yeti-table/tfoot/row/cell';

export default class TFootRow extends Component {
  <template>
    <tr class='{{@class}} {{@theme.tfootRow}} {{@theme.row}}' ...attributes>
      {{yield (hash cell=(component Cell theme=@theme parent=this columns=@columns))}}
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
