import { _ as _applyDecoratedDescriptor, b as _initializerDefineProperty, a as _defineProperty } from '../../../../_rollupPluginBabelHelpers-DbQ2dxyI.js';
import { isArray } from '@ember/array';
import { assert } from '@ember/debug';
import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { localCopy } from 'tracked-toolbox';
import { on } from '@ember/modifier';
import { fn, hash } from '@ember/helper';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _Column;
let Column = (_dec = localCopy('args.visible', true), _dec2 = localCopy('args.sortable', true), _dec3 = localCopy('args.sort'), _dec4 = localCopy('args.filterable', true), _dec5 = localCopy('args.name'), _class = (_Column = class Column extends Component {
  /**
  * An important argument that Yeti Table uses to tie this column to a certain property on
  * each row object of the original `@data` (or `@loadFunction`) that was passed in.
  *
  * This is the argument that Yeti Table uses to filter and sort the data.
  *
  * This argument also allows Yeti Table to keep itself up to date when the original
  * data changes. NOTE: If this property is a nested property (one that contains periods),
  * the table will not update when this property changes. This is due to `@each` only supporting
  * one level of properties.
  *
  * If you don't need sorting, filtering or automatic table unrolling (using the blockless
  * body component), then this property is optional.
  *
  * @argument prop
  * @type {String}
  */
  get prop() {
    return this.args.prop;
  }
  /**
  * Set to `false` to hide the entire column across all rows. Keep in mind that this property
  * won't just hide the column using css. The DOM for the column will be removed. Defaults to `true`.
  *
  * @argument visible
  * @type {Boolean}
  */

  /**
  * The column filter. If passed in, Yeti Table will search this column for rows that contain this
  * string and show those rows.
  *
  * The column definitions `@filter` argument is subtractive, meaning that it will filter out rows
  * from the subset that passes the general `@filter`.
  *
  * @argument filter
  * @type {String}
  */
  get filter() {
    return this.args.filter;
  }
  /**
  * An optional function to customize the filtering logic *on this column*. This function should return true
  * or false to either include or exclude the row on the resulting set. If this function depends
  * on a value, pass that value as the `@filterUsing` argument.
  *
  * This function will be called with two arguments:
  * - `value` - the current data cell to use for filtering
  * - `filterUsing` - the value you passed in as `@filterUsing`
  *
  * @argument filterFunction
  * @type {Function}
  */
  get filterFunction() {
    return this.args.filterFunction;
  }
  /**
  * If you `@filterFunction` function depends on a different value (other that `@filter`)
  * to show, pass it in this argument. Yeti Table uses this argument to know when to recalculate
  * the fitlered rows.
  *
  * @argument filterUsing
  * @type {String}
  */
  get filterUsing() {
    return this.args.filterUsing;
  }
  /**
  * Used to add a class to all the cells in this column.
  *
  * @argument columnClass
  * @type {String}
  */
  get columnClass() {
    return this.args.columnClass;
  }
  /**
  * This property is a human-readable representation of the name of the column.
  * It defaults to the trimmed `textContent` of the `<th>` element, but can be overridden
  * by using a `@name="your custom name"` argument.
  *
  * @argument name
  * @type {String}
  */

  /**
  * An optional function to be invoked whenever this column is clicked
  *
  * This function will be called with two arguments:
  * - `column` - the column that was clicked
  *
  * @argument onClick
  * @type {Function}
  */
  get isAscSorted() {
    return this.sort === 'asc';
  }
  get isDescSorted() {
    return this.sort === 'desc';
  }
  get isSorted() {
    return this.isAscSorted || this.isDescSorted;
  }
  get normalizedSortSequence() {
    let sortSequence = this.args.sortSequence;
    assert('@sortSequence must be either a comma-separated string or an array. Got `${sortSequence}.`', isArray(sortSequence) || typeof sortSequence === 'string');
    if (isArray(sortSequence)) {
      return sortSequence;
    } else if (typeof sortSequence === 'string') {
      return sortSequence.split(',').map(s => s.trim());
    } else {
      return [];
    }
  }
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "visible", _descriptor, this);
    /**
    * Used to turn off sorting clicking on this column (clicks won't toggle sorting anymore).
    * Useful on avatar columns, for example, where a sorting order doesn't really make sense.
    * Defaults to the `<YetiTable>` `@sortable` argument (which in turn defaults to `true`).
    *
    * @argument sortable
    * @type Boolean
    */
    _initializerDefineProperty(this, "sortable", _descriptor2, this);
    /**
    * Optionally use an `asc` or `desc` string on this argument to turn on ascending or descending sorting
    * on this column. Useful to turn on default sortings on the table.
    * @argument sort
    * @type {String}
    */
    _initializerDefineProperty(this, "sort", _descriptor3, this);
    /**
    * Use `@sortSequence` to customize the sequence in which the sorting order will cycle when
    * clicking on this column header. You can either pass in a comma-separated string or an array
    * of strings. Accepted values are `'asc'`, `'desc'` and `'unsorted'`. The default value is `['asc', 'desc']`
    * or whatever the global table sortSequence value is.
    *
    * @argument sortSequence
    * @type Array
    */
    /**
    * Used to turn off filtering for this column. When `false`, Yeti Table won't look for
    * values on this column. Defaults to `true`.
    *
    * @argument filterable
    * @type {Boolean}
    */
    _initializerDefineProperty(this, "filterable", _descriptor4, this);
    _initializerDefineProperty(this, "name", _descriptor5, this);
    _defineProperty(this, "updateName", modifier(element => {
      if (!this.args.name) {
        this.name = element.textContent.trim();
      }
    }));
    _defineProperty(this, "noop", () => {});
    this.args.parent?.registerColumn(this);
  }
  willDestroy() {
    super.willDestroy(...arguments);
    this.args.parent?.unregisterColumn(this);
  }
}, setComponentTemplate(precompileTemplate("\n    {{!-- template-lint-disable no-invalid-interactive --}}\n    {{#if this.visible}}\n      <th role={{if this.sortable \"button\"}} class=\"{{@class}}\n          {{@theme.theadCell}}\n          {{if this.sortable @theme.sorting.columnSortable}}\n          {{if this.isSorted @theme.sorting.columnSorted}}\n          {{if this.isAscSorted @theme.sorting.columnSortedAsc}}\n          {{if this.isDescSorted @theme.sorting.columnSortedDesc}}\" {{on \"click\" (if this.sortable (fn @onClick this) this.noop)}} {{this.updateName}} ...attributes>\n        {{yield (hash isSorted=this.isSorted isAscSorted=this.isAscSorted isDescSorted=this.isDescSorted)}}\n      </th>\n    {{/if}}\n  ", {
  strictMode: true,
  scope: () => ({
    on,
    fn,
    hash
  })
}), _Column), _Column), _descriptor = _applyDecoratedDescriptor(_class.prototype, "visible", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "sortable", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "sort", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "filterable", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "name", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);

export { Column as default };
//# sourceMappingURL=column.js.map
