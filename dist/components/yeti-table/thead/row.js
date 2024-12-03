import { a as _defineProperty } from '../../../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import Component from '@glimmer/component';
import Column from './row/column.js';
import THeadCell from './row/cell.js';
import { hash } from '@ember/helper';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _THeadRow;
class THeadRow extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "cells", []);
  }
  registerCell(cell) {
    let column;
    if (cell.prop) {
      column = this.args.columns.findBy('prop', cell.prop);
      cell.column = column;
    } else {
      let index = this.cells.length;
      column = this.args.columns[index];
      return column;
    }
    this.cells.push(cell);
    return column;
  }
  unregisterCell(cell) {
    let cells = this.cells;
    let index = cells.indexOf(cell);
    cells.splice(index, 1);
  }
}
_THeadRow = THeadRow;
setComponentTemplate(precompileTemplate("\n    <tr class=\"{{@trClass}} {{@theme.theadRow}} {{@theme.row}}\" ...attributes>\n      {{yield (hash column=(component Column sortable=@sortable sortSequence=@sortSequence onClick=@onColumnClick theme=@theme parent=@parent) cell=(component Cell theme=@theme parent=this))}}\n    </tr>\n  ", {
  strictMode: true,
  scope: () => ({
    hash,
    Column,
    Cell: THeadCell
  })
}), _THeadRow);

export { THeadRow as default };
//# sourceMappingURL=row.js.map
