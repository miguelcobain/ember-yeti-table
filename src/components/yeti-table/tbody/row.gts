import { action } from '@ember/object';
import Component from '@glimmer/component';

import { hash } from '@ember/helper';
import { on } from '@ember/modifier';

import type { WithBoundArgs } from '@glint/template';

import Cell from './row/cell.gts';
import type {
  ColumnDefinition,
  RowClickHandler,
  Theme,
} from '../../../types.ts';

/**
  Renders a `<tr>` element and yields the cell component.

  @class TBodyRow
  @yield {object} row
  @yield {Component} row.cell - the cell component
*/

interface TBodyCellLike {
  index?: number;
}

export interface TBodyRowSignature {
  Element: HTMLTableRowElement;
  Args: {
    theme?: Theme;
    columns?: ColumnDefinition[];
    onClick?: RowClickHandler;
  };
  Blocks: {
    default: [
      { cell: WithBoundArgs<typeof Cell, 'theme' | 'parent' | 'columns'> },
    ];
  };
}

export default class TBodyRow extends Component<TBodyRowSignature> {
  cells: TBodyCellLike[] = [];

  registerCell(cell: TBodyCellLike): number {
    const index = this.cells.length;
    this.cells.push(cell);
    return index;
  }

  unregisterCell(cell: TBodyCellLike): void {
    const cells = this.cells;
    const index = cells.indexOf(cell);

    cells.splice(index, 1);
  }

  @action
  handleClick(event: MouseEvent): void {
    this.args.onClick?.(event);
  }

  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <tr
      class="{{@theme.tbodyRow}} {{@theme.row}}"
      {{on "click" this.handleClick}}
      role={{if @onClick "button"}}
      ...attributes
    >
      {{yield
        (hash cell=(component Cell theme=@theme parent=this columns=@columns))
      }}
    </tr>
  </template>
}
