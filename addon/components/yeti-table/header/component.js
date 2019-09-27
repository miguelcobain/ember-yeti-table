import Component from '@ember/component';

import { tagName, className } from '@ember-decorators/component';
import { action } from '@ember/object';
import { reads } from '@ember/object/computed';

import layout from './template';

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
@tagName('thead')
class Header extends Component {
  layout = layout;

  theme;

  sortable;

  sortSequence;

  onColumnClick;

  parent;

  columns;

  trClass;

  @className
  @reads('theme.thead')
  themeClass;

  @action
  onColumnClickHeader(column, e) {
    if (this.get('onColumnClick') && column.get('sortable')) {
      this.get('onColumnClick')(column, e);
    }
  }
}

export default Header;
