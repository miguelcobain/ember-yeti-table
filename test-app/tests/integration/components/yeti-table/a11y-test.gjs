import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import YetiTable from 'ember-yeti-table/components/yeti-table';
import { fn } from '@ember/helper';

module('Integration | Component | yeti-table (a11y)', function (hooks) {
  setupRenderingTest(hooks);

  let data;

  hooks.beforeEach(function () {
    data = [
      {
        firstName: 'Miguel',
        lastName: 'Andrade',
        points: 1
      },
      {
        firstName: 'José',
        lastName: 'Baderous',
        points: 2
      },
      {
        firstName: 'Maria',
        lastName: 'Silva',
        points: 3
      },
      {
        firstName: 'Tom',
        lastName: 'Dale',
        points: 4
      },
      {
        firstName: 'Yehuda',
        lastName: 'Katz',
        points: 5
      }
    ];
  });

  test('only sortable columns have role="button"', async function (assert) {
    await render(<template>
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName' @sortable={{false}}>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    assert.dom('thead tr th:nth-child(1)').hasNoAttribute('role');
    assert.dom('thead tr th:nth-child(2)').hasAttribute('role', 'button');
    assert.dom('thead tr th:nth-child(3)').hasAttribute('role', 'button');
  });

  test('not clickable rows do not have role="button"', async function (assert) {
    await render(<template>
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    assert.dom('tbody tr').hasNoAttribute('role');
  });

  test('clickable rows have role="button"', async function (assert) {
    class TestParams {
      noop;
    }

    const testParams = new TestParams();

    await render(<template>
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body @onRowClick={{fn (mut testParams.noop) true}} />

      </YetiTable>
    </template>);

    assert.dom('tbody tr').hasAttribute('role');
  });
});
