import { action } from '@ember/object';

import Component from '@glimmer/component';

export default class MaterialPagination extends Component {
  @action
  changePageSize(ev) {
    this.args.table.actions.changePageSize(ev.target.value);
  }
}
