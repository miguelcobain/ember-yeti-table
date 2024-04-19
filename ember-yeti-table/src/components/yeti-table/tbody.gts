import { hash } from '@ember/helper';
import TBodyRow from './tbody/row.gts';
import type { TOC } from '@ember/component/template-only';
import type { Theme } from './thead/row/column.gts';
import type Column from './thead/row/column.gts';
import type { TableData } from './body.gts';
import type { WithBoundArgs } from '@glint/template';

export interface TBodySignature {
  Args: {
    theme: Theme;
    onRowClick: (rowData: TableData) => void;
    columns: Column[];
    data: TableData[];
  };
  Blocks: {
    default: [
      {
        row: WithBoundArgs<typeof TBodyRow, 'onClick' | 'columns' | 'theme'>;
      },
      TableData[]
    ]
  };
  Element: HTMLTableSectionElement;
}

/**
  Renders a `<tbody>` element and yields the row component and data. You must iterate each row
  ```hbs
  <table.tbody as |body data|>
    {{#each data as |person index|}}
      <body.row as |row|>
        <row.cell>
          {{person.firstName}} #{{index}}
        </row.cell>
        <row.cell>
          {{person.lastName}}
        </row.cell>
        <row.cell>
          {{person.points}}
        </row.cell>
      </body.row>
    {{/each}}
  </table.tbody>
  ```
  Remember that you must perform the {{#each}} to iterate over the `@data` array.

 This component does not provide a blockless variation

  @class TBody
  @yield {object} body
  @yield {Component} body.row - the row component
  @yield {Array} data
*/

const tBody: TOC<TBodySignature> = <template>
  <tbody class={{@theme.tbody}} ...attributes>
    {{yield (hash row=(component TBodyRow theme=@theme onClick=@onRowClick columns=@columns)) @data}}
  </tbody>
</template>


export default tBody;
