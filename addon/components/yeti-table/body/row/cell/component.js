import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type } from '@ember-decorators/argument/type';

import layout from './template';

@tagName('')
export default class Cell extends Component {
  layout = layout;

  @argument
  @required
  @type(Component)
  parent;

  init() {
    super.init(...arguments);
    if (this.get('parent')) {
      this.get('parent').registerCell(this);
    }
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    if (this.get('parent')) {
      this.get('parent').unregisterCell(this);
    }
  }
}
