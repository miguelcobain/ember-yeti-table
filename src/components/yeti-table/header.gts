import { action } from '@ember/object';
import Component from '@glimmer/component';

import { hash } from '@ember/helper';

import type { WithBoundArgs } from '@glint/template';

import Column from './thead/row/column.gts';
import type { ColumnParent } from './thead/row/column.gts';
import type { ColumnDefinition, SortDirection, Theme } from '../../types.ts';

/**
  Renders a `<thead>` element and yields the column component.

  @class Header
*/

export interface HeaderSignature {
  Element: HTMLTableSectionElement;
  Args: {
    trClass?: string;
    theme?: Theme;
    sortable?: boolean;
    sortSequence?: SortDirection[] | string;
    columns?: ColumnDefinition[];
    onColumnClick?: (column: Column, e: MouseEvent) => void;
    parent?: ColumnParent;
  };
  Blocks: {
    default: [
      {
        column: WithBoundArgs<
          typeof Column,
          'sortable' | 'sortSequence' | 'onClick' | 'parent' | 'theme'
        >;
      },
    ];
  };
}

export default class Header extends Component<HeaderSignature> {
  @action
  onColumnClickHeader(column: Column, e: MouseEvent): void {
    if (this.args.onColumnClick && column.sortable) {
      this.args.onColumnClick(column, e);
    }
  }

  <template>
    <thead class={{@theme.thead}} ...attributes>
      <tr class="{{@trClass}} {{@theme.theadRow}} {{@theme.row}}">
        {{yield
          (hash
            column=(component
              Column
              sortable=@sortable
              sortSequence=@sortSequence
              onClick=this.onColumnClickHeader
              parent=@parent
              theme=@theme
            )
          )
        }}
      </tr>
    </thead>
  </template>
}
