import type { TemplateOnlyComponent } from '@ember/component/template-only';

import { hash } from '@ember/helper';

import type { WithBoundArgs } from '@glint/template';

import THeadRow from './thead/row.gts';
import type Column from './thead/row/column.gts';
import type { ColumnParent } from './thead/row/column.gts';
import type { ColumnDefinition, SortDirection, Theme } from '../../types.ts';

/**
  Renders a `<thead>` element and yields the row component.

  @class THead
  @yield {object} head
  @yield {Component} head.row
*/

export interface THeadSignature {
  Element: HTMLTableSectionElement;
  Args: {
    theme?: Theme;
    sortable?: boolean;
    sortSequence?: SortDirection[] | string;
    onColumnClick?: (column: Column, e: MouseEvent) => void;
    columns: ColumnDefinition[];
    parent?: ColumnParent;
  };
  Blocks: {
    default: [
      {
        row: WithBoundArgs<
          typeof THeadRow,
          | 'sortable'
          | 'sortSequence'
          | 'onColumnClick'
          | 'columns'
          | 'theme'
          | 'parent'
        >;
      },
    ];
  };
}

const THeadComponent: TemplateOnlyComponent<THeadSignature> = <template>
  <thead class={{@theme.thead}} ...attributes>
    {{yield
      (hash
        row=(component
          THeadRow
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

export default THeadComponent;
