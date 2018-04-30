# General

In this example, ember-yeti-tables "unrolls" the table for you if you use
`{{table.body}}` in the blockless form.

You can still customize the generated rows using:

- `onRowClick` - adds a click action to each row, called with the clicked row's data as an argument
- `rowClass` - adds a class to each `tr` element

{{#docs-demo as |demo|}}
  {{#demo.example name="general-simple.hbs"}}
    {{#yeti-table data=data as |yeti|}}

      {{#yeti.table as |table|}}
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
      {{/yeti.table}}

    {{/yeti-table}}
  {{/demo.example}}

  {{demo.snippet "general-simple.hbs"}}
{{/docs-demo}}

If you need to make more advanced customizations, you will need
to use `{{#table.body}}` in the block form. This form
allows you to:

- Use any component or markup as the cell's content
- Use the row data accross multiple cells of the same row
- Attach click listeners to the row or cell
- Use row data to conditionally add classes

{{#docs-demo as |demo|}}
  {{#demo.example name="general-simple-with-body.hbs"}}
    {{#yeti-table data=data sortProperty="firstName" sortDirection="desc" as |yeti|}}

      {{#yeti.table as |table|}}
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

        {{#table.body as |body person|}}
          {{#body.row as |row|}}
            {{#row.cell}}
              {{person.firstName}}
            {{/row.cell}}
            {{#row.cell}}
              {{person.lastName}}
            {{/row.cell}}
            {{#row.cell}}
              {{person.points}}
            {{/row.cell}}
          {{/body.row}}
        {{/table.body}}
      {{/yeti.table}}

    {{/yeti-table}}
  {{/demo.example}}

  {{demo.snippet "general-simple-with-body.hbs"}}
{{/docs-demo}}