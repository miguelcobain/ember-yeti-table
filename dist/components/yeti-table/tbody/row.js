import { _ as _applyDecoratedDescriptor, a as _defineProperty } from '../../../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import TBodyCell from './row/cell.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class, _TBodyRow;
let TBodyRow = (_class = (_TBodyRow = class TBodyRow extends Component {
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
  registerCell(cell) {
    let index = this.cells.length;
    this.cells.push(cell);
    return index;
  }
  unregisterCell(cell) {
    let cells = this.cells;
    let index = cells.indexOf(cell);
    cells.splice(index, 1);
  }
  handleClick() {
    this.args.onClick?.(...arguments);
  }
}, setComponentTemplate(precompileTemplate("\n    {{!-- template-lint-disable no-invalid-interactive --}}\n    <tr class=\"{{@theme.tbodyRow}} {{@theme.row}}\" {{on \"click\" this.handleClick}} role={{if @onClick \"button\"}} ...attributes>\n      {{yield (hash cell=(component Cell theme=@theme parent=this columns=@columns))}}\n    </tr>\n  ", {
  strictMode: true,
  scope: () => ({
    on,
    hash,
    Cell: TBodyCell
  })
}), _TBodyRow), _TBodyRow), _applyDecoratedDescriptor(_class.prototype, "handleClick", [action], Object.getOwnPropertyDescriptor(_class.prototype, "handleClick"), _class.prototype), _class);

export { TBodyRow as default };
//# sourceMappingURL=row.js.map
