# `tbody.row` / `body.row`

A `<tr>` in the table body. Yields a pre-bound `cell` component. When `@onClick` is set, the row receives `role="button"` and a click handler.

```hbs
<table.body as |body person|>
  <body.row as |row|>
    <row.cell>{{person.firstName}}</row.cell>
    <row.cell>{{person.lastName}}</row.cell>
  </body.row>
</table.body>
```

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `@theme` | `Theme` | Pre-bound. |
| `@columns` | `ColumnDefinition[]` | Pre-bound. |
| `@onClick` | `RowClickHandler` | Click handler. When set, the row is interactive (`role="button"`). |

## Yielded block

```hbs
<body.row as |row|>
```

- `row.cell` — a [`TBodyCell`](./tbody-cell.md) component with `theme`, `parent`, and `columns` pre-bound.

## Signature

```ts
interface TBodyRowSignature {
  Element: HTMLTableRowElement;
  Args: {
    theme?: Theme;
    columns?: ColumnDefinition[];
    onClick?: RowClickHandler;
  };
  Blocks: {
    default: [{ cell: WithBoundArgs<typeof Cell, 'theme' | 'parent' | 'columns'> }];
  };
}
```
