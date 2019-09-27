# Yeti Table Changelog

## v1.0.0

- [BREAKING CHANGE] `table.visibleRows` is no longer a number of visible rows but the rows data itself. If you want the number of visible rows, you can use `{{table.visibleRows.length}}`
- [BREAKING CHANGE] `table.totalColumns` was renamed to `table.columns` and is no longer a number of total columns but an array of objects that represent the columns. If you want the number of total columns, you can use `{{table.columns.length}}`
- [BREAKING CHANGE] `table.visibleColumns` is no longer a number of visible columns but an array of objects that represent the visible columns. If you want the number of visible columns, you can use `{{table.visibleColumns.length}}`
- [FEATURE] now you can use `table.rows`. This will contain an array of all the rows yeti table knows of. In the sync case, it will contain the entire dataset. In the async case, it will be the same as `table.visibleRows`.
- [CHORE] updated dependencies and removed `@argument` decorator because it was stopping us from supporting latest ember versions
