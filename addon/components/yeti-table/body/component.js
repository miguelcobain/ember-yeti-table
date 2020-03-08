import Component from '@ember/component';

import { tagName, layout } from '@ember-decorators/component';

import template from './template';

/**
  Renders a `<tbody>` element and yields the row component, row data and index.
  ```hbs
  <table.body as |body person index|>
    <body.row as |row|>
      <row.cell>
        {{person.firstName}} #{{index}}
      </row.cell>
      <row.cell>
        {{person.lastName}}
      </row.cell>
      <row.cell>
        {{person.points}}
      </row.cell>
    </body.row>
  </table.body>
  ```
  It can also be used as a blockless component to let yeti table automatically
  unroll thee rows for you, based on the `@prop` arguments you passed in to the
  column definition components.
  ```hbs
  <table.body/>
  ```
  Remember that this component's block will be rendered once per each item in the `@data` array.
  @yield {object} body
  @yield {Component} body.row - the row component
  @yield {Object} rowData - one item in the data array
  @yield {number} index
*/
@tagName('')
@layout(template)
class Body extends Component {
  theme;

  data;

  columns;

  parent;
  /**
   * Adds a click action to each row, called with the clicked row's data as an argument.
   * Can be used with both the blockless and block invocations.
   */
  onRowClick = () => {};
}

export default Body;
