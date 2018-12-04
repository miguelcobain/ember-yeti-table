import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { click } from '@ember/test-helpers';
import { A } from '@ember/array';

module('Integration | Component | yeti-table (general)', function(hooks) {
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
      lastName: 'Dale',
      points: 4
    }, {
      firstName: 'Yehuda',
      lastName: 'Katz',
      points: 5
    }]);
  });

  test('body blockless form renders table', async function(assert) {
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

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 3 });
    assert.dom('td').exists({ count: 5 * 3 });
  });

  test('body block form renders table', async function(assert) {
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

        <table.body as |body person|>
          <body.row as |row|>
            <row.cell>
              Custom {{person.firstName}}
            </row.cell>
            <row.cell>
              {{person.lastName}}
            </row.cell>
            <row.cell>
              {{person.points}}
            </row.cell>
          </body.row>
        </table.body>

      </YetiTable>
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Custom Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Custom José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Custom Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Custom Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Custom Yehuda');
  });

  test('trClass applies a class to the header tr element', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header @trClass="custom-tr-class" as |header|>
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

    assert.dom('thead > tr').hasClass('custom-tr-class');
  });

  test('columnClass applies a class to each column with blockless body', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @columnClass="custom-column-class">
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    let rows = this.element.querySelectorAll('tbody tr td:nth-child(2)');
    rows.forEach((r) => {
      assert.dom(r).hasClass('custom-column-class');
    });
  });

  test('columnClass applies a class to each column with block body', async function(assert) {
    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @columnClass="custom-column-class">
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body as |body person|>
          <body.row as |row|>
            <row.cell>
              Custom {{person.firstName}}
            </row.cell>
            <row.cell>
              {{person.lastName}}
            </row.cell>
            <row.cell>
              {{person.points}}
            </row.cell>
          </body.row>
        </table.body>

      </YetiTable>
    `);

    let rows = this.element.querySelectorAll('tbody tr td:nth-child(2)');
    rows.forEach((r) => {
      assert.dom(r).hasClass('custom-column-class');
    });
  });

  test('rowClass applies a class to each row', async function(assert) {
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

        <table.body @rowClass="custom-row-class"/>

      </YetiTable>
    `);

    let rows = this.element.querySelectorAll('tbody tr');
    rows.forEach((r) => {
      assert.dom(r).hasClass('custom-row-class');
    });
  });

  test('onRowClick action is triggered', async function(assert) {
    assert.expect(2);

    this.rowClicked = (p) => {
      assert.equal(p.firstName, 'Miguel');
    };

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

        <table.body @onRowClick={{action rowClicked}} />

      </YetiTable>
    `);

    await click('tbody tr:nth-child(1)');

    this.set('rowClicked', (p) => {
      assert.equal(p.firstName, 'Tom');
    });

    await click('tbody tr:nth-child(4)');
  });

  test('onClick action is triggered on row component', async function(assert) {
    assert.expect(2);

    this.rowClicked = (p) => {
      assert.equal(p.firstName, 'Miguel');
    };

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column>
            First name
          </header.column>
          <header.column>
            Last name
          </header.column>
          <header.column>
            Points
          </header.column>
        </table.header>

        <table.body as |body person|>
          <body.row @onClick={{action rowClicked person}} as |row|>
            <row.cell>
              Custom {{person.firstName}}
            </row.cell>
            <row.cell>
              {{person.lastName}}
            </row.cell>
            <row.cell>
              {{person.points}}
            </row.cell>
          </body.row>
        </table.body>

      </YetiTable>
    `);

    await click('tbody tr:nth-child(1)');

    this.set('rowClicked', (p) => {
      assert.equal(p.firstName, 'Tom');
    });

    await click('tbody tr:nth-child(4)');
  });

  test('renders with data with arrays', async function(assert) {
    this.data = [
      ['Miguel', 'Andrade', 1, 2, 3, 4],
      ['José', 'Baderous', 1, 2, 3, 4],
      ['Maria', 'Silva', 1, 2, 3, 4],
      ['Tom', 'Dale', 1, 2, 3, 4],
      ['Yehuda', 'Katz', 1, 2, 3, 4]
    ];

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="0">
            First name
          </header.column>
          <header.column @prop="1">
            Last name
          </header.column>
          <header.column @prop="2">
            Matches
          </header.column>
          <header.column @prop="3">
            Wins
          </header.column>
          <header.column @prop="4">
            Losses
          </header.column>
          <header.column @prop="5">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tbody tr').exists({ count: this.data.length });
    assert.dom('th').exists({ count: this.data[0].length });
    assert.dom('td').exists({ count: this.data.length * this.data[0].length });

    this.data.forEach((line, row) => {
      line.forEach((data, column) => {
        assert.dom(`tbody tr:nth-child(${row + 1}) td:nth-child(${column + 1})`).hasText(`${data}`);
      });
    })
  });

  test('column visibility works with blockless body', async function(assert) {
    this.visible = true;

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @visible={{visible}}>
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 3 });
    assert.dom('td').exists({ count: 5 * 3 });

    this.set('visible', false);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 2 });
    assert.dom('td').exists({ count: 5 * 2 });
  });

  test('column visibility works with block body', async function(assert) {
    this.visible = true;

    await render(hbs`
      <YetiTable @data={{data}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @visible={{visible}}>
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body as |body person|>
          <body.row as |row|>
            <row.cell>
              {{person.firstName}}
            </row.cell>
            <row.cell>
              {{person.lastName}}
            </row.cell>
            <row.cell>
              {{person.points}}
            </row.cell>
          </body.row>
        </table.body>

      </YetiTable>
    `);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 3 });
    assert.dom('td').exists({ count: 5 * 3 });

    this.set('visible', false);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 2 });
    assert.dom('td').exists({ count: 5 * 2 });
  });

  test('yielded totalColumns and totalRows are correct', async function(assert) {

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
          <header.column @prop="dummy" @visible={{false}}>
            Dummy
          </header.column>
        </table.header>

        <table.body/>

        <div id="totalColumns">{{table.totalColumns}}</div>
        <div id="visibleColumns">{{table.visibleColumns}}</div>
        <div id="totalRows">{{table.totalRows}}</div>
        <div id="visibleRows">{{table.visibleRows}}</div>

      </YetiTable>
    `);

    assert.dom('#totalColumns').hasText('4');
    assert.dom('#visibleColumns').hasText('3');
    assert.dom('#totalRows').hasText('5');
    assert.dom('#visibleRows').hasText('5');
  });
});
