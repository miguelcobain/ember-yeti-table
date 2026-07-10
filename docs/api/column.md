# `thead.row.column` (a.k.a. `Column`)

The most important sub-component. Defines a column of the table — its sortability, filterability, visibility, and its header label.

```hbs
<head.row as |row|>
  <row.column @prop="firstName" as |column|>
    First name
    {{if column.isAscSorted  " ▲"}}
    {{if column.isDescSorted " ▼"}}
  </row.column>

  <row.column @prop="email" @sortable={{false}}>
    Email
  </row.column>
</head.row>
```

A `Column` also implements `ColumnDefinition`, so it can be passed back into other yielded components.

## Arguments

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `@class` | `string` | — | Extra CSS classes on the `<th>`. |
| `@theme` | `Theme` | — | Pre-bound. |
| `@prop` | `string` | — | Path on a row used for sorting, filtering and cell rendering. Required for column-level sorting/filtering. |
| `@visible` | `boolean` | `true` | Show or hide the column. |
| `@sortable` | `boolean` | `true` | Whether clicking this column toggles sorting. |
| `@sort` | `'asc' \| 'desc' \| null` | — | Current sort direction. Two-way bound by the table. |
| `@sortSequence` | `SortDirection[] \| string` | inherited | Override the cycle order for this column. Strings are comma-split. |
| `@filterable` | `boolean` | `true` | Whether the global filter applies to this column. |
| `@filter` | `string` | — | Per-column filter value. |
| `@filterFunction` | `FilterFunction` | — | Per-column filter function. |
| `@filterUsing` | `unknown` | — | Free-form extra value passed to `@filterFunction`. |
| `@columnClass` | `string` | — | CSS class applied to every `<td>` in this column. |
| `@name` | `string` | derived from textContent | A stable display name (used by debugging tools / API consumers). |
| `@onClick` | `(column: Column, e: MouseEvent) => void` | — | Pre-bound by the parent row/header. |
| `@parent` | `ColumnParent` | — | Column registry. Pre-bound. |

## Yielded block

```hbs
<row.column @prop="firstName" as |column|>
```

The `column` hash exposes:

| Key | Type | Description |
| --- | --- | --- |
| `column.isSorted` | `boolean` | `true` if `@sort` is `'asc'` or `'desc'`. |
| `column.isAscSorted` | `boolean` | `true` if `@sort === 'asc'`. |
| `column.isDescSorted` | `boolean` | `true` if `@sort === 'desc'`. |

## Signature

```ts
interface ColumnSignature {
  Element: HTMLTableCellElement;
  Args: {
    class?: string;
    theme?: Theme;
    prop?: string;
    visible?: boolean;
    sortable?: boolean;
    sort?: SortDirection | null;
    sortSequence?: SortDirection[] | string;
    filterable?: boolean;
    filter?: string;
    filterFunction?: FilterFunction;
    filterUsing?: unknown;
    columnClass?: string;
    name?: string;
    onClick?: (column: Column, e: MouseEvent) => void;
    parent?: ColumnParent;
  };
  Blocks: {
    default: [{ isSorted: boolean; isAscSorted: boolean; isDescSorted: boolean }];
  };
}
```
