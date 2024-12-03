import { a as _defineProperty } from '../../../../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _THeadCell;
class THeadCell extends Component {
  constructor() {
    super(...arguments);
    // Assigned when the cell is registered
    _defineProperty(this, "column", undefined);
    this.column = this.args.parent?.registerCell(this);
  }
  willDestroy() {
    super.willDestroy(...arguments);
    this.args.parent?.unregisterCell(this);
  }
}
_THeadCell = THeadCell;
setComponentTemplate(precompileTemplate("\n    {{#if this.column.visible}}\n      <th class=\"{{@class}} {{@theme.theadCell}}\" ...attributes>\n        {{yield}}\n      </th>\n    {{/if}}\n  ", {
  strictMode: true
}), _THeadCell);

export { THeadCell as default };
//# sourceMappingURL=cell.js.map
