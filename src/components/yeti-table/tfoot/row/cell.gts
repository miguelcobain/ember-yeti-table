import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type Owner from '@ember/owner';

import type { ColumnDefinition, Theme } from '../../../../types.ts';

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

export interface TFootCellParent {
  registerCell(cell: TFootCell): number;
  unregisterCell(cell: TFootCell): void;
}

export interface TFootCellSignature {
  Element: HTMLTableCellElement;
  Args: {
    class?: string;
    theme?: Theme;
    parent?: TFootCellParent;
    columns?: ColumnDefinition[];
  };
  Blocks: { default: [] };
}

export default class TFootCell extends Component<TFootCellSignature> {
  @tracked
  index: number | undefined;

  get column(): ColumnDefinition | undefined {
    return this.args.columns?.[this.index ?? -1];
  }

  constructor(owner: Owner, args: TFootCellSignature['Args']) {
    super(owner, args);

    this.index = this.args.parent?.registerCell(this);
  }

  willDestroy(): void {
    super.willDestroy();
    this.args.parent?.unregisterCell(this);
  }

  <template>
    {{#if this.column.visible}}
      <td class="{{@class}} {{@theme.tfootCell}}" ...attributes>
        {{yield}}
      </td>
    {{/if}}
  </template>
}
