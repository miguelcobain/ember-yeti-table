import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';

@tagName('')
class MaterialPagination extends Component {
  table;

  @action
  changePageSize(ev) {
    this.table.actions.changePageSize(ev.target.value);
  }
}

export default MaterialPagination;
