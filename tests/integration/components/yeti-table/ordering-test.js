import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import '@ember/test-helpers';
import { A } from '@ember/array';
import { set } from '@ember/object';

module('Integration | Component | yeti-table (ordering)', function(hooks) {
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

  test('default sortProperty works', async function(assert) {
    await render(hbs`
      {{#yeti-table sortProperty="firstName" data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');
  });

  test('updating sortProperty works', async function(assert) {
    this.sortProperty = 'firstName';

    await render(hbs`
      {{#yeti-table sortProperty=sortProperty data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    this.set('sortProperty', 'lastName');

    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(2) td:nth-child(2)').hasText('Baderous');
    assert.dom('tbody tr:nth-child(3) td:nth-child(2)').hasText('Dale');
    assert.dom('tbody tr:nth-child(4) td:nth-child(2)').hasText('Pale');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Silva');
  });

  test('updating sortDirection works', async function(assert) {
    this.sortDirection = 'asc';

    await render(hbs`
      {{#yeti-table sortProperty="firstName" sortDirection=sortDirection data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    this.set('sortDirection', 'desc');

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('José');
  });

  test('default sortProperty and sortDirection works', async function(assert) {
    await render(hbs`
      {{#yeti-table sortProperty="firstName" sortDirection="desc" data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

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
      {{#yeti-table data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

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

  test('changing a sorted property updates ordering', async function(assert) {
    await render(hbs`
      {{#yeti-table sortProperty="firstName" data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

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

  test('sortDefinition works', async function(assert) {
    await render(hbs`
      {{#yeti-table sortDefinition="firstName lastName" data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

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

  test('default sortProperty applies correct order class to header', async function(assert) {
    await render(hbs`
      {{#yeti-table sortProperty="firstName" data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

      {{/yeti-table}}
    `);

    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass('yeti-table-sorted-asc');
  });

  test('default sortProperty applies correct order class to header (desc)', async function(assert) {
    await render(hbs`
      {{#yeti-table sortProperty="firstName" sortDirection="desc" data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

      {{/yeti-table}}
    `);

    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass('yeti-table-sorted-desc');
  });

  test('clicking on column header applies correct class', async function(assert) {
    await render(hbs`
      {{#yeti-table data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

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
      {{#yeti-table data=data as |yeti|}}

        {{#yeti.table as |table|}}
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
        {{/yeti.table}}

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
