import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

/**
  Renders a `<td>` element and yields for the developer to supply content.

  ```hbs
  <table.tfoot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.tfoot>
  ```
  @class TFootCell
 */

export default class TFootCell extends Component {
  @tracked
  index;

  get column() {
    return this.args.columns[this.index];
  }

  constructor() {
    super(...arguments);

    this.index = this.args.parent?.registerCell(this);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.args.parent?.unregisterCell(this);
  }
}
