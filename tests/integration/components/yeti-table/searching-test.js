import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import '@ember/test-helpers';
import { A } from '@ember/array';

module('Integration | Component | yeti-table (searching)', function(hooks) {
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

  test('rendering with searchText filters rows', async function(assert) {
    this.set('searchText', 'Baderous');

    await render(hbs`
      {{#yeti-table data=data searchText=searchText as |table|}}

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

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('updating searchText filters rows', async function(assert) {
    await render(hbs`
      {{#yeti-table data=data searchText=searchText as |table|}}

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

    assert.dom('tbody tr').exists({ count: 5 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    this.set('searchText', 'Baderous');

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('rendering with searchText on column filters rows', async function(assert) {
    this.set('searchText', 'Baderous');

    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName" searchText=searchText}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('updating searchText on column filters rows', async function(assert) {

    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName" searchText=searchText}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr').exists({ count: 5 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom');

    this.set('searchText', 'Baderous');
    await settled();

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('rendering with searchText on multiple column filters rows correctly', async function(assert) {
    this.set('searchTextFirst', 'Tom');
    this.set('searchTextLast', '');

    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName" searchText=searchTextFirst}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName" searchText=searchTextLast}}
            Last name
          {{/header.column}}
          {{#header.column prop="points"}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr').exists({ count: 2 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    this.set('searchTextLast', 'Dale');

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Dale');
  });
});