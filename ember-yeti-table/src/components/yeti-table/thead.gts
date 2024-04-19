import type { TOC } from '@ember/component/template-only';
import { hash } from '@ember/helper';
import THead from './thead/row.gts';
import type { Theme } from './thead/row/column.gts';
import type { WithBoundArgs } from '@glint/template';
import type Column from './thead/row/column.gts';

export interface THeadSignature {
  Args: {
    theme: Theme;
    sortable: boolean;
    sortSequence: string[];
    onColumnClick: (column: Column,e: MouseEvent) => void;
    columns: Column[];
    parent: unknown;
  },
  Blocks: {
    default: [{
      row: WithBoundArgs<typeof THead, 'sortable' | 'sortSequence' | 'onColumnClick' | 'columns' | 'theme' | 'parent'>;
    }]
  },
  Element: HTMLTableSectionElement;
}


/**
  Renders a `<thead>` element and yields the row component.

  ```hbs
  <table.thead as |head|>
    <head.row as |row|>
      <row.column @prop="firstName" as |column|>
        First name
        {{if column.isAscSorted "(sorted asc)"}}
        {{if column.isDescSorted "(sorted desc)"}}
      </row.column>
    </head.row>
  </table.thead>
  ```

  @class THead
  @yield {object} head
  @yield {Component} head.row
*/
const thead: TOC<THeadSignature> = <template>
  <thead class={{@theme.thead}} ...attributes>
    {{yield
      (hash
        row=(component
          THead
          sortable=@sortable
          sortSequence=@sortSequence
          onColumnClick=@onColumnClick
          columns=@columns
          theme=@theme
          parent=@parent
        )
      )
    }}
  </thead>
</template>;

export default thead;
