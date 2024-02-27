import { _ as _applyDecoratedDescriptor } from '../../_rollupPluginBabelHelpers-CROxMPeN.js';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import Column from './thead/row/column.js';
import { hash } from '@ember/helper';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class, _class2;
let Header = (_class = (_class2 = class Header extends Component {
  onColumnClickHeader(column1, e1) {
    if (this.args.onColumnClick && column1.sortable) {
      this.args.onColumnClick(column1, e1);
    }
  }
}, setComponentTemplate(precompileTemplate("\n    <thead class={{@theme.thead}} ...attributes>\n      <tr class=\"{{@trClass}} {{@theme.theadRow}} {{@theme.row}}\">\n        {{yield (hash column=(component THead sortable=@sortable sortSequence=@sortSequence onClick=this.onColumnClickHeader parent=@parent theme=@theme))}}\n      </tr>\n    </thead>\n  ", {
  scope: () => ({
    hash,
    THead: Column
  }),
  strictMode: true
}), _class2), _class2), (_applyDecoratedDescriptor(_class.prototype, "onColumnClickHeader", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onColumnClickHeader"), _class.prototype)), _class);

export { Header as default };
//# sourceMappingURL=header.js.map
