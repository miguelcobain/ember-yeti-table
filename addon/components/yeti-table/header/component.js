import Component from '@ember/component';

import { tagName, className } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { arrayOf, optional, unionOf } from '@ember-decorators/argument/types';
import { Action } from '@ember-decorators/argument/types';
import { reads } from '@ember-decorators/object/computed';

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

  @argument('object')
  theme;

  @argument('boolean')
  sortable;

  @argument(unionOf('string', arrayOf('string')))
  sortSequence;

  @argument(Component)
  parent;

  @argument(arrayOf(Component))
  columns;

  @argument(Action)
  onColumnClick;

  @argument(optional('string'))
  trClass;

  @className
  @reads('theme.thead')
  themeClass;

  /**
   * Should the sort classes be applied to the sortIndicator component or the column `td`.
   * By default the sort classes are applied to the columnd `td`
   */
  @argument(optional('boolean'))
  useSortIndicator = false;

  @action
  onColumnClick(column, e) {
    if (this.get('onColumnClick') && column.get('sortable')) {
      this.get('onColumnClick')(column, e);
    }
  }
}

export default Header;
