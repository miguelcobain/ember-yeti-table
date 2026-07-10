# `tfoot.row`

A `<tr>` in the table footer. Yields a pre-bound `cell` component.

```hbs
<table.tfoot as |foot|>
  <foot.row as |row|>
    <row.cell>Footer cell A</row.cell>
    <row.cell>Footer cell B</row.cell>
  </foot.row>
</table.tfoot>
```

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `@class` | `string` | Extra CSS classes on the `<tr>`. |
| `@theme` | `Theme` | Pre-bound. |
| `@columns` | `ColumnDefinition[]` | Pre-bound. |
| `@parent` | `unknown` | Pre-bound. |

## Yielded block

```hbs
<foot.row as |row|>
```

- `row.cell` — a [`TFootCell`](./tfoot-cell.md) with `theme`, `parent`, and `columns` pre-bound.

## Signature

```ts
interface TFootRowSignature {
  Element: HTMLTableRowElement;
  Args: {
    class?: string;
    theme?: Theme;
    columns?: ColumnDefinition[];
    parent?: unknown;
  };
  Blocks: {
    default: [{ cell: WithBoundArgs<typeof Cell, 'theme' | 'parent' | 'columns'> }];
  };
}
```
