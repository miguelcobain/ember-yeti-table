import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import TFootRow from './tfoot/row.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _class;
class TFoot extends Component {}
_class = TFoot;
setComponentTemplate(precompileTemplate("\n    <tfoot class={{@theme.tfoot}} ...attributes>\n      {{yield (hash row=(component TFootRow columns=@columns theme=@theme parent=@parent))}}\n    </tfoot>\n  ", {
  scope: () => ({
    hash,
    TFootRow
  }),
  strictMode: true
}), _class);

export { TFoot as default };
//# sourceMappingURL=tfoot.js.map
