import Component from '@ember/component';
import layout from '../../../../templates/components/yeti-table/table/header/column';
import { ChildMixin } from 'ember-composability-tools';

export default Component.extend(ChildMixin, {
  layout,
  tagName: '',
  orderable: true,
  searchable: true,
  visible: true
});
