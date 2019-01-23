import Component from '@ember/component';

import { or } from '@ember-decorators/object/computed';
import { classNames } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { arrayOf } from '@ember-decorators/argument/types';

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
  <tfoot>
    <tr>
      <td colspan={{table.visibleColumns}}>
        <table.pagination/>
      </td>
    </tr>
  </tfoot>
  ```
*/
@classNames('yeti-table-pagination-controls')
class Pagination extends Component {
  layout = layout;

  @argument('object')
  paginationData;

  @argument('object')
  paginationActions;

  @argument('boolean')
  disabled;

  @or('paginationData.isFirstPage', 'disabled')
  shouldDisablePrevious;

  @or('paginationData.isLastPage', 'disabled')
  shouldDisableNext;

  /**
   * Array of page sizes to populate the page size `<select>`.
   * Particularly useful with an array helper, e.g `@pageSizes={{array 10 12 23 50 100}}`
   * Defaults to `[10, 15, 20, 25]`.
   */
  @argument(arrayOf('number'))
  pageSizes = [
    10, 15, 20, 25
  ];

  /**
   * Used to show/hide some textual information about the current page. Defaults to `true`.
   */
  @argument('boolean')
  showInfo = true;

  /**
   * Used to show/hide the page size selector. Defaults to `true`.
   */
  @argument('boolean')
  showPageSizeSelector = true;

  /**
   * Used to show/hide the previous and next page buttons. Defaults to `true`.
   */
  @argument('boolean')
  showButtons = true;

}

export default Pagination;
