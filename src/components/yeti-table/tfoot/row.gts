import Component from '@glimmer/component';

import { hash } from '@ember/helper';

import type { WithBoundArgs } from '@glint/template';

import Cell from './row/cell.gts';
import type { ColumnDefinition, Theme } from '../../../types.ts';

/**
  Renders a `<tr>` element and yields cell component.

  @class TFootRow
  @yield {object} row
  @yield {Component} row.cell
*/

interface TFootCellLike {
  index?: number;
}

export interface TFootRowSignature {
  Element: HTMLTableRowElement;
  Args: {
    class?: string;
    theme?: Theme;
    columns?: ColumnDefinition[];
    parent?: unknown;
  };
  Blocks: {
    default: [
      { cell: WithBoundArgs<typeof Cell, 'theme' | 'parent' | 'columns'> },
    ];
  };
}

export default class TFootRow extends Component<TFootRowSignature> {
  cells: TFootCellLike[] = [];

  registerCell(cell: TFootCellLike): number {
    const index = this.cells.length;
    this.cells.push(cell);
    return index;
  }

  unregisterCell(cell: TFootCellLike): void {
    const cells = this.cells;
    const index = cells.indexOf(cell);
    cells.splice(index, 1);
  }

  <template>
    <tr class="{{@class}} {{@theme.tfootRow}} {{@theme.row}}" ...attributes>
      {{yield
        (hash cell=(component Cell theme=@theme parent=this columns=@columns))
      }}
    </tr>
  </template>
}
