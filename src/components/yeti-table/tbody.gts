import Component from '@glimmer/component';

import { hash } from '@ember/helper';

import type { WithBoundArgs } from '@glint/template';

import TBodyRow from './tbody/row.gts';
import type {
  ColumnDefinition,
  Row,
  RowClickHandler,
  Theme,
} from '../../types.ts';

/**
  Renders a `<tbody>` element and yields the row component and data. You must iterate each row.

  @class TBody
*/

export interface TBodySignature {
  Element: HTMLTableSectionElement;
  Args: {
    theme?: Theme;
    data?: Row[];
    columns?: ColumnDefinition[];
    onRowClick?: RowClickHandler;
  };
  Blocks: {
    default: [
      {
        row: WithBoundArgs<typeof TBodyRow, 'theme' | 'onClick' | 'columns'>;
      },
      Row[] | undefined,
    ];
  };
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class TBody extends Component<TBodySignature> {
  <template>
    <tbody class={{@theme.tbody}} ...attributes>
      {{yield
        (hash
          row=(component
            TBodyRow theme=@theme onClick=@onRowClick columns=@columns
          )
        )
        @data
      }}
    </tbody>
  </template>
}
