import { _ as _applyDecoratedDescriptor, a as _defineProperty } from '../../../_rollupPluginBabelHelpers-CROxMPeN.js';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import TBodyCell from './row/cell.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class, _class2;
let TBodyRow = (_class = (_class2 = class TBodyRow extends Component {
  constructor(...args) {
    super(...args);
    /**
    * Adds a click action to the row.
    *
    * @argument onClick
    * @type Function
    */
    _defineProperty(this, "cells", []);
  }
  registerCell(cell1) {
    let index1 = this.cells.length;
    this.cells.push(cell1);
    return index1;
  }
  unregisterCell(cell1) {
    let cells1 = this.cells;
    let index1 = cells1.indexOf(cell1);
    cells1.splice(index1, 1);
  }
  handleClick() {
    this.args.onClick?.(...arguments);
  }
}, setComponentTemplate(precompileTemplate("\n    {{!-- template-lint-disable no-invalid-interactive --}}\n    <tr class=\"{{@theme.tbodyRow}} {{@theme.row}}\" {{on \"click\" this.handleClick}} role={{if @onClick \"button\"}} ...attributes>\n      {{yield (hash cell=(component Cell theme=@theme parent=this columns=@columns))}}\n    </tr>\n  ", {
  scope: () => ({
    on,
    hash,
    Cell: TBodyCell
  }),
  strictMode: true
}), _class2), _class2), (_applyDecoratedDescriptor(_class.prototype, "handleClick", [action], Object.getOwnPropertyDescriptor(_class.prototype, "handleClick"), _class.prototype)), _class);

export { TBodyRow as default };
//# sourceMappingURL=row.js.map
