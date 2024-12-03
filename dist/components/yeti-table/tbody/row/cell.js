import { _ as _applyDecoratedDescriptor, b as _initializerDefineProperty } from '../../../../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { hash } from '@ember/helper';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class, _descriptor, _TBodyCell;
let TBodyCell = (_class = (_TBodyCell = class TBodyCell extends Component {
  get column() {
    return this.args.columns[this.index] || {};
  }
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "index", _descriptor, this);
    this.index = this.args.parent?.registerCell(this);
  }
  willDestroy() {
    super.willDestroy(...arguments);
    this.args.parent?.unregisterCell(this);
  }
}, setComponentTemplate(precompileTemplate("\n    {{#if this.column.visible}}\n      <td class=\"{{@class}} {{this.column.columnClass}} {{@theme.tbodyCell}}\" ...attributes>\n        {{yield (hash prop=this.column.prop)}}\n      </td>\n    {{/if}}\n  ", {
  strictMode: true,
  scope: () => ({
    hash
  })
}), _TBodyCell), _TBodyCell), _descriptor = _applyDecoratedDescriptor(_class.prototype, "index", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);

export { TBodyCell as default };
//# sourceMappingURL=cell.js.map
