# `tfoot`

Renders a `<tfoot>` section and yields the `row` component for you to compose footer rows (totals, summaries, action bars, …).

```hbs
<table.tfoot as |foot|>
  <foot.row as |row|>
    <row.cell>Total</row.cell>
    <row.cell>{{this.total}}</row.cell>
  </foot.row>
</table.tfoot>
```

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `@theme` | `Theme` | Pre-bound. |
| `@columns` | `ColumnDefinition[]` | Pre-bound. |
| `@parent` | `unknown` | Pre-bound handle to the parent table. |

## Yielded block

```hbs
<table.tfoot as |foot|>
```

- `foot.row` — a [`TFootRow`](./tfoot-row.md) with `columns`, `theme`, and `parent` pre-bound.

## Signature

```ts
interface TFootSignature {
  Element: HTMLTableSectionElement;
  Args: {
    theme?: Theme;
    columns?: ColumnDefinition[];
    parent?: unknown;
  };
  Blocks: {
    default: [{ row: WithBoundArgs<typeof TFootRow, 'columns' | 'theme' | 'parent'> }];
  };
}
```
