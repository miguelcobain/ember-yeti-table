import { action } from '@ember/object';

import Component from '@glimmer/component';

/**
  Renders a `<tr>` element and yields the cell component.
  ```hbs
  <body.row as |row|>
    <row.cell>
      {{person.firstName}} #{{index}}
    </row.cell>
    <row.cell>
      {{person.lastName}}
    </row.cell>
    <row.cell>
      {{person.points}}
    </row.cell>
  </body.row>
  ```
  Remember you can customize each `<tr>` class or `@onClick` handler based on the row data
  because you have access to it from the body component.

  ```hbs
  <table.body as |body person|>
    <body.row class={{if person.isInvalid "error"}} as |row|>
      <row.cell>
        {{person.firstName}}
      </row.cell>
      <row.cell>
        {{person.lastName}}
      </row.cell>
      <row.cell>
        {{person.points}}
      </row.cell>
    </body.row>
  </table.body>
  ```

  @yield {object} row
  @yield {Component} row.cell - the cell component
*/
class TBodyRow extends Component {
  /**
   * Adds a click action to the row.
   *
   * @argument onClick
   * @type Function
   */

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

  @action
  handleClick() {
    this.args.onClick?.(...arguments);
  }
}

export default TBodyRow;
