import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  render,
  settled,
  triggerEvent
} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { A } from '@ember/array';
import { set, get } from '@ember/object';
import { compare } from '@ember/utils';
import { run } from '@ember/runloop';
import DEFAULT_THEME from 'ember-yeti-table/-private/themes/default-theme';

module('Integration | Component | yeti-table (sorting)', function(hooks) {
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
      lastName: 'Pale',
      points: 4
    }, {
      firstName: 'Tom',
      lastName: 'Dale',
      points: 5
    }]);
  });

  test('by default all columns are sortable and have the sortable class', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    assert.dom('th').hasClass(DEFAULT_THEME.sorting.columnSortable);
  });

  test('using @sortable={{false}} on <YetiTable> does not add the sortable classes to all collumns', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} @sortable={{false}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    assert.dom('thead tr th:nth-child(1)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortable);
    assert.dom('thead tr th:nth-child(2)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortable);
    assert.dom('thead tr th:nth-child(3)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortable);
  });

  test('using sortable=false does not add the sortable class', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    assert.dom('thead tr th:nth-child(1)').hasClass(DEFAULT_THEME.sorting.columnSortable);
    assert.dom('thead tr th:nth-child(2)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortable);
    assert.dom('thead tr th:nth-child(3)').hasClass(DEFAULT_THEME.sorting.columnSortable);
  });

  test('default sort works', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
  });

  test('updating sort property works', async function(assert) {
    this.firstNameSort = 'asc';

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName" @sort={{firstNameSort}}>
            First name
          </header.column>
          <header.column @prop="lastName" @sort={{lastNameSort}}>
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    this.set('firstNameSort', null);
    this.set('lastNameSort', 'asc');

    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Baderous');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Dale');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Pale');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Silva');
  });

  test('updating sort direction works', async function(assert) {
    this.sort = 'asc';

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName" @sort={{sort}}>
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

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    this.set('sort', 'desc');

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
  });

  test('default sort with direction works', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
  });

  test('clicking on column header sorts (default @orderSequence)', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

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

  test('clicking on column header sorts (custom @orderSequence)', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} @sortSequence="desc,asc,unsorted" as |table|>

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

        <table.body/>

      </YetiTable>
    `);

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

  test('clicking on column header sorts (custom @orderSequence on column)', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} @sortSequence="desc,asc" as |table|>

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

        <table.body/>

      </YetiTable>
    `);

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

  test('shift clicking on column header adds a new sort', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

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

  test('changing a sorted property updates sorting', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    run(() => {
      set(this.data.objectAt(3), 'firstName', '123');
    });
    await settled();

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('123');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
  });

  test('using multiple properties on sort works', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

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

  test('sortFunction function works', async function(assert) {
    function pointsComparator(a, b) {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }

      return 0;
    }

    this.set('customSort', (a, b, sortings) => {
      let compareValue;

      for (let { prop, direction } of sortings) {
        let comparator = prop === 'points' ? pointsComparator : compare;
        let valueA = get(a, prop);
        let valueB = get(b, prop);

        compareValue = direction === 'asc' ? comparator(valueA, valueB) : -comparator(valueA, valueB);

        if (compareValue !== 0) {
          break;
        }
      }

      return compareValue;
    });

    await render(hbs`
      <YetiTable @data={{data}} @sortFunction={{action customSort}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

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

  test('using sort and clicking header afterwards works', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

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

  test('default sort applies correct order class to header column', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(DEFAULT_THEME.sorting.columnSortedAsc);
  });

  test('default sort applies correct order class to header column (desc)', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(DEFAULT_THEME.sorting.columnSortedDesc);
  });

  test('sort does not apply sort direction class to header column when @useSortIndicator={{true}}', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header @useSortIndicator={{true}} as |header|>
          <header.column @prop="firstName" @sort="asc" as |column|>
            First name
            <column.sortIndicator/>
          </header.column>
          <header.column @prop="lastName" @sort="desc" as |column|>
            Last name
            <column.sortIndicator/>
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    assert.dom('thead tr:nth-child(1) th:nth-child(1)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortedAsc);
    assert.dom('thead tr:nth-child(1) th:nth-child(1) i').hasClass(DEFAULT_THEME.sorting.columnSortedAsc);

    assert.dom('thead tr:nth-child(1) th:nth-child(2)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortedDesc);
    assert.dom('thead tr:nth-child(1) th:nth-child(2) i').hasClass(DEFAULT_THEME.sorting.columnSortedDesc);

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.head @useSortIndicator={{true}} as |head|>
          <head.row as |row|>
            <row.column @prop="firstName" @sort="asc" as |column|>
              First name
              <column.sortIndicator/>
            </row.column>
            <row.column @prop="lastName" @sort="desc" as |column|>
              Last name
              <column.sortIndicator/>
            </row.column>
            <row.column @prop="points">
              Points
            </row.column>
          </head.row>        
        </table.head>

        <table.body/>

      </YetiTable>
    `);

    assert.dom('thead tr:nth-child(1) th:nth-child(1)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortedAsc);
    assert.dom('thead tr:nth-child(1) th:nth-child(1) i').hasClass(DEFAULT_THEME.sorting.columnSortedAsc);

    assert.dom('thead tr:nth-child(1) th:nth-child(2)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortedDesc);
    assert.dom('thead tr:nth-child(1) th:nth-child(2) i').hasClass(DEFAULT_THEME.sorting.columnSortedDesc);
  });

  test('clicking on column header applies correct class', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    // not sorted
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortedAsc);
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortedDesc);

    await click('thead th:nth-child(1)');

    // it is sorted ascending
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(DEFAULT_THEME.sorting.columnSortedAsc);

    await click('thead th:nth-child(1)');

    // it is sorted descending
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(DEFAULT_THEME.sorting.columnSortedDesc);
  });

  test('column header yields order status correctly', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    // not sorted
    assert.dom('thead tr:nth-child(1) th:nth-child(1) .up-arrow').doesNotExist();
    assert.dom('thead tr:nth-child(1) th:nth-child(1) .down-arrow').doesNotExist();

    await click('thead th:nth-child(1)');

    // it is sorted ascending
    assert.dom('thead tr:nth-child(1) th:nth-child(1) .up-arrow').exists();
    assert.dom('thead tr:nth-child(1) th:nth-child(1) .down-arrow').doesNotExist();

    await click('thead th:nth-child(1)');

    // it is sorted descending
    assert.dom('thead tr:nth-child(1) th:nth-child(1) .down-arrow').exists();
    assert.dom('thead tr:nth-child(1) th:nth-child(1) .up-arrow').doesNotExist();
  });

  test('clicking on column header applies correct class', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    // not sorted
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortedAsc);
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortedDesc);

    await click('thead th:nth-child(1)');

    // it is sorted ascending
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(DEFAULT_THEME.sorting.columnSortedAsc);

    await click('thead th:nth-child(1)');

    // it is sorted descending
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(DEFAULT_THEME.sorting.columnSortedDesc);
  });

});
