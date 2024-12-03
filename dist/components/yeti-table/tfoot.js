import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import TFootRow from './tfoot/row.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _TFoot;
class TFoot extends Component {}
_TFoot = TFoot;
setComponentTemplate(precompileTemplate("\n    <tfoot class={{@theme.tfoot}} ...attributes>\n      {{yield (hash row=(component TFootRow columns=@columns theme=@theme parent=@parent))}}\n    </tfoot>\n  ", {
  strictMode: true,
  scope: () => ({
    hash,
    TFootRow
  })
}), _TFoot);

export { TFoot as default };
//# sourceMappingURL=tfoot.js.map
