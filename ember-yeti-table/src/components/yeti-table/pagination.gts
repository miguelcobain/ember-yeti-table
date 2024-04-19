import { action } from '@ember/object';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
// @ts-expect-error: Ignore import error until types are added
import { localCopy } from 'tracked-toolbox';
import type { Theme } from './thead/row/column.gts';
import type { PaginationActions, PaginationData } from '../yeti-table.gts';

export interface PaginationSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
  Args: {
    theme: Theme;
    paginationData: PaginationData;
    paginationActions: PaginationActions;
    disabled: boolean;
    pageSizes: number[];
    showInfo: boolean;
    showPageSizeSelector: boolean;
    showButtons: boolean;
  };
}

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

  @class Pagination
*/
export default class Pagination extends Component<PaginationSignature> {
  <template>
    <div class={{@theme.pagination.controls}} ...attributes>
      {{#if this.showInfo}}
        <div class={{@theme.pagination.info}}>
          Showing
          {{@paginationData.pageStart}}
          to
          {{@paginationData.pageEnd}}
          of
          {{@paginationData.totalRows}}
          entries
        </div>
      {{/if}}

      {{#if this.showPageSizeSelector}}
        <div class={{@theme.pagination.pageSize}}>
          Rows per page:
          <select disabled={{@disabled}} {{on 'change' this.changePageSize}}>
            {{#each this.pageSizes as |pageSize|}}
              <option value={{pageSize}} selected={{eq @paginationData.pageSize pageSize}}>{{pageSize}}</option>
            {{/each}}
          </select>
        </div>
      {{/if}}

      {{#if this.showButtons}}
        <button
          type='button'
          class={{@theme.pagination.previous}}
          disabled={{this.shouldDisablePrevious}}
          {{on 'click' @paginationActions.previousPage}}
        >
          Previous
        </button>

        <button
          type='button'
          class={{@theme.pagination.next}}
          disabled={{this.shouldDisableNext}}
          {{on 'click' @paginationActions.nextPage}}
        >
          Next
        </button>
      {{/if}}
    </div>
  </template>
  // theme;

  // paginationData;

  // paginationActions;

  // disabled;

  get shouldDisablePrevious() {
    return this.args.paginationData.isFirstPage || this.args.disabled;
  }

  get shouldDisableNext() {
    return this.args.paginationData.isLastPage || this.args.disabled;
  }

  /**
   * Array of page sizes to populate the page size `<select>`.
   * Particularly useful with an array helper, e.g `@pageSizes={{array 10 12 23 50 100}}`
   * Defaults to `[10, 15, 20, 25]`.
   *
   * @argument pageSizes
   * @type {Number}
   */
  @localCopy('args.pageSizes', [10, 15, 20, 25])
  pageSizes!: number[];

  /**
   * Used to show/hide some textual information about the current page. Defaults to `true`.
   *
   * @argument showInfo
   * @type {Boolean}
   */
  @localCopy('args.showInfo', true)
  showInfo!: boolean;

  /**
   * Used to show/hide the page size selector. Defaults to `true`.
   *
   * @argument showPageSizeSelector
   * @type {Boolean}
   */
  @localCopy('args.showPageSizeSelector', true)
  showPageSizeSelector!: boolean;

  /**
   * Used to show/hide the previous and next page buttons. Defaults to `true`.
   *
   * @argument showButtons
   * @type {Boolean}
   */
  @localCopy('args.showButtons', true)
  showButtons!: boolean;

  @action
  changePageSize(ev: Event) {
    this.args.paginationActions.changePageSize((ev.target as HTMLSelectElement).value);
  }
}
