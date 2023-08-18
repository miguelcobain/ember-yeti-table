import { render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { A } from '@ember/array';
import { set, get } from '@ember/object';
import { run } from '@ember/runloop';

import { tracked } from '@glimmer/tracking';
import { hbs } from 'ember-cli-htmlbars';

class Person {
  @tracked firstName;
  @tracked lastName;
  @tracked points;

  constructor({ firstName, lastName, points }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.points = points;
  }
}

module('Integration | Component | yeti-table (filtering)', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.data = A([
      new Person({
        firstName: 'Miguel',
        lastName: 'Andrade',
        points: 1
      }),
      new Person({
        firstName: 'José',
        lastName: 'Baderous',
        points: 2
      }),
      new Person({
        firstName: 'Maria',
        lastName: 'Silva',
        points: 3
      }),
      new Person({
        firstName: 'Tom',
        lastName: 'Pale',
        points: 4
      }),
      new Person({
        firstName: 'Tom',
        lastName: 'Dale',
        points: 5
      })
    ]);
  });

  test('rendering with filter filters rows', async function (assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} @filter="Baderous" as |table|>

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

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('updating filter filters rows', async function (assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} @filter={{this.filterText}} as |table|>

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

  test('rendering with filter on column filters rows', async function (assert) {
    this.set('filterText', 'Baderous');

    await render(hbs`
      <YetiTable @data={{this.data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @filter={{this.filterText}}>
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('updating filter on column filters rows', async function (assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @filter={{this.filterText}}>
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
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

  test('rendering with filter on multiple column filters rows correctly', async function (assert) {
    this.set('filterFirst', 'Tom');
    this.set('filterLast', '');

    await render(hbs`
      <YetiTable @data={{this.data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName" @filter={{this.filterFirst}}>
            First name
          </header.column>
          <header.column @prop="lastName" @filter={{this.filterLast}}>
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    assert.dom('tbody tr').exists({ count: 2 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    this.set('filterLast', 'Dale');
    await settled();

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Dale');
  });

  test('changing a filtered property updates table', async function (assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} @filter="Tom" as |table|>

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

    assert.dom('tbody tr').exists({ count: 2 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    run(() => {
      this.data.objectAt(3).firstName = 123;
    });
    await settled();

    assert.dom('tbody tr').exists({ count: 1 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
  });

  test('changing a filtered property updates table is ignored correctly', async function (assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} @filter="Tom" @ignoreDataChanges={{true}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 2 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    run(() => {
      set(this.data.objectAt(3), 'firstName', '123');
    });
    await settled();

    assert.dom('tbody tr').exists({ count: 2 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('123');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');
  });

  test('custom filter function', async function (assert) {
    this.filter = (row, filter) => {
      let [prop, text] = filter.split(':');

      if (prop && text) {
        let value = get(row, prop) || '';
        return value.toUpperCase().includes(text.toUpperCase());
      } else {
        return true;
      }
    };

    this.set('filterText', 'firstName:tom');

    await render(hbs`
      <YetiTable @data={{this.data}} @filterFunction={{this.filter}} @filterUsing={{this.filterText}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 2 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Tom');

    this.set('filterText', 'lastName:baderous');
    await settled();

    assert.dom('tbody tr').exists({ count: 1 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Baderous');
  });

  test('custom filter function and filterUsing', async function (assert) {
    this.filter = (row, { min, max }) => {
      let points = get(row, 'points');
      return points >= min && points <= max;
    };

    this.set('min', 0);
    this.set('max', 100);

    await render(hbs`
      <YetiTable @data={{this.data}} @filterUsing={{hash min=this.min max=this.max}} @filterFunction={{this.filter}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 5 });

    this.set('min', 2);
    this.set('max', 4);

    assert.dom('tbody tr').exists({ count: 3 });
  });

  test('custom filter function and filterUsing on column', async function (assert) {
    this.filter = (points, { min, max }) => {
      return points >= min && points <= max;
    };

    this.set('min', 0);
    this.set('max', 100);

    await render(hbs`
      <YetiTable @data={{this.data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName">
            Last name
          </header.column>
          <header.column @prop="points" @filterUsing={{hash min=this.min max=this.max}} @filterFunction={{this.filter}}>
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    assert.dom('tbody tr').exists({ count: 5 });

    this.set('min', 2);
    this.set('max', 4);

    assert.dom('tbody tr').exists({ count: 3 });
  });

  test('Filtering works when a column header does not have a property', async function (assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} @filter="Baderous" as |table|>

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

        <table.body/>

      </YetiTable>
    `);

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });
});
