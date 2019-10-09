# Defining a table

Your starting point for Yeti Table will be the `@data` argument. It accepts an array of objects
or a promise that resolves to such an array.

Then you must define your table columns inside the header component, each of them with a `@prop` argument that corresponds to the
property key of each object that you want to display for that column. Yeti Table will update itself based on
these property names, e.g if a `firstName` property of an object changes, Yeti Table might need to re-sort
or re-filter the rows.

Afterwards, we just need to define our table body. If you use `<table.body/>` in the blockless form,
Yeti Table "unrolls" all the rows for you. This is useful for simple tables. Here is such an example:

{{#docs-demo as |demo|}}
  {{#demo.example name="general-simple.hbs"}}
    <YetiTable @data={{this.data}} as |table|>

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

You can still add a click handler to the generated rows by passing the `@onRowClick` argument
to `<table.body/>`. `@onRowClick` adds a click action to each row, called with the clicked row's data as an argument.

You will probably need to make more customizations, and to do so you will need to use `<table.head>`,
`<table.foot>` and/or `<table.body>` in the block form. This form allows you to:

- Use any component or markup as a cell's content
- Use the row data across multiple cells of the same row
- Attach click listeners to the row or cell
- Use row data to conditionally add classes

<aside>
  Notice that if you don't need automatic unrolling, sorting or filtering, the `prop` property is optional.
</aside>

{{#docs-demo as |demo|}}
  {{#demo.example name="general-simple-with-body.hbs"}}
    <YetiTable @data={{this.data}} as |table|>

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

      <table.foot as |foot|>
        <foot.row as |row|>
          <row.cell>
            First Name footer
          </row.cell>
          <row.cell>
            Last Name footer
          </row.cell>
          <row.cell>
            Points footer
          </row.cell>
        </foot.row>
      </table.foot>

    </YetiTable>
  {{/demo.example}}

  {{demo.snippet "general-simple-with-body.hbs"}}
{{/docs-demo}}

Each `<body.row>` component accepts an optional `@onClick` action that will be called if the row is clicked.

Additionally, you might need to toggle the visibility of each row, and for that we can use the `@visible` argument
on the `<header.column>` component. It defaults to `true`. Setting it to false will hide all the cells for that column
accross all rows.

The `<header.column>` component also accepts a `@columnClass` argument. Yeti Table will apply this class all the cells
for that column accross all rows.

<aside>
  In angle bracket invocation, you can pass in element attributes without the `@`.
  A typical usage is the `class` attribute. So you can just write `&lt;body.row class="some-class"&gt;`.
</aside>

You might have noticed that the `<table.header>` component always renders a single `<tr>` row inside the `<thead>`.
This will probably be your most common use case, but sometimes you might need to render additional rows in the header.
To do that, you should use the `<table.head>` component, which doesn't render that single `<tr>` and let's you render the rows yourself.
Here is an example of such a usage:

{{#docs-demo as |demo|}}
  {{#demo.example name="general-simple-with-multiple-rows-on-header.hbs"}}
    <YetiTable @data={{this.data}} as |table|>

      <table.head as |head|>
        <head.row as |row|>
          <row.column @prop="firstName">
            First name
          </row.column>
          <row.column @prop="lastName">
            Last name
          </row.column>
          <row.column @prop="points">
            Points
          </row.column>
        </head.row>

        <head.row as |row|>
          <row.cell>
            Additional row on header
          </row.cell>
          <row.cell>
            Additional row on header
          </row.cell>
          <row.cell>
            Additional row on header
          </row.cell>
        </head.row>
      </table.head>

      <table.body/>

    </YetiTable>
  {{/demo.example}}

  {{demo.snippet "general-simple-with-multiple-rows-on-header.hbs"}}
{{/docs-demo}}
