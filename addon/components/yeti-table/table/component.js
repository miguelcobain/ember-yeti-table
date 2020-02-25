import Component from '@ember/component';

import { layout, tagName } from '@ember-decorators/component';

import template from './template';

/**
  A simple component that just renders the `<table>` element with the correct
  theme classes.

  This component should only be needed when using `@renderTableElement={{false}}` to render
  the table element yourself. Please refer to the `@renderTableElement` documentation for
  more information.

  Example:

  ```hbs
  <YetiTable @data={{this.data}} @pagination={{true}} @renderTableElement={{false}} as |t|>

    <t.table> {{!-- we render the given table component ourselves --}}
      <t.header as |header|>
        ...
      </t.header>

      <t.body/>
    </t.table>

    <t.pagination/> {{!-- pagination controls outside the <table> element --}}

  </YetiTable>
  ```
*/

@tagName('')
@layout(template)
class Table extends Component {}

export default Table;
