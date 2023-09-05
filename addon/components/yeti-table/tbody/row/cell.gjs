import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

/**
  @class TBodyCell

  Renders a `<td>` element (if its corresponding column definition has `@visible={{true}}`).
  ```hbs
  <row.cell>
    {{person.firstName}}
  </row.cell>

  If the prop name was used when the column header was defined, it is yielded in a hash
  ```hbs
  <row.cell as |column|>
    {{get person column.prop}}
  </row.cell>
  ```
*/

import { hash } from '@ember/helper';

export default class TBodyCell extends Component {
  <template>
    {{#if this.column.visible}}
      <td class='{{@class}} {{this.column.columnClass}} {{@theme.tbodyCell}}' ...attributes>
        {{yield (hash prop=this.column.prop)}}
      </td>
    {{/if}}
  </template>

  @tracked
  index;

  get column() {
    return this.args.columns[this.index] || {};
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
