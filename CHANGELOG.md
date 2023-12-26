# v2.0.0

#### 🚨 Breaking Changes

- Support for ember 3.28+ by refactoring component file structure for converting to glimmer [#345](https://github.com/miguelcobain/ember-yeti-table/pull/345)
- Removed polyfills no longer needed for supporting 3.28+
- Dropped support for Node 14.
- Removed yielded for head and foot from table api (Previously deprecated)
- cells no longer support the ability to specify `visible` on the cells themselves. Please set `visible` on the column
- many booleans arguments if undefined are now treated as true instead of false (ex column.visible)

#### ✨ Features

- Converted components to user glimmer syntax [#345](https://github.com/miguelcobain/ember-yeti-table/pull/345) [#351](https://github.com/miguelcobain/ember-yeti-table/pull/351)
- Converted components to use template imports
- Updated husky/prettier/linters
- switch from npm to pnpm
- yield prop name in TBody/Row/Cell

# v1.7.4

#### ✨ Features

- The column's `@filterFunction` now gets an extra argument passed in with the row.

# v1.7.3

#### 🐛 Bugfixes

- import `deprecate` from `@ember/debug` instead of `@ember/application/deprecations`. This was causing runtime errors on ember 4.x.

# v1.7.2

#### 🏗 Chores

- use `(has-block)` helper fix erroring on ember v4

# v1.7.1

#### 🏗 Chores

- relax `@ember/render-modifiers` dependency to `^1.0.2 || ^2.0.0`

# v1.7.0

#### ✨ Features

- `@loadData` function is invoked with a `columnFilters` param which is an array of objects. Those objects now have a `prop` property. This makes it easier to know which column you're filtering on, simplifying custom filtering logic. [#296](https://github.com/miguelcobain/ember-yeti-table/pull/296)

# v1.6.2

#### 🐛 Bugfixes

- fix bug that made the `visibleColumns` to not update correctly under ember source >= 3.23

#### 🏗 Chores

- update ember version and other dependencies
- update `deprecate` usage
- migrate travis to github actions

# v1.6.1

#### 🐛 Bugfixes

- fixes bug where the `@loadData` function could be running twice if a `@pageNumber` or `@pageSize` argument was passed in to the component.

# v1.6.0

#### ✨ Features

- new argument `@isColumnVisible`. This argument can be used to initialize the column visibility in a programatic way.
  For example, let's say you store the initial column visibility in local storage, then you can
  use this function to initialize the `visible` column of the specific column. The given function should
  return a boolean which will be assigned to the `visible` property of the column. An object representing
  the column is passed in. Sou can use `column.prop` and `column.name` to know which column your computed
  the visibility for.

# v1.5.2

#### 🐛 Bugfixes

- fix bug where the columns weren't unregistering

# v1.5.1

#### 🐛 Bugfixes

- run the `@registerApi` function in the actions queue to allow things like `@registerApi={{fn (mut this.table)}}`

# v1.5.0

#### ✨ Features

- new argument `@registerApi` that gets passed the public api of the table. With this object you can call
  actions to change the state of the table itself. Currently the same as the yielded `table.actions` object.
- new action called `reloadData`. Invoking this action will rerun the `@loadData` argument to get fresh data.

#### 🏗 Chores

- update ember version and other dependencies

# v1.4.1

#### 🐛 Bugfixes

- `role="button"` was being applied to all `<tr>` elements, even if a click action was not provided.

#### 🏗 Chores

- use ember on modifier on documentation and codebase
- use `this.` when referencing properties on docs

# v1.4.0

#### 🚨 Breaking Changes

- all components except `<YetiTable>` are now private and no longer exposed to the application in the global namespace.

#### ✨ Features

- added a new component `tbody`. Unlike the current body component which yields a single record and
  iterates over the array for you, `tbody` yields the array and you must iterate over the array yourself.

#### 🏗 Chores

- the head and foot components have been deprecated and replaced with thead and tfoot
- added prettier to the project

# v1.3.0

#### ✨ Features

- the yielded columns now have a `name` property. It defaults to the column's trimmed `textContent` value, but it can be
  overrided by using a `@name="your custom name"` argument. This feature can be useful for "introspection" purposes,
  e.g if you want to show a list of the columns to the user.

# v1.2.0

#### ✨ Features

- introduced new argument `@renderTableElement={{false}}`. This prevents yeti table from automatically rendering the `<table>` element.
  When you set this argument as `false`, you are responsible for rendering the table element yourself using the yielded `<t.table>` component.
  This is a simple component that is now yielded that just renders the table element with the appropriate theme classes.

#### 🏗 Chores

- updated internal dependencies
- migrate all components to be tagless (more in line with glimmer components)

# v1.1.0

#### ✨ Features

- now you can use `@ignoreDataChanges={{true}}` to prevent yeti from reacting to changes on the underlying data, resorting or refiltering. Useful when doing inline editing in a table. [#151](https://github.com/miguelcobain/ember-yeti-table/pull/151)

#### 🏗 Chores

- updated internal dependencies
- use `ember-on-modifier`
- use ember `fn` helper instead of `action` helper

# v1.0.1

#### 🐛 Bugfixes

- allow usage of nested keys on the `@prop` argument. If the property is a nested property (one that contains
  periods), the table will not be updated when this nested property changes. This is due to `@each` only supporting one level
  of properties.

#### 🏗 Chores

- updated dependencies

# v1.0.0

#### 🚨 Breaking Changes

- `table.visibleRows` is no longer a number of visible rows but the rows data itself. If you want the number of visible rows, you can use `{{table.visibleRows.length}}`
- `table.totalColumns` was renamed to `table.columns` and is no longer a number of total columns but an array of objects that represent the columns. If you want the number of total columns, you can use `{{table.columns.length}}`
- `table.visibleColumns` is no longer a number of visible columns but an array of objects that represent the visible columns. If you want the number of visible columns, you can use `{{table.visibleColumns.length}}`
- the deprecated `@rowClass` argument on `<table.body>` was removed. Use theme feature instead, e.g `<YetiTable @theme={{hash tbodyRow="custom-row-class"}}>`.

#### ✨ Features

- now you can use `table.rows`. This will contain an array of all the rows yeti table knows of. In the sync case, it will contain the entire dataset. In the async case, it will be the same as `table.visibleRows`.
- now you can use `@visible` on any cell component. Useful if you need to escape the default `@visible` value of the corresponding column e.g to always render pagination on the first row with a colspan

#### 🏗 Chores

- updated dependencies and removed `@argument` decorator because it was stopping us from supporting latest ember versions
