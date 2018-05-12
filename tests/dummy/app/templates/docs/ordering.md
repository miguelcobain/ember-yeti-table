# Ordering

Yeti table columns are sortable by default. Try to click the table headers in the example below.

You can disable sorting in any column by passing `orderable=false` to any column definition.

{{#docs-demo as |demo|}}
  {{#demo.example name="ordering-simple.hbs"}}
    {{#yeti-table data=data columns="firstName lastName points" as |yeti|}}

        {{#yeti.table as |table|}}
          {{#table.header as |header|}}
            {{#header.column}}
              First name
            {{/header.column}}
            {{#header.column orderable=false}}
              Last name
            {{/header.column}}
            {{#header.column}}
              Points
            {{/header.column}}
          {{/table.header}}

          {{table.body}}
        {{/yeti.table}}

      {{/yeti-table}}
  {{/demo.example}}

  {{demo.snippet "ordering-simple.hbs"}}
{{/docs-demo}}

If you need to specify an order by default, you can pass in `sortProperty` and `sortDirection`. `sortDirection` can be `asc` or `desc` strings and it defaults to `asc`.

Note that updating these properties will also update the ordering of the table. Also, if you update an object's property which the table is sorted on, the table ordering will update accordingly.

It is very common to customize the column header based on the sorting status of that column.
Yeti table provides two approaches for this customization:

- **css classes** - When a column is ordered ascending, it will have the `yeti-table-sorted-asc` class. When a column is ordered descending, it will have the `yeti-table-sorted-desc` class. You can use these to style according to your needs.
- **yielded hash** - Every `{{header.column}}` component will yield a hash of booleans that contains: `isSorted`, `isAscSorted` and `isDescSorted`. You can use these to customize the rendering of the column itself.

{{#docs-demo as |demo|}}
  {{#demo.example name="ordering-custom.hbs"}}
    {{#yeti-table data=data columns="firstName lastName points" sortProperty="points" as |yeti|}}

      {{#yeti.table as |table|}}
        {{#table.header as |header|}}
          {{#header.column as |column|}}
            First name
            {{if column.isAscSorted "(sorted asc)"}} {{if column.isDescSorted "(sorted desc)"}}
          {{/header.column}}
          {{#header.column as |column|}}
            Last name
            {{if column.isAscSorted "(sorted asc)"}} {{if column.isDescSorted "(sorted desc)"}}
          {{/header.column}}
          {{#header.column as |column|}}
            Points
            {{if column.isAscSorted "(sorted asc)"}} {{if column.isDescSorted "(sorted desc)"}}
          {{/header.column}}
        {{/table.header}}

        {{table.body}}
      {{/yeti.table}}

    {{/yeti-table}}
  {{/demo.example}}

  {{demo.snippet "ordering-custom.hbs"}}
{{/docs-demo}}

# Advanced ordering

Sometimes we have more advanced ordering requirements. Yeti table uses the `sort` macro from `@ember/object/computed` ([docs here](https://emberjs.com/api/ember/3.0/functions/@ember%2Fobject%2Fcomputed/sort)) under the hood and exposes the sort definition as the `sortDefinition` property.

Let's say we want to sort by `firstName` ascending and then by `lastName` descending. We could pass `sortDefinition="firstName:asc lastName:desc"` string to yeti-table. 

<aside>Yeti table takes care of splitting the string for you, so you don't need to pass in an array.</aside>

{{#docs-demo as |demo|}}
  {{#demo.example name="ordering-advanced.hbs"}}
    {{#yeti-table data=advancedSortingData columns="firstName lastName points"
      sortDefinition="firstName lastName:desc" as |yeti|}}

      {{#yeti.table as |table|}}
        {{#table.header as |header|}}
          {{#header.column}}
            First name
          {{/header.column}}
          {{#header.column}}
            Last name
          {{/header.column}}
          {{#header.column}}
            Points
          {{/header.column}}
        {{/table.header}}

        {{table.body}}
      {{/yeti.table}}

    {{/yeti-table}}
  {{/demo.example}}

  {{demo.snippet "ordering-advanced.hbs"}}
{{/docs-demo}}

Notice that the last names are sorting descending for the same first name.

Column header classes, yielded sort status and clickable columns **do not apply** in this advanced ordering scenario. Let's chat a bit if you want to support this.
