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

  @yield {object} row
  @yield {Component} row.cell
*/

export default class TFootRow extends Component {
  cells = [];
  registerCell(cell) {
    let columns = this.args.columns;
    let index = this.cells.length;
    let column = columns[index];
    this.cells.push(cell);
    return column;
  }

  unregisterCell(cell) {
    let cells = this.cells;
    let index = cells.indexOf(cell);
    cells.splice(index, 1);
  }
}
