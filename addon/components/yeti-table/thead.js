import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

/**
  Renders a `<thead>` element and yields the row component.

  ```hbs
  <table.thead as |head|>
    <head.row as |row|>
      <row.column @prop="firstName" as |column|>
        First name
        {{if column.isAscSorted "(sorted asc)"}}
        {{if column.isDescSorted "(sorted desc)"}}
      </row.column>
    </head.row>
  </table.thead>
  ```

  @yield {object} head
  @yield {Component} head.row
*/
@tagName('')
class THead extends Component {
  theme;

  sortable;

  sortSequence;

  parent;

  columns;

  onColumnClick;
}

export default THead;
