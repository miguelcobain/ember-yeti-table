import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, arrayOf } from '@ember-decorators/argument/type';

import layout from './template';

/**
  Renders a `<tfoot>` element and yields the row component.
  ```hbs
  <table.foot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.head>
  ```

  @yield {Component} row
*/
@tagName('tfoot')
export default class Foot extends Component {
  layout = layout;

  @argument
  @required
  @type(Component)
  parent;

  @argument
  @required
  @type(arrayOf(Component))
  columns;
}
