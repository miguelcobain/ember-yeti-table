import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { Theme } from '../../thead/row/column.gts'
import type Column from '../../thead/row/column.gts'
import type TFootRow from '../row.gts'

export interface TFootCellSignature {
  Args: {
    parent: TFootRow;
    columns: Column[];
    class?: string;
    theme?: Theme;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLTableCellElement;
}

/**
  Renders a `<td>` element and yields for the developer to supply content.

  ```hbs
  <table.tfoot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.tfoot>
  ```
  @class TFootCell
 */
export default class TFootCell extends Component<TFootCellSignature> {
  <template>
    {{#if this.column.visible}}
      <td class='{{@class}} {{@theme.tfootCell}}' ...attributes>
        {{yield}}
      </td>
    {{/if}}
  </template>

  @tracked
  index?: number;

  get column() {
    return this.args.columns[this.index!];
  }

  constructor(owner: unknown, args: TFootCellSignature['Args']) {
    super(owner, args);
    this.index = this.args.parent?.registerCell(this);
  }

  willDestroy() {
    super.willDestroy();
    this.args.parent?.unregisterCell(this);
  }
}
