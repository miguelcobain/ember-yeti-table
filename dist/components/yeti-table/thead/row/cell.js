import { a as _initializerDefineProperty, b as _applyDecoratedDescriptor } from '../../../../_rollupPluginBabelHelpers-C6tXCyhy.js';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class, _descriptor, _THeadCell;
let THeadCell = (_class = (_THeadCell = class THeadCell extends Component {
  get column() {
    return this.args.prop ? this.args.columns.find(column => column.prop === this.args.prop) : this.args.columns[this.index];
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
}, setComponentTemplate(precompileTemplate("\n    {{#if this.column.visible}}\n      <th class=\"{{@class}} {{@theme.theadCell}}\" ...attributes>\n        {{yield}}\n      </th>\n    {{/if}}\n  ", {
  strictMode: true
}), _THeadCell), _THeadCell), _descriptor = _applyDecoratedDescriptor(_class.prototype, "index", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);

export { THeadCell as default };
//# sourceMappingURL=cell.js.map
