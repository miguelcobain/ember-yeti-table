import { action } from '@ember/object';
import { or } from '@ember/object/computed';

import Component from '@glimmer/component';
import { localCopy } from 'tracked-toolbox';

/**
  Simple pagination controls component that is included to help you get started quickly.
  Yeti Table yields a lot of pagination data, so you shouldn't have a problem
  creating your own pagination controls.

  At any rate, this component tries to be as flexible as possible. Some arguments
  are provided to customize how this component behaves.

  If you want to render these controls on the table footer, you probably want
  a footer row that always spans all rows. To do that you can use a `colspan` equal
  to the yielded `visibleColumns.length` number. Example:

  ```hbs
  <YetiTable @data={{this.data}} @pagination={{true}} as |table|>
    ...
    <table.tfoot as |foot|>
      <foot.row as |row|>
        <row.cell colspan={{table.visibleColumns.length}}>
          <table.pagination/>
        </row.cell>
      </foot.row>
    </table.tfoot>
  </YetiTable>
  ```
*/

class Pagination extends Component {
  // theme;

  // paginationData;

  // paginationActions;

  // disabled;

  @or('args.paginationData.isFirstPage', 'args.disabled')
  shouldDisablePrevious;

  @or('args.paginationData.isLastPage', 'args.disabled')
  shouldDisableNext;

  /**
   * Array of page sizes to populate the page size `<select>`.
   * Particularly useful with an array helper, e.g `@pageSizes={{array 10 12 23 50 100}}`
   * Defaults to `[10, 15, 20, 25]`.
   */
  @localCopy('args.pageSizes', [10, 15, 20, 25])
  pageSizes;

  /**
   * Used to show/hide some textual information about the current page. Defaults to `true`.
   */
  @localCopy('args.showInfo', true)
  showInfo;

  /**
   * Used to show/hide the page size selector. Defaults to `true`.
   */
  @localCopy('args.showPageSizeSelector', true)
  showPageSizeSelector;

  /**
   * Used to show/hide the previous and next page buttons. Defaults to `true`.
   */
  @localCopy('args.showButtons', true)
  showButtons;

  @action
  changePageSize(ev) {
    this.args.paginationActions.changePageSize(ev.target.value);
  }
}

export default Pagination;
