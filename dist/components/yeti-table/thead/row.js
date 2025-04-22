import { _ as _defineProperty } from '../../../_rollupPluginBabelHelpers-C6tXCyhy.js';
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
_THeadRow = THeadRow;
setComponentTemplate(precompileTemplate("\n    <tr class=\"{{@trClass}} {{@theme.theadRow}} {{@theme.row}}\" ...attributes>\n      {{yield (hash column=(component Column sortable=@sortable sortSequence=@sortSequence onClick=@onColumnClick theme=@theme parent=@parent) cell=(component Cell theme=@theme parent=this columns=@columns))}}\n    </tr>\n  ", {
  strictMode: true,
  scope: () => ({
    hash,
    Column,
    Cell: THeadCell
  })
}), _THeadRow);

export { THeadRow as default };
//# sourceMappingURL=row.js.map
