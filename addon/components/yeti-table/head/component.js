import Component from '@ember/component';

import { tagName, className } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { arrayOf, unionOf, optional } from '@ember-decorators/argument/types';
import { Action } from '@ember-decorators/argument/types';
import { reads } from '@ember-decorators/object/computed';

import layout from './template';

/**
  Renders a `<thead>` element and yields the row component.

  ```hbs
  <table.head as |head|>
    <head.row as |row|>
      <row.column @prop="firstName" as |column|>
        First name
        {{if column.isAscSorted "(sorted asc)"}}
        {{if column.isDescSorted "(sorted desc)"}}
      </head.column>
    </head.row>
  </table.head>
  ```

  @yield {object} head
  @yield {Component} head.row
*/
@tagName('thead')
class Head extends Component {
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

  /**
   * Should the sort classes be applied to the sortIndicator component or the column `td`.
   * By default the sort classes are applied to the columnd `td`
   */
  @argument(optional('boolean'))
  useSortIndicator = false;

  @className
  @reads('theme.thead')
  themeClass;

}

export default Head;
