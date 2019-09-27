import Component from '@ember/component';
import { A } from '@ember/array';

import { tagName, className } from '@ember-decorators/component';
import { reads } from '@ember/object/computed';

import layout from './template';

/**
  Renders a `<tr>` element and yields the cell component.
  ```hbs
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
  ```
  Remember you can cutomize each `<tr>` class or `@onClick` handler based on the row data
  because you have access to it from the body component.

  ```hbs
  <table.body as |body person|>
    <body.row class={{if person.isInvalid "error"}} as |row|>
      <row.cell>
        {{person.firstName}}
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

  @yield {object} row
  @yield {Component} row.cell - the cell component
*/
@tagName('tr')
class Row extends Component {
  layout = layout;

  theme;

  columns;

  /**
   * Adds a click action to the row.
   */
  onClick;

  @className
  @reads('theme.tbodyRow')
  themeClass;

  @className
  @reads('theme.row')
  themeRowClass;

  cells = A();

  registerCell(cell) {
    let columns = this.get('columns');
    let prop = cell.get('prop');

    if (prop) {
      let column = columns.findBy('prop', prop);
      cell.set('column', column);
    } else {
      let index = this.get('cells.length');
      let column = columns.objectAt(index);
      cell.set('column', column);
    }

    this.get('cells').addObject(cell);
  }

  unregisterCell(cell) {
    this.get('cells').removeObject(cell);
  }

  click() {
    if (this.get('onClick')) {
      this.get('onClick')(...arguments);
    }
  }
}

export default Row;
