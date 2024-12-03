import { _ as _applyDecoratedDescriptor, b as _initializerDefineProperty } from '../../../../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class, _descriptor, _TFootCell;
let TFootCell = (_class = (_TFootCell = class TFootCell extends Component {
  get column() {
    return this.args.columns[this.index];
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
}, setComponentTemplate(precompileTemplate("\n    {{#if this.column.visible}}\n      <td class=\"{{@class}} {{@theme.tfootCell}}\" ...attributes>\n        {{yield}}\n      </td>\n    {{/if}}\n  ", {
  strictMode: true
}), _TFootCell), _TFootCell), _descriptor = _applyDecoratedDescriptor(_class.prototype, "index", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);

export { TFootCell as default };
//# sourceMappingURL=cell.js.map
