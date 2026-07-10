# Defining a table

Your starting point for Yeti Table will be the `@data` argument. It accepts an array of objects or a promise that resolves to such an array.

Then you must define your table columns inside the header component, each of them with a `@prop` argument that corresponds to the property key of each object that you want to display for that column. Yeti Table uses this property for filtering and sorting.

Yeti Table will update itself based on these property names, e.g. if a `firstName` property of an object changes, Yeti Table might need to re-sort or re-filter the rows.

> **Note:** If the property is a nested property (one that contains periods), the table will not be updated when this nested property changes. This is due to `@each` only supporting one level of properties.

Afterwards, we just need to define our table body. If you use `<table.body/>` in the blockless form, Yeti Table "unrolls" all the rows for you. This is useful for simple tables. Here is such an example:

<CodePreview src="/demos/general-simple.gts" />

## Custom row markup

For more complex needs you can pass a block to `<table.body>` and to `<table.header>`. This gives you total control over markup, click handlers and per-row classes:

```gts
<YetiTable @data={{this.data}} as |table|>

  <table.header as |header|>
    <header.column @prop="firstName">First name</header.column>
    <header.column @prop="lastName">Last name</header.column>
    <header.column @prop="points">Points</header.column>
  </table.header>

  <table.body as |body person|>
    <body.row as |row|>
      <row.cell>{{person.firstName}}</row.cell>
      <row.cell>{{person.lastName}}</row.cell>
      <row.cell>{{person.points}}</row.cell>
    </body.row>
  </table.body>

</YetiTable>
```

Each `<body.row>` component accepts an optional `@onClick` action that will be called if the row is clicked.

You can also toggle the visibility of each column with the `@visible` argument on the `<header.column>` component. It defaults to `true`. Setting it to `false` will hide all the cells for that column across all rows.

The `<header.column>` component also accepts a `@columnClass` argument. Yeti Table will apply this class to all the cells for that column across all rows.

## Multiple header rows

You might have noticed that the `<table.header>` component always renders a single `<tr>` row inside the `<thead>`. This will probably be your most common use case, but sometimes you might need to render additional rows in the header.

To do that, you should use the `<table.thead>` component, which doesn't render that single `<tr>` and lets you render the rows yourself.

<CodePreview src="/demos/general-multi-header.gts" />
