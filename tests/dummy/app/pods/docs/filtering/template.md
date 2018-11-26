# Filtering

## Global filtering

You can filter a table's rows simply by using the `@filter` argument.

This allows you to update that argument as you wish, either using an input element, a query parameter, a select box, you name it.

Using the `@filter` argument on the `<YetiTable>` component itself will apply a *global* filter to the rows.
This means that Yeti Table will only show rows in which any of its columns match that text. 

{{#docs-demo as |demo|}}
  {{#demo.example name="filtering-simple.hbs"}}
    <div class="docs-flex docs-justify-end">
      <input
        class="input" type="search" placeholder="Search..."
        value={{filterText}} oninput={{action (mut filterText) value="target.value"}}>
    </div>

    <YetiTable @data={{data}} @filter={{filterText}} as |table|>

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

{{#docs-demo as |demo|}}
  {{#demo.example name="filtering-column.hbs"}}

    <div class="docs-flex docs-justify-end">
      <input
        class="input" type="search" placeholder="Search..."
        value={{filterText}} oninput={{action (mut filterText) value="target.value"}}>
    </div>

    <YetiTable @data={{data}} @filter={{filterText}} as |table|>

      <table.header as |header|>
        <header.column @prop="firstName" @filter={{firstNameFilter}}>
          First name
        </header.column>
        <header.column @prop="lastName" @filter={{lastNameFilter}}>
          Last name
        </header.column>
        <header.column @prop="points" @filter={{pointsFilter}}>
          Points
        </header.column>
      </table.header>

      <table.body/>

      <tfoot>
        <tr>
          <td>
            <input
              class="input" type="search" placeholder="Search first name"
              value={{firstNameFilter}} oninput={{action (mut firstNameFilter) value="target.value"}}>
          </td>
          <td>
            <input
              class="input" type="search" placeholder="Search last name"
              value={{lastNameFilter}} oninput={{action (mut lastNameFilter) value="target.value"}}>
          </td>
          <td>
            <input
              class="input" type="search" placeholder="Search points"
              value={{pointsFilter}} oninput={{action (mut pointsFilter) value="target.value"}}>
          </td>
        </tr>
      </tfoot>

    </YetiTable>
  {{/demo.example}}

  {{demo.snippet "filtering-column.hbs"}}
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

This allows for advanced filtering logic. See the following example:

{{#docs-demo as |demo|}}
  {{#demo.example name="filtering-custom.hbs"}}

    <div class="docs-flex docs-justify-end">
      <div>
        Min points:
        <input
          class="input" type="number" min="0" max={{max}}
          value={{min}} oninput={{action (mut min) value="target.value"}}>
      </div>
      <div>
        Max points:
        <input
          class="input" type="number" min={{min}} max="100"
          value={{max}} oninput={{action (mut max) value="target.value"}}>
      </div>
    </div>

    <YetiTable @data={{data}} as |table|>

      <table.header as |header|>
        <header.column @prop="firstName">
          First name
        </header.column>
        <header.column @prop="lastName">
          Last name
        </header.column>
        <header.column @prop="points"
          @filterFunction={{action "filterPoints"}}
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
