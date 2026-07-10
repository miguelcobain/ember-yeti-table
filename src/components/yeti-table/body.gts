import { action } from '@ember/object';
import Component from '@glimmer/component';

import { fn, get, hash } from '@ember/helper';

import type { WithBoundArgs } from '@glint/template';

import TBodyRow from './tbody/row.gts';
import type {
  ColumnDefinition,
  Row,
  RowClickHandler,
  Theme,
} from '../../types.ts';

/**
  Renders a `<tbody>` element and yields the row component, row data and index.

  @class Body
*/

export interface BodySignature {
  Element: HTMLTableSectionElement;
  Args: {
    theme?: Theme;
    data?: Row[];
    columns?: ColumnDefinition[];
    onRowClick?: RowClickHandler;
  };
  Blocks: {
    default: [
      { row: WithBoundArgs<typeof TBodyRow, 'theme' | 'onClick' | 'columns'> },
      Row,
      number,
    ];
  };
}

export default class Body extends Component<BodySignature> {
  @action
  handleRowClick(rowData: Row): void {
    this.args.onRowClick?.(rowData);
  }

  asContent = (value: unknown): string => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  };

  <template>
    <tbody class={{@theme.tbody}} ...attributes>
      {{#if (has-block)}}

        {{#each @data as |rowData index|}}
          {{yield
            (hash
              row=(component
                TBodyRow theme=@theme onClick=@onRowClick columns=@columns
              )
            )
            rowData
            index
          }}
        {{/each}}

      {{else}}

        {{#each @data as |rowData|}}
          <TBodyRow
            @theme={{@theme}}
            @onClick={{if @onRowClick (fn this.handleRowClick rowData)}}
            @columns={{@columns}}
            as |row|
          >

            {{#each @columns as |column|}}
              <row.cell @class={{column.columnClass}}>
                {{#if column.prop}}
                  {{this.asContent (get rowData column.prop)}}
                {{else}}
                  {{this.asContent rowData}}
                {{/if}}
              </row.cell>
            {{/each}}
          </TBodyRow>
        {{/each}}
      {{/if}}
    </tbody>
  </template>
}
