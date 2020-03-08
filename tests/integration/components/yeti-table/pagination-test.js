import { render, click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { A } from '@ember/array';

import { hbs } from 'ember-cli-htmlbars';
import faker from 'faker';

module('Integration | Component | yeti-table (pagination)', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    let numberOfRows = 40;

    this.data = A(
      Array.from(Array(numberOfRows), (_, i) => {
        return {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          points: i
        };
      })
    );
  });

  test('when using pagination, it does not render more than pageSize rows', async function(assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} @pagination={{true}} @pageSize={{15}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 15 });
  });

  test('updating pageSize updates the number of rows', async function(assert) {
    this.pageSize = 15;

    await render(hbs`
      <YetiTable @data={{this.data}} @pagination={{true}} @pageSize={{pageSize}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 15 });

    this.set('pageSize', 20);

    assert.dom('tbody tr').exists({ count: 20 });
  });

  test('rendering with initial pageNumber, renders the correct page', async function(assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} @pagination={{true}} @pageSize={{15}} @pageNumber={{2}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 15 });

    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('15');
  });

  test('updating pageNumber updates the displayed rows', async function(assert) {
    this.pageNumber = 1;

    await render(hbs`
      <YetiTable @data={{this.data}} @pagination={{true}} @pageSize={{15}} @pageNumber={{pageNumber}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('0');

    this.set('pageNumber', 2);

    assert.dom('tbody tr').exists({ count: 15 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('15');
  });

  test('updating pageSize to make the current pageNumber out of bounds also updates the pageNumber', async function(assert) {
    this.pageNumber = 4;
    this.pageSize = 10;

    await render(hbs`
      <YetiTable @data={{this.data}} @pagination={{true}} @pageSize={{pageSize}} @pageNumber={{pageNumber}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 10 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('30');

    this.set('pageSize', 35);

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('35');
  });

  test('using yield actions works to change pages', async function(assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} @pagination={{true}} @pageSize={{15}} as |table|>

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

        <button id="previous" onclick={{action table.actions.previousPage}}>
          Previous
        </button>

        <button id="next" onclick={{action table.actions.nextPage}}>
          Next
        </button>

        <button id="goToPage1" onclick={{action table.actions.goToPage 2}}>
          2
        </button>

        <button id="goToPage2" onclick={{action table.actions.goToPage 2000}}>
          2000
        </button>

        <button id="goToPage3" onclick={{action table.actions.goToPage -2000}}>
          -2000
        </button>

      </YetiTable>
    `);

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

  test('yielded paginationData is correct', async function(assert) {
    await render(hbs`
      <YetiTable @data={{this.data}} @pagination={{true}} @pageSize={{15}} as |table|>

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

        <button id="previous" disabled={{table.paginationData.isFirstPage}} onclick={{action table.actions.previousPage}}>
          Previous
        </button>

        <button id="next" disabled={{table.paginationData.isLastPage}} onclick={{action table.actions.nextPage}}>
          Next
        </button>

        <div id="pageSize">{{table.paginationData.pageSize}}</div>
        <div id="pageNumber">{{table.paginationData.pageNumber}} of {{table.paginationData.totalPages}}</div>
        <div id="pageStart">{{table.paginationData.pageStart}} to {{table.paginationData.pageEnd}} of {{table.paginationData.totalRows}}</div>

      </YetiTable>
    `);

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
});
