import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';

import layout from './template';

/**
  Renders a `<td>` element and yields for the developer to supply content.

  ```hbs
  <table.foot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.head>
  ```

 */
@tagName('')
class Cell extends Component {
  layout = layout;

  @argument(Component)
  parent;

  init() {
    super.init(...arguments);

    if (this.get('parent')) {
      this.get('parent').registerCell(this);
    }
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    if (this.get('parent')) {
      this.get('parent').unregisterCell(this);
    }
  }
}

export default Cell;
