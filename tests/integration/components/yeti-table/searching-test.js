import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import '@ember/test-helpers';
import { A } from '@ember/array';
import { set, get } from '@ember/object';

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

  test('changing a filtered property updates table', async function(assert) {
    await render(hbs`
      {{#yeti-table searchText="Tom" data=data as |table|}}

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

    assert.dom('tbody tr').exists({ count: 2 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    set(this.data.objectAt(3), 'firstName', '123');
    await settled();

    assert.dom('tbody tr').exists({ count: 1 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
  });

  test('custom search function', async function(assert) {
    this.search = (row, searchText) => {
      let [prop, text] = searchText.split(':');

      if (prop && text) {
        let value = get(row, prop) || '';
        return value.toUpperCase().includes(text.toUpperCase());
      } else {
        return true;
      }
    };

    this.set('searchText', 'firstName:tom');

    await render(hbs`
      {{#yeti-table data=data searchValue=searchText search=(action search) as |table|}}

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

    assert.dom('tbody tr').exists({ count: 2 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    this.set('searchText', 'lastName:baderous');

    assert.dom('tbody tr').exists({ count: 1 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Baderous');
  });

  test('custom search function and searchValue', async function(assert) {
    this.search = (row, { min, max }) => {
      let points = get(row, 'points');
      return points >= min && points <= max;
    };

    this.set('min', 0);
    this.set('max', 100);

    await render(hbs`
      {{#yeti-table data=data searchValue=(hash min=min max=max) search=(action search) as |table|}}

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

    this.set('min', 2);
    this.set('max', 4);

    assert.dom('tbody tr').exists({ count: 3 });
  });

  test('custom search function and searchValue on column', async function(assert) {
    this.search = (points, { min, max }) => {
      return points >= min && points <= max;
    };

    this.set('min', 0);
    this.set('max', 100);

    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName"}}
            Last name
          {{/header.column}}
          {{#header.column prop="points" searchValue=(hash min=min max=max) search=(action search)}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr').exists({ count: 5 });

    this.set('min', 2);
    this.set('max', 4);

    assert.dom('tbody tr').exists({ count: 3 });
  });

});
