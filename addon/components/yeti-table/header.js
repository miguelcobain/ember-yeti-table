import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, arrayOf, optional } from '@ember-decorators/argument/type';
import { Action } from '@ember-decorators/argument/types';

import layout from '../../templates/components/yeti-table/header';

@tagName('thead')
export default class Header extends Component {
  layout = layout;

  @argument
  @required
  @type(Component)
  parent;

  @argument
  @required
  @type(arrayOf(Component))
  columns;

  @argument
  @type(optional('string'))
  sortProperty = null;

  @argument
  @type('string')
  sortDirection = 'asc';

  @argument
  @required
  @type(Action)
  onColumnClick;

  @action
  onColumnClick(column, e) {
    if (this.get('onColumnClick') && column.get('sortable')) {
      this.get('onColumnClick')(column, e);
    }
  }
}
