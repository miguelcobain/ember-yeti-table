import { a as _defineProperty } from '../../../_rollupPluginBabelHelpers-CROxMPeN.js';
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import TFootCell from './row/cell.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class;
class TFootRow extends Component {
  constructor(...args) {
    super(...args);
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
}
_class = TFootRow;
setComponentTemplate(precompileTemplate("\n    <tr class=\"{{@class}} {{@theme.tfootRow}} {{@theme.row}}\" ...attributes>\n      {{yield (hash cell=(component Cell theme=@theme parent=this columns=@columns))}}\n    </tr>\n  ", {
  scope: () => ({
    hash,
    Cell: TFootCell
  }),
  strictMode: true
}), _class);

export { TFootRow as default };
//# sourceMappingURL=row.js.map
