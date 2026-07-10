import type { TemplateOnlyComponent } from '@ember/component/template-only';

import type { Theme } from '../../types.ts';

/**
  A simple component that just renders the `<table>` element with the correct
  theme classes.

  @class Table
*/

export interface TableSignature {
  Element: HTMLTableElement;
  Args: {
    theme?: Theme;
    parent?: unknown;
  };
  Blocks: { default: [] };
}

const Table: TemplateOnlyComponent<TableSignature> = <template>
  <table class={{@theme.table}} ...attributes>
    {{yield}}
  </table>
</template>;

export default Table;
