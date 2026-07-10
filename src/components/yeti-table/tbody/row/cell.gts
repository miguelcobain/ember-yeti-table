import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type Owner from '@ember/owner';

import { hash } from '@ember/helper';

import type { ColumnDefinition, Theme } from '../../../../types.ts';

/**
  @class TBodyCell

  Renders a `<td>` element (if its corresponding column definition has `@visible={{true}}`).
  ```hbs
  <row.cell>
    {{person.firstName}}
  </row.cell>

  If the prop name was used when the column header was defined, it is yielded in a hash
  ```hbs
  <row.cell as |column|>
    {{get person column.prop}}
  </row.cell>
  ```
*/

export interface TBodyCellParent {
  registerCell(cell: TBodyCell): number;
  unregisterCell(cell: TBodyCell): void;
}

export interface TBodyCellSignature {
  Element: HTMLTableCellElement;
  Args: {
    class?: string;
    theme?: Theme;
    parent?: TBodyCellParent;
    columns?: ColumnDefinition[];
  };
  Blocks: { default: [{ prop: string | undefined }] };
}

export default class TBodyCell extends Component<TBodyCellSignature> {
  @tracked
  index: number | undefined;

  get column(): ColumnDefinition {
    return this.args.columns?.[this.index ?? -1] ?? {};
  }

  constructor(owner: Owner, args: TBodyCellSignature['Args']) {
    super(owner, args);
    this.index = this.args.parent?.registerCell(this);
  }

  willDestroy(): void {
    super.willDestroy();
    this.args.parent?.unregisterCell(this);
  }

  <template>
    {{#if this.column.visible}}
      <td
        class="{{@class}} {{this.column.columnClass}} {{@theme.tbodyCell}}"
        ...attributes
      >
        {{yield (hash prop=this.column.prop)}}
      </td>
    {{/if}}
  </template>
}
