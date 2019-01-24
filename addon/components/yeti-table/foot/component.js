import Component from '@ember/component';

import { tagName, className } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { arrayOf } from '@ember-decorators/argument/types';
import { reads } from '@ember-decorators/object/computed';

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
class Foot extends Component {
  layout = layout;

  @argument('object')
  theme;

  @argument(Component)
  parent;

  @argument(arrayOf(Component))
  columns;

  @className
  @reads('theme.tfoot')
  themeClass;

}

export default Foot;
