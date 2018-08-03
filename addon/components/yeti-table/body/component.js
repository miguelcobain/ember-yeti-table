import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, arrayOf, unionOf, shapeOf, optional } from '@ember-decorators/argument/type';
import { Action } from '@ember-decorators/argument/types';

import layout from './template';

@tagName('tbody')
export default class Body extends Component {
  layout = layout;

  @argument
  @required
  @type(
    unionOf(
      arrayOf('object'),
      shapeOf({ then: Function })
    )
  )
  data;

  @argument
  @required
  @type(arrayOf(Component))
  columns;

  @argument
  @required
  @type(Component)
  parent;

  @argument
  @type(optional('string'))
  rowClass;

  @argument
  @required
  @type(Component)
  parent;

  @argument
  @type(optional(Action))
  onRowClick = () => {};
}
