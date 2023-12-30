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

  @class TBodyRow
  @yield {object} row
  @yield {Component} row.cell - the cell component
*/
// template imports
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import Cell from './row/cell.gjs';

export default class TBodyRow extends Component {
  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <tr
      class='{{@theme.tbodyRow}} {{@theme.row}}'
      {{on 'click' this.handleClick}}
      role={{if @onClick 'button'}}
      ...attributes
    >
      {{yield (hash cell=(component Cell theme=@theme parent=this columns=@columns))}}
    </tr>
  </template>

  /**
   * Adds a click action to the row.
   *
   * @argument onClick
   * @type Function
   */

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

  @action
  handleClick() {
    this.args.onClick?.(...arguments);
  }
}
