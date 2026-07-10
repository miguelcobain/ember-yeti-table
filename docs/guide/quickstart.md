# Quick start

## Installation

```sh
pnpm add ember-yeti-table
```

### ⚠️ Requirements

Yeti Table requires Ember 4.0 or higher.

### Editor integration

You can get autocomplete and additional information inside [Visual Studio Code](https://code.visualstudio.com/) by installing the [els-addon-docs](https://github.com/lifeart/els-addon-docs) addon for [Unstable Ember Language Server](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-ember-unstable).

## Basic usage

To render a table using Yeti Table you basically need two things: data and column definitions. Unlike most table solutions, in Yeti Table the column and row definitions **happen mostly on your templates**.

For the data, let's use an array of objects defined in your component:

```js
import Component from '@glimmer/component';

export default class extends Component {
  data = [
    { firstName: 'Miguel',  lastName: 'Andrade', points: 1 },
    { firstName: 'José',    lastName: 'Baptista', points: 2 },
    { firstName: 'Tom',     lastName: 'Dale',    points: 3 },
    { firstName: 'Yehuda',  lastName: 'Katz',    points: 4 },
  ];
}
```

Then in your template, render a `<YetiTable>` and define the columns inside the header:

<CodePreview src="/demos/general-simple.gts" />

That's it — sorting (click the headers!) just works out of the box. Continue with the [Defining a table](./general) guide to learn about everything you can do with the body, footer and column definitions.
