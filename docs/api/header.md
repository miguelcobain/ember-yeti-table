# `header`

A `<thead>` with a single implicit `<tr>`. Yields a pre-bound `column` component so you can declare columns inline. Use this when you don't need multiple header rows.

```hbs
<YetiTable @data={{this.data}} as |table|>
  <table.header as |header|>
    <header.column @prop="firstName">First name</header.column>
    <header.column @prop="lastName">Last name</header.column>
  </table.header>

  <table.body />
</YetiTable>
```

## Arguments

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `@trClass` | `string` | — | Extra CSS classes for the implicit `<tr>`. |
| `@theme` | `Theme` | — | Theme. Pre-bound by the parent. |
| `@sortable` | `boolean` | `true` | Enable click-to-sort on yielded columns. |
| `@sortSequence` | `SortDirection[] \| string` | `['asc', 'desc']` | Cycle order when a column header is clicked. |
| `@columns` | `ColumnDefinition[]` | — | Columns registered with the parent table. Pre-bound. |
| `@onColumnClick` | `(column: Column, e: MouseEvent) => void` | — | Click handler for a sortable column. Pre-bound. |
| `@parent` | `ColumnParent` | — | Column registry. Pre-bound. |

## Yielded block

```hbs
<table.header as |header|>
```

- `header.column` — a [`Column`](./column.md) component with `sortable`, `sortSequence`, `onClick`, `parent`, and `theme` pre-bound.

## Signature

```ts
interface HeaderSignature {
  Element: HTMLTableSectionElement;
  Args: {
    trClass?: string;
    theme?: Theme;
    sortable?: boolean;
    sortSequence?: SortDirection[] | string;
    columns?: ColumnDefinition[];
    onColumnClick?: (column: Column, e: MouseEvent) => void;
    parent?: ColumnParent;
  };
  Blocks: {
    default: [{ column: WithBoundArgs<typeof Column, ...> }];
  };
}
```
