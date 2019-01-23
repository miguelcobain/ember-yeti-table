import Component from '@ember/component';
import { A } from '@ember/array';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { arrayOf } from '@ember-decorators/argument/types';

import layout from './template';

/**
  Renders a `<tr>` element and yields cell component.
  ```hbs
  <table.foot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.head>
  ```

  @yield {object} row
  @yield {Component} row.cell
*/
@tagName('')
class Row extends Component {
  layout = layout;

  @argument(Component)
  parent;

  @argument(arrayOf(Component))
  columns;

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

}


export default Row;
