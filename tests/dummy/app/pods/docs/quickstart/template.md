# Quick start

## Installation

Just run the usual ember-cli `install` command:

```sh
ember install ember-yeti-table
```

### ⚠️ Requirements

Yeti Table only supports the following Ember versions: **latest 3.4.X**, **latest 3.5.X** and **3.6+**.

## Basic usage

To render a table using Yeti Table you basically need two things: data, column definitions and rows.
Unlike most table solutions, in Yeti Table the column and row definitions **happen mostly on your templates**.

For the data, let's use an array of objects defined in your component:

```js
import Component from '@ember/component';

export default class DemoComponent extends Component {
  rows = [
    {
      firstName: 'Tony',
      lastName: 'Stark',
      points: 99
    },
    {
      firstName: 'Tom',
      lastName: 'Dale',
      points: 100
    }
  ];
}
```

Now let's setup the template for this component:

```hbs
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
```

You should now see a rendered HTML table with the correct columns and data.

Notice how we carefully passed in the `@prop` arguments in the column definitions to match the object keys.
This way, Yeti Table knows which values you want in each column and can "unroll" the entire rows for you using just `<table.body/>`.

<aside>
  Confused by this weird syntax? Read more about in the 
  <a href="https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md" target="_blank" rel="noopener noreferrer">Angle Bracket Invocation RFC</a>.
</aside>
