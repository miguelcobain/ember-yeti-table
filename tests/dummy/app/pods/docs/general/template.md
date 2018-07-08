# General

In this example, ember-yeti-tables "unrolls" the table for you if you use `<table.body/>` in the blockless form.

{{#docs-demo as |demo|}}
  {{#demo.example name="general-simple.hbs"}}
    <YetiTable @data={{data}} as |table|>

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

  {{demo.snippet "general-simple.hbs"}}
{{/docs-demo}}

You can still customize the generated rows using the following parameters on `<table.body/>`:

- `onRowClick` - adds a click action to each row, called with the clicked row's data as an argument
- `rowClass` - adds a class to each `tr` element

You will probably need to make more customizations, and to do so you will need to use `{{table.header}}`
and/or `<table.body/>` in the block form. This form allows you to:

- Use any component or markup as a cell's content
- Use the row data across multiple cells of the same row
- Attach click listeners to the row or cell
- Use row data to conditionally add classes

<aside>
  Notice that if you don't need automatic unrolling or sorting, the `prop` property is optional.
</aside>

{{#docs-demo as |demo|}}
  {{#demo.example name="general-simple-with-body.hbs"}}
    <YetiTable @data={{data}} as |table|>

      <table.header as |header|>
        <header.column>
          First name
        </header.column>
        <header.column>
          Last name
        </header.column>
        <header.column>
          Points
        </header.column>
      </table.header>

      <table.body as |body person|>
        <body.row as |row|>
          <row.cell>
            {{person.firstName}}
          </row.cell>
          <row.cell>
            {{person.lastName}}
          </row.cell>
          <row.cell>
            {{person.points}}
          </row.cell>
        </body.row>
      </table.body>

    </YetiTable>
  {{/demo.example}}

  {{demo.snippet "general-simple-with-body.hbs"}}
{{/docs-demo}}
