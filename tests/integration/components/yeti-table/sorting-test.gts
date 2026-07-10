import { click, render, settled, triggerEvent } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { tracked } from '@glimmer/tracking';

import { get, set } from '@ember/object';
import { compare } from '@ember/utils';

import DEFAULT_THEME from '#src/themes/default-theme';

import YetiTable from '#src/components/yeti-table';

import type { Row, SortDirection } from '#src/types';
import type { Comparator } from '#src/utils/sorting-utils';

type SortingEntry = { prop: string; direction: SortDirection };
type CustomSortFn = (
  a: Row,
  b: Row,
  sortings: SortingEntry[],
  compareFn: Comparator,
) => number;

class TestParams {
  @tracked
  data?: Row[];
  @tracked
  sort?: SortDirection | null;
  @tracked
  firstNameSort?: SortDirection | null;
  @tracked
  lastNameSort?: SortDirection | null;
  @tracked
  customSort?: CustomSortFn;
}

function setupTestData(): TestParams {
  const testParams = new TestParams();

  testParams.data = [
    {
      firstName: 'Miguel',
      lastName: 'Andrade',
      points: 1,
    },
    {
      firstName: 'José',
      lastName: 'Baderous',
      points: 2,
    },
    {
      firstName: 'Maria',
      lastName: 'Silva',
      points: 3,
    },
    {
      firstName: 'Tom',
      lastName: 'Pale',
      points: 4,
    },
    {
      firstName: 'Tom',
      lastName: 'Dale',
      points: 5,
    },
  ];

  return testParams;
}

