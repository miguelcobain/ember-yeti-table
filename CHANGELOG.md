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
* `table.visibleRows` is no longer a number of visible rows but the rows data itself. If you want the number of visible rows, you can use `{{table.visibleRows.length}}`
* `table.totalColumns` was renamed to `table.columns` and is no longer a number of total columns but an array of objects that represent the columns. If you want the number of total columns, you can use `{{table.columns.length}}`
* `table.visibleColumns` is no longer a number of visible columns but an array of objects that represent the visible columns. If you want the number of visible columns, you can use `{{table.visibleColumns.length}}`
* the deprecated `@rowClass` argument on `<table.body>` was removed. Use theme feature instead, e.g `<YetiTable @theme={{hash tbodyRow="custom-row-class"}}>`.

#### ✨ Features
- now you can use `table.rows`. This will contain an array of all the rows yeti table knows of. In the sync case, it will contain the entire dataset. In the async case, it will be the same as `table.visibleRows`.
- now you can use `@visible` on any cell component. Useful if you need to escape the default `@visible` value of the corresponding column e.g to always render pagination on the first row with a colspan

#### 🏗 Chores
- updated dependencies and removed `@argument` decorator because it was stopping us from supporting latest ember versions
