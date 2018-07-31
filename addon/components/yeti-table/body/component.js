import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, arrayOf } from '@ember-decorators/argument/type';

import layout from './template';

@tagName('tbody')
export default class Body extends Component {
  layout = layout;

  @argument
  @required
  // @type(arrayOf('object'))
  data;

  @argument
  @required
  @type(Component)
  parent;

  @argument
  @required
  @type(arrayOf(Component))
  columns;

  onRowClick() {}
}
