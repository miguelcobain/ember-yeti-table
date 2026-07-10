import { action } from '@ember/object';
import { helper } from '@ember/component/helper';
import Component from '@glimmer/component';
import { localCopy } from 'tracked-toolbox';

import { on } from '@ember/modifier';

import type { PaginationActions, PaginationData, Theme } from '../../types.ts';
import { uniqueId } from '@ember/helper';

/**
  Simple pagination controls component that is included to help you get started quickly.

  @class Pagination
*/

export interface PaginationSignature {
  Element: HTMLDivElement;
  Args: {
    theme?: Theme;
    paginationData: PaginationData;
    paginationActions: PaginationActions;
    disabled?: boolean;
    pageSizes?: number[];
    showInfo?: boolean;
    showPageSizeSelector?: boolean;
    showButtons?: boolean;
  };
  Blocks: { default: [] };
}

export default class Pagination extends Component<PaginationSignature> {
  isPaginationNumberSelected = helper(([number]: [number]) => {
    return number === this.args.paginationData.pageSize;
  });

  get shouldDisablePrevious(): boolean {
    return !!this.args.paginationData.isFirstPage || !!this.args.disabled;
  }

  get shouldDisableNext(): boolean {
    return !!this.args.paginationData.isLastPage || !!this.args.disabled;
  }

  @localCopy('args.pageSizes', [10, 15, 20, 25])
  pageSizes!: number[];

  @localCopy('args.showInfo', true)
  showInfo!: boolean;

  @localCopy('args.showPageSizeSelector', true)
  showPageSizeSelector!: boolean;

  @localCopy('args.showButtons', true)
  showButtons!: boolean;

  @action
  changePageSize(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    this.args.paginationActions.changePageSize(target.value);
  }

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
          {{#let (uniqueId) as |selectId|}}
            <label for="page-size-select-{{selectId}}">Rows per page:</label>
            <select
              id="page-size-select-{{selectId}}"
              disabled={{@disabled}}
              {{on "change" this.changePageSize}}
            >
              {{#each this.pageSizes as |pageSize|}}
                <option
                  value={{pageSize}}
                  selected={{this.isPaginationNumberSelected pageSize}}
                >{{pageSize}}</option>
              {{/each}}
            </select>
          {{/let}}
        </div>
      {{/if}}

      {{#if this.showButtons}}
        <button
          type="button"
          class={{@theme.pagination.previous}}
          disabled={{this.shouldDisablePrevious}}
          {{on "click" @paginationActions.previousPage}}
        >
          Previous
        </button>

        <button
          type="button"
          class={{@theme.pagination.next}}
          disabled={{this.shouldDisableNext}}
          {{on "click" @paginationActions.nextPage}}
        >
          Next
        </button>
      {{/if}}
    </div>
  </template>
}
