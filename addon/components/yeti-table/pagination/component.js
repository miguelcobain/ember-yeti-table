import Component from '@ember/component';

import { classNames } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type, arrayOf } from '@ember-decorators/argument/type';

import layout from './template';

@classNames('yeti-table-pagination-controls')
export default class Header extends Component {
  layout = layout;

  @argument
  @required
  @type('object')
  paginationData;

  @argument
  @required
  @type('object')
  paginationActions;

  @argument
  @type(arrayOf('number'))
  pageSizes = [
    10, 15, 20, 25
  ];

  @argument
  @type('boolean')
  showInfo = true;

  @argument
  @type('boolean')
  showPageSizeSelector = true;

  @argument
  @type('boolean')
  showButtons = true;

}
