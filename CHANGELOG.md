# Yeti Table Changelog

## v1.0.0

- [BREAKING CHANGE] `table.visibleRows` is no longer a number of visible rows but the rows data itself. If you want the number of visible rows, you can use `{{table.visibleRows.length}}`
- [CHORE] updated dependencies and removed `@argument` decorator because it was stopping us from supporting latest ember versions
