import Component from '@ember/component';

import { tagName, className } from '@ember-decorators/component';
import { reads } from '@ember/object/computed';

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

  theme;

  sortable;

  sortSequence;

  parent;

  columns;

  onColumnClick;

  @className
  @reads('theme.thead')
  themeClass;

}

export default Head;
