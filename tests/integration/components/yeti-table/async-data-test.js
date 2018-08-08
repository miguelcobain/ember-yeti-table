import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  clearRender,
  settled,
  click,
  waitFor
} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { A } from '@ember/array';
import RSVP from 'rsvp';
import { later } from '@ember/runloop';
import sinon from 'sinon';

import {
  sortMultiple,
  compareValues,
  mergeSort
} from 'ember-yeti-table/-private/utils/sorting-utils';

module('Integration | Component | yeti-table (async)', function(hooks) {
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

  this.data2 = A([{
    firstName: 'A',
    lastName: 'B',
    points: 123
  }, {
    firstName: 'C',
    lastName: 'D',
    points: 456
  }, {
    firstName: 'E',
    lastName: 'F',
    points: 789
  }, {
    firstName: 'G',
    lastName: 'H',
    points: 321
  }, {
    firstName: 'I',
    lastName: 'J',
    points: 654
  }]);

  test('passing a promise as `data` works after resolving promise', async function(assert) {

    this.dataPromise = [];

    await render(hbs`
      <YetiTable @data={{dataPromise}} as |table|>

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

    this.set('dataPromise', new RSVP.Promise((resolve) => {
      later(() => {
        resolve(this.data);
      }, 150);
    }));

    assert.dom('tbody tr').doesNotExist();

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
  });

  test('yielded isLoading boolean is true while promise is not resolved', async function(assert) {

    this.dataPromise = [];

    await render(hbs`
      <YetiTable @data={{dataPromise}} as |table|>

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

        {{#if table.isLoading}}
          <div class="loading-message">Loading...</div>
        {{/if}}

      </YetiTable>
    `);

    this.set('dataPromise', new RSVP.Promise((resolve) => {
      later(() => {
        resolve(this.data);
      }, 150);
    }));

    await waitFor('.loading-message');

    assert.dom('.loading-message').hasText('Loading...');

    await settled();

    assert.dom('.loading-message').doesNotExist();
  });

  test('updating `data` after passing in a promise ignores first promise, respecting order', async function(assert) {

    this.dataPromise = [];

    await render(hbs`
      <YetiTable @data={{dataPromise}} as |table|>

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

    this.set('dataPromise', new RSVP.Promise((resolve) => {
      later(() => {
        resolve(this.data);
      }, 150);
    }));

    assert.dom('tbody tr').doesNotExist();

    this.set('dataPromise', new RSVP.Promise((resolve) => {
      later(() => {
        resolve(this.data2);
      }, 10);
    }));

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('A');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('B');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('123');
  });

  test('yielded isLoading boolean is true while loadData promise is not resolved', async function(assert) {

    this.loadData = sinon.spy(() => {
      return new RSVP.Promise((resolve) => {
        later(() => {
          resolve(this.data);
        }, 150);
      });
    });

    render(hbs`
      <YetiTable @loadData={{loadData}} as |table|>

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

        {{#if table.isLoading}}
          <div class="loading-message">Loading...</div>
        {{/if}}

      </YetiTable>
    `);

    await waitFor('.loading-message');

    assert.dom('.loading-message').hasText('Loading...');

    await settled();

    assert.dom('.loading-message').doesNotExist();
  });

  test('loadData is called with correct parameters', async function(assert) {
    this.loadData = sinon.spy(() => {
      return new RSVP.Promise((resolve) => {
        later(() => {
          resolve(this.data);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{loadData}} @filter="Miguel" as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @sort="desc">
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    await settled();

    assert.dom('tbody tr').exists({ count: 5 }, 'is not filtered');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom', 'column 1 is not sorted');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Dale', 'column 2 is not sorted');
    assert.dom('tbody tr:nth-child(5) td:nth-child(3)').hasText('5', 'column 3 is not sorted');

    await clearRender();

    assert.ok(this.loadData.calledOnce, 'loadData was called once');
    assert.ok(this.loadData.firstCall.calledWithMatch({
      paginationData: undefined,
      sortData: [{ prop: 'lastName', direction: 'desc' }],
      filterData: { filter: 'Miguel' }
    }));
  });

  test('loadData is called when updating filter', async function(assert) {
    assert.expect();

    this.loadData = sinon.spy(({ filterData }) => {
      return new RSVP.Promise((resolve) => {
        later(() => {
          let data = this.data;

          if (filterData.filter) {
            data = data.filter((p) => p.lastName.includes(filterData.filter));
          }

          resolve(data);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{loadData}} @filter={{filterText}} as |table|>

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

    await settled();

    assert.dom('tbody tr').exists({ count: 5 }, 'is not filtered');

    assert.ok(this.loadData.calledOnce, 'loadData was called once');

    this.set('filterText', 'Baderous');

    await settled();

    assert.dom('tbody tr').exists({ count: 1 }, 'is filtered');

    await clearRender();

    assert.ok(this.loadData.calledTwice, 'loadData was called twice');
    assert.ok(this.loadData.firstCall.calledWithMatch({ filterData: { filter: undefined }}));
    assert.ok(this.loadData.secondCall.calledWithMatch({ filterData: { filter: 'Baderous' }}));
  });

  test('loadData is called when updating sorting', async function(assert) {
    assert.expect();

    this.loadData = sinon.spy(({ sortData }) => {
      return new RSVP.Promise((resolve) => {
        later(() => {
          let data = this.data;

          if (sortData.length > 0) {
            data = mergeSort(data, (itemA, itemB) => {
              return sortMultiple(itemA, itemB, sortData, compareValues);
            });
          }

          resolve(data);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{loadData}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @sort={{sortDir}}>
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('1');

    assert.ok(this.loadData.calledOnce, 'loadData was called once');

    this.set('sortDir', 'desc');

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Silva');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('3');

    await clearRender();

    assert.ok(this.loadData.calledTwice, 'loadData was called twice');
    assert.ok(this.loadData.firstCall.calledWithMatch({ sortData: [] }));
    assert.ok(this.loadData.secondCall.calledWithMatch({ sortData: [{ prop: 'lastName', direction: 'desc' }]}));
  });

  test('loadData is called when changing page', async function(assert) {
    assert.expect();

    this.loadData = sinon.spy(({ paginationData }) => {
      return new RSVP.Promise((resolve) => {
        later(() => {
          let pages = [this.data, this.data2];
          resolve(pages[paginationData.pageNumber - 1]);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{loadData}} @pagination={{true}} @totalRows={{10}} @pageSize={{5}} as |table|>

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

        <button id="next" onclick={{table.actions.nextPage}}>
          Next
        </button>

      </YetiTable>
    `);

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('1');

    assert.ok(this.loadData.calledOnce, 'loadData was called once');

    await click('button#next');

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('A');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('B');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('123');

    await clearRender();

    assert.ok(this.loadData.calledTwice, 'loadData was called twice');
    assert.ok(this.loadData.firstCall.calledWithMatch({
      paginationData: {
        pageSize: 5,
        pageNumber: 1,
        pageStart: 1,
        pageEnd: 5,
        isFirstPage: true,
        isLastPage: false,
        totalRows: 10,
        totalPages: 2
      }
    }));

    assert.ok(this.loadData.secondCall.calledWithMatch({
      paginationData: {
        pageSize: 5,
        pageNumber: 2,
        pageStart: 6,
        pageEnd: 10,
        isFirstPage: false,
        isLastPage: true,
        totalRows: 10,
        totalPages: 2
      }
    }));
  });

  test('loadData is called once if updated totalRows on the loadData function', async function(assert) {
    this.loadData = sinon.spy(() => {
      return new RSVP.Promise((resolve) => {
        later(() => {
          this.set('totalRows', this.data.length);
          resolve(this.data);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{loadData}} @pagination={{true}} @pageSize={{10}} @totalRows={{totalRows}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @sort="desc">
            Last name
          </header.column>
          <header.column @prop="points">
            Points
          </header.column>
        </table.header>

        <table.body/>

      </YetiTable>
    `);

    await settled();

    assert.dom('tbody tr').exists({ count: 5 }, 'is not filtered');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom', 'column 1 is not sorted');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Dale', 'column 2 is not sorted');
    assert.dom('tbody tr:nth-child(5) td:nth-child(3)').hasText('5', 'column 3 is not sorted');

    await clearRender();

    assert.ok(this.loadData.calledOnce, 'loadData was called once');
  });

});
