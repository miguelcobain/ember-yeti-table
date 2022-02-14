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
      </head.column>
    </head.row>
  </table.thead>
  ```

  @yield {Component} column
  @yield {Component} cell
*/
class THeadRow extends Component {
  cells = [];

  registerCell(cell) {
    let column;

    if (cell.prop) {
      column = this.args.columns.findBy('prop', cell.prop);
      cell.column = column;
    } else {
      let index = this.cells.length;
      column = this.args.columns[index];

      return column;
    }

    this.cells.push(cell);

    return column;
  }

  unregisterCell(cell) {
    let cells = this.cells;
    let index = cells.indexOf(cell);

    cells.splice(index, 1);
  }
}

export default THeadRow;
