import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

/**
  Renders a `<tbody>` element and yields the row component and data. You must iterate each row
  ```hbs
  <table.tbody as |body data|>
    {{#each data as |person index|}}
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
    {{/each}}
  </table.tbody>
  ```
  Remember that you must perform the {{#each}} to iterate over the `@data` array.

 This component does not provide a blockless variation

  @yield {object} body
  @yield {Component} body.row - the row component
  @yield {Array} data
*/
@tagName('')
class TBody extends Component {
  theme;

  data;

  columns;

  parent;

  /**
   * Adds a click action to each row, called with the clicked row's data as an argument.
   * Can be used with both the blockless and block invocations.
   */
  onRowClick;
}

export default TBody;
