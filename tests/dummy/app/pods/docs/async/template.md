
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
  - `pageStart` - the 0-indexed index of the first record of the current page
  - `pageEnd` - the 0-indexed index of the last record of the current page
  - `isFirstPage` - boolean that is `true` when we're on the first page (useful to disable a previous button)
  - `isLastPage` - boolean that is `true` when we're on the last page (useful to disable a next button)
  - `totalRows` - the total nubmer of rows (same as the `@totalRows` argument)
  - `totalPages` - the calculated total number of pages based on the current `pageSize`

- `sortData` - an array of `{ prop, direction }` objects for each column that represents the current sorting status of the table

- `filterData` - an object that contains:
  - `filter` - the current global filter applied to the table
  - `filterUsing` - the current `@filterUsing` property, if existent
  - `columnFilters` - an array of `{ filter, filterUsing }` objects for each column

With this data you should be able to build the correct request to inform your server of what exact info Yeti Table wants.

## `isLoading`

In the hash that Yeti Table yields, there is an `isLoading` boolean. This boolean is `true` when:

- the promise passed in to the `@data` argument didn't resolve yet
- the `@loadData` function is running

You can use this boolean to build a loading data indicator on the table.

## All together now

Here is an example of a table using async loading with filtering, sorting and pagination with custom made pagination controls.

This example uses ember-data and ember-cli-mirage to fake a real server.
In this example, filtering, sorting and pagination are entirely done on the server. Yeti Table just
asks for data and displays it.

<aside>
  The server side implementation is out of scope for these guides, but you can check it [here](https://github.com/miguelcobain/ember-yeti-table/blob/master/tests/dummy/mirage/config.js#L32-L54) if you're interested.
</aside>

{{#docs-demo as |demo|}}
  {{#demo.example name="async-simple.hbs"}}

    {{input value=filter}}

    <YetiTable
      @loadData={{action "loadData"}}
      @filter={{filter}}
      @pagination={{true}} @pageSize={{20}} @totalRows={{totalRows}} as |table|>
      
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
          <row.cell @class="avatar-cell">
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

      <tfoot>
        <tr>
          <td colspan="5">
            <div class="pagination-controls">
              <div>
                Rows per page:
                <XSelect @value={{table.paginationData.pageSize}} @action={{action table.actions.changePageSize}} as |xs|>
                  <xs.option @value={{10}}>10</xs.option>
                  <xs.option @value={{15}}>15</xs.option>
                  <xs.option @value={{20}}>20</xs.option>
                  <xs.option @value={{25}}>25</xs.option>
                </XSelect>
              </div>

              <div class="page-info">
                {{add table.paginationData.pageStart 1}} - {{add table.paginationData.pageEnd 1}} of {{table.paginationData.totalRows}}
              </div>

              <button class="previous" disabled={{table.paginationData.isFirstPage}} onclick={{action table.actions.previousPage}}>
                <i class="material-icons">keyboard_arrow_left</i>
              </button>

              <button class="next" disabled={{table.paginationData.isLastPage}} onclick={{action table.actions.nextPage}}>
                <i class="material-icons">keyboard_arrow_right</i>
              </button>
            </div>
          </td>
        </tr>
      </tfoot>

    </YetiTable>

  {{/demo.example}}

  {{demo.snippet "async-simple.hbs"}}
  {{demo.snippet label="component.js" name="async-simple.js"}}
  {{demo.snippet label="user.js" name="user.js"}}
{{/docs-demo}}
