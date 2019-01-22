import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';

@tagName('')
export default class MaterialSpinner extends Component {

  @argument('string')
  width = '65px';

  @argument('string')
  height = '65px';

}
