import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';

module('Integration | Component | yeti-table (a11y)', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.data = A([{
      firstName: 'Miguel',
      lastName: 'Andrade',
      points: 1
    }, {
      firstName: 'José',
      lastName: 'Baderous',
      points: 2
    }, {
      firstName: 'Maria',
      lastName: 'Silva',
      points: 3
    }, {
      firstName: 'Tom',
      lastName: 'Dale',
      points: 4
    }, {
      firstName: 'Yehuda',
      lastName: 'Katz',
      points: 5
    }]);
  });

  test('only sortable columns have role="button"', async function(assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName" @sortable={{false}}>
            First name
          </header.column>
          <header.column @prop="lastName">
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    assert.dom('thead tr th:nth-child(1)').hasNoAttribute('role');
    assert.dom('thead tr th:nth-child(2)').hasAttribute('role', 'button');
    assert.dom('thead tr th:nth-child(3)').hasAttribute('role', 'button');
  });

});
