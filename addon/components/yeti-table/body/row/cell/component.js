import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';

import layout from './template';

/**
  Renders a `<td>` element (if its corresponding column definition has `@visible={{true}}`).
  ```hbs
  <row.cell>
    {{person.firstName}}
  </row.cell>
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
