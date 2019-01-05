import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type } from '@ember-decorators/argument/type';

import layout from './template';

/**
  An component yielded from the head.row component that is used to define
  a cell in a row of the head of the table. Would be used for filters or any other
  additional information in the table head for a column

  ```hbs
  <table.head as |head|>
    <head.row as |row|>
      <row.cell>
        <input
          class="input" type="search" placeholder="Search last name"
          value={{lastNameFilter}}
          oninput={{action (mut lastNameFilter) value="target.value"}}>
      </row.cell>
    </head.row>
  </table.head>
  ```

  @yield {object} cell

 */
@tagName('')
export default class Cell extends Component {
  layout = layout;

  @argument
  @required
  @type(Component)
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
