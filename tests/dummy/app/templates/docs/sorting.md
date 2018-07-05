# sorting

Yeti table columns are sortable by default. Try to click the table headers in the example below.

You can disable sorting in any column by passing `sortable=false` to any column definition.

{{#docs-demo as |demo|}}
  {{#demo.example name="sorting-simple.hbs"}}
    {{#yeti-table data=data as |table|}}

      {{#table.header as |header|}}
        {{#header.column prop="firstName"}}
          First name
        {{/header.column}}
        {{#header.column prop="lastName" sortable=false}}
          Last name
        {{/header.column}}
        {{#header.column prop="points"}}
          Points
        {{/header.column}}
      {{/table.header}}

      {{table.body}}

    {{/yeti-table}}
  {{/demo.example}}

  {{demo.snippet "sorting-simple.hbs"}}
{{/docs-demo}}

If you need to specify an sort order by default, you can pass in `sortProperty` and `sortDirection`. `sortDirection` can be `asc` or `desc` strings and it defaults to `asc`.

Note that updating these properties will also update the sorting of the table. Also, if you update an object's property which the table is sorted on, the table sorting will update accordingly.

It is very common to customize the column header based on the sorting status of that column.
Yeti table provides two approaches for this customization:

- **css classes** - When a column is sorted ascending, it will have the `yeti-table-sorted-asc` class. When a column is sorted descending, it will have the `yeti-table-sorted-desc` class. You can use these to style according to your needs.
- **yielded hash** - Every `{{header.column}}` component will yield a hash of booleans that contains: `isSorted`, `isAscSorted` and `isDescSorted`. You can use these to customize the rendering of the column itself.

{{#docs-demo as |demo|}}
  {{#demo.example name="sorting-custom.hbs"}}
    {{#yeti-table data=data sortProperty="points" as |table|}}

      {{#table.header as |header|}}
        {{#header.column prop="firstName" as |column|}}
          First name
          {{if column.isAscSorted "(sorted asc)"}} {{if column.isDescSorted "(sorted desc)"}}
        {{/header.column}}
        {{#header.column prop="lastName" as |column|}}
          Last name
          {{if column.isAscSorted "(sorted asc)"}} {{if column.isDescSorted "(sorted desc)"}}
        {{/header.column}}
        {{#header.column prop="points" as |column|}}
          Points
          {{if column.isAscSorted "(sorted asc)"}} {{if column.isDescSorted "(sorted desc)"}}
        {{/header.column}}
      {{/table.header}}

      {{table.body}}

    {{/yeti-table}}
  {{/demo.example}}

  {{demo.snippet "sorting-custom.hbs"}}
{{/docs-demo}}

# Advanced sorting

Sometimes we have more advanced sorting requirements. Yeti table uses the `sort` macro from `@ember/object/computed` ([docs here](https://emberjs.com/api/ember/3.0/functions/@ember%2Fobject%2Fcomputed/sort)) under the hood and exposes the sort definition as the `sortDefinition` property.

Let's say we want to sort by `firstName` ascending and then by `lastName` descending. We could pass `sortDefinition="firstName:asc lastName:desc"` string to yeti-table. 

<aside>Yeti table takes care of splitting the string for you, so you don't need to pass in an array.</aside>

{{#docs-demo as |demo|}}
  {{#demo.example name="sorting-advanced.hbs"}}
    {{#yeti-table data=advancedSortingData sortDefinition="firstName lastName:desc" as |table|}}

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

  {{demo.snippet "sorting-advanced.hbs"}}
{{/docs-demo}}

Notice that the last names are sorting descending for the same first name.

Column header classes, yielded sort status and clickable columns **do not apply** in this advanced sorting scenario. Let's chat a bit if you want to support this.
