# Async data

## The `loadData` function

Up until now the guides assumed you passed in an array of data to the `@data` argument of `<YetiTable>`.
However, sometimes you don't have all the data available or loading all rows at once isn't possible, e.g the dataset is too large.

In this cases we delegate sorting, filtering and pagination to the server (or any other async data source, for that matter).
The data source is effectively "driving" the table.

Yeti Table provides a `@loadData` argument that you can pass in a function to load data.
This function will be invoked whenever new data is needed:

- when sorting changes
- when any `@filter` or `@filterUsing` changes
- when the page number or page size changes (if pagination is enabled)

## `loadData` arguments

The argument for the `loadData` function is an object that contains:

- `paginationData` - an object that contains:

  - `pageSize` - the current size of the page
  - `pageNumber` - the current page number
  - `pageStart` - the 1-indexed index of the first record of the current page
  - `pageEnd` - the 1-indexed index of the last record of the current page
  - `isFirstPage` - boolean that is `true` when we're on the first page (useful to disable a previous button)
  - `isLastPage` - boolean that is `true` when we're on the last page (useful to disable a next button)
  - `totalRows` - the total number of rows (same as the `@totalRows` argument)
  - `totalPages` - the calculated total number of pages based on the current `pageSize`

- `sortData` - an array of `{ prop, direction }` objects for each column that represents the current sorting status of the table

- `filterData` - an object that contains:
  - `filter` - the current global filter applied to the table
  - `filterUsing` - the current `@filterUsing` property, if existent
  - `columnFilters` - an array of `{ prop, filter, filterUsing }` objects for each column

With this data you should be able to build the correct request to inform your server of what exact info Yeti Table wants.

## `isLoading`

In the hash that Yeti Table yields, there is an `isLoading` boolean. This boolean is `true` when:

- the promise passed in to the `@data` argument didn't resolve yet
- the `@loadData` function is running

You can use this boolean to build a loading data indicator on the table.

## `@totalRows` and async

You'll usually use pagination and async together. In such a case, Yeti Table needs to know
the total number of rows to display the correct pagination information.

To do this, you need to get the total number of rows from your server (usually sent in the `meta` hash in JSON:API)
and set that value to the `@totalRows` argument of `<YetiTable>`.

In the next section we'll see an example of such.

## All together now

Here is an example of a table using async loading with filtering, sorting and pagination with custom made pagination controls.

This example uses ember-data and ember-cli-mirage to fake a real server.
In this example, filtering, sorting and pagination are entirely done on the server. Yeti Table just
asks for data and displays it.

The example also uses ember-concurrency to easily debounce the `loadData` function. You could also write this function
as an async/await function (check the `load-data-async-await.js` tab of the next demo).

A custom pagination controls component is also included (check the `pagination-component.hbs` tab of the next demo).

<aside>
  The server side implementation is out of scope for these guides, but you can check it
  <a href="https://github.com/miguelcobain/ember-yeti-table/blob/master/tests/dummy/mirage/config.js#L33-L64" target="_blank" rel="noopener noreferrer">here</a>
  if you're interested.
</aside>

{{#docs-demo as |demo|}}
{{#demo.example name="async-simple.hbs"}}

    <div class="docs-flex docs-justify-end">
      <input
        class="input" type="search" placeholder="Search..."
        value={{this.filterText}} oninput={{action (mut this.filterText) value="target.value"}}>
    </div>

    <YetiTable
      @loadData={{perform this.loadDataTask}}
      @filter={{this.filterText}}
      @pagination={{true}} @pageSize={{10}} @totalRows={{this.totalRows}} as |table|>

      <table.header as |header|>
        <header.column @prop="avatarUrl" @sortable={{false}}>
          Avatar
        </header.column>
        <header.column @prop="firstName" @sort="asc">
          First name
        </header.column>
        <header.column @prop="lastName">
          Last name
        </header.column>
        <header.column @prop="email">
          E-mail
        </header.column>
        <header.column @prop="age">
          Age
        </header.column>
      </table.header>

      <table.body as |body user|>
        <body.row as |row|>
          <row.cell class="avatar-cell">
            <img class="avatar" src={{user.avatarUrl}} alt={{user.name}}>
          </row.cell>
          <row.cell>
            {{user.firstName}}
          </row.cell>
          <row.cell>
            {{user.lastName}}
          </row.cell>
          <row.cell>
            {{user.email}}
          </row.cell>
          <row.cell>
            {{user.age}}
          </row.cell>
        </body.row>
      </table.body>

      <table.tfoot as |foot|>
        <foot.row as |row|>
          <row.cell colspan={{table.visibleColumns.length}}>
            <MaterialPagination @table={{table}} />
          </row.cell>
        </foot.row>
      </table.tfoot>

      {{#if table.isLoading}}
        <div class="loading-pane">
          <MaterialSpinner/>
        </div>
      {{/if}}

    </YetiTable>

{{/demo.example}}

{{demo.snippet "async-simple.hbs"}}
{{demo.snippet label="load-data-task.js" name="async-simple.js"}}
{{demo.snippet label="load-data-async-await.js" name="async-simple-es7.js"}}
{{demo.snippet label="pagination-component.hbs" name="async-custom-pagination.hbs"}}
{{demo.snippet label="user-model.js" name="user.js"}}
{{/docs-demo}}
