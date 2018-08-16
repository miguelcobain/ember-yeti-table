import Component from '@ember/component';
import DidChangeAttrsComponent from 'ember-yeti-table/-private/utils/did-change-attrs-component';

import { equal, or } from '@ember-decorators/object/computed';
import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, optional } from '@ember-decorators/argument/type';
import { Action } from '@ember-decorators/argument/types';

import layout from './template';

/**
  An important component yielded from the header component that is used to define
  a column of the table.
  ```hbs
  <header.column @prop="firstName" as |column|>
    First name
    {{if column.isAscSorted "(sorted asc)"}}
    {{if column.isDescSorted "(sorted desc)"}}
  </header.column>
  ```

  @yield {object} column
  @yield {boolean} column.isSorted - `true` if column is sorted ascending or descending
  @yield {boolean} column.isAscSorted - `true` if column is sorted ascending
  @yield {boolean} column.isDescSorted - `true` if column is sorted descending
*/
@tagName('')
export default class Column extends DidChangeAttrsComponent {
  layout = layout;

  @argument
  @required
  @type(Component)
  parent;

  /**
   * An important argument that Yeti Table uses to tiw this column to a certain property on
   * each row object of the original `@data` (or `@loadFunction`) that was passed in.
   *
   * This is the argument that allows Yeti Table to keep itself up to date when the original
   * data changes.
   *
   * If you don't need sorting, filtering or automatic table unrolling (using the blockless
   * body component), then this property is optional.
   */
  @argument
  @type(optional('string'))
  prop;

  /**
   * Set to `false` to hide the entire column across all rows. Keep in mind that this property
   * won't just hide the column using css. The DOM for the column will be removed. Defaults to `true`.
   */
  @argument
  @type('boolean')
  visible = true;

  /**
   * Used to turn off sorting clicking on this column (clicks won't toggle sorting anymore).
   * Useful on avatar columns, for example, where a sorting order doesn't really make sense.
   * Defaults to the `<YetiTable>` `@sortable` argument (which in turn defaults to `true`).
   */
  @argument
  @type('boolean')
  sortable = true;

  /**
   * Optionally use an `asc` or `desc` string on this argument to turn on ascending or descending sorting
   * on this column. Useful to turn on default sortings on the table.
   */
  @argument
  @type(optional('string'))
  sort = null;

  /**
   * Used to turn off filtering for this column. When `false`, Yeti Table won't look for
   * values on this column. Defaults to `true`.
   */
  @argument
  @type('boolean')
  filterable = true;

  /**
   * The column filter. If passed in, Yeti Table will search this column for rows that contain this
   * string and show those rows.
   *
   * The column definitions `@filter` argument is subtractive, meaning that it will filter out rows
   * from the subset that passes the general `@filter`.
   */
  @argument
  @type(optional('string'))
  filter;

  /**
   * An optional function to customize the filtering logic *on this column*. This function should return true
   * or false to either include or exclude the row on the resulting set. If this function depends
   * on a value, pass that value as the `@filterUsing` argument.
   *
   * This function will be called with two arguments:
   * - `value` - the current data cell to use for filtering
   * - `filterUsing` - the value you passed in as `@filterUsing`
   */
  @argument
  @type(optional(Function))
  filterFunction;

  /**
   * If you `@filterFunction` function depends on a different value (other that `@filter`)
   * to show, pass it in this argument. Yeti Table uses this argument to know when to recalculate
   * the fitlered rows.
   */
  @argument
  @type(optional('any'))
  filterUsing;

  /**
   * Used to add a class to all the cells in this column.
   */
  @argument
  @type(optional('string'))
  columnClass;

  @argument
  @required
  @type(Action)
  onClick;

  @equal('sort', 'asc') isAscSorted;

  @equal('sort', 'desc') isDescSorted;

  @or('isAscSorted', 'isDescSorted') isSorted;

  init() {
    super.init(...arguments);

    this.didChangeAttrsConfig = {
      attrs: ['filter', 'filterUsing', 'sort']
    };

    if (this.get('parent')) {
      this.get('parent').registerColumn(this);
    }
  }

  didChangeAttrs() {
    this.get('parent').runLoadData();
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    if (this.get('parent')) {
      this.get('parent').unregisterColumn(this);
    }
  }
}
