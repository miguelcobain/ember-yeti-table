import { action } from '@ember/object';

import Component from '@glimmer/component';

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

import THead from 'ember-yeti-table/components/yeti-table/thead/row/column';
import { fn, hash } from '@ember/helper';

export default class Header extends Component {
  <template>
    <thead class={{@theme.thead}} ...attributes>
      <tr class='{{@trClass}} {{@theme.theadRow}} {{@theme.row}}'>
        {{yield
          (hash
            column=(component
              THead
              sortable=@sortable
              sortSequence=@sortSequence
              onClick=(fn this.onColumnClickHeader)
              parent=@parent
              theme=@theme
            )
          )
        }}
      </tr>
    </thead>
  </template>
  @action
  onColumnClickHeader(column, e) {
    if (this.args.onColumnClick && column.sortable) {
      this.args.onColumnClick(column, e);
    }
  }
}
