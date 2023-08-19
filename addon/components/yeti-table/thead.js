import Component from '@glimmer/component';

/**
  Renders a `<thead>` element and yields the row component.

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

  @class THead
  @yield {object} head
  @yield {Component} head.row
*/
// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class THead extends Component {
  /**
   * Adds a click action to the thead, called with the clicked column as an argument.
   *
   * @argument onColumnClick - action that is called when the column header is clicked
   * @type Function
   */
}
