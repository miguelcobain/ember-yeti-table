# Sorting

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

If you need to specify a sort order, you can use the `sort` property. The property should be a string with a syntax similar to 
the [`sort` macro](https://emberjs.com/api/ember/3.0/functions/@ember%2Fobject%2Fcomputed/sort) from `@ember/object/computed`.

Note that updating the `sort` property will also update the sorting of the table. Also, if you update an object's property which the table is sorted on, the table sorting will update accordingly.

It is very common to customize the column header based on the sorting status of that column.
Yeti table provides two approaches for this customization:

- **css classes** - When a column is sorted ascending, it will have the `yeti-table-sorted-asc` class. When a column is sorted descending, it will have the `yeti-table-sorted-desc` class. You can use these to style according to your needs.
- **yielded hash** - Every `{{header.column}}` component will yield a hash of booleans that contains: `isSorted`, `isAscSorted` and `isDescSorted`. You can use these to customize the rendering of the column itself.

{{#docs-demo as |demo|}}
  {{#demo.example name="sorting-custom.hbs"}}
    {{#yeti-table data=data sort="points" as |table|}}

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

# Multiple sorting

Sometimes we have more advanced sorting requirements. In most cases, the `sort` property will suffice.

Let's say we want to sort by `firstName` ascending and then by `lastName` descending. We could pass `sort="firstName lastName:desc"` string to yeti-table. 

<aside>The `asc` direction will be used if you omit a direction.</aside>

{{#docs-demo as |demo|}}
  {{#demo.example name="sorting-advanced.hbs"}}
    {{#yeti-table data=advancedSortingData sort="firstName lastName:desc" as |table|}}

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

<aside>Bonus: you can shift+click on a header column to add a new sort to the existing ones!</aside>

# Advanced sorting

Yeti table allows you to pass in a `sortFunction` and a `compareFunction`. They do slightly different things.

Use the `sortFunction` if you want to completely customize how the row sorting is done. It will be invoked with two rows,
the current sortings that are applied and the compare function.

Use `compareFunction` if you just want to customize how two values relate to each other (not the entire row). It will be invoked with two values
and you just need to return -1, 0 or 1 depending on if first value is greater than the second or not. The default compare function used is [`compare` function](https://emberjs.com/api/ember/3.2/functions/@ember%2Futils/compare) from `@ember/utils`.
