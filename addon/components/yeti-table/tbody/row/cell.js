import Component from '@glimmer/component';

/**
  Renders a `<td>` element (if its corresponding column definition has `@visible={{true}}`).
  ```hbs
  <row.cell>
    {{person.firstName}}
  </row.cell>
  ```

 If the prop name was used when the column header was defined, it is yielded in a hash
 ```hbs
 <row.cell as |column|>
   {{get person column.prop}}
 </row.cell>
 ```

 */
class TBodyCell extends Component {
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

export default TBodyCell;
