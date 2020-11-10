import { tagName, layout } from '@ember-decorators/component';
import { A } from '@ember/array';
import Component from '@ember/component';
import { next } from '@ember/runloop';

import template from './template';

/**
  Renders a `<tr>` element and yields cell component.
  ```hbs
  <table.tfoot as |foot|>
    <foot.row as |row|>
      <row.cell>
        Footer content
      </row.cell>
    </foot.row>
  </table.tfoot>
  ```

  @yield {object} row
  @yield {Component} row.cell
*/
@tagName('')
@layout(template)
class TFootRow extends Component {
  theme;

  parent;

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
      let column = columns[index];
      cell.set('column', column);
    }

    this.get('cells').addObject(cell);
  }

  unregisterCell(cell) {
    next(this, () => {
      this.get('cells').removeObject(cell);
    });
  }
}

export default TFootRow;
