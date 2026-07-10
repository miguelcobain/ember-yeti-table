import Component from '@glimmer/component';

import { hash } from '@ember/helper';

import type { WithBoundArgs } from '@glint/template';

import Column from './row/column.gts';
import type { ColumnParent } from './row/column.gts';
import Cell from './row/cell.gts';
import type { ColumnDefinition, SortDirection, Theme } from '../../../types.ts';

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

interface THeadCellLike {
  prop?: string;
  column?: ColumnDefinition;
}

export interface THeadRowSignature {
  Element: HTMLTableRowElement;
  Args: {
    trClass?: string;
    theme?: Theme;
    sortable?: boolean;
    sortSequence?: SortDirection[] | string;
    onColumnClick?: (column: Column, e: MouseEvent) => void;
    columns: ColumnDefinition[];
    parent?: ColumnParent;
  };
  Blocks: {
    default: [
      {
        column: WithBoundArgs<
          typeof Column,
          'sortable' | 'sortSequence' | 'onClick' | 'theme' | 'parent'
        >;
        cell: WithBoundArgs<typeof Cell, 'theme' | 'parent'>;
      },
    ];
  };
}

export default class THeadRow extends Component<THeadRowSignature> {
  cells: THeadCellLike[] = [];

  registerCell(cell: THeadCellLike): ColumnDefinition | undefined {
    let column: ColumnDefinition | undefined;

    if (cell.prop) {
      column = this.args.columns.find((c) => c.prop === cell.prop);
      cell.column = column;
    } else {
      const index = this.cells.length;
      column = this.args.columns[index];

      return column;
    }

    this.cells.push(cell);

    return column;
  }

  unregisterCell(cell: THeadCellLike): void {
    const cells = this.cells;
    const index = cells.indexOf(cell);

    cells.splice(index, 1);
  }

  <template>
    <tr class="{{@trClass}} {{@theme.theadRow}} {{@theme.row}}" ...attributes>
      {{yield
        (hash
          column=(component
            Column
            sortable=@sortable
            sortSequence=@sortSequence
            onClick=@onColumnClick
            theme=@theme
            parent=@parent
          )
          cell=(component Cell theme=@theme parent=this)
        )
      }}
    </tr>
  </template>
}
