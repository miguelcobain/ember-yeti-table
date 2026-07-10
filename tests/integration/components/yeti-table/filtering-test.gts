import { render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import YetiTable from '#src/components/yeti-table';
import { hash } from '@ember/helper';
import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type { FilterFunction, Row, RowFilterFunction } from '#src/types';

interface PersonArgs {
  firstName: string | number;
  lastName: string | { nestedName: string };
  points: number;
}

class Person {
  @tracked firstName: string | number;
  @tracked lastName: string | { nestedName: string };
  @tracked points: number;
  [key: string]: unknown;

  constructor({ firstName, lastName, points }: PersonArgs) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.points = points;
  }
}

class TestParams {
  @tracked
  data?: Person[];
  @tracked
  filterText?: string;
  @tracked
  filterFirst?: string;
  @tracked
  filterLast?: string;
  @tracked
  filter?: FilterFunction;
  @tracked
  rowFilter?: RowFilterFunction;
  @tracked
  min?: number;
  @tracked
  max?: number;
}

function setupTestData(): TestParams {
  const testParams = new TestParams();

  testParams.data = [
    new Person({
      firstName: 'Miguel',
      lastName: 'Andrade',
      points: 1,
    }),
    new Person({
      firstName: 'José',
      lastName: 'Baderous',
      points: 2,
    }),
    new Person({
      firstName: 'Maria',
      lastName: 'Silva',
      points: 3,
    }),
    new Person({
      firstName: 'Tom',
      lastName: 'Pale',
      points: 4,
    }),
    new Person({
      firstName: 'Tom',
      lastName: 'Dale',
      points: 5,
    }),
  ];

  return testParams;
}

module('Integration | Component | yeti-table (filtering)', function (hooks) {
  setupRenderingTest(hooks);

  test('rendering with filter filters rows', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} @filter="Baderous" as |table|>

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName">
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('updating filter filters rows', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable
          @data={{testParams.data}}
          @filter={{testParams.filterText}}
          as |table|
        >

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName">
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />
          <div>rows length
            <span data-test-row-length>{{table.rows.length}}</span></div>
          <div>Total rows
            <span data-test-total-rows>{{table.totalRows}}</span></div>

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 5 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    assert.dom('[data-test-row-length]').hasText('5');
    assert.dom('[data-test-total-rows]').hasText('5');

    testParams.filterText = 'Baderous';

    await settled();

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');

    assert.dom('[data-test-row-length]').hasText('1');
    assert.dom('[data-test-total-rows]').hasText('1');
  });

  test('updating filter filters rows with nested property names', async function (assert) {
    const testParams = setupTestData();

    testParams.data!.forEach((item) => {
      item.lastName = {
        nestedName: item.lastName as string,
      };
    });
    await render(
      <template>
        <YetiTable
          @data={{testParams.data}}
          @filter={{testParams.filterText}}
          as |table|
        >

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName.nestedName">
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 5 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    testParams.filterText = 'Baderous';

    await settled();

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('rendering with filter on column filters rows', async function (assert) {
    const testParams = setupTestData();

    testParams.filterText = 'Baderous';

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName" @filter={{testParams.filterText}}>
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('updating filter on column filters rows', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName" @filter={{testParams.filterText}}>
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 5 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    testParams.filterText = 'Baderous';
    await settled();

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('rendering with filter on multiple column filters rows correctly', async function (assert) {
    const testParams = setupTestData();

    testParams.filterFirst = 'Tom';
    testParams.filterLast = '';

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" @filter={{testParams.filterFirst}}>
              First name
            </header.column>
            <header.column @prop="lastName" @filter={{testParams.filterLast}}>
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 2 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    testParams.filterLast = 'Dale';
    await settled();

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Dale');
  });

  test('changing a filtered property updates table', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} @filter="Tom" as |table|>

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName">
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 2 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    testParams.data![3]!.firstName = 123;
    await settled();

    assert.dom('tbody tr').exists({ count: 1 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
  });

  test('changing a filtered property updates table is ignored correctly', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable
          @data={{testParams.data}}
          @filter="Tom"
          @ignoreDataChanges={{true}}
          as |table|
        >

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName">
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 2 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    testParams.data![3]!.firstName = '123';
    await settled();

    assert.dom('tbody tr').exists({ count: 2 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('123');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
  });

  test('custom filter function', async function (assert) {
    const testParams = setupTestData();

    testParams.rowFilter = (row: Row, filter: unknown) => {
      const [prop, text] = String(filter).split(':');

      if (prop && text) {
        const value = (get(row, prop) as string | undefined) ?? '';
        return value.toUpperCase().includes(text.toUpperCase());
      } else {
        return true;
      }
    };

    testParams.filterText = 'firstName:tom';

    await render(
      <template>
        <YetiTable
          @data={{testParams.data}}
          @filterFunction={{testParams.rowFilter}}
          @filterUsing={{testParams.filterText}}
          as |table|
        >

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName">
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 2 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    testParams.filterText = 'lastName:baderous';
    await settled();

    assert.dom('tbody tr').exists({ count: 1 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Baderous');
  });

  test('custom filter function and filterUsing', async function (assert) {
    const testParams = setupTestData();

    testParams.rowFilter = (row: Row, filterUsing: unknown) => {
      const points = row.points as number;
      const range = filterUsing as { min: number; max: number };
      return points >= range.min && points <= range.max;
    };

    testParams.min = 0;
    testParams.max = 100;

    await render(
      <template>
        <YetiTable
          @data={{testParams.data}}
          @filterUsing={{hash min=testParams.min max=testParams.max}}
          @filterFunction={{testParams.rowFilter}}
          as |table|
        >

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName">
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 5 });

    testParams.min = 2;
    testParams.max = 4;

    await settled();

    assert.dom('tbody tr').exists({ count: 3 });
  });

  test('custom filter function and filterUsing on column', async function (assert) {
    const testParams = setupTestData();

    testParams.filter = ((
      points: unknown,
      filterUsing: { min: number; max: number },
    ) => {
      const n = points as number;
      return n >= filterUsing.min && n <= filterUsing.max;
    }) as FilterFunction;

    testParams.min = 0;
    testParams.max = 100;

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName">
              Last name
            </header.column>
            <header.column
              @prop="points"
              @filterUsing={{hash min=testParams.min max=testParams.max}}
              @filterFunction={{testParams.filter}}
            >
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 5 });

    testParams.min = 2;
    testParams.max = 4;

    await settled();

    assert.dom('tbody tr').exists({ count: 3 });
  });

  test('Filtering works when a column header does not have a property', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} @filter="Baderous" as |table|>

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName">
              Last name
            </header.column>
            <header.column @prop="points">
              Points
            </header.column>
            <header.column>
              Test blank column
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });
});
