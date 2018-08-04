import Component from '@ember/component';

import { equal, or } from '@ember-decorators/object/computed';
import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, optional } from '@ember-decorators/argument/type';
import { Action } from '@ember-decorators/argument/types';

import layout from './template';

@tagName('')
export default class Column extends Component {
  layout = layout;

  @argument
  @required
  @type(Component)
  parent;

  @argument
  @type(optional('string'))
  prop;

  @argument
  @required
  @type('boolean')
  visible = true;

  @argument
  @required
  @type('boolean')
  sortable = true;

  @argument
  @type(optional('string'))
  sort = null;

  @argument
  @required
  @type('boolean')
  filterable = true;

  @argument
  @type(optional('string'))
  filter;

  @argument
  @type(optional(Function))
  filterFunction;

  @argument
  @type(optional('any'))
  filterUsing;

  @argument
  @type(optional('string'))
  columnClass;

  @argument
  @required
  @type(Action)
  onClick;

  @equal('sort', 'asc') isAscSorted;

  @equal('sort', 'desc') isDescSorted;

  @or('isAscSorted', 'isDescSorted') isSorted;

  init() {
    super.init(...arguments);
    if (this.get('parent')) {
      this.get('parent').registerColumn(this);
    }
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    if (this.get('parent')) {
      this.get('parent').unregisterColumn(this);
    }
  }
}
