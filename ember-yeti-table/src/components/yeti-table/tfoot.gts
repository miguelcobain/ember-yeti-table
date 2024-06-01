import { hash } from '@ember/helper';
import TFootRow from './tfoot/row.gts';
import type { Theme } from './thead/row/column.gts';
import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import type Column from './thead/row/column.gts';

export interface TFootSignature {
  Element: HTMLTableSectionElement;
  Args: {
    theme: Theme;
    columns: Column[];
  };
  Blocks: {
    default: [
      {
        row: WithBoundArgs<typeof TFootRow, 'columns' | 'theme'>;
      }
    ]
  }
}

/**
  Renders a `<tfoot>` element and yields the row component.
  ```hbs
  <table.tfoot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.tfoot>
  ```

  @class TTFoot
  @yield {object} footer
  @yield {Component} footer.row
*/

const tfoot : TOC<TFootSignature> =  <template>
    <tfoot class={{@theme.tfoot}} ...attributes>
      {{yield (hash row=(component TFootRow columns=@columns theme=@theme))}}
    </tfoot>
  </template>

export default tfoot;
