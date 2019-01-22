import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { arrayOf } from '@ember-decorators/argument/types';

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

  @yield {object} footer
  @yield {Component} footer.row
*/
@tagName('tfoot')
export default class Foot extends Component {
  layout = layout;

  @argument(Component)
  parent;

  @argument(arrayOf(Component))
  columns;
}
