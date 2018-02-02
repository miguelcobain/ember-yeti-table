import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('yeti-table/body/row', 'Integration | Component | yeti table/body/row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{yeti-table/body/row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#yeti-table/body/row}}
      template block text
    {{/yeti-table/body/row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
