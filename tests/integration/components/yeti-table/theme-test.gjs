import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { tracked } from '@glimmer/tracking';

import DEFAULT_THEME from 'ember-yeti-table/-private/themes/default-theme';

import YetiTable from 'ember-yeti-table/components/yeti-table';

class TestParams {
  @tracked
  data;
  @tracked
  theme;
}

module('Integration | Component | yeti-table (theme)', function (hooks) {
  setupRenderingTest(hooks);

  let testParams;

  hooks.beforeEach(function () {
    testParams = new TestParams();

    testParams.theme = {
      table: 'table-1',
      thead: 'head-1',
      theadRow: 'head-row-1',
      theadCell: 'head-cell-1',
      tbodyRow: 'body-row-1',
      tbodyCell: 'body-cell-1',
      tfoot: 'foot-1',
      tfootRow: 'foot-row-1',
      tfootCell: 'foot-cell-1'
    };

    testParams.data = [
      {
        firstName: 'Miguel',
        lastName: 'Andrade',
        points: 1
      },
      {
        firstName: 'José',
        lastName: 'Baderous',
        points: 2
      },
      {
        firstName: 'Maria',
        lastName: 'Silva',
        points: 3
      },
      {
        firstName: 'Tom',
        lastName: 'Dale',
        points: 4
      },
      {
        firstName: 'Yehuda',
        lastName: 'Katz',
        points: 5
      }
    ];
  });

  test('renders table with correct theme (header)', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} @theme={{testParams.theme}} as |table|>

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

    assert.dom('table').hasClass(testParams.theme.table);
    assert.dom('thead').hasClass(testParams.theme.thead);
    assert.dom('thead tr').hasClass(testParams.theme.theadRow);
    assert.dom('thead tr th').hasClass(testParams.theme.theadCell);
    assert.dom('tbody tr').hasClass(testParams.theme.tbodyRow);
    assert.dom('tbody tr td').hasClass(testParams.theme.tbodyCell);
  });

  test('renders table with correct theme (head)', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} @theme={{testParams.theme}} as |table|>

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
            <row.cell colspan={{table.visibleColumns.length}}>
              <table.pagination />
            </row.cell>
          </foot.row>
        </table.tfoot>

      </YetiTable>
    </template>);

    assert.dom('table').hasClass(testParams.theme.table);

    assert.dom('thead').hasClass(testParams.theme.thead);
    assert.dom('thead tr').hasClass(testParams.theme.theadRow);
    assert.dom('thead tr th').hasClass(testParams.theme.theadCell);

    assert.dom('tbody tr').hasClass(testParams.theme.tbodyRow);
    assert.dom('tbody tr td').hasClass(testParams.theme.tbodyCell);

    assert.dom('tfoot').hasClass(testParams.theme.tfoot);
    assert.dom('tfoot tr').hasClass(testParams.theme.tfootRow);
    assert.dom('tfoot tr td').hasClass(testParams.theme.tfootCell);

    assert.dom('tfoot > tr > td > div').hasClass(DEFAULT_THEME.pagination.controls);
    assert.dom('tfoot > tr > td > div > :nth-child(1)').hasClass(DEFAULT_THEME.pagination.info);
    assert.dom('tfoot > tr > td > div > :nth-child(2)').hasClass(DEFAULT_THEME.pagination.pageSize);
    assert.dom('tfoot > tr > td > div > :nth-child(3)').hasClass(DEFAULT_THEME.pagination.previous);
    assert.dom('tfoot > tr > td > div > :nth-child(4)').hasClass(DEFAULT_THEME.pagination.next);
  });

  test('deep merge of themes works', async function (assert) {
    testParams.theme = {
      sorting: {
        columnSortable: 'custom-sortable'
      },
      pagination: {
        next: 'custom-next'
      }
    };

    await render(<template>
      <YetiTable @data={{testParams.data}} @theme={{testParams.theme}} as |table|>

        <table.thead as |head|>
          <head.row as |row|>
            <row.column @prop='firstName' @sort='asc'>
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
            <row.cell colspan={{table.visibleColumns.length}}>
              <table.pagination />
            </row.cell>
          </foot.row>
        </table.tfoot>

      </YetiTable>
    </template>);

    // we overwrote sorting.columnSortable but not sorting.columnSorted
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(DEFAULT_THEME.sorting.columnSorted);
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(testParams.theme.sorting.columnSortable);
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortable);

    // we overwrote pagination.next but not pagination.previous
    assert.dom('tfoot > tr > td > div > button:nth-last-child(2)').hasClass(DEFAULT_THEME.pagination.previous);
    assert.dom('tfoot > tr > td > div > button:last-child').hasClass(testParams.theme.pagination.next);
    assert.dom('tfoot > tr > td > div > button:last-child').doesNotHaveClass(DEFAULT_THEME.pagination.next);
  });
});
