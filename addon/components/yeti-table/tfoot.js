import { tagName } from '@ember-decorators/component';
import { deprecate } from '@ember/application/deprecations';
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

  init() {
    super.init(...arguments);

    deprecate('The yielded `foot` component has been deprecated. Please use `tfoot` instead.', !this.shouldDeprecate, {
      id: 'ember-yeti-table:foot-component',
      until: '2.0.0',
      for: 'ember-yeti-table',
      since: {
        enable: '1.4.0'
      }
    });
  }
}

export default TFoot;
