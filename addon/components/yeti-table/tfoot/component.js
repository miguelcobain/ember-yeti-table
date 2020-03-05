import Component from '@ember/component';

import { tagName, layout } from '@ember-decorators/component';

import template from './template';

import {deprecate} from "@ember/debug";

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
@layout(template)
class TFoot extends Component {
  theme;

  parent;

  columns;

  init() {
    super.init(...arguments);

    deprecate("The yielded Foot component has been deprecated. Please use TFoot instead",
      !this.shouldDeprecate,
      {
        id: 'ember-yet-table:Foot-component',
        until: "2.0.0"
      }
    );
  }

}

export default TFoot;
