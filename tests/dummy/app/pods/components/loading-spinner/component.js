import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';

@tagName('')
export default class MaterialSpinner extends Component {

  @argument
  @type('string')
  width = '65px';

  @argument
  @type('string')
  height = '65px';

}
