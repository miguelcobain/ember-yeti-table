import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import '@ember/test-helpers';
import { A } from '@ember/array';
import { set, get } from '@ember/object';

module('Integration | Component | yeti-table (filtering)', function(hooks) {
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

  test('rendering with filterText filters rows', async function(assert) {
    this.set('filterText', 'Baderous');

    await render(hbs`
      {{#yeti-table data=data filterText=filterText as |table|}}

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

  test('updating filterText filters rows', async function(assert) {
    await render(hbs`
      {{#yeti-table data=data filterText=filterText as |table|}}

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

    this.set('filterText', 'Baderous');

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('rendering with filterText on column filters rows', async function(assert) {
    this.set('filterText', 'Baderous');

    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName" filterText=filterText}}
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

  test('updating filterText on column filters rows', async function(assert) {

    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName"}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName" filterText=filterText}}
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

    this.set('filterText', 'Baderous');
    await settled();

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('rendering with filterText on multiple column filters rows correctly', async function(assert) {
    this.set('filterTextFirst', 'Tom');
    this.set('filterTextLast', '');

    await render(hbs`
      {{#yeti-table data=data as |table|}}

        {{#table.header as |header|}}
          {{#header.column prop="firstName" filterText=filterTextFirst}}
            First name
          {{/header.column}}
          {{#header.column prop="lastName" filterText=filterTextLast}}
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

    this.set('filterTextLast', 'Dale');

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Dale');
  });

  test('changing a filtered property updates table', async function(assert) {
    await render(hbs`
      {{#yeti-table filterText="Tom" data=data as |table|}}

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

  test('custom filter function', async function(assert) {
    this.filter = (row, filterText) => {
      let [prop, text] = filterText.split(':');

      if (prop && text) {
        let value = get(row, prop) || '';
        return value.toUpperCase().includes(text.toUpperCase());
      } else {
        return true;
      }
    };

    this.set('filterText', 'firstName:tom');

    await render(hbs`
      {{#yeti-table data=data filterFunction=(action filter) filterUsing=filterText as |table|}}

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

    this.set('filterText', 'lastName:baderous');

    assert.dom('tbody tr').exists({ count: 1 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Baderous');
  });

  test('custom filter function and filterUsing', async function(assert) {
    this.filter = (row, { min, max }) => {
      let points = get(row, 'points');
      return points >= min && points <= max;
    };

    this.set('min', 0);
    this.set('max', 100);

    await render(hbs`
      {{#yeti-table data=data filterUsing=(hash min=min max=max) filterFunction=(action filter) as |table|}}

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

  test('custom filter function and filterUsing on column', async function(assert) {
    this.filter = (points, { min, max }) => {
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
          {{#header.column prop="points" filterUsing=(hash min=min max=max) filterFunction=(action filter)}}
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
