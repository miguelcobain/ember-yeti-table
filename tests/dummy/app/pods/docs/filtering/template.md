# Filtering

You can filter a table's rows simply by using the `filter` property.

This allows you to update that property as you wish, either using an input element, a query parameter, a select box, etc.

{{#docs-demo as |demo|}}
  {{#demo.example name="filtering-simple.hbs"}}
    {{input value=filter}}

    <YetiTable @data={{data}} @filter={{filter}} as |table|>

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

If you want to filter on a single column, you can use `filter` on the column definition.
You can still use the general `filter` property in the parent `{{yeti-table}}` component.

<aside>
  The column definitions `filter` property is subtractive, meaning that it will filter out rows
  from the subset that passes the general `filter`.
</aside>

{{#docs-demo as |demo|}}
  {{#demo.example name="filtering-column.hbs"}}

    {{input value=filter}}

    <YetiTable @data={{data}} @filter={{filter}} as |table|>

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
            {{input value=firstNameFilter}}
          </td>
          <td>
            {{input value=lastNameFilter}}
          </td>
          <td>
            {{input value=pointsFilter}}
          </td>
        </tr>
      </tfoot>

    </YetiTable>
  {{/demo.example}}

  {{demo.snippet "filtering-column.hbs"}}
{{/docs-demo}}

You can customize the filtering by passing in a custom `filterFunction` function to the parent `{{yeti-table}}` component or to a column definition.
This function should return `true` or `false` to either include or exclude the row on the resulting set.
If this function depends on a value, pass that value as a `filterUsing` property.

The `filterFunction` function on `{{yeti-table}}` arguments are:
- `row` - the current data row to use for filtering
- `filterUsing` - the value you passed in as `filterUsing`

The `filterFunction` function on `{{header.column}}` arguments are:
- `value` - the current data **cell** to use for filtering
- `filterUsing` - the value you passed in as `filterUsing`

This allows for advanced filtering logic. See the following example:

{{#docs-demo as |demo|}}
  {{#demo.example name="filtering-custom.hbs"}}

    <p>Min points: {{input type="number" value=min}}</p>
    <p>Max points: {{input type="number" value=max}}</p>

    <YetiTable @data={{data}} as |table|>

      <table.header as |header|>
        <header.column @prop="firstName">
          First name
        </header.column>
        <header.column @prop="lastName">
          Last name
        </header.column>
        <header.column @prop="points" @filterFunction={{action "filterPoints"}} @filterUsing={{hash min=min max=max}}>
          Points
        </header.column>
      </table.header>

      <table.body/>

    </YetiTable>

  {{/demo.example}}

  {{demo.snippet "filtering-custom.hbs"}}
  {{demo.snippet label="component.js" name="filtering-custom.js"}}
{{/docs-demo}}
