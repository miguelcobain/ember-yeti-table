import Component from '@ember/component';

import { computed } from '@ember-decorators/object';
import { bool } from '@ember-decorators/object/computed';
import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, optional, arrayOf } from '@ember-decorators/argument/type';
import { Action } from '@ember-decorators/argument/types';

import layout from './template';

@tagName('')
export default class Column extends Component {
  layout = layout;

  @argument
  @type(optional('string'))
  prop;

  @argument
  @required
  @type('boolean')
  sortable = true;

  @argument
  @required
  @type('boolean')
  visible = true;

  @argument
  @required
  @type('boolean')
  filterable = true;

  @argument
  @type(optional('string'))
  filterText;

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
  @type(arrayOf('object'))
  sortings;

  @argument
  @required
  @type(Action)
  onClick;

  @computed('sortings.@each.prop', 'prop')
  get sorting() {
    return this.get('sortings').find((s) => s.prop === this.get('prop'));
  }

  @bool('sorting') isSorted;

  @computed('isSorted', 'sorting.direction')
  get isAscSorted() {
    return this.get('isSorted') && this.get('sorting.direction') === 'asc';
  }

  @computed('isSorted', 'sorting.direction')
  get isDescSorted() {
    return this.get('isSorted') && this.get('sorting.direction') === 'desc';
  }

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
