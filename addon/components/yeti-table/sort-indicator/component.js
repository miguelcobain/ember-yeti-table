import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';

import layout from './template';

/**
  Simple pagination controls component that is included to help you get started quickly.
  Yeti Table yields a lot of pagination data, so you shouldn't have a problem
  creating your own pagination controls.

  At any rate, this component tries to be as flexible as possible. Some arguments
  are provided to customize how this component behaves.

  If you want to render these controls on the table footer, you probably want
  a footer row that always spans all rows. To do that you can use a `colspan` equal
  to the yielded `visibleColumns` number. Example:

  ```hbs
  <YetiTable @data={{data}} @pagination={{true}} as |table|>
    ...
    <table.foot as |foot|>
      <foot.row as |row|>
        <row.cell colspan={{table.visibleColumns}}>
          <table.pagination/>
        </row.cell>
      </foot.row>
    </table.foot>
  </YetiTable>
  ```
*/

@tagName('')
class SortIndicator extends Component {
  layout = layout;

  @argument('boolean')
  isSorted;

  @argument('boolean')
  isAscSorted;

  @argument('boolean')
  isDescSorted;

  @argument('object')
  theme;

}

export default SortIndicator;
