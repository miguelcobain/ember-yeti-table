import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { hash } from '@ember/helper';
import type { Theme } from 'ember-yeti-table/components/yeti-table/thead/row/column';
import type Column from 'ember-yeti-table/components/yeti-table/thead/row/column';
import type TBodyRow from 'ember-yeti-table/components/yeti-table/tbody/row';

export interface TBodyCellSignature {
  Args: {
    columns: Column[];
    parent: TBodyRow;
    class?: string;
    theme: Theme;
  };
  Blocks: {
    default: [{
      prop?: string;
    }];
  },
  Element: HTMLTableCellElement;
}

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
export default class TBodyCell extends Component<TBodyCellSignature> {
  <template>
    {{#if this.column.visible}}
      <td class='{{@class}} {{this.column.columnClass}} {{@theme.tbodyCell}}' ...attributes>
        {{yield (hash prop=this.column.prop)}}
      </td>
    {{/if}}
  </template>

  @tracked
  index: number;

  get column(): Column {
    return this.args.columns[this.index] || {} as Column;
  }

  constructor(owner: unknown, args: TBodyCellSignature['Args']) {
    super(owner, args);
    this.index = this.args.parent?.registerCell(this);
  }

  willDestroy() {
    super.willDestroy();
    this.args.parent?.unregisterCell(this);
  }
}
