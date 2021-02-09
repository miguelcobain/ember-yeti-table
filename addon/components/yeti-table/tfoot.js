import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

/**
  Renders a `<tfoot>` element and yields the row component.
  ```hbs
  <table.tfoot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.tfoot>
  ```

  @yield {object} footer
  @yield {Component} footer.row
*/
@tagName('')
class TFoot extends Component {
  theme;

  parent;

  columns;
}

export default TFoot;
