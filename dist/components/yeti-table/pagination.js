import { _ as _applyDecoratedDescriptor, a as _defineProperty, b as _initializerDefineProperty } from '../../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import { action } from '@ember/object';
import { helper } from '@ember/component/helper';
import Component from '@glimmer/component';
import { localCopy } from 'tracked-toolbox';
import { on } from '@ember/modifier';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _dec, _dec2, _dec3, _dec4, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _Pagination;
let Pagination = (_dec = localCopy('args.pageSizes', [10, 15, 20, 25]), _dec2 = localCopy('args.showInfo', true), _dec3 = localCopy('args.showPageSizeSelector', true), _dec4 = localCopy('args.showButtons', true), _class = (_Pagination = class Pagination extends Component {
  constructor(...args) {
    super(...args);
    // theme;
    // paginationData;
    // paginationActions;
    // disabled;
    // helper function used, needed while working with ember <= 4.4. Works without helper function in ember > 4.4
    _defineProperty(this, "isPaginationNumberSelected", helper(([number]) => {
      return number === this.args.paginationData.pageSize;
    }));
    /**
    * Array of page sizes to populate the page size `<select>`.
    * Particularly useful with an array helper, e.g `@pageSizes={{array 10 12 23 50 100}}`
    * Defaults to `[10, 15, 20, 25]`.
    *
    * @argument pageSizes
    * @type {Number}
    */
    _initializerDefineProperty(this, "pageSizes", _descriptor, this);
    /**
    * Used to show/hide some textual information about the current page. Defaults to `true`.
    *
    * @argument showInfo
    * @type {Boolean}
    */
    _initializerDefineProperty(this, "showInfo", _descriptor2, this);
    /**
    * Used to show/hide the page size selector. Defaults to `true`.
    *
    * @argument showPageSizeSelector
    * @type {Boolean}
    */
    _initializerDefineProperty(this, "showPageSizeSelector", _descriptor3, this);
    /**
    * Used to show/hide the previous and next page buttons. Defaults to `true`.
    *
    * @argument showButtons
    * @type {Boolean}
    */
    _initializerDefineProperty(this, "showButtons", _descriptor4, this);
  }
  get shouldDisablePrevious() {
    return this.args.paginationData.isFirstPage || this.args.disabled;
  }
  get shouldDisableNext() {
    return this.args.paginationData.isLastPage || this.args.disabled;
  }
  changePageSize(ev) {
    this.args.paginationActions.changePageSize(ev.target.value);
  }
}, setComponentTemplate(precompileTemplate("\n    <div class={{@theme.pagination.controls}} ...attributes>\n      {{#if this.showInfo}}\n        <div class={{@theme.pagination.info}}>\n          Showing\n          {{@paginationData.pageStart}}\n          to\n          {{@paginationData.pageEnd}}\n          of\n          {{@paginationData.totalRows}}\n          entries\n        </div>\n      {{/if}}\n\n      {{#if this.showPageSizeSelector}}\n        <div class={{@theme.pagination.pageSize}}>\n          Rows per page:\n          <select disabled={{@disabled}} {{on \"change\" this.changePageSize}}>\n            {{#each this.pageSizes as |pageSize|}}\n              <option value={{pageSize}} selected={{this.isPaginationNumberSelected pageSize}}>{{pageSize}}</option>\n            {{/each}}\n          </select>\n        </div>\n      {{/if}}\n\n      {{#if this.showButtons}}\n        <button type=\"button\" class={{@theme.pagination.previous}} disabled={{this.shouldDisablePrevious}} {{on \"click\" @paginationActions.previousPage}}>\n          Previous\n        </button>\n\n        <button type=\"button\" class={{@theme.pagination.next}} disabled={{this.shouldDisableNext}} {{on \"click\" @paginationActions.nextPage}}>\n          Next\n        </button>\n      {{/if}}\n    </div>\n  ", {
  strictMode: true,
  scope: () => ({
    on
  })
}), _Pagination), _Pagination), _descriptor = _applyDecoratedDescriptor(_class.prototype, "pageSizes", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "showInfo", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "showPageSizeSelector", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "showButtons", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class.prototype, "changePageSize", [action], Object.getOwnPropertyDescriptor(_class.prototype, "changePageSize"), _class.prototype), _class);

export { Pagination as default };
//# sourceMappingURL=pagination.js.map
