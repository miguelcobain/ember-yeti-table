import { _ as _applyDecoratedDescriptor } from '../../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { hash, fn, get } from '@ember/helper';
import TBodyRow from './tbody/row.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class, _Body;
let Body = (_class = (_Body = class Body extends Component {
  /**
  * Adds a click action to each row, called with the clicked row's data as an argument.
  * Can be used with both the blockless and block invocations.
  *
  * @argument onRowClick
  * @type Function
  */
  handleRowClick(rowData) {
    this.args.onRowClick?.(rowData);
  }
}, setComponentTemplate(precompileTemplate("\n    <tbody class={{@theme.tbody}} ...attributes>\n      {{#if (has-block)}}\n\n        {{#each @data as |rowData index|}}\n          {{yield (hash row=(component TBodyRow theme=@theme onClick=@onRowClick columns=@columns)) rowData index}}\n        {{/each}}\n\n      {{else}}\n\n        {{#each @data as |rowData|}}\n          <TBodyRow @theme={{@theme}} @onClick={{if @onRowClick (fn this.handleRowClick rowData)}} @columns={{@columns}} as |row|>\n\n            {{#each @columns as |column|}}\n              <row.cell @class={{column.columnClass}}>\n                {{#if column.prop}}\n                  {{get rowData column.prop}}\n                {{else}}\n                  {{rowData}}\n                {{/if}}\n              </row.cell>\n            {{/each}}\n          </TBodyRow>\n        {{/each}}\n      {{/if}}\n    </tbody>\n  ", {
  strictMode: true,
  scope: () => ({
    hash,
    TBodyRow,
    fn,
    get
  })
}), _Body), _Body), _applyDecoratedDescriptor(_class.prototype, "handleRowClick", [action], Object.getOwnPropertyDescriptor(_class.prototype, "handleRowClick"), _class.prototype), _class);

export { Body as default };
//# sourceMappingURL=body.js.map
