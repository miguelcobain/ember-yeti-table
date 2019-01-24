import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { A } from '@ember/array';

import DEFAULT_THEME from 'ember-yeti-table/-private/themes/default-theme';

module('Integration | Component | yeti-table (theme)', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {

    this.theme = {
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

  test('renders table with correct theme (header)', async function (assert) {
    await render(hbs`
      <YetiTable @data={{data}} @theme={{theme}} as |table|>

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

    assert.dom('table').hasClass(this.theme.table);
    assert.dom('thead').hasClass(this.theme.thead);
    assert.dom('thead tr').hasClass(this.theme.theadRow);
    assert.dom('thead tr th').hasClass(this.theme.theadCell);
    assert.dom('tbody tr').hasClass(this.theme.tbodyRow);
    assert.dom('tbody tr td').hasClass(this.theme.tbodyCell);
  });

  test('renders table with correct theme (head)', async function (assert) {
    await render(hbs`
      <YetiTable @data={{data}} @theme={{theme}} as |table|>

        <table.head as |head|>
          <head.row as |row|>
            <row.column @prop="firstName">
              First name
            </row.column>
            <row.column @prop="lastName">
              Last name
            </row.column>
            <row.column @prop="points">
              Points
            </row.column>
          </head.row>
        </table.head>

        <table.body/>

        <table.foot as |foot|>
          <foot.row as |row|>
            <row.cell colspan={{table.visibleColumns}}>
              <table.pagination/>
            </row.cell>
          </foot.row>
        </table.foot>

      </YetiTable>
    `);

    assert.dom('table').hasClass(this.theme.table);

    assert.dom('thead').hasClass(this.theme.thead);
    assert.dom('thead tr').hasClass(this.theme.theadRow);
    assert.dom('thead tr th').hasClass(this.theme.theadCell);

    assert.dom('tbody tr').hasClass(this.theme.tbodyRow);
    assert.dom('tbody tr td').hasClass(this.theme.tbodyCell);

    assert.dom('tfoot').hasClass(this.theme.tfoot);
    assert.dom('tfoot tr').hasClass(this.theme.tfootRow);
    assert.dom('tfoot tr td').hasClass(this.theme.tfootCell);

    assert.dom('tfoot > tr > td > div').hasClass(DEFAULT_THEME.pagination.controls);
    assert.dom('tfoot > tr > td > div > :nth-child(1)').hasClass(DEFAULT_THEME.pagination.info);
    assert.dom('tfoot > tr > td > div > :nth-child(2)').hasClass(DEFAULT_THEME.pagination.pageSize);
    assert.dom('tfoot > tr > td > div > :nth-child(3)').hasClass(DEFAULT_THEME.pagination.previous);
    assert.dom('tfoot > tr > td > div > :nth-child(4)').hasClass(DEFAULT_THEME.pagination.next);
  });

  test('deep merge of themes works', async function (assert) {
    this.theme = {
      sorting: {
        columnSortable: 'custom-sortable'
      },
      pagination: {
        next: 'custom-next'
      }
    };

    await render(hbs`
      <YetiTable @data={{data}} @theme={{theme}} as |table|>

        <table.head as |head|>
          <head.row as |row|>
            <row.column @prop="firstName" @sort="asc">
              First name
            </row.column>
            <row.column @prop="lastName">
              Last name
            </row.column>
            <row.column @prop="points">
              Points
            </row.column>
          </head.row>
        </table.head>

        <table.body/>

        <table.foot as |foot|>
          <foot.row as |row|>
            <row.cell colspan={{table.visibleColumns}}>
              <table.pagination/>
            </row.cell>
          </foot.row>
        </table.foot>

      </YetiTable>
    `);

    // we overwrote sorting.columnSortable but not sorting.columnSorted
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(DEFAULT_THEME.sorting.columnSorted);
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').hasClass(this.theme.sorting.columnSortable);
    assert.dom('thead tr:nth-child(1) th:nth-child(1)').doesNotHaveClass(DEFAULT_THEME.sorting.columnSortable);

    // we overwrote pagination.next but not pagination.previous
    assert.dom('tfoot > tr > td > div > button:nth-last-child(2)').hasClass(DEFAULT_THEME.pagination.previous);
    assert.dom('tfoot > tr > td > div > button:last-child').hasClass(this.theme.pagination.next);
    assert.dom('tfoot > tr > td > div > button:last-child').doesNotHaveClass(DEFAULT_THEME.pagination.next);
  });

});
