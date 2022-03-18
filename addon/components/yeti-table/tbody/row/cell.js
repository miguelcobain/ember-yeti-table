import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

/**
  Renders a `<td>` element (if its corresponding column definition has `@visible={{true}}`).
  ```hbs
  <row.cell>
    {{person.firstName}}
  </row.cell>
  ```
*/
export default class TBodyCell extends Component {
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
