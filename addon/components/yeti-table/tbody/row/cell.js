import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { reads } from '@ember/object/computed';

/**
  Renders a `<td>` element (if its corresponding column definition has `@visible={{true}}`).
  ```hbs
  <row.cell>
    {{person.firstName}}
  </row.cell>
  ```
*/
@tagName('')
class TBodyCell extends Component {
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

export default TBodyCell;
