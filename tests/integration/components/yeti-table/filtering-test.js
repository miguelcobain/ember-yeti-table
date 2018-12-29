import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { A } from '@ember/array';
import { set, get } from '@ember/object';
import { run } from '@ember/runloop';

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

  test('rendering with filter filters rows', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} @filter="Baderous" as |table|>

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

  test('updating filter filters rows', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} @filter={{filterText}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
  });

  test('rendering with filter on column filters rows', async function(assert) {
    this.set('filterText', 'Baderous');

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @filter={{filterText}}>
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

  test('updating filter on column filters rows', async function(assert) {

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @filter={{filterText}}>
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

  test('rendering with filter on multiple column filters rows correctly', async function(assert) {
    this.set('filterFirst', 'Tom');
    this.set('filterLast', '');

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName" @filter={{filterFirst}}>
            First name
          </header.column>
          <header.column @prop="lastName" @filter={{filterLast}}>
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

    assert.dom('tbody tr').exists({ count: 1 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Dale');
  });

  test('changing a filtered property updates table', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} @filter="Tom" as |table|>

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

    assert.dom('tbody tr').exists({ count: 1 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Tom');
  });

  test('custom filter function', async function(assert) {
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
      <YetiTable @data={{data}} @filterFunction={{action filter}} @filterUsing={{filterText}} as |table|>

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
      <YetiTable @data={{data}} @filterUsing={{hash min=min max=max}} @filterFunction={{action filter}} as |table|>

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

  test('custom filter function and filterUsing on column', async function(assert) {
    this.filter = (points, { min, max }) => {
      return points >= min && points <= max;
    };

    this.set('min', 0);
    this.set('max', 100);

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName">
            Last name
          </header.column>
          <header.column @prop="points" @filterUsing={{hash min=min max=max}} @filterFunction={{action filter}}>
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

  test('Allows for Column filtering in the header', async function(assert) {

    this.visibleTest = true;

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.head as |head|>
          <head.row as |row|>
            <row.column @prop="firstName" @filter={{firstNameFilter}} data-column="test-column">
              First name
            </row.column>
            <row.column @prop="lastName" @filter={{lastNameFilter}}>
              Last name
            </row.column>
            <row.column @visible={{visibleTest}} @prop="points" @filter={{pointsFilter}}>
              Points
            </row.column>
          </head.row>
          
          <head.row as |row|>
            <row.cell>
                <input
                  class="input" type="search" placeholder="Search first name"
                  value={{firstNameFilter}}
                  oninput={{action (mut firstNameFilter) value="target.value"}}>
            </row.cell>
            <row.cell>
                <input
                  class="input" type="search" placeholder="Search last name"
                  value={{lastNameFilter}}
                  oninput={{action (mut lastNameFilter) value="target.value"}}>
            </row.cell>
            <row.cell>
                <input
                  class="input" type="search" placeholder="Search points"
                  value={{pointsFilter}}
                  oninput={{action (mut pointsFilter) value="target.value"}}>
            </row.cell>
          </head.row>
          
        </table.head>

        <table.body/>

      </YetiTable>
    `);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('thead tr').exists({ count: 2 });
    assert.dom('thead th').exists({ count: 6 });

    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody td').exists({ count: 5 * 3 });

    assert.dom('thead tr:nth-child(2) th:nth-child(1) input').hasAttribute("placeholder", "Search first name");
    assert.dom('thead tr:nth-child(2) th:nth-child(2) input').hasAttribute("placeholder", "Search last name");
    assert.dom('thead tr:nth-child(2) th:nth-child(3) input').hasAttribute("placeholder", "Search points");

    await fillIn('thead tr:nth-child(2) th:nth-child(2) input', "s");

    assert.dom('tbody tr').exists({ count: 2 });

    this.set('visibleTest', false);

    assert.dom('tbody td').exists({ count: 2 * 2 });

  });

});
