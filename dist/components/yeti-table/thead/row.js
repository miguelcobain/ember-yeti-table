import { a as _defineProperty } from '../../../_rollupPluginBabelHelpers-CROxMPeN.js';
import Component from '@glimmer/component';
import Column from './row/column.js';
import THeadCell from './row/cell.js';
import { hash } from '@ember/helper';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class;
class THeadRow extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "cells", []);
  }
  registerCell(cell1) {
    let column1;
    if (cell1.prop) {
      column1 = this.args.columns.findBy('prop', cell1.prop);
      cell1.column = column1;
    } else {
      let index1 = this.cells.length;
      column1 = this.args.columns[index1];
      return column1;
    }
    this.cells.push(cell1);
    return column1;
  }
  unregisterCell(cell1) {
    let cells1 = this.cells;
    let index1 = cells1.indexOf(cell1);
    cells1.splice(index1, 1);
  }
}
_class = THeadRow;
setComponentTemplate(precompileTemplate("\n    <tr class=\"{{@trClass}} {{@theme.theadRow}} {{@theme.row}}\" ...attributes>\n      {{yield (hash column=(component Column sortable=@sortable sortSequence=@sortSequence onClick=@onColumnClick theme=@theme parent=@parent) cell=(component Cell theme=@theme parent=this))}}\n    </tr>\n  ", {
  scope: () => ({
    hash,
    Column,
    Cell: THeadCell
  }),
  strictMode: true
}), _class);

export { THeadRow as default };
//# sourceMappingURL=row.js.map
