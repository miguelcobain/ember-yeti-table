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

export default class TFootRow extends Component {
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
