import { render, clearRender, settled, click, waitFor } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { notifyPropertyChange } from '@ember/object';

import { timeout, restartableTask } from 'ember-concurrency';
import RSVP from 'rsvp';
import sinon from 'sinon';

import { sortMultiple, compareValues, mergeSort } from 'ember-yeti-table/utils/sorting-utils';

import YetiTable from 'ember-yeti-table/components/yeti-table';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import perform from 'ember-concurrency/helpers/perform';

class TestParams {
  @tracked
  data;
  @tracked
  data2;
  @tracked
  dataPromise;
  @tracked
  loadData;
  @tracked
  filterText;
  @tracked
  sortDir;
  @tracked
  pageNumber;
  @tracked
  totalRows;
  @tracked
  tableApi;
}

module('Integration | Component | yeti-table (async)', function (hooks) {
  setupRenderingTest(hooks);

  let testParams;

  hooks.beforeEach(function () {
    testParams = new TestParams();

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
        lastName: 'Pale',
        points: 4
      },
      {
        firstName: 'Tom',
        lastName: 'Dale',
        points: 5
      }
    ];

    testParams.data2 = [
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
    ];
  });

  test('passing a promise as `data` works after resolving promise', async function (assert) {
    testParams.dataPromise = [];

    await render(<template>
      <YetiTable @data={{testParams.dataPromise}} as |table|>

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

    testParams.dataPromise = new RSVP.Promise(resolve => {
      later(() => {
        resolve(testParams.data);
      }, 150);
    });

    assert.dom('tbody tr').doesNotExist();

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
  });

  test('yielded isLoading boolean is true while promise is not resolved', async function (assert) {
    testParams.dataPromise = [];

    await render(<template>
      <YetiTable @data={{testParams.dataPromise}} as |table|>

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

        {{#if table.isLoading}}
          <div class='loading-message'>Loading...</div>
        {{/if}}

      </YetiTable>
    </template>);

    testParams.dataPromise = new RSVP.Promise(resolve => {
      later(() => {
        resolve(testParams.data);
      }, 150);
    });

    await waitFor('.loading-message');

    assert.dom('.loading-message').hasText('Loading...');

    await settled();

    assert.dom('.loading-message').doesNotExist();
  });

  test('updating `data` after passing in a promise ignores first promise, respecting order', async function (assert) {
    testParams.dataPromise = [];

    await render(<template>
      <YetiTable @data={{testParams.dataPromise}} as |table|>

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

    testParams.dataPromise = new RSVP.Promise(resolve => {
      later(() => {
        resolve(testParams.data);
      }, 150);
    });

    assert.dom('tbody tr').doesNotExist();

    await settled();

    testParams.dataPromise = new RSVP.Promise(resolve => {
      later(() => {
        resolve(testParams.data2);
      }, 10);
    });

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('A');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('B');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('123');
  });

  test('yielded isLoading boolean is true while loadData promise is not resolved', async function (assert) {
    testParams.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          resolve(testParams.data);
        }, 150);
      });
    });

    render(<template>
      <YetiTable @loadData={{testParams.loadData}} as |table|>

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

        {{#if table.isLoading}}
          <div class='loading-message'>Loading...</div>
        {{/if}}

      </YetiTable>
    </template>);

    await waitFor('.loading-message');

    assert.dom('.loading-message').hasText('Loading...');

    await settled();

    assert.dom('.loading-message').doesNotExist();
  });

  test('loadData is called with correct parameters', async function (assert) {
    testParams.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          resolve(testParams.data);
        }, 150);
      });
    });

    await render(<template>
      <YetiTable @loadData={{testParams.loadData}} @filter='Miguel' as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName' @sort='desc' @filter='Andrade'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    assert.dom('tbody tr').exists({ count: 5 }, 'is not filtered');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom', 'column 1 is not sorted');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Dale', 'column 2 is not sorted');
    assert.dom('tbody tr:nth-child(5) td:nth-child(3)').hasText('5', 'column 3 is not sorted');

    await clearRender();

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');

    assert.ok(
      testParams.loadData.firstCall.calledWithMatch({
        paginationData: undefined,
        sortData: [{ prop: 'lastName', direction: 'desc' }],
        filterData: {
          filter: 'Miguel',
          columnFilters: [
            { prop: 'firstName', filter: undefined, filterUsing: undefined },
            { prop: 'lastName', filter: 'Andrade', filterUsing: undefined },
            { prop: 'points', filter: undefined, filterUsing: undefined }
          ]
        }
      })
    );
  });

  test('loadData is called when updating filter', async function (assert) {
    testParams.loadData = sinon.spy(({ filterData }) => {
      return new RSVP.Promise(resolve => {
        later(() => {
          let data = testParams.data;

          if (filterData.filter) {
            data = data.filter(p => p.lastName.includes(filterData.filter));
          }

          resolve(data);
        }, 150);
      });
    });

    await render(<template>
      <YetiTable @loadData={{testParams.loadData}} @filter={{testParams.filterText}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 5 }, 'is not filtered');

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');

    testParams.filterText = 'Baderous';

    await settled();

    assert.dom('tbody tr').exists({ count: 1 }, 'is filtered');

    await clearRender();

    assert.ok(testParams.loadData.calledTwice, 'loadData was called twice');
    assert.ok(testParams.loadData.firstCall.calledWithMatch({ filterData: { filter: '' } }));
    assert.ok(testParams.loadData.secondCall.calledWithMatch({ filterData: { filter: 'Baderous' } }));
  });

  test('loadData is called when updating sorting', async function (assert) {


    testParams.loadData = sinon.spy(({ sortData }) => {
      return new RSVP.Promise(resolve => {
        later(() => {
          let data = testParams.data;

          if (sortData.length > 0) {
            data = mergeSort(data, (itemA, itemB) => {
              return sortMultiple(itemA, itemB, sortData, compareValues);
            });
          }

          resolve(data);
        }, 150);
      });
    });

    await render(<template>
      <YetiTable @loadData={{testParams.loadData}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName' @sort={{testParams.sortDir}}>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('1');

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');

    testParams.sortDir = 'desc';

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Maria');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Silva');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('3');

    await clearRender();

    assert.ok(testParams.loadData.calledTwice, 'loadData was called twice');
    assert.ok(testParams.loadData.firstCall.calledWithMatch({ sortData: [] }));
    assert.ok(testParams.loadData.secondCall.calledWithMatch({ sortData: [{ prop: 'lastName', direction: 'desc' }] }));
  });

  test('loadData is called when clicking a sortable header', async function (assert) {


    testParams.loadData = sinon.spy(({ sortData }) => {
      return new RSVP.Promise(resolve => {
        later(() => {
          let data = testParams.data;

          if (sortData.length > 0) {
            data = mergeSort(data, (itemA, itemB) => {
              return sortMultiple(itemA, itemB, sortData, compareValues);
            });
          }

          resolve(data);
        }, 150);
      });
    });

    await render(<template>
      <YetiTable @loadData={{testParams.loadData}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('1');

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');

    await click('thead tr th:nth-child(1)');

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('José');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Baderous');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('2');

    await clearRender();

    assert.ok(testParams.loadData.calledTwice, 'loadData was called twice');
    assert.ok(testParams.loadData.firstCall.calledWithMatch({ sortData: [] }));
    assert.ok(testParams.loadData.secondCall.calledWithMatch({ sortData: [{ prop: 'firstName', direction: 'asc' }] }));
  });

  test('loadData is called when changing page', async function (assert) {


    testParams.loadData = sinon.spy(({ paginationData }) => {
      return new RSVP.Promise(resolve => {
        later(() => {
          let pages = [testParams.data, testParams.data2];
          resolve(pages[paginationData.pageNumber - 1]);
        }, 150);
      });
    });

    await render(<template>
      <YetiTable @loadData={{testParams.loadData}} @pagination={{true}} @totalRows={{10}} @pageSize={{5}} as |table|>

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

        <button id='next' type='button' {{on 'click' table.actions.nextPage}}>
          Next
        </button>

      </YetiTable>
    </template>);

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('1');

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');

    await click('button#next');

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('A');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('B');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('123');

    await clearRender();

    assert.ok(testParams.loadData.calledTwice, 'loadData was called twice');

    assert.ok(
      testParams.loadData.firstCall.calledWithMatch({
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
      testParams.loadData.secondCall?.calledWithMatch({
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

  test('loadData is called when changing page through @pageNumber arg', async function (assert) {


    testParams.loadData = sinon.spy(({ paginationData }) => {
      return new RSVP.Promise(resolve => {
        later(() => {
          let pages = [testParams.data, testParams.data2];
          resolve(pages[paginationData.pageNumber - 1]);
        }, 150);
      });
    });

    testParams.pageNumber = 1;

    await render(<template>
      <YetiTable
        @loadData={{testParams.loadData}}
        @pagination={{true}}
        @totalRows={{10}}
        @pageSize={{5}}
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

        <button id='next' type='button' {{on 'click' table.actions.nextPage}}>
          Next
        </button>

      </YetiTable>
    </template>);

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('1');

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');

    testParams.pageNumber = 2;

    await settled();

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('A');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('B');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('123');

    await clearRender();

    assert.ok(testParams.loadData.calledTwice, 'loadData was called twice');
    assert.ok(
      testParams.loadData.firstCall.calledWithMatch({
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
      testParams.loadData.secondCall.calledWithMatch({
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

  test('loadData is called when changing page with @onPageNumberChange (see #301)', async function (assert) {


    testParams.loadData = sinon.spy(({ paginationData }) => {
      return new RSVP.Promise(resolve => {
        later(() => {
          let pages = [testParams.data, testParams.data2];
          resolve(pages[paginationData.pageNumber - 1]);
        }, 150);
      });
    });

    testParams.pageNumber = 1;

    await render(<template>
      <YetiTable
        @loadData={{testParams.loadData}}
        @pagination={{true}}
        @totalRows={{10}}
        @pageSize={{5}}
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

        <button id='next' type='button' {{on 'click' table.actions.nextPage}}>
          Next
        </button>

      </YetiTable>
    </template>);

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Miguel');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('Andrade');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('1');

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');

    await click('button#next');

    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('A');
    assert.dom('tbody tr:nth-child(1) td:nth-child(2)').hasText('B');
    assert.dom('tbody tr:nth-child(1) td:nth-child(3)').hasText('123');

    await clearRender();

    assert.ok(testParams.loadData.calledTwice, 'loadData was called twice');
    assert.ok(
      testParams.loadData.firstCall.calledWithMatch({
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
      testParams.loadData.secondCall.calledWithMatch({
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

  test('loadData is called once if updated totalRows on the loadData function and totalRows is correct', async function (assert) {
    testParams.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          testParams.totalRows = testParams.data.length;
          resolve(testParams.data);
        }, 150);
      });
    });

    await render(<template>
      <YetiTable
        @loadData={{testParams.loadData}}
        @pagination={{true}}
        @pageSize={{10}}
        @totalRows={{testParams.totalRows}}
        as |table|
      >

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName' @sort='desc'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />
        <div id='totalRows'>{{table.totalRows}}</div>

      </YetiTable>
    </template>);

    assert.dom('tbody tr').exists({ count: 5 }, 'is not filtered');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom', 'column 1 is not sorted');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Dale', 'column 2 is not sorted');
    assert.dom('tbody tr:nth-child(5) td:nth-child(3)').hasText('5', 'column 3 is not sorted');

    assert.dom('#totalRows').hasText('5');
    await clearRender();

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');
  });

  test('loadData is called once if we change @filter from undefined to ""', async function (assert) {
    testParams.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          resolve(testParams.data);
        }, 150);
      });
    });

    await render(<template>
      <YetiTable @loadData={{testParams.loadData}} @filter={{testParams.filterText}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName' @sort='desc'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    assert.dom('tbody tr').exists({ count: 5 }, 'is not filtered');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Tom', 'column 1 is not sorted');
    assert.dom('tbody tr:nth-child(5) td:nth-child(2)').hasText('Dale', 'column 2 is not sorted');
    assert.dom('tbody tr:nth-child(5) td:nth-child(3)').hasText('5', 'column 3 is not sorted');

    testParams.filterText = '';

    await clearRender();

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');
  });

  test('loadData can be an ember-concurrency restartable task and be cancelled', async function (assert) {
    // eslint-disable-next-line qunit/require-expect
    assert.expect(4);
    let spy = sinon.spy();
    let hardWorkCounter = 0;

    class Obj {
      @restartableTask
      *loadData() {
        spy(...arguments);
        yield timeout(100);
        hardWorkCounter++;
        return testParams.data;
      }
    }

    let obj = new Obj();

    testParams.filterText = 'Migu';

    render(<template>
      <YetiTable @loadData={{perform obj.loadData}} @filter={{testParams.filterText}} as |table|>

        <table.header as |header|>
          <header.column @prop='firstName'>
            First name
          </header.column>
          <header.column @prop='lastName' @sort='desc'>
            Last name
          </header.column>
          <header.column @prop='points'>
            Points
          </header.column>
        </table.header>

        <table.body />

      </YetiTable>
    </template>);

    setTimeout(() => {
      testParams.filterText = 'Tom';
    }, 50);

    await settled();

    assert.ok(spy.calledTwice, 'load data was called twice (but one was cancelled)');
    assert.ok(spy.firstCall.calledWithMatch({ filterData: { filter: 'Migu' } }));
    assert.ok(spy.secondCall.calledWithMatch({ filterData: { filter: 'Tom' } }));
    assert.strictEqual(hardWorkCounter, 1, 'only did the "hard work" once');

    await clearRender();
  });

  test('reloadData from @registerApi reruns the @loadData function', async function (assert) {
    testParams.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          resolve(testParams.data);
        }, 150);
      });
    });

    await render(<template>
      <YetiTable @loadData={{testParams.loadData}} @registerApi={{fn (mut testParams.tableApi)}} as |table|>

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

    assert.dom('tbody tr').exists({ count: 5 }, 'has only five rows');

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');

    testParams.data.push({
      firstName: 'New',
      lastName: 'User',
      points: 12
    });
    notifyPropertyChange(testParams, 'data');

    testParams.tableApi.reloadData();
    await settled();

    assert.dom('tbody tr').exists({ count: 6 }, 'has an additional row from the reloadData call');

    await clearRender();

    assert.ok(testParams.loadData.calledTwice, 'loadData was called twice');
  });

  test('reloadData from yielded action reruns the @loadData function', async function (assert) {
    testParams.loadData = sinon.spy(() => {
      return new RSVP.Promise(resolve => {
        later(() => {
          resolve(testParams.data);
        }, 150);
      });
    });

    await render(<template>
      <YetiTable @loadData={{testParams.loadData}} as |table|>

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

        <button id='reload' type='button' disabled={{table.isLoading}} {{on 'click' table.actions.reloadData}}>
          Reload
        </button>

      </YetiTable>
    </template>);

    assert.dom('tbody tr').exists({ count: 5 }, 'has only five rows');

    assert.ok(testParams.loadData.calledOnce, 'loadData was called once');

    testParams.data.push({
      firstName: 'New',
      lastName: 'User',
      points: 12
    });
    notifyPropertyChange(testParams, 'data');

    await click('button#reload');

    assert.dom('tbody tr').exists({ count: 6 }, 'has an additional row from the reloadData call');

    await clearRender();

    assert.ok(testParams.loadData.calledTwice, 'loadData was called twice');
  });
});
