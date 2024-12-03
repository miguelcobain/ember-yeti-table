import { a as _defineProperty } from '../../../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import TFootCell from './row/cell.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _TFootRow;
class TFootRow extends Component {
  constructor(...args) {
    super(...args);
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
}
_TFootRow = TFootRow;
setComponentTemplate(precompileTemplate("\n    <tr class=\"{{@class}} {{@theme.tfootRow}} {{@theme.row}}\" ...attributes>\n      {{yield (hash cell=(component Cell theme=@theme parent=this columns=@columns))}}\n    </tr>\n  ", {
  strictMode: true,
  scope: () => ({
    hash,
    Cell: TFootCell
  })
}), _TFootRow);

export { TFootRow as default };
//# sourceMappingURL=row.js.map
