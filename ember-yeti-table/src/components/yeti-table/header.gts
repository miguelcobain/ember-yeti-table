import { action } from '@ember/object';
import THead, { type Theme } from './thead/row/column.gts';
import { hash } from '@ember/helper';
import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import type Column from './thead/row/column.gts';
import type YetiTable from '../yeti-table.gts';

export interface HeaderSignature {
  Args: {
    sortable?: boolean;
    sortSequence?: string[];
    onColumnClick?: (column: Column, e: MouseEvent) => void;
    parent: YetiTable;
    theme: Theme;
    trClass?: string;
  };
  Blocks: {
    default: [
      {
        column: WithBoundArgs<typeof THead, 'sortable' | 'sortSequence' | 'onClick' | 'parent' | 'theme'>;
      }
    ]
  };
  Element: HTMLTableSectionElement;
}

/**
  Renders a `<thead>` element and yields the column component.
  ```hbs
  <table.header as |header|>
    <header.column @prop="firstName">
      First name
    </header.column>
    <header.column @prop="lastName">
      Last name
    </header.column>
    <header.column @prop="points">
      Points
    </header.column>
  </table.header>
  ```

  @class Header
  @yield {object} header
  @yield {Component} header.column       the column component
*/
export default class Header extends Component<HeaderSignature> {
  <template>
    <thead class={{@theme.thead}} ...attributes>
      <tr class='{{@trClass}} {{@theme.theadRow}} {{@theme.row}}'>
        {{yield
          (hash
            column=(component
              THead
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

  @action
  onColumnClickHeader(column: Column, e: MouseEvent) {
    if (this.args.onColumnClick && column.sortable) {
      this.args.onColumnClick(column, e);
    }
  }
}
