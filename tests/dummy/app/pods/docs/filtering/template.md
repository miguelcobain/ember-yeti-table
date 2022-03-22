# Filtering

## Global filtering

You can filter a table's rows simply by using the `@filter` argument.

This allows you to update that argument as you wish, either using an input element, a query parameter, a select box, you name it.

Using the `@filter` argument on the `<YetiTable>` component itself will apply a _global_ filter to the rows.
This means that Yeti Table will only show rows in which any of its columns match that text.

If you update an object's property, the table's filtered rows will be updated accordingly. This behaviour can be turned off with `@ignoreDataChanges={{true}}`.

{{#docs-demo as |demo|}}
{{#demo.example name="filtering-simple.hbs"}}

<div class="docs-flex docs-justify-end">
<input
class="input" type="search" placeholder="Search..."
value={{this.filterText}} oninput={{action (mut this.filterText) value="target.value"}}>
</div>

    <YetiTable @data={{this.data}} @filter={{this.filterText}} as |table|>

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

{{/demo.example}}

{{demo.snippet "filtering-simple.hbs"}}
{{/docs-demo}}

## Single column filtering

You can also use the `@filter` argument on the columns, in which case the filter would only apply to that column.
This means that Yeti Table will only show rows in which that particular column matches that text.

You can use the `@filter` argument on `<YetiTable>` and `<header.column>` at the same time.

<aside>
  The column definitions `@filter` argument is subtractive, meaning that it will filter out rows
  from the subset that passes the general `@filter`.
</aside>

<aside>
  Notice how in the following example we used the `table.head` component instead of `table.header`
  because we wanted to place the filter inputs on an additional header row.
</aside>

{{#docs-demo as |demo|}}
{{#demo.example name="filtering-column-provided.hbs"}}

    <div class="docs-flex docs-justify-end">
      <input
        class="input" type="search" placeholder="Search..."
        value={{filterText}} oninput={{action (mut this.filterText) value="target.value"}}>
    </div>

    <YetiTable @data={{this.data}} @filter={{this.filterText}} as |table|>

      <table.thead as |head|>
        <head.row as |row|>
          <row.column @prop="firstName" @filter={{this.firstNameFilter}}>
            First name
          </row.column>
          <row.column @prop="lastName" @filter={{this.lastNameFilter}}>
            Last name
          </row.column>
          <row.column @prop="points" @filter={{this.pointsFilter}}>
            Points
          </row.column>
        </head.row>

        <head.row as |row|>
          <row.cell>
              <input
                class="input" type="search" placeholder="Search first name"
                value={{this.firstNameFilter}}
                oninput={{action (mut this.firstNameFilter) value="target.value"}}>
          </row.cell>
          <row.cell>
              <input
                class="input" type="search" placeholder="Search last name"
                value={{this.lastNameFilter}}
                oninput={{action (mut this.lastNameFilter) value="target.value"}}>
          </row.cell>
          <row.cell>
              <input
                class="input" type="search" placeholder="Search points"
                value={{this.pointsFilter}}
                oninput={{action (mut this.pointsFilter) value="target.value"}}>
          </row.cell>
        </head.row>

      </table.thead>

      <table.body/>

    </YetiTable>

{{/demo.example}}

{{demo.snippet "filtering-column-provided.hbs"}}
{{/docs-demo}}

## Advanced filtering

You can customize the filtering by passing in a custom `@filterFunction` function argument to the
parent `<YetiTable>` component or to a column definition.
This function should return `true` or `false` to either include or exclude the row on the resulting set.
If this function depends on a value, pass that value as a `@filterUsing` argument.

The `@filterFunction` function on `<YetiTable>` arguments are:

- `row` - the current data row to use for filtering
- `filterUsing` - the value you passed in as `@filterUsing`

The `@filterFunction` function on `<header.column>` arguments are:

- `value` - the current data **cell** to use for filtering
- `filterUsing` - the value you passed in as `@filterUsing`
- `row` - the current data row to use for filtering

This allows for advanced filtering logic. See the following example:

{{#docs-demo as |demo|}}
{{#demo.example name="filtering-custom.hbs"}}

    <div class="docs-flex docs-justify-end">
      <div>
        Min points:
        <input
          class="input" type="number" min="0" max={{this.max}}
          value={{this.min}} oninput={{action (mut this.min) value="target.value"}}>
      </div>
      <div>
        Max points:
        <input
          class="input" type="number" min={{this.min}} max="100"
          value={{this.max}} oninput={{action (mut this.max) value="target.value"}}>
      </div>
    </div>

    <YetiTable @data={{this.data}} as |table|>

      <table.header as |header|>
        <header.column @prop="firstName">
          First name
        </header.column>
        <header.column @prop="lastName">
          Last name
        </header.column>
        <header.column @prop="points"
          @filterFunction={{this.filterPoints}}
          @filterUsing={{hash min=min max=max}}>
          Points
        </header.column>
      </table.header>

      <table.body/>

    </YetiTable>

{{/demo.example}}

{{demo.snippet "filtering-custom.hbs"}}
{{demo.snippet label="component.js" name="filtering-custom.js"}}
{{/docs-demo}}
