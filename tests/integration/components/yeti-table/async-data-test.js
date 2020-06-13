import { render, clearRender, settled, click, waitFor } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { A } from '@ember/array';
import { later } from '@ember/runloop';

import { hbs } from 'ember-cli-htmlbars';
import { timeout } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import RSVP from 'rsvp';
import sinon from 'sinon';

import { sortMultiple, compareValues, mergeSort } from 'ember-yeti-table/-private/utils/sorting-utils';

module('Integration | Component | yeti-table (async)', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.data = A([
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
        lastName: 'Pale',
        points: 4
      },
      {
        firstName: 'Tom',
        lastName: 'Dale',
        points: 5
      }
    ]);
  });

  this.data2 = A([
    {
      firstName: 'A',
      lastName: 'B',
      points: 123
    },
    {
      firstName: 'C',
      lastName: 'D',
      points: 456
    },
    {
      firstName: 'E',
      lastName: 'F',
      points: 789
    },
    {
      firstName: 'G',
      lastName: 'H',
      points: 321
    },
    {
      firstName: 'I',
      lastName: 'J',
      points: 654
    }
  ]);

  test('passing a promise as `data` works after resolving promise', async function (assert) {
    this.dataPromise = [];

    await render(hbs`
      <YetiTable @data={{this.dataPromise}} as |table|>

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

    this.set(
      'dataPromise',
      new RSVP.Promise(resolve => {
        later(() => {
          resolve(this.data);
        }, 150);
      })
    );

    assert.dom('tbody tr').doesNotExist();

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
  });

  test('yielded isLoading boolean is true while promise is not resolved', async function (assert) {
    this.dataPromise = [];

    await render(hbs`
      <YetiTable @data={{this.dataPromise}} as |table|>

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

    this.set(
      'dataPromise',
      new RSVP.Promise(resolve => {
        later(() => {
          resolve(this.data);
        }, 150);
      })
    );

    await waitFor('.loading-message');

    assert.dom('.loading-message').hasText('Loading...');

    await settled();

    assert.dom('.loading-message').doesNotExist();
  });

  test('updating `data` after passing in a promise ignores first promise, respecting order', async function (assert) {
    this.dataPromise = [];

    await render(hbs`
      <YetiTable @data={{this.dataPromise}} as |table|>

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

    this.set(
      'dataPromise',
      new RSVP.Promise(resolve => {
        later(() => {
          resolve(this.data);
        }, 150);
      })
    );

    assert.dom('tbody tr').doesNotExist();

    this.set(
      'dataPromise',
      new RSVP.Promise(resolve => {
        later(() => {
          resolve(this.data2);
        }, 10);
      })
    );

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('A');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('B');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('123');
  });

  test('yielded isLoading boolean is true while loadData promise is not resolved', async function (assert) {
    this.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          resolve(this.data);
        }, 150);
      });
    });

    render(hbs`
      <YetiTable @loadData={{this.loadData}} as |table|>

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

  test('loadData is called with correct parameters', async function (assert) {
    this.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          resolve(this.data);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{this.loadData}} @filter="Miguel" as |table|>

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
    assert.ok(
      this.loadData.firstCall.calledWithMatch({
        paginationData: undefined,
        sortData: [{ prop: 'lastName', direction: 'desc' }],
        filterData: { filter: 'Miguel' }
      })
    );
  });

  test('loadData is called when updating filter', async function (assert) {
    assert.expect();

    this.loadData = sinon.spy(({ filterData }) => {
      return new RSVP.Promise(resolve => {
        later(() => {
          let data = this.data;

          if (filterData.filter) {
            data = data.filter(p => p.lastName.includes(filterData.filter));
          }

          resolve(data);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{this.loadData}} @filter={{this.filterText}} as |table|>

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
    assert.ok(this.loadData.firstCall.calledWithMatch({ filterData: { filter: '' } }));
    assert.ok(this.loadData.secondCall.calledWithMatch({ filterData: { filter: 'Baderous' } }));
  });

  test('loadData is called when updating sorting', async function (assert) {
    assert.expect();

    this.loadData = sinon.spy(({ sortData }) => {
      return new RSVP.Promise(resolve => {
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
      <YetiTable @loadData={{this.loadData}} as |table|>

        <table.header as |header|>
          <header.column @prop="firstName">
            First name
          </header.column>
          <header.column @prop="lastName" @sort={{this.sortDir}}>
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
    assert.ok(this.loadData.secondCall.calledWithMatch({ sortData: [{ prop: 'lastName', direction: 'desc' }] }));
  });

  test('loadData is called when clicking a sortable header', async function (assert) {
    assert.expect();

    this.loadData = sinon.spy(({ sortData }) => {
      return new RSVP.Promise(resolve => {
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
      <YetiTable @loadData={{this.loadData}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('1');

    assert.ok(this.loadData.calledOnce, 'loadData was called once');

    await click('thead tr th:nth-child(1)');

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Baderous');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('2');

    await clearRender();

    assert.ok(this.loadData.calledTwice, 'loadData was called twice');
    assert.ok(this.loadData.firstCall.calledWithMatch({ sortData: [] }));
    assert.ok(this.loadData.secondCall.calledWithMatch({ sortData: [{ prop: 'firstName', direction: 'asc' }] }));
  });

  test('loadData is called when changing page', async function (assert) {
    assert.expect();

    this.loadData = sinon.spy(({ paginationData }) => {
      return new RSVP.Promise(resolve => {
        later(() => {
          let pages = [this.data, this.data2];
          resolve(pages[paginationData.pageNumber - 1]);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{this.loadData}} @pagination={{true}} @totalRows={{10}} @pageSize={{5}} as |table|>

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

        <button id="next" type="button" {{on "click" table.actions.nextPage}}>
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
    assert.ok(
      this.loadData.firstCall.calledWithMatch({
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
      })
    );

    assert.ok(
      this.loadData.secondCall.calledWithMatch({
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
      })
    );
  });

  test('loadData is called once if updated totalRows on the loadData function', async function (assert) {
    this.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          this.set('totalRows', this.data.length);
          resolve(this.data);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{this.loadData}} @pagination={{true}} @pageSize={{10}} @totalRows={{this.totalRows}} as |table|>

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

  test('loadData is called once if we change @filter from undefined to ""', async function (assert) {
    this.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          resolve(this.data);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{this.loadData}} @filter={{this.filterText}} as |table|>

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

    this.set('filterText', '');

    await clearRender();

    assert.ok(this.loadData.calledOnce, 'loadData was called once');
  });

  test('loadData can be an ember-concurrency restartable task and be cancelled', async function (assert) {
    assert.expect(4);
    let data = this.data;
    let spy = sinon.spy();
    let hardWorkCounter = 0;

    class Obj {
      @restartableTask
      *loadData() {
        spy(...arguments);
        yield timeout(100);
        hardWorkCounter++;
        return data;
      }
    }

    this.obj = new Obj();

    this.set('filterText', 'Migu');

    render(hbs`
      <YetiTable @loadData={{perform this.obj.loadData}} @filter={{this.filterText}} as |table|>

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

    setTimeout(() => {
      this.set('filterText', 'Tom');
    }, 50);

    await settled();

    assert.ok(spy.calledTwice, 'load data was called twice (but one was cancelled)');
    assert.ok(spy.firstCall.calledWithMatch({ filterData: { filter: 'Migu' } }));
    assert.ok(spy.secondCall.calledWithMatch({ filterData: { filter: 'Tom' } }));
    assert.equal(hardWorkCounter, 1, 'only did the "hard work" once');
  });

  test('reloadData from @registerApi reruns the @loadData function', async function (assert) {
    this.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          console.log(this.data);
          resolve(this.data);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{this.loadData}} @registerApi={{fn (mut this.tableApi)}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 5 }, 'has only five rows');

    assert.ok(this.loadData.calledOnce, 'loadData was called once');

    this.data.addObject({
      firstName: 'New',
      lastName: 'User',
      points: 12
    });

    this.tableApi.reloadData();
    await settled();

    assert.dom('tbody tr').exists({ count: 6 }, 'has an additional row from the reloadData call');

    await clearRender();

    assert.ok(this.loadData.calledTwice, 'loadData was called twice');
  });

  test('reloadData from yielded action reruns the @loadData function', async function (assert) {
    this.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          console.log(this.data);
          resolve(this.data);
        }, 150);
      });
    });

    await render(hbs`
      <YetiTable @loadData={{this.loadData}} as |table|>

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

        <button id="reload" type="button" disabled={{table.isLoading}} {{on "click" table.actions.reloadData}}>
          Reload
        </button>

      </YetiTable>
    `);

    await settled();

    assert.dom('tbody tr').exists({ count: 5 }, 'has only five rows');

    assert.ok(this.loadData.calledOnce, 'loadData was called once');

    this.data.addObject({
      firstName: 'New',
      lastName: 'User',
      points: 12
    });

    await click('button#reload');

    assert.dom('tbody tr').exists({ count: 6 }, 'has an additional row from the reloadData call');

    await clearRender();

    assert.ok(this.loadData.calledTwice, 'loadData was called twice');
  });
});
