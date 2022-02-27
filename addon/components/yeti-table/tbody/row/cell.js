import Component from '@glimmer/component';

/**
  Renders a `<td>` element (if its corresponding column definition has `@visible={{true}}`).
  ```hbs
  <row.cell>
    {{person.firstName}}
  </row.cell>
  ```
*/
export default class TBodyCell extends Component {
  // Assigned when the cell is registered
  column = undefined;

  constructor() {
    super(...arguments);
    this.column = this.args.parent?.registerCell(this);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.args.parent?.unregisterCell(this);
  }
}
