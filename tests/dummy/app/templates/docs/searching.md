# Searching

You can filter a table's rows simply by using the `searchText` property.

This allows you to update that property as you wish, either using an input element, a query parameter, a select box, etc.

{{#docs-demo as |demo|}}
  {{#demo.example name="searching-simple.hbs"}}
    {{input value=searchText}}

    {{#yeti-table data=data searchText=searchText as |table|}}

      {{#table.header as |header|}}
        {{#header.column prop="firstName"}}
          First name
        {{/header.column}}
        {{#header.column prop="lastName"}}
          Last name
        {{/header.column}}
        {{#header.column prop="points"}}
          Points
        {{/header.column}}
      {{/table.header}}

      {{table.body}}

    {{/yeti-table}}
  {{/demo.example}}

  {{demo.snippet "searching-simple.hbs"}}
{{/docs-demo}}

If you want to filter on a single column, you can use `searchText` on the column definition.
You can still use the general `searchText` property in the parent `{{yeti-table}}` component.

<aside>
  The column definitions `searchText` property is subtractive, meaning that it will filter out rows
  from the subset that passes the general `searchText`.
</aside>

{{#docs-demo as |demo|}}
  {{#demo.example name="searching-column.hbs"}}

    {{input value=searchText}}

    {{#yeti-table data=data searchText=searchText as |table|}}

      {{#table.header as |header|}}
        {{#header.column prop="firstName" searchText=firstNameFilter}}
          First name
        {{/header.column}}
        {{#header.column prop="lastName" searchText=lastNameFilter}}
          Last name
        {{/header.column}}
        {{#header.column prop="points" searchText=pointsFilter}}
          Points
        {{/header.column}}
      {{/table.header}}

      {{table.body}}

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

    {{/yeti-table}}
  {{/demo.example}}

  {{demo.snippet "searching-column.hbs"}}
{{/docs-demo}}

You can customize the search by passing in a custom `search` function to the parent `{{yeti-table}}` component or to a column definition.
This function should return `true` or `false` to either include or exclude the row on the resulting set.
If this function depends on a value, pass that value as a `searchValue` property.

The `search` function on `{{yeti-table}}` arguments are:
- `row` - the current data row to use for filtering
- `searchValue` - the search value you passed in as `searchValue`

The `search` function on `{{header.column}}` arguments are:
- `value` - the current data **cell** to use for filtering
- `searchValue` - the search value you passed in as `searchValue`

This allows for advanced searching logic. See the following example:

{{#docs-demo as |demo|}}
  {{#demo.example name="searching-custom.hbs"}}

    <p>Min points: {{input type="number" value=min}}</p>
    <p>Max points: {{input type="number" value=max}}</p>

    {{#yeti-table data=data as |table|}}

      {{#table.header as |header|}}
        {{#header.column prop="firstName"}}
          First name
        {{/header.column}}
        {{#header.column prop="lastName"}}
          Last name
        {{/header.column}}
        {{#header.column prop="points" searchValue=(hash min=min max=max) search=(action "searchPoints")}}
          Points
        {{/header.column}}
      {{/table.header}}

      {{table.body}}

    {{/yeti-table}}

  {{/demo.example}}

  {{demo.snippet "searching-custom.hbs"}}
  {{demo.snippet label="component.js" name="searching-custom.js"}}
{{/docs-demo}}
