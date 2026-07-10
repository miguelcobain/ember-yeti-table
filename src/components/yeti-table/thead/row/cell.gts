import Component from '@glimmer/component';
import type Owner from '@ember/owner';

import type { ColumnDefinition, Theme } from '../../../../types.ts';

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
export interface THeadCellParent {
  registerCell(cell: THeadCell): ColumnDefinition | undefined;
  unregisterCell(cell: THeadCell): void;
}

export interface THeadCellSignature {
  Element: HTMLTableCellElement;
  Args: {
    class?: string;
    theme?: Theme;
    parent?: THeadCellParent;
    prop?: string;
  };
  Blocks: { default: [] };
}

export default class THeadCell extends Component<THeadCellSignature> {
  // Assigned when the cell is registered
  column: ColumnDefinition | undefined = undefined;

  constructor(owner: Owner, args: THeadCellSignature['Args']) {
    super(owner, args);
    this.column = this.args.parent?.registerCell(this);
  }

  willDestroy(): void {
    super.willDestroy();
    this.args.parent?.unregisterCell(this);
  }

  get prop(): string | undefined {
    return this.args.prop;
  }

  <template>
    {{#if this.column.visible}}
      <th class="{{@class}} {{@theme.theadCell}}" ...attributes>
        {{yield}}
      </th>
    {{/if}}
  </template>
}
