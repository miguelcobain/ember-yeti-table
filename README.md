# Yeti Table [![Build Status](https://github.com/miguelcobain/ember-yeti-table/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/miguelcobain/ember-yeti-table/actions/workflows/ci.yml) [![Ember Observer Score](http://emberobserver.com/badges/ember-yeti-table.svg)](http://emberobserver.com/addons/ember-yeti-table)

Yeti Table provides a new expressive way to build tables in Ember with flexibility in mind.

## Installation

```
ember install ember-yeti-table
```

## Why Yeti Table?

Perhaps the biggest difference compared to other table solution is that Yeti Table uses templates to define your columns.
In many other table solutions you need to define columns in javascript.
Yeti Table was born from an experimentation of trying to define columns in templates.

In practice, this empowers customization and feels more in line with writing regular HTML tables.
This fact has many implications on the whole API of Yeti Table.

Yeti table currently weights around `6.17kb` (minified and gzipped).

## Features

Yeti Table was built with the needs of a real production app in mind. Out of the box, it supports:

- **Client side row sorting** - On a single column or on multiple columns.
- **Client side row filtering** - You can apply a global filter to the table or just to specific columns.
- **Client side pagination** - Provides pagination controls, but encourages you to build your own as well.
- **Server side data** - Allows your server to drive the table pagination, filtering and sorting if you choose to. Useful when the dataset is too large to fetch.
- **Customization** - Does not provide any styles. You can customize pretty much everything about how the tables are rendered on your templates. This includes custom css classes, click handlers and custom filtering and sorting logic.

## Usage

Your starting point for Yeti Table will be the `@data` argument. It accepts an array of objects
or a promise that resolves to such an array.

Then you must define your table columns inside the header component, each of them with a `@prop` argument that corresponds to the
property key of each object that you want to display for that column. Yeti Table will update itself based on
these property names, e.g if a `firstName` property of an object changes, Yeti Table might need to re-sort
or re-filter the rows.

Afterwards, we just need to define our table body. If you use `<table.body/>` in the blockless form,
Yeti Table "unrolls" all the rows for you. This is useful for simple tables. Here is such an example:

```hbs
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
```

You will probably need to make more customizations, and to do so you will need to use `<table.header>`
and/or `<table.body>` in the block form. This form allows you to:

- Use any component or markup as a cell's content
- Use the row data across multiple cells of the same row
- Attach click listeners to the row or cell
- Use row data to conditionally add classes

Each `<body.row>` component accepts an optional `@onClick` action that will be called if the row is clicked.

Additionally, you might need to toggle the visibility of each row, and for that we can use the `@visible` argument
on the `<header.column>` component. It defaults to `true`. Setting it to false will hide all the cells for that column
accross all rows.

The `<header.column>` component also accepts a `@columnClass` argument. Yeti Table will apply this class all the cells
for that column accross all rows.

Check out more advanced features on the [Yeti Table documentation site](https://miguelcobain.github.io/ember-yeti-table).

## Compatibility

- Ember.js v3.20 or above
- Ember CLI v3.20 or above

## Editor integration

You can get autocomplete and additional information inside [Visual Studio Code](https://code.visualstudio.com/) by installing [els-addon-docs](https://github.com/lifeart/els-addon-docs) addon for [Unstable Ember Language Server](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-ember-unstable).

## Credits

Credits to the amazing [Ember Table](https://github.com/Addepar/ember-table) addon.

Yeti Table was also inpired by [DataTables](https://datatables.net/) in a lot of its features.

## Contributing

### Installation

- `git clone <repository-url>`
- `cd ember-yeti-table`
- `npm install`

### Linting

- `npm run lint:hbs`
- `npm run lint:js`
- `npm run lint:js -- --fix`

### Running tests

- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

- `ember serve`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
