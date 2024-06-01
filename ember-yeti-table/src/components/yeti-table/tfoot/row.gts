import Component from '@glimmer/component';
import type { Theme } from '../thead/row/column.gts'
import Cell from './row/cell.gts'
import { hash } from '@ember/helper';
import type { WithBoundArgs } from '@glint/template';
import type Column from '../thead/row/column.gts'

export interface TFootRowSignature {
  Args: {
    class?: string;
    theme?: Theme;
    columns: Column[];
  };
  Blocks: {
    default: [{
      cell: WithBoundArgs<typeof Cell, 'theme' | 'columns' | 'parent'>;
    }];
  };
  Element: HTMLTableRowElement;
}

/**
  Renders a `<tr>` element and yields cell component.
  ```hbs
  <table.tfoot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.tfoot>
  ```

  @class TFootRow
  @yield {object} row
  @yield {Component} row.cell
*/
export default class TFootRow extends Component<TFootRowSignature> {
  <template>
    <tr class='{{@class}} {{@theme.tfootRow}} {{@theme.row}}' ...attributes>
      {{yield (hash cell=(component Cell theme=@theme parent=this columns=@columns))}}
    </tr>
  </template>

  cells: Cell[] = [];

  registerCell(cell: Cell) {
    let index = this.cells.length;
    this.cells.push(cell);
    return index;
  }

  unregisterCell(cell: Cell) {
    let cells = this.cells;
    let index = cells.indexOf(cell);
    cells.splice(index, 1);
  }
}
