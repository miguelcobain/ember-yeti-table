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
  @yield {object} header
  @yield {Component} header.column       the column component
*/
class Header extends Component {
  @action
  onColumnClickHeader(column, e) {
    if (this.args.onColumnClick && column.sortable) {
      this.args.onColumnClick(column, e);
    }
  }
}

export default Header;
