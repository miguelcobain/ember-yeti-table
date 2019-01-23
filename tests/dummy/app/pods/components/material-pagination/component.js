import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';

@tagName('')
class MaterialPagination extends Component {

  @argument('object')
  table;
}

export default MaterialPagination;
