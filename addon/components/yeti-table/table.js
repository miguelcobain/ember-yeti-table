import Component from '@ember/component';
import layout from '../../templates/components/yeti-table/table';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { ParentMixin } from 'ember-composability-tools';

export default Component.extend(ParentMixin, {
  layout,
  tagName: 'table',

  headerComponent: computed('childComponents.@each._isHeader', function() {
    return this.get('childComponents').findBy('_isHeader');
  }),

  columns: reads('headerComponent.childComponents'),

  bodyComponent: computed('childComponents.@each._isBody', function() {
    return this.get('childComponents').findBy('_isBody');
  })
});
