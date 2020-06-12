import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | yeti-table-eq', function (hooks) {
  setupRenderingTest(hooks);

  test('returns true when two identical arguments are passed in', async function (assert) {
    this.set('inputValue', '1234');

    await render(hbs`
      {{#if (yeti-table-eq inputValue "1234")}}
        works!
      {{/if}}
    `);

    assert.equal(this.element.textContent.trim(), 'works!');
  });

  test('returns false when two different arguments are passed in', async function (assert) {
    this.set('inputValue', '1234');

    await render(hbs`
      {{#if (yeti-table-eq inputValue 1234)}}
        works!
      {{else}}
        not work
      {{/if}}
    `);

    assert.equal(this.element.textContent.trim(), 'not work');
  });
});
