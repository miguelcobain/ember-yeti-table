import { render, settled, click, getContext } from '@ember/test-helpers';
import type { TestContext } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { tracked } from '@glimmer/tracking';
import { runTask } from 'ember-lifeline';
import sinon from 'sinon';
import type { SinonSpy } from 'sinon';

import YetiTable from '#src/components/yeti-table';
import { on } from '@ember/modifier';

import type { LoadDataParams, Row } from '#src/types';
import type Column from '#src/components/yeti-table/thead/row/column';

type LoadDataFn = (params: LoadDataParams) => Promise<Row[]>;

interface ColumnDef {
  field: string;
  labelA: string;
  labelB: string;
}

class TestParams {
  @tracked useAltLabels = false;

  columnDefs: ColumnDef[] = [
    { field: 'firstName', labelA: 'First name', labelB: 'Prénom' },
    { field: 'lastName', labelA: 'Last name', labelB: 'Nom' },
    { field: 'email', labelA: 'Email', labelB: 'Courriel' },
  ];

  rows = [
    {
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@test.com',
    },
  ];

  loadData?: SinonSpy & LoadDataFn;

  get displayColumns() {
    if (this.useAltLabels) {
      return this.columnDefs.map((col) => ({
        field: col.field,
        label: col.labelB,
      }));
    }

    return this.columnDefs.map((col) => ({
      field: col.field,
      label: col.labelA,
    }));
  }

  toggle = () => {
    this.useAltLabels = !this.useAltLabels;
  };
}

module(
  'Integration | Component | yeti-table | column re-render',
  function (hooks) {
    setupRenderingTest(hooks);

    let originalRegisterColumn: YetiTable['registerColumn'];
    let blockColumnRegistration = false;
    const pendingColumns: Column[] = [];
    let tableInstance: YetiTable | null = null;

    hooks.beforeEach(function (this: void) {
      // eslint-disable-next-line @typescript-eslint/unbound-method -- prototype snapshot for test isolation
      originalRegisterColumn = YetiTable.prototype.registerColumn;
      blockColumnRegistration = false;
      pendingColumns.length = 0;
      tableInstance = null;

      YetiTable.prototype.registerColumn = function (
        this: YetiTable,
        column: Column,
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias -- capture table instance for deferred registration
        tableInstance = this;

        if (blockColumnRegistration) {
          pendingColumns.push(column);
          return;
        }

        originalRegisterColumn.call(this, column);
      };
    });

    hooks.afterEach(function () {
      YetiTable.prototype.registerColumn = originalRegisterColumn;
    });

    test('rows remain visible after column header re-render', async function (assert) {
      const testParams = new TestParams();
      const context = getContext() as TestContext;

      testParams.loadData = sinon.spy(() => {
        return new Promise<Row[]>((resolve) => {
          runTask(
            context,
            () => {
              resolve(testParams.rows);
            },
            50,
          );
        });
      }) as SinonSpy & LoadDataFn;

      await render(
        <template>
          <button
            type="button"
            data-test-toggle-labels
            {{on "click" testParams.toggle}}
          >
            toggle
          </button>

          <YetiTable
            @loadData={{testParams.loadData}}
            @pagination={{true}}
            @pageSize={{10}}
            @totalRows={{1}}
            as |yt|
          >
            <yt.header as |header|>
              {{#each testParams.displayColumns key="label" as |col|}}
                <header.column @prop={{col.field}} @sortable={{true}}>
                  {{col.label}}
                </header.column>
              {{/each}}
            </yt.header>

            <yt.body />

            <div data-test-visible-rows>{{yt.visibleRows.length}}</div>
            <div data-test-column-count>{{yt.columns.length}}</div>
          </YetiTable>
        </template>,
      );

      assert.dom('tbody tr').exists({ count: 1 }, 'initial row is rendered');
      assert.dom('[data-test-visible-rows]').hasText('1');
      assert.ok(
        testParams.loadData?.called,
        'loadData was called on initial render',
      );

      blockColumnRegistration = true;

      await click('[data-test-toggle-labels]');

      assert
        .dom('[data-test-column-count]')
        .hasText(
          '0',
          'columns stay unregistered while registerColumn is deferred',
        );
      assert
        .dom('tbody tr')
        .exists(
          { count: 1 },
          'row should remain visible while columns are temporarily unregistered',
        );
      assert
        .dom('[data-test-visible-rows]')
        .hasText(
          '1',
          'visibleRows should not be cleared during column re-render',
        );

      blockColumnRegistration = false;

      for (const column of pendingColumns.splice(0)) {
        originalRegisterColumn.call(tableInstance, column);
      }

      await settled();

      assert.dom('[data-test-column-count]').hasText('3');

      assert
        .dom('tbody tr')
        .exists(
          { count: 1 },
          'row should remain visible after columns are re-registered',
        );
      assert.dom('[data-test-visible-rows]').hasText('1');
    });
  },
);
