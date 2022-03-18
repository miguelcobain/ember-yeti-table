import { isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { action } from '@ember/object';

import Component from '@glimmer/component';
import { localCopy } from 'tracked-toolbox';

/**
  An important component yielded from the header or head.row component that is used to define
  a column of the table.

  ```hbs
  <table.header as |header|>
    <header.column @prop="firstName" as |column|>
      First name
      {{if column.isAscSorted "(sorted asc)"}}
      {{if column.isDescSorted "(sorted desc)"}}
    </header.column>
  </table.header>
  ```

  ```hbs
  <table.thead as |head|>
    <head.row as |row|>
      <row.column @prop="firstName" as |column|>
        First name
        {{if column.isAscSorted "(sorted asc)"}}
        {{if column.isDescSorted "(sorted desc)"}}
      </row.column>
    </head.row>
  </table.thead>
  ```

  @yield {object} column
  @yield {boolean} column.isSorted - `true` if column is sorted ascending or descending
  @yield {boolean} column.isAscSorted - `true` if column is sorted ascending
  @yield {boolean} column.isDescSorted - `true` if column is sorted descending
*/
export default class Column extends Component {
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
  @localCopy('args.visible', true)
  visible;

  /**
   * Used to turn off sorting clicking on this column (clicks won't toggle sorting anymore).
   * Useful on avatar columns, for example, where a sorting order doesn't really make sense.
   * Defaults to the `<YetiTable>` `@sortable` argument (which in turn defaults to `true`).
   *
   * @argument sortable
   * @type Boolean
   */
  @localCopy('args.sortable', true)
  sortable;

  /**
   * Optionally use an `asc` or `desc` string on this argument to turn on ascending or descending sorting
   * on this column. Useful to turn on default sortings on the table.

   * @argument sort
   * @type {String}
   */
  @localCopy('args.sort')
  sort;

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
  @localCopy('args.filterable', true)
  filterable;

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
   */
  @localCopy('args.name')
  name;

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
    assert(
      '@sortSequence must be either a comma-separated string or an array. Got `${sortSequence}.`',
      isArray(sortSequence) || typeof sortSequence === 'string'
    );

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

    this.args.parent?.registerColumn(this);
  }

  @action
  runLoadData() {
    this.args.parent?.runLoadData();
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.args.parent?.unregisterColumn(this);
  }

  @action
  updateName(element) {
    if (!this.args.name) {
      this.name = element.textContent.trim();
    }
  }

  noop = () => {};
}
