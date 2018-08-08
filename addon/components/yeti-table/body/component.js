import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import {
  type,
  arrayOf,
  unionOf,
  shapeOf,
  optional
} from '@ember-decorators/argument/type';
import { Action } from '@ember-decorators/argument/types';

import layout from './template';

const arrayOrPromise = unionOf(
  arrayOf('object'),
  shapeOf({ then: Function })
);

/**
  Renders a `<tbody>` element and yields the row component, row data and index.
  ```hbs
  <table.body as |body person index|>
    <body.row as |row|>
      <row.cell>
        {{person.firstName}} #{{index}}
      </row.cell>
      <row.cell>
        {{person.lastName}}
      </row.cell>
      <row.cell>
        {{person.points}}
      </row.cell>
    </body.row>
  </table.body>
  ```
  It can also be used as a blockless component to let yeti table automatically
  unroll thee rows for you, based on the `@prop` arguments you passed in to the
  column definition components.
  ```hbs
  <table.body/>
  ```
  Remember that this component's block will be rendered once per each item in the `@data` array.
  @yield {object} body
  @yield {Component} body.row - the row component
*/
@tagName('tbody')
export default class Body extends Component {
  layout = layout;

  @argument
  @required
  @type(arrayOrPromise)
  data;

  @argument
  @required
  @type(arrayOf(Component))
  columns;

  @argument
  @required
  @type(Component)
  parent;

  /**
   * Adds a class to each `<tr>` element. Can be used with both the blockless and block invocations.
   */
  @argument
  @type(optional('string'))
  rowClass;

  /**
   * Adds a click action to each row, called with the clicked row's data as an argument.
   * Can be used with both the blockless and block invocations.
   */
  @argument
  @type(optional(Action))
  onRowClick = () => {};
}
