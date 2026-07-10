# `tfoot.row.cell`

A `<td>` in the footer. Only rendered when its corresponding column has `visible === true`.

```hbs
<table.tfoot as |foot|>
  <foot.row as |row|>
    <row.cell>Footer content</row.cell>
  </foot.row>
</table.tfoot>
```

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `@class` | `string` | Extra CSS classes on the `<td>`. |
| `@theme` | `Theme` | Pre-bound. |
| `@parent` | `TFootCellParent` | Pre-bound. |
| `@columns` | `ColumnDefinition[]` | Pre-bound. |

## Yielded block

The default block is yielded with no parameters.

## Signature

```ts
interface TFootCellSignature {
  Element: HTMLTableCellElement;
  Args: {
    class?: string;
    theme?: Theme;
    parent?: TFootCellParent;
    columns?: ColumnDefinition[];
  };
  Blocks: { default: [] };
}
```
