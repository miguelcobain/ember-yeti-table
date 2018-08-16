import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type } from '@ember-decorators/argument/type';

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
export default class Cell extends Component {
  layout = layout;

  @argument
  @required
  @type(Component)
  parent;

  constructor() {
    super(...arguments);
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
