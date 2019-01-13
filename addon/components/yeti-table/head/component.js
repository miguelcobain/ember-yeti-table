import Component from '@ember/component';

import { tagName, className } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { arrayOf, unionOf } from '@ember-decorators/argument/types';
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

  @argument(Object)
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

  @className
  @reads('theme.thead')
  themeClass;

}

export default Head;
