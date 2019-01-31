import Component from '@ember/component';
import { deprecate } from '@ember/application/deprecations';

import { tagName, className } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import {
  arrayOf,
  unionOf,
  shapeOf,
  optional
} from '@ember-decorators/argument/types';
import { Action } from '@ember-decorators/argument/types';
import { reads } from '@ember-decorators/object/computed';

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
class Body extends Component {
  layout = layout;

  @argument('object')
  theme;

  @argument(arrayOrPromise)
  data;

  @argument(arrayOf(Component))
  columns;

  @argument(Component)
  parent;

  /**
   * Adds a class to each `<tr>` element. Can be used with both the blockless and block invocations.
   * @deprecated use YetiTable's `@theme` instead of `@rowClass`
   */
  @argument(optional('string'))
  rowClass;

  @className
  @reads('theme.tbody')
  themeClass;

  /**
   * Adds a click action to each row, called with the clicked row's data as an argument.
   * Can be used with both the blockless and block invocations.
   */
  @argument(optional(Action))
  onRowClick = () => {};

  init() {
    super.init(...arguments);
    deprecate('`@rowClass` argument was deprecated in favor of using `tbodyRow` property of `@theme`. Please check the "Styling" section on the documentation site.', !this.get('rowClass'), {
      id: 'no-row-class',
      until: '0.2.0'
    });
  }
}

export default Body;
