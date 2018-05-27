# Searching

You can filter a table's rows simply by using the `searchText` property.

This allows you to update that property as you wish, either using an input element, a query parameter, a select box, etc.

{{#docs-demo as |demo|}}
  {{#demo.example name="searching-simple.hbs"}}
    {{input value=searchText}}

    {{#yeti-table data=data searchText=searchText as |yeti|}}

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

  {{demo.snippet "searching-simple.hbs"}}
{{/docs-demo}}