module('Integration | Component | yeti-table (sorting)', function (hooks) {
  setupRenderingTest(hooks);

  test('by default all columns are sortable and have the sortable class', async function (assert) {
    const testParams = setupTestData();

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
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    assert.dom('th').hasClass(DEFAULT_THEME.sorting.columnSortable);
  });

  test('using @sortable={{false}} on <YetiTable> does not add the sortable classes to all collumns', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} @sortable={{false}} as |table|>

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

    assert
      .dom('thead tr th:nth-child(1)')
      .doesNotHaveClass(DEFAULT_THEME.sorting.columnSortable);
    assert
      .dom('thead tr th:nth-child(2)')
      .doesNotHaveClass(DEFAULT_THEME.sorting.columnSortable);
    assert
      .dom('thead tr th:nth-child(3)')
      .doesNotHaveClass(DEFAULT_THEME.sorting.columnSortable);
  });

  test('using sortable=false does not add the sortable class', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName">
              First name
            </header.column>
            <header.column @prop="lastName" @sortable={{false}}>
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

    assert
      .dom('thead tr th:nth-child(1)')
      .hasClass(DEFAULT_THEME.sorting.columnSortable);
    assert
      .dom('thead tr th:nth-child(2)')
      .doesNotHaveClass(DEFAULT_THEME.sorting.columnSortable);
    assert
      .dom('thead tr th:nth-child(3)')
      .hasClass(DEFAULT_THEME.sorting.columnSortable);
  });

  test('default sort works', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" @sort="asc">
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

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
  });

  test('default sort works with nested property names', async function (assert) {
    const testParams = setupTestData();

    testParams.data!.forEach((item) => {
      item.firstName = {
        nestedName: item.firstName,
      };
    });
    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName.nestedName" @sort="asc">
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

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
  });

  test('updating sort property works', async function (assert) {
    const testParams = setupTestData();

    testParams.firstNameSort = 'asc';

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" @sort={{testParams.firstNameSort}}>
              First name
            </header.column>
            <header.column @prop="lastName" @sort={{testParams.lastNameSort}}>
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

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    testParams.firstNameSort = null;
    testParams.lastNameSort = 'asc';

    await settled();

    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Baderous');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Dale');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Pale');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Silva');
  });

  test('updating sort direction works', async function (assert) {
    const testParams = setupTestData();

    testParams.sort = 'asc';

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" @sort={{testParams.sort}}>
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

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    testParams.sort = 'desc';
    await settled();

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
  });

  test('default sort with direction works', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" @sort="desc">
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

    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
  });

  test('clicking on column header sorts (default @orderSequence)', async function (assert) {
    const testParams = setupTestData();

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
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    // not sorted
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // it is sorted ascending
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // it is sorted descending
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // ascending again
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
  });

  test('clicking on column header sorts (custom @orderSequence)', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable
          @data={{testParams.data}}
          @sortSequence="desc,asc,unsorted"
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

    // not sorted
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // it is sorted descending
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // it is sorted ascending
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // not sorted
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // it is sorted descending again
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
  });

  test('clicking on column header sorts (custom @orderSequence on column)', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable
          @data={{testParams.data}}
          @sortSequence="desc,asc"
          as |table|
        >

          <table.header as |header|>
            <header.column @prop="firstName" @sortSequence="desc,asc,unsorted">
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

    // not sorted
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // it is sorted descending
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // it is sorted ascending
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // not sorted
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    await click('thead th:nth-child(1)');

    // it is sorted descending again
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
  });

  test('shift clicking on column header adds a new sort', async function (assert) {
    const testParams = setupTestData();

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
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    // not sorted
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Baderous');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Silva');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Pale');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Dale');

    await click('thead th:nth-child(1)');

    // it is sorted ascending
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Baderous');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Silva');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Pale');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Dale');

    await triggerEvent('thead th:nth-child(2)', 'click', { shiftKey: true });

    // it is sorted by first name AND last name
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Baderous');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Silva');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Dale');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Pale');
  });

  test('changing a sorted property updates sorting', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" @sort="asc">
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

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    set(testParams.data![3]!, 'firstName', '123');
    await settled();

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('123');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
  });

  test('changing a sorted property updates sorting is ignored correctly', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable
          @data={{testParams.data}}
          @ignoreDataChanges={{true}}
          as |table|
        >

          <table.header as |header|>
            <header.column @prop="firstName" @sort="asc">
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

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    set(testParams.data![3]!, 'firstName', '123');
    await settled();

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('123');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
  });

  test('using multiple properties on sort works', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" @sort="asc">
              First name
            </header.column>
            <header.column @prop="lastName" @sort="asc">
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

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Baderous');

    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Silva');

    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Andrade');

    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Dale');

    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Pale');
  });

  test('sortFunction function works', async function (assert) {
    const testParams = setupTestData();

    const pointsComparator: Comparator = (a, b) => {
      if ((a as number) > (b as number)) {
        return 1;
      } else if ((a as number) < (b as number)) {
        return -1;
      }

      return 0;
    };

    testParams.customSort = (a, b, sortings) => {
      let compareValue = 0;

      for (const { prop, direction } of sortings) {
        const comparator: Comparator =
          prop === 'points' ? pointsComparator : compare;
        const valueA = get(a, prop);
        const valueB = get(b, prop);

        compareValue =
          direction === 'asc'
            ? comparator(valueA, valueB)
            : -comparator(valueA, valueB);

        if (compareValue !== 0) {
          break;
        }
      }

      return compareValue;
    };

    await render(
      <template>
        <YetiTable
          @data={{testParams.data}}
          @sortFunction={{testParams.customSort}}
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

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');

    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Baderous');

    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Silva');

    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Pale');

    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Dale');

    await click('thead th:nth-child(3)');
    await click('thead th:nth-child(3)');

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Dale');

    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Pale');

    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Silva');

    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Baderous');

    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Andrade');
  });

  test('using sort and clicking header afterwards works', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" @sort="asc">
              First name
            </header.column>
            <header.column @prop="lastName" @sort="asc">
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

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Baderous');

    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Silva');

    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Andrade');

    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Dale');

    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Pale');

    await click('thead th:nth-child(3)');

    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('1');
    assert.dom('tbody tr:nth-child(2) td:nth-child(3)').hasText('2');
    assert.dom('tbody tr:nth-child(3) td:nth-child(3)').hasText('3');
    assert.dom('tbody tr:nth-child(4) td:nth-child(3)').hasText('4');
    assert.dom('tbody tr:nth-child(5) td:nth-child(3)').hasText('5');
  });

  test('default sort applies correct order class to header column', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" @sort="asc">
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

    assert
      .dom('thead tr:nth-child(1) th:nth-child(1)')
      .hasClass(DEFAULT_THEME.sorting.columnSortedAsc);
  });

  test('default sort applies correct order class to header column (desc)', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" @sort="desc">
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

    assert
      .dom('thead tr:nth-child(1) th:nth-child(1)')
      .hasClass(DEFAULT_THEME.sorting.columnSortedDesc);
  });

  test('clicking on column header applies correct class', async function (assert) {
    const testParams = setupTestData();

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
            <header.column @prop="points">
              Points
            </header.column>
          </table.header>

          <table.body />

        </YetiTable>
      </template>,
    );

    // not sorted
    assert
      .dom('thead tr:nth-child(1) th:nth-child(1)')
      .doesNotHaveClass(DEFAULT_THEME.sorting.columnSortedAsc);
    assert
      .dom('thead tr:nth-child(1) th:nth-child(1)')
      .doesNotHaveClass(DEFAULT_THEME.sorting.columnSortedDesc);

    await click('thead th:nth-child(1)');

    // it is sorted ascending
    assert
      .dom('thead tr:nth-child(1) th:nth-child(1)')
      .hasClass(DEFAULT_THEME.sorting.columnSortedAsc);

    await click('thead th:nth-child(1)');

    // it is sorted descending
    assert
      .dom('thead tr:nth-child(1) th:nth-child(1)')
      .hasClass(DEFAULT_THEME.sorting.columnSortedDesc);
  });

  test('column header yields order status correctly', async function (assert) {
    const testParams = setupTestData();

    await render(
      <template>
        <YetiTable @data={{testParams.data}} as |table|>

          <table.header as |header|>
            <header.column @prop="firstName" as |column|>
              First name
              {{#if column.isAscSorted}}
                <div class="up-arrow"></div>
              {{else if column.isDescSorted}}
                <div class="down-arrow"></div>
              {{/if}}
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

    // not sorted
    assert
      .dom('thead tr:nth-child(1) th:nth-child(1) .up-arrow')
      .doesNotExist();
    assert
      .dom('thead tr:nth-child(1) th:nth-child(1) .down-arrow')
      .doesNotExist();

    await click('thead th:nth-child(1)');

    // it is sorted ascending
    assert.dom('thead tr:nth-child(1) th:nth-child(1) .up-arrow').exists();
    assert
      .dom('thead tr:nth-child(1) th:nth-child(1) .down-arrow')
      .doesNotExist();

    await click('thead th:nth-child(1)');

    // it is sorted descending
    assert.dom('thead tr:nth-child(1) th:nth-child(1) .down-arrow').exists();
    assert
      .dom('thead tr:nth-child(1) th:nth-child(1) .up-arrow')
      .doesNotExist();
  });
});
