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
      </row.column>
    </head.row>
  </table.thead>
  ```

  @class THeadRow
  @yield {Component} column
  @yield {Component} cell
*/

import Column, { type Theme } from './row/column.gts';
import Cell from './row/cell.gts';
import { hash } from '@ember/helper';
import type { WithBoundArgs } from '@glint/template';
import type YetiTable from '../../yeti-table.gts';

export interface THeadRowSignature {
  Args: {
    columns: Column[];
    sortable: boolean;
    sortSequence: string[];
    onColumnClick: (column: Column,e: MouseEvent) => void;
    theme: Theme;
    parent: YetiTable;
    trClass: string;
  };
  Blocks: {
    default: [{
      column: WithBoundArgs<typeof Column, 'sortable' | 'sortSequence' | 'onClick' | 'theme' | 'parent'>;
      cell: WithBoundArgs<typeof Cell, 'theme' | 'parent'>;
    }];
  };
  Element: HTMLTableRowElement;
}

export default class THeadRow extends Component<THeadRowSignature> {
  <template>
    <tr class='{{@trClass}} {{@theme.theadRow}} {{@theme.row}}' ...attributes>
      {{yield
        (hash
          column=(component
            Column sortable=@sortable sortSequence=@sortSequence onClick=@onColumnClick theme=@theme parent=@parent
          )
          cell=(component Cell theme=@theme parent=this)
        )
      }}
    </tr>
  </template>

  cells: Cell[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerCell(_cell: Cell) {
    let column;
    // never seems to have a cell.prop param
    // if (cell.prop) {
    //   column = this.args.columns.findBy('prop', cell.prop);
    //   cell.column = column;
    // } else {
    let index = this.cells.length;
    column = this.args.columns[index];

    return column;
  }

  unregisterCell(cell: Cell) {
    let cells = this.cells;
    let index = cells.indexOf(cell);

    cells.splice(index, 1);
  }
}
