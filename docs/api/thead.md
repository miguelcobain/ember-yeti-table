# `thead`

Renders a `<thead>` element and yields the `head.row` component. Use this when you want multiple header rows or full control over the head.

```hbs
<YetiTable @data={{this.data}} as |table|>
  <table.thead as |head|>
    <head.row as |row|>
      <row.column @prop="firstName">First name</row.column>
      <row.column @prop="lastName">Last name</row.column>
    </head.row>
  </table.thead>
</YetiTable>
```

## Arguments

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `@theme` | `Theme` | — | Theme. Pre-bound. |
| `@sortable` | `boolean` | `true` | Enable click-to-sort on yielded columns. |
| `@sortSequence` | `SortDirection[] \| string` | `['asc', 'desc']` | Cycle order. |
| `@onColumnClick` | `(column: Column, e: MouseEvent) => void` | — | Click handler. Pre-bound. |
| `@columns` | `ColumnDefinition[]` | — | Columns. Pre-bound. |
| `@parent` | `ColumnParent` | — | Column registry. Pre-bound. |

## Yielded block

```hbs
<table.thead as |head|>
```

- `head.row` — a [`THeadRow`](./thead-row.md) component with `sortable`, `sortSequence`, `onColumnClick`, `columns`, `theme`, and `parent` pre-bound.

## Signature

```ts
interface THeadSignature {
  Element: HTMLTableSectionElement;
  Args: {
    theme?: Theme;
    sortable?: boolean;
    sortSequence?: SortDirection[] | string;
    onColumnClick?: (column: Column, e: MouseEvent) => void;
    columns: ColumnDefinition[];
    parent?: ColumnParent;
  };
  Blocks: {
    default: [{ row: WithBoundArgs<typeof THeadRow, ...> }];
  };
}
```
