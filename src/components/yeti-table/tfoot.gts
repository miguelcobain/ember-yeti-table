import Component from '@glimmer/component';

import { hash } from '@ember/helper';

import type { WithBoundArgs } from '@glint/template';

import TFootRow from './tfoot/row.gts';
import type { ColumnDefinition, Theme } from '../../types.ts';

/**
  Renders a `<tfoot>` element and yields the row component.

  @class TTFoot
*/

export interface TFootSignature {
  Element: HTMLTableSectionElement;
  Args: {
    theme?: Theme;
    columns?: ColumnDefinition[];
    parent?: unknown;
  };
  Blocks: {
    default: [
      { row: WithBoundArgs<typeof TFootRow, 'columns' | 'theme' | 'parent'> },
    ];
  };
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class TFoot extends Component<TFootSignature> {
  <template>
    <tfoot class={{@theme.tfoot}} ...attributes>
      {{yield
        (hash
          row=(component TFootRow columns=@columns theme=@theme parent=@parent)
        )
      }}
    </tfoot>
  </template>
}
