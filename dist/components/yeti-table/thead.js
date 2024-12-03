import { hash } from '@ember/helper';
import THeadRow from './thead/row.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';

/**
  Renders a `<thead>` element and yields the row component.

  ```hbs
  <table.thead as |head|>
    <head.row as |row|>
      <row.column @prop="firstName" as |column|>
        First name
        {{if column.isAscSorted "(sorted asc)"}}
        {{if column.isDescSorted "(sorted desc)"}}
      </row.column>
    </head.row>
  </table.thead>
  ```

  @class THead
  @yield {object} head
  @yield {Component} head.row
*/
var THead = setComponentTemplate(precompileTemplate("\n  <thead class={{@theme.thead}} ...attributes>\n    {{yield (hash row=(component THead sortable=@sortable sortSequence=@sortSequence onColumnClick=@onColumnClick columns=@columns theme=@theme parent=@parent))}}\n  </thead>\n", {
  strictMode: true,
  scope: () => ({
    hash,
    THead: THeadRow
  })
}), templateOnly());

export { THead as default };
//# sourceMappingURL=thead.js.map
