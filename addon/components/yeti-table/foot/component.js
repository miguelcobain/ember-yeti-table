import Component from '@ember/component';

import { tagName, layout } from '@ember-decorators/component';

import template from './template';

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
@tagName('')
@layout(template)
class Foot extends Component {
  theme;

  parent;

  columns;
}

export default Foot;
