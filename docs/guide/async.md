# Async data

## The `loadData` function

Up until now the guides assumed you passed in an array of data to the `@data` argument of `<YetiTable>`. However, sometimes you don't have all the data available or loading all rows at once isn't possible, e.g. the dataset is too large.

In these cases we delegate sorting, filtering and pagination to the server (or any other async data source, for that matter). The data source is effectively "driving" the table.

Yeti Table provides a `@loadData` argument that accepts a function to load data. This function will be invoked whenever new data is needed:

- when sorting changes
- when any `@filter` or `@filterUsing` changes
- when the page number or page size changes (if pagination is enabled)

## `loadData` arguments

The `loadData` function is invoked with a single hash with the following properties:

- `paginationData` — same hash described in the [Pagination](./pagination#pagination-state-and-actions) guide
- `sortData` — an array of `{ prop, direction }` hashes describing the current sort
- `filterData` — a hash with the current filter values:
  - `filter` — the global `@filter` value
  - `filterUsing` — the value passed to `@filterUsing`
  - `columnFilters` — an array of per-column filters

Whatever this function returns (an array, or a promise that resolves to one) will be used as the row data. You can return your data however you like — for example with `fetch`, `ember-data`, or an `ember-concurrency` task.

## `isLoading`

In the hash that Yeti Table yields, there is an `isLoading` boolean. This boolean is `true` when:

- the promise passed in to the `@data` argument didn't resolve yet
- the `@loadData` function is running

You can use this boolean to build a loading data indicator on the table.

## `@totalRows` and async

You'll usually use pagination and async together. In such a case, Yeti Table needs to know the total number of rows to display the correct pagination information.

To do this, you need to get the total number of rows from your server (usually sent in the `meta` hash in JSON:API) and set that value to the `@totalRows` argument of `<YetiTable>`.

## All together now

Here is an example of a table using async loading with filtering, sorting and pagination. In this example, filtering, sorting and pagination are entirely done on the server. Yeti Table just asks for data and displays it.

```gts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';

import YetiTable from 'ember-yeti-table/components/yeti-table';

export default class AsyncExample extends Component {
  @service store;

  @tracked filterText = '';
  @tracked totalRows;

  // Using ember-concurrency for debouncing.
  // Use this on YetiTable as `@loadData={{perform this.loadDataTask}}`.
  @restartableTask
  *loadDataTask({ paginationData, sortData, filterData }) {
    yield timeout(250);

    const params = {
      sortBy: sortData.map((s) => s.prop),
      sortDir: sortData.map((s) => s.direction),
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      filter: filterData.filter,
    };

    const users = yield this.store.query('user', params);
    this.totalRows = users.meta?.totalRows;
    return users;
  }

  // Or using plain async/await.
  // Use this on YetiTable as `@loadData={{this.loadData}}`.
  @action
  async loadData({ paginationData, sortData, filterData }) {
    const params = {
      sortBy: sortData.map((s) => s.prop),
      sortDir: sortData.map((s) => s.direction),
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      filter: filterData.filter,
    };

    const users = await this.store.query('user', params);
    this.totalRows = users.meta?.totalRows;
    return users;
  }

  <template>
    <YetiTable
      @loadData={{this.loadData}}
      @filter={{this.filterText}}
      @pagination={{true}}
      @pageSize={{10}}
      @totalRows={{this.totalRows}}
      as |table|
    >
      <table.header as |header|>
        <header.column @prop="firstName">First name</header.column>
        <header.column @prop="lastName">Last name</header.column>
        <header.column @prop="points">Points</header.column>
      </table.header>

      <table.body />

      <table.tfoot as |foot|>
        <foot.row as |row|>
          <row.cell colspan={{table.visibleColumns.length}}>
            <table.pagination />
          </row.cell>
        </foot.row>
      </table.tfoot>
    </YetiTable>
  </template>
}
```

> The server-side implementation is out of scope for these guides, but you can check it [here](https://github.com/miguelcobain/ember-yeti-table/blob/master/tests/dummy/mirage/config.js) if you're interested.
