import Component from '@glimmer/component';

/**
  Renders a `<tfoot>` element and yields the row component.
  ```hbs
  <table.tfoot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.tfoot>
  ```

  @yield {object} footer
  @yield {Component} footer.row
*/

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
class TFoot extends Component {}

export default TFoot;
