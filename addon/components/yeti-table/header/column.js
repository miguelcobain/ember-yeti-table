import Component from '@ember/component';

import { computed } from '@ember-decorators/object';
import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, optional } from '@ember-decorators/argument/type';
import { Action } from '@ember-decorators/argument/types';

import layout from '../../../templates/components/yeti-table/header/column';

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
  @type(optional(Action))
  filterFunction;

  @argument
  @type(optional('any'))
  filterUsing;

  @argument
  @type(optional('string'))
  columnClass;

  @argument
  @type(optional('string'))
  sortProperty;

  @argument
  @type('string')
  sortDirection;

  @computed('sortProperty', 'prop')
  get isSorted() {
    return this.get('sortProperty') === this.get('prop');
  }

  @computed('isSorted', 'sortDirection')
  get isAscSorted() {
    return this.get('isSorted') && this.get('sortDirection') === 'asc';
  }

  @computed('isSorted', 'sortDirection')
  get isDescSorted() {
    return this.get('isSorted') && this.get('sortDirection') === 'desc';
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
