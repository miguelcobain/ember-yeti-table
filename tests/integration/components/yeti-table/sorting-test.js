import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { A } from '@ember/array';
import { set, get } from '@ember/object';
import { compare } from '@ember/utils';

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
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('th').hasClass('yeti-table-sortable');
  });

  test('using sortable=false does not add the sortable class', async function(assert) {
    await render(hbs`
      {{#yeti-table sort="firstName" data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName" sortable=false}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('thead tr th:nth-child(1)').hasClass('yeti-table-sortable');
    assert.dom('thead tr th:nth-child(2)').doesNotHaveClass('yeti-table-sortable');
    assert.dom('thead tr th:nth-child(3)').hasClass('yeti-table-sortable');
  });

  test('default sort works', async function(assert) {
    await render(hbs`
      {{#yeti-table sort="firstName" data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
  });

  test('updating sort property works', async function(assert) {
    this.sort = 'firstName';

    await render(hbs`
      {{#yeti-table sort=sort data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    this.set('sort', 'lastName');

    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Baderous');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Dale');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Pale');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Silva');
  });

  test('updating sort direction works', async function(assert) {
    this.sort = 'firstName';

    await render(hbs`
      {{#yeti-table sort=sort data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    this.set('sort', 'firstName:desc');

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
  });

  test('default sort with direction works', async function(assert) {
    await render(hbs`
      {{#yeti-table sort="firstName:desc" data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
  });

  test('clicking on column header sorts', async function(assert) {
    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
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
  });

  test('shift clicking on column header adds a new sort', async function(assert) {
    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
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
      {{#yeti-table sort="firstName" data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    set(this.data.objectAt(3), 'firstName', '123');
    await settled();

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('123');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
  });

  test('using multiple properties on sort works', async function(assert) {
    await render(hbs`
      {{#yeti-table sort="firstName lastName" data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
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
      {{#yeti-table sortFunction=(action customSort) data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
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
      {{#yeti-table sort="firstName lastName" data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
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
      {{#yeti-table sort="firstName" data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass('yeti-table-sorted-asc');
  });

  test('default sort applies correct order class to header column (desc)', async function(assert) {
    await render(hbs`
      {{#yeti-table sort="firstName:desc" data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass('yeti-table-sorted-desc');
  });

  test('clicking on column header applies correct class', async function(assert) {
    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    // not sorted
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').doesNotHaveClass('yeti-table-sorted-asc');
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').doesNotHaveClass('yeti-table-sorted-desc');

    await click('thead th:nth-child(1)');

    // it is sorted ascending
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass('yeti-table-sorted-asc');

    await click('thead th:nth-child(1)');

    // it is sorted descending
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass('yeti-table-sorted-desc');
  });

  test('column header yields order status correctly', async function(assert) {
    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName" as |column|}}
            First name
            {{#if column.isAscSorted}}
              <div class="up-arrow"></div>
            {{else if column.isDescSorted}}
              <div class="down-arrow"></div>
            {{/if}}
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
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
});
