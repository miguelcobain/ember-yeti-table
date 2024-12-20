import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

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
          {{on "input"
            (pipe
              (pick "target.value")
              (fn (mut this.lastNameFilter))
            )
          }}
          >
      </row.cell>
    </head.row>
  </table.thead>
  ```

  @class THeadCell
  @yield {object} cell

 */
export default class THeadCell extends Component {
  <template>
    {{#if this.column.visible}}
      <th class='{{@class}} {{@theme.theadCell}}' ...attributes>
        {{yield}}
      </th>
    {{/if}}
  </template>

  @tracked
  index;

  get column() {
    return this.args.prop ?
      this.args.columns.find((column) => column.prop === this.args.prop) :
      this.args.columns[this.index];
  }

  constructor() {
    super(...arguments);

    this.index = this.args.parent?.registerCell(this);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.args.parent?.unregisterCell(this);
  }
}
