import { tagName, layout } from '@ember-decorators/component';
import Component from '@ember/component';
import { reads } from '@ember/object/computed';

import template from './template';

/**
  An component yielded from the head.row component that is used to define
  a cell in a row of the head of the table. Would be used for filters or any other
  additional information in the table head for a column

  ```hbs
  <table.thead as |head|>
    <head.row as |row|>
      <row.cell>
        <input
          class="input" type="search" placeholder="Search last name"
          value={{lastNameFilter}}
          oninput={{action (mut lastNameFilter) value="target.value"}}>
      </row.cell>
    </head.row>
  </table.thead>
  ```

  @yield {object} cell

 */
@tagName('')
@layout(template)
class THeadCell extends Component {
  theme;

  parent;

  /**
   * Controls the visibility of the current cell. Keep in mind that this property
   * won't just hide the column using css. The DOM for the column will be removed.
   * Defaults to the `visible` argument of the corresponding column.
   */
  @reads('column.visible')
  visible;

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

export default THeadCell;
