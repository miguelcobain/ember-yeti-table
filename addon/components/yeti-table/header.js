import Component from '@ember/component';
import layout from '../../templates/components/yeti-table/header';
import { ParentMixin, ChildMixin } from 'ember-composability-tools';

export default Component.extend(ParentMixin, ChildMixin, {
  layout,
  tagName: ''
});
