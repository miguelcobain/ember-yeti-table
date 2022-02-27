import Component from '@glimmer/component';

/**
  An component yielded from the head.row component that is used to define
  a cell in a row of the head of the table. Would be used for filters or any other
  additional information in the table head for a column

  ```hbs
  <table.thead as |head|>
    <head.row as |row|>
      <row.cell>
        <input
          class="input" type="search" placeholder="Search last name"
          value={{this.lastNameFilter}}
          oninput={{action (mut this.lastNameFilter) value="target.value"}}>
      </row.cell>
    </head.row>
  </table.thead>
  ```

  @yield {object} cell

 */
export default class THeadCell extends Component {
  // Assigned when the cell is registered
  column = undefined;

  constructor() {
    super(...arguments);
    this.column = this.args.parent?.registerCell(this);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.args.parent?.unregisterCell(this);
  }
}
