import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';

@tagName('')
export default class MaterialPagination extends Component {

  @argument
  @required
  table;
}
