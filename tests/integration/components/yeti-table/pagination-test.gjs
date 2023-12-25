import { render, click, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { tracked } from '@glimmer/tracking';

import faker from 'faker';

class TestParams {
  @tracked
  data;
  @tracked
  pageSize;
  @tracked
  pageNumber;
  @tracked
  tableApi;
}

import YetiTable from 'ember-yeti-table/components/yeti-table';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

module('Integration | Component | yeti-table (pagination)', function (hooks) {
  setupRenderingTest(hooks);

  let testParams;

  hooks.beforeEach(function () {
    testParams = new TestParams();

    let numberOfRows = 40;

    testParams.data = Array.from(Array(numberOfRows), (_, i) => {
      return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        points: i
      };
    });
  });

  test('when using pagination, it does not render more than pageSize rows', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} @pagination={{true}} @pageSize={{15}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 15 });
  });

  test('updating pageSize updates the number of rows', async function (assert) {
    testParams.pageSize = 15;

    await render(<template>
      <YetiTable @data={{testParams.data}} @pagination={{true}} @pageSize={{testParams.pageSize}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 15 });

    testParams.pageSize = 20;
    await settled();

    assert.dom('tbody tr').exists({ count: 20 });
  });

  test('rendering with initial pageNumber, renders the correct page', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} @pagination={{true}} @pageSize={{15}} @pageNumber={{2}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 15 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('15');
  });

  test('updating pageNumber updates the displayed rows', async function (assert) {
    testParams.pageNumber = 1;

    await render(<template>
      <YetiTable
        @data={{testParams.data}}
        @pagination={{true}}
        @pageSize={{15}}
        @pageNumber={{testParams.pageNumber}}
        as |table|
      >

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

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('0');

    testParams.pageNumber = 2;

    await settled();

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('15');
  });

  test('updating pageSize to make the current pageNumber out of bounds also updates the pageNumber', async function (assert) {
    testParams.pageNumber = 4;
    testParams.pageSize = 10;

    await render(<template>
      <YetiTable
        @data={{testParams.data}}
        @pagination={{true}}
        @pageSize={{testParams.pageSize}}
        @pageNumber={{testParams.pageNumber}}
        as |table|
      >

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

    assert.dom('tbody tr').exists({ count: 10 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('30');

    testParams.pageSize = 35;

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('35');
  });

  test('using yield actions works to change pages', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} @pagination={{true}} @pageSize={{15}} as |table|>

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

        <button id='previous' type='button' {{on 'click' table.actions.previousPage}}>
          Previous
        </button>

        <button id='next' type='button' {{on 'click' table.actions.nextPage}}>
          Next
        </button>

        <button id='goToPage1' type='button' {{on 'click' (fn table.actions.goToPage 2)}}>
          2
        </button>

        <button id='goToPage2' type='button' {{on 'click' (fn table.actions.goToPage 2000)}}>
          2000
        </button>

        <button id='goToPage3' type='button' {{on 'click' (fn table.actions.goToPage -2000)}}>
          -2000
        </button>

      </YetiTable>
    </template>);

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('0');

    await click('button#next');

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('15');

    await click('button#previous');

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('0');

    await click('button#goToPage1');

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('15');

    await click('button#goToPage2');

    assert.dom('tbody tr').exists({ count: 10 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('30');

    await click('button#goToPage3');

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('0');
  });

  test('yielded paginationData is correct', async function (assert) {
    await render(<template>
      <YetiTable @data={{testParams.data}} @pagination={{true}} @pageSize={{15}} as |table|>

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

        <button
          id='previous'
          type='button'
          disabled={{table.paginationData.isFirstPage}}
          {{on 'click' table.actions.previousPage}}
        >
          Previous
        </button>

        <button
          id='next'
          type='button'
          disabled={{table.paginationData.isLastPage}}
          {{on 'click' table.actions.nextPage}}
        >
          Next
        </button>

        <div id='pageSize'>{{table.paginationData.pageSize}}</div>
        <div id='pageNumber'>{{table.paginationData.pageNumber}} of {{table.paginationData.totalPages}}</div>
        <div id='pageStart'>{{table.paginationData.pageStart}}
          to
          {{table.paginationData.pageEnd}}
          of
          {{table.paginationData.totalRows}}</div>

      </YetiTable>
    </template>);

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('0');
    assert.dom('button#previous').isDisabled();
    assert.dom('button#next').isNotDisabled();
    assert.dom('div#pageSize').hasText('15');

    assert.dom('div#pageNumber').hasText('1 of 3');
    assert.dom('div#pageStart').hasText('1 to 15 of 40');

    await click('button#next');

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('15');
    assert.dom('button#previous').isNotDisabled();
    assert.dom('button#next').isNotDisabled();
    assert.dom('div#pageSize').hasText('15');
    assert.dom('div#pageNumber').hasText('2 of 3');
    assert.dom('div#pageStart').hasText('16 to 30 of 40');

    await click('button#next');

    assert.dom('tbody tr').exists({ count: 10 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('30');
    assert.dom('button#previous').isNotDisabled();
    assert.dom('button#next').isDisabled();
    assert.dom('div#pageSize').hasText('15');
    assert.dom('div#pageNumber').hasText('3 of 3');
    assert.dom('div#pageStart').hasText('31 to 40 of 40');
  });

  test('using registered api to update pagination state works', async function (assert) {
    await render(<template>
      <YetiTable
        @data={{testParams.data}}
        @pagination={{true}}
        @pageSize={{15}}
        @registerApi={{fn (mut testParams.tableApi)}}
        as |table|
      >

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

    assert.strictEqual(typeof testParams.tableApi, 'object', 'table api was registered');

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('0');

    testParams.tableApi.nextPage();
    await settled();

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('15');

    testParams.tableApi.previousPage();
    await settled();

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('0');

    testParams.tableApi.goToPage(2);
    await settled();

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('15');

    testParams.tableApi.goToPage(2000);
    await settled();

    assert.dom('tbody tr').exists({ count: 10 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('30');

    testParams.tableApi.goToPage(-2000);
    await settled();

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('0');
  });
});
