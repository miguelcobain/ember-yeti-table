import { _ as _applyDecoratedDescriptor } from '../../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import Column from './thead/row/column.js';
import { hash } from '@ember/helper';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class, _Header;
let Header = (_class = (_Header = class Header extends Component {
  onColumnClickHeader(column, e) {
    if (this.args.onColumnClick && column.sortable) {
      this.args.onColumnClick(column, e);
    }
  }
}, setComponentTemplate(precompileTemplate("\n    <thead class={{@theme.thead}} ...attributes>\n      <tr class=\"{{@trClass}} {{@theme.theadRow}} {{@theme.row}}\">\n        {{yield (hash column=(component THead sortable=@sortable sortSequence=@sortSequence onClick=this.onColumnClickHeader parent=@parent theme=@theme))}}\n      </tr>\n    </thead>\n  ", {
  strictMode: true,
  scope: () => ({
    hash,
    THead: Column
  })
}), _Header), _Header), _applyDecoratedDescriptor(_class.prototype, "onColumnClickHeader", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onColumnClickHeader"), _class.prototype), _class);

export { Header as default };
//# sourceMappingURL=header.js.map
