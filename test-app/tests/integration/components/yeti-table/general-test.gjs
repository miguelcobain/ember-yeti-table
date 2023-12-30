import { render, settled, waitFor } from '@ember/test-helpers';
import { click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { tracked } from '@glimmer/tracking';

import sinon from 'sinon';

import DEFAULT_THEME from 'ember-yeti-table/themes/default-theme';

import YetiTable from 'ember-yeti-table/components/yeti-table';
import { fn, get } from '@ember/helper';

class TestParams {
  @tracked
  data;
  @tracked
  rowClicked;
  @tracked
  visible;
  @tracked
  isColumnVisible;
  @tracked
  registerApi;
  @tracked
  tableApi;
}

module('Integration | Component | yeti-table (general)', function (hooks) {
  setupRenderingTest(hooks);

  let testParams;

  hooks.beforeEach(function () {
    testParams = new TestParams();

    testParams.data = [
      {
        firstName: 'Miguel',
        lastName: 'Andrade',
        points: 1,
        address: {
          city: 'New York'
        }
      },
      {
        firstName: 'José',
        lastName: 'Baderous',
        points: 2,
        address: {
          city: 'New York'
        }
      },
      {
        firstName: 'Maria',
        lastName: 'Silva',
        points: 3,
        address: {
          city: 'New York'
        }
      },
      {
        firstName: 'Tom',
        lastName: 'Dale',
        points: 4,
        address: {
          city: 'Portland'
        }
      },
      {
        firstName: 'Yehuda',
        lastName: 'Katz',
        points: 5,
        address: {
          city: 'Portland'
        }
      }
    ];
  });

  test('body blockless form renders table', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    assert.dom('table').exists({ count: 1 });
    assert.dom('table').hasClass(DEFAULT_THEME.table);
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 3 });
    assert.dom('td').exists({ count: 5 * 3 });
  });

  test('body block form renders table', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body as |body person|>
          <body.row as |row|>
            <row.cell>
              Custom
              {{person.firstName}}
            </row.cell>
            <row.cell as |column|>
              {{get person column.prop}}
            </row.cell>
            <row.cell>
              {{person.points}}
            </row.cell>
          </body.row>
        </table.body>

      </YetiTable>
    </template>);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Custom Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Custom José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Custom Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Custom Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Custom Yehuda');
  });

  test('tbody block form renders table and test performs each', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.tbody as |body data|>
          {{#each data as |person|}}
            <body.row as |row|>
              <row.cell>
                Custom
                {{person.firstName}}
              </row.cell>
              <row.cell>
                {{person.lastName}}
              </row.cell>
              <row.cell>
                {{person.points}}
              </row.cell>
            </body.row>
          {{/each}}
        </table.tbody>

      </YetiTable>
    </template>);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Custom Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Custom José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Custom Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Custom Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Custom Yehuda');
  });

  test('supports nested properties', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='address.city'>
            City
          </header.column>
        </table.header>

        <table.body as |body person|>
          <body.row as |row|>
            <row.cell>
              Custom
              {{person.firstName}}
            </row.cell>
            <row.cell>
              {{person.lastName}}
            </row.cell>
            <row.cell>
              {{person.address.city}}
            </row.cell>
          </body.row>
        </table.body>

      </YetiTable>
    </template>);

    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('New York');
    assert.dom('tbody tr:nth-child(2) td:nth-child(3)').hasText('New York');
    assert.dom('tbody tr:nth-child(3) td:nth-child(3)').hasText('New York');
    assert.dom('tbody tr:nth-child(4) td:nth-child(3)').hasText('Portland');
    assert.dom('tbody tr:nth-child(5) td:nth-child(3)').hasText('Portland');
  });

  test('renders table using head and foot components', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.thead as |head|>
          <head.row as |row|>
            <row.column @prop='firstName'>
              First name
            </row.column>
            <row.column @prop='lastName'>
              Last name
            </row.column>
            <row.column @prop='points'>
              Points
            </row.column>
          </head.row>
        </table.thead>

        <table.body />

        <table.tfoot as |foot|>
          <foot.row as |row|>
            <row.cell>
              Footer first Name
            </row.cell>
            <row.cell>
              Footer last Name
            </row.cell>
            <row.cell>
              Footer points
            </row.cell>
          </foot.row>
        </table.tfoot>

      </YetiTable>
    </template>);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tfoot').exists({ count: 1 });
    assert.dom('tr').exists({ count: 1 + 5 + 1 });
    assert.dom('th').exists({ count: 3 });
    assert.dom('td').exists({ count: 5 * 3 + 3 });
  });

  test('trClass applies a class to the header tr element', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header @trClass='custom-tr-class' as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    assert.dom('thead > tr').hasClass('custom-tr-class');
  });

  test('columnClass applies a class to each column with blockless body', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName' @columnClass='custom-column-class'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    let rows = this.element.querySelectorAll('tbody tr td:nth-child(2)');
    rows.forEach(r => {
      assert.dom(r).hasClass('custom-column-class');
    });
  });

  test('columnClass applies a class to each column with block body', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName' @columnClass='custom-column-class'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body as |body person|>
          <body.row as |row|>
            <row.cell>
              Custom
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
    </template>);

    let rows = this.element.querySelectorAll('tbody tr td:nth-child(2)');
    rows.forEach(r => {
      assert.dom(r).hasClass('custom-column-class');
    });
  });

  // eslint-disable-next-line qunit/require-expect
  test('onRowClick action is triggered', async function (assert) {
    assert.expect(2);

    testParams.rowClicked = p => {
      assert.strictEqual(p.firstName, 'Miguel');
    };

    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body @onRowClick={{testParams.rowClicked}} />

      </YetiTable>
    </template>);

    await click('tbody tr:nth-child(1)');

    testParams.rowClicked = p => {
      assert.strictEqual(p.firstName, 'Tom');
    };

    await click('tbody tr:nth-child(4)');
  });

  // eslint-disable-next-line qunit/require-expect
  test('onClick action is triggered on row component', async function (assert) {
    assert.expect(2);

    testParams.rowClicked = p => {
      assert.strictEqual(p.firstName, 'Miguel');
    };

    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

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
          <body.row @onClick={{fn testParams.rowClicked person}} as |row|>
            <row.cell>
              Custom
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
    </template>);

    await click('tbody tr:nth-child(1)');

    testParams.rowClicked = p => {
      assert.strictEqual(p.firstName, 'Tom');
    };

    await click('tbody tr:nth-child(4)');
  });

  test('renders with data with arrays', async function (assert) {
    testParams.data = [
      ['Miguel', 'Andrade', 1, 2, 3, 4],
      ['José', 'Baderous', 1, 2, 3, 4],
      ['Maria', 'Silva', 1, 2, 3, 4],
      ['Tom', 'Dale', 1, 2, 3, 4],
      ['Yehuda', 'Katz', 1, 2, 3, 4]
    ];

    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='0'>
            First name
          </header.column>
          <header.column @prop='1'>
            Last name
          </header.column>
          <header.column @prop='2'>
            Matches
          </header.column>
          <header.column @prop='3'>
            Wins
          </header.column>
          <header.column @prop='4'>
            Losses
          </header.column>
          <header.column @prop='5'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tbody tr').exists({ count: testParams.data.length });
    assert.dom('th').exists({ count: testParams.data[0].length });
    assert.dom('td').exists({ count: testParams.data.length * testParams.data[0].length });

    testParams.data.forEach((line, row) => {
      line.forEach((data, column) => {
        assert.dom(`tbody tr:nth-child(${row + 1}) td:nth-child(${column + 1})`).hasText(`${data}`);
      });
    });
  });

  test('column visibility works with blockless body', async function (assert) {
    testParams.visible = true;

    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName' @visible={{testParams.visible}}>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 3 });
    assert.dom('td').exists({ count: 5 * 3 });

    testParams.visible = false;

    await settled();

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 2 });
    assert.dom('td').exists({ count: 5 * 2 });
  });

  test('column visibility works with block body', async function (assert) {
    testParams.visible = true;

    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName' @visible={{testParams.visible}}>
            Last name
          </header.column>
          <header.column @prop='points'>
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
    </template>);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 3 });
    assert.dom('td').exists({ count: 5 * 3 });

    testParams.visible = false;

    await settled();

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 2 });
    assert.dom('td').exists({ count: 5 * 2 });
  });

  test('column visibility works with @isColumnVisible', async function (assert) {
    testParams.isColumnVisible = c => {
      return ['firstName', 'points'].includes(c.prop);
    };

    await render(<template>
      <YetiTable @data={{testParams.data}} @isColumnVisible={{testParams.isColumnVisible}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
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
    </template>);

    assert.dom('table').exists({ count: 1 });
    assert.dom('thead').exists({ count: 1 });
    assert.dom('tbody').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    assert.dom('th').exists({ count: 2 });
    assert.dom('td').exists({ count: 5 * 2 });
  });

  test('yielded columns, visibleColumns, totalRows and visibleRows are correct', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
          <header.column @prop='dummy' @visible={{false}}>
            Dummy
          </header.column>
        </table.header>

        <table.body />

        <div id='totalColumns'>{{table.columns.length}}</div>
        <div id='visibleColumns'>{{table.visibleColumns.length}}</div>
        <div id='totalRows'>{{table.totalRows}}</div>
        <div id='rows'>{{table.rows.length}}</div>
        <div id='visibleRows'>{{table.visibleRows.length}}</div>
      </YetiTable>
    </template>);

    assert.dom('#totalColumns').hasText('4');
    assert.dom('#visibleColumns').hasText('3');
    assert.dom('#totalRows').hasText('5');
    assert.dom('#rows').hasText('5');
    assert.dom('#visibleRows').hasText('5');
  });

  test('can add arbitrary attributes to columns and cells', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column class='custom-class' @columnClass='column-class' data-column='test-column'>
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
          <body.row as |row|>
            <row.cell class='cell-class' data-cell='test-cell'>
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
    </template>);

    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasAttribute('data-column', 'test-column');
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass('custom-class');
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(DEFAULT_THEME.sorting.columnSortable);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasAttribute('data-cell', 'test-cell');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasClass('column-class');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasClass('cell-class');
  });

  test('@renderTableElement={{false}} and yielded table component render correctly', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} @renderTableElement={{false}} as |table|>

        <table.table>
          <table.header as |header|>
            <header.column @prop='firstName'>
              First name
            </header.column>
            <header.column @prop='lastName'>
              Last name
            </header.column>
            <header.column @prop='points'>
              Points
            </header.column>
          </table.header>

          <table.body as |body person|>
            <body.row as |row|>
              <row.cell>
                Custom
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
        </table.table>

      </YetiTable>
    </template>);

    assert.dom('table').exists({ count: 1 });
    assert.dom('tr').exists({ count: 6 });
    await waitFor('tbody tr:nth-child(1) td:nth-child(1)');
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Custom Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Custom José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Custom Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Custom Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Custom Yehuda');
  });

  test('yielded columns have a name property equal to the trimmed textContent of the headers', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

        <table.tfoot as |foot|>
          <foot.row as |row|>
            {{#each table.columns as |c|}}
              <row.cell>
                {{c.name}}
              </row.cell>
            {{/each}}
          </foot.row>
        </table.tfoot>

      </YetiTable>
    </template>);

    assert.dom('tfoot > tr > td').exists({ count: 3 });
    assert.dom('tfoot tr:nth-child(1) td:nth-child(1)').hasText('First name');
    assert.dom('tfoot tr:nth-child(1) td:nth-child(2)').hasText('Last name');
    assert.dom('tfoot tr:nth-child(1) td:nth-child(3)').hasText('Points');
  });

  test('yielded columns have a name property equal to the @name argument, overriding the default', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName' @name='First name yo!'>
            First name
          </header.column>
          <header.column @prop='lastName' @name='Last name yo!'>
            Last name
          </header.column>
          <header.column @prop='points' @name='Points yo!'>
            Points
          </header.column>
        </table.header>

        <table.body />

        <table.tfoot as |foot|>
          <foot.row as |row|>
            {{#each table.columns as |c|}}
              <row.cell>
                {{c.name}}
              </row.cell>
            {{/each}}
          </foot.row>
        </table.tfoot>

      </YetiTable>
    </template>);

    assert.dom('tfoot > tr > td').exists({ count: 3 });
    assert.dom('tfoot tr:nth-child(1) td:nth-child(1)').hasText('First name yo!');
    assert.dom('tfoot tr:nth-child(1) td:nth-child(2)').hasText('Last name yo!');
    assert.dom('tfoot tr:nth-child(1) td:nth-child(3)').hasText('Points yo!');
  });

  test('@registerApi is called', async function (assert) {
    testParams.registerApi = sinon.spy(table => (testParams.tableApi = table));

    await render(<template>
      <YetiTable @data={{testParams.data}} @registerApi={{testParams.registerApi}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    assert.strictEqual(typeof testParams.tableApi, 'object', 'table is an object');
    assert.strictEqual(typeof testParams.tableApi.nextPage, 'function', 'table.nextPage is a function');
    assert.strictEqual(typeof testParams.tableApi.previousPage, 'function', 'table.previousPage is a function');
    assert.strictEqual(typeof testParams.tableApi.goToPage, 'function', 'table.goToPage is a function');
    assert.strictEqual(typeof testParams.tableApi.changePageSize, 'function', 'table.changePageSize is a function');
    assert.strictEqual(typeof testParams.tableApi.reloadData, 'function', 'table.reloadData is a function');
    assert.ok(testParams.registerApi.calledOnce, '@registerApi is called once');
  });
});
