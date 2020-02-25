import Component from '@ember/component';

import { tagName, layout } from '@ember-decorators/component';

import template from './template';

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
@tagName('')
@layout(template)
class Head extends Component {
  theme;

  sortable;

  sortSequence;

  parent;

  columns;

  onColumnClick;

}

export default Head;
