import Component from '@glimmer/component';
import Column from './column.gts'
import type THeadRow from '../row.gts'
import type { Theme } from './column.gts'

export interface THeadCellSignature {
  Args: {
    parent?: THeadRow;
    class?: string;
    theme?: Theme;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLTableCellElement;
}

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
export default class THeadCell extends Component<THeadCellSignature> {
  private column?: Column;

  constructor(owner: unknown, args: THeadCellSignature['Args']) {
    super(owner, args);
    this.column = args.parent?.registerCell(this);
  }

  willDestroy() {
    super.willDestroy();
    this.args.parent?.unregisterCell(this);
  }

  <template>
    {{#if this.column.visible}}
      <th class='{{@class}} {{@theme.theadCell}}' ...attributes>
        {{yield}}
      </th>
    {{/if}}
  </template>
}
