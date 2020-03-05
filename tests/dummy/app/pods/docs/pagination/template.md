# Pagination

## Enabling pagination

To enable pagination you just need to pass `@pagination={{true}}` to the `<YetiTable>` component.
This will cause Yeti Table to only render 15 rows at a time.

You can customize the page size and change from 15 to any value you need using the `@pageSize` argument.

Yeti Table provides a component with basic pagination controls, but encourages you to build your own
with the yielded state and actions (more on that in the following section).

{{#docs-demo as |demo|}}
  {{#demo.example name="pagination-simple.hbs"}}
    <YetiTable @data={{this.data}} @pagination={{true}} @pageSize={{10}} as |table|>

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

      <table.tfoot as |foot|>
        <foot.row as |row|>
          <row.cell @visible={{true}} colspan={{table.visibleColumns.length}}>
            <table.pagination/>
          </row.cell>
        </foot.row>
      </table.tfoot>

    </YetiTable>
  {{/demo.example}}

  {{demo.snippet "pagination-simple.hbs"}}
{{/docs-demo}}

By using `colspan={{table.visibleColumns.length}}` we can make sure that the footer cell always spans across
all columns. Keep in mind that you need to use `@visible={{true}}` on the cell, to make sure it always stays visible
no matter what, even if its column definition has `@visible={{false}}`.

## Pagination state and actions

`<YetiTable>` component yields a number of useful pagination information and actions to its block.

Assuming a `<YetiTable as |table|>`, then:

- `table.paginationData` - a hash containing multiple pagination related properties
  - `pageSize` - the current size of a page (default is `15`)
  - `pageNumber` - the current 1-indexed page number (default is `1`)
  - `pageStart` - the 1-indexed index of the first row of this page
  - `pageEnd` - the 1-indexed index of the last row of this page
  - `totalRows` - the number of rows the table is diplaying
  - `totalPages` - the number of pages, given the current `pageSize`
  - `isFirstPage` - a boolean that is `true` when `pageNumber === 1`
  - `isLastPage` - a boolean that is `true` when `pageNumber === totalPages`

- `table.actions` - a hash containing actions to interact with the table
  - `previousPage` - decrements `pageNumber` and no-ops when on the first page
  - `nextPage` - increments `pageNumber` and no-ops when on the last page
  - `goToPage` - goes to a specific given page and clamps the value to a `[1..totalPages]` range
  - `changePageSize` - changes `pageSize` to the given number

You can use these yielded properties and actions to build your own controls as you see fit.
