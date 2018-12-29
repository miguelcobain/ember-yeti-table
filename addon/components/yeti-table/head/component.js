import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, arrayOf, unionOf } from '@ember-decorators/argument/type';
import { Action } from '@ember-decorators/argument/types';

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

  @yield {Component} row
*/
@tagName('thead')
export default class Head extends Component {
  layout = layout;

  @argument
  @required
  @type('boolean')
  sortable;

  @argument
  @required
  @type(unionOf('string', arrayOf('string')))
  sortSequence;

  @argument
  @required
  @type(Component)
  parent;

  @argument
  @required
  @type(arrayOf(Component))
  columns;

  @argument
  @required
  @type(Action)
  onColumnClick;

}
