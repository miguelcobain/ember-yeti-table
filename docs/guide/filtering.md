# Filtering

## Global filtering

You can apply a global filter to the table by passing a `@filter` argument to the `<YetiTable>` component. Yeti Table will then only render rows that match (case-insensitive substring on every visible column).

This is usually wired up to a text input outside the table:

<CodePreview src="/demos/filtering-global.gts" />

## Single column filtering

You can also use the `@filter` argument on the columns, in which case the filter will only apply to that column. This means that Yeti Table will only show rows in which that particular column matches that text.

You can use the `@filter` argument on `<YetiTable>` and `<header.column>` at the same time.

> The column definitions' `@filter` argument is *subtractive*, meaning it will filter out rows from the subset that already passed the general `@filter`.

> Notice how in the example below we used the `<table.thead>` component instead of `<table.header>` because we wanted to place the filter inputs on an additional header row.

<CodePreview src="/demos/filtering-column.gts" />

## Advanced filtering

You can customize the filtering by passing in a custom `@filterFunction` function argument to the parent `<YetiTable>` component or to a column definition. This function should return `true` or `false` to either include or exclude the row from the resulting set. If this function depends on a value, pass that value as a `@filterUsing` argument.

The `@filterFunction` function on `<YetiTable>` receives:

- `row` — the current data row to use for filtering
- `filterUsing` — the value you passed in as `@filterUsing`

The `@filterFunction` function on `<header.column>` receives:

- `value` — the current data **cell** to use for filtering
- `filterUsing` — the value you passed in as `@filterUsing`

This allows for advanced filtering logic. See the example below — we filter the `points` column by a numeric range:

<CodePreview src="/demos/filtering-custom.gts" />
